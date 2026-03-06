const { test, expect } = require('@playwright/test');

// Minimal Google Maps mock served in place of the real Maps API script
const GOOGLE_MAPS_MOCK = `
window.google = {
  maps: {
    DistanceMatrixService: function() {},
    DistanceMatrixStatus: { OK: 'OK', REQUEST_DENIED: 'REQUEST_DENIED' },
    TravelMode: { TRANSIT: 'TRANSIT', DRIVING: 'DRIVING' },
    UnitSystem: { IMPERIAL: 0 },
    places: { Autocomplete: function() {} },
    event: { addDomListener: function(target, event, fn) { if (event === 'load') fn(); } },
    Geocoder: function() {},
  },
};
`;

// Intercept Maps API request and inject mock before each test
test.beforeEach(async ({ page }) => {
  await page.route('**/maps/api/js**', route => {
    route.fulfill({ body: GOOGLE_MAPS_MOCK, contentType: 'text/javascript' });
  });
});

// Wait for React app to fully render (Maps mock loaded + React rendered)
async function waitForApp(page) {
  await page.waitForFunction(
    () => typeof window.google !== 'undefined' && document.getElementById('startInput') !== null,
    { timeout: 15000 }
  );
}

// 1. Page load — verify all form elements present
test('page load shows all form elements', async ({ page }) => {
  await page.goto('/');
  await waitForApp(page);
  await expect(page.locator('#startInput')).toBeVisible();
  await expect(page.locator('#airportInput')).toBeVisible();
  await expect(page.locator('#datetimepicker12')).toBeAttached();
  await expect(page.locator('input[name="options2"][value="driving"]')).toBeAttached();
  await expect(page.locator('input[name="options2"][value="transit"]')).toBeAttached();
  await expect(page.locator('#hr')).toBeVisible();
  await expect(page.locator('#min')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

// 2. Airport typeahead — type "JFK", verify suggestion appears
test('airport typeahead shows suggestions for JFK', async ({ page }) => {
  await page.goto('/');
  await waitForApp(page);
  const airportInput = page.locator('#airportInput');
  await airportInput.click();
  await airportInput.type('JFK');
  const suggestion = page.locator('.tt-suggestion').first();
  await expect(suggestion).toBeVisible({ timeout: 5000 });
  await expect(suggestion).toContainText('JFK');
});

// 3. Form submission — mock DistanceMatrix, submit, verify result
test('form submission shows leave time and Google Maps link', async ({ page }) => {
  await page.goto('/');
  await waitForApp(page);

  // Mock without duration_in_traffic to simulate missing traffic data
  await page.evaluate(() => {
    google.maps.DistanceMatrixService.prototype.getDistanceMatrix = function(config, callback) {
      callback({
        rows: [{ elements: [{
          duration: { value: 1800, text: '30 mins' },
        }] }],
      }, 'OK');
    };
  });

  await page.fill('#startInput', '123 Main St, New York, NY');
  await page.fill('#airportInput', 'JFK - John F Kennedy International, Jamaica, New York');
  await page.click('button[type="submit"]');

  const result = page.locator('#result');
  await expect(result).toContainText('You should leave by', { timeout: 5000 });
  await expect(result.locator('a[href*="google.com/maps"]')).toBeVisible();
});

// 4. Travel mode toggle — click transit radio, verify it becomes checked
test('travel mode toggle selects transit', async ({ page }) => {
  await page.goto('/');
  await waitForApp(page);
  const transitLabel = page.locator('label:has(input[value="transit"])');
  await transitLabel.click();
  const transitRadio = page.locator('input[value="transit"]');
  await expect(transitRadio).toBeChecked();
});

// 5. API error handling — mock REQUEST_DENIED, verify error displays
test('API error displays error message', async ({ page }) => {
  await page.goto('/');
  await waitForApp(page);

  await page.evaluate(() => {
    google.maps.DistanceMatrixService.prototype.getDistanceMatrix = function(config, callback) {
      callback({}, 'REQUEST_DENIED');
    };
  });

  await page.fill('#startInput', '123 Main St, New York, NY');
  await page.fill('#airportInput', 'JFK - John F Kennedy International, Jamaica, New York');
  await page.click('button[type="submit"]');

  const result = page.locator('#result');
  await expect(result).toContainText('error', { timeout: 5000 });
});

// 6. XSS verification — malicious input must not create img tag in #result
test('XSS input is not rendered as HTML in result', async ({ page }) => {
  await page.goto('/');
  await waitForApp(page);

  await page.evaluate(() => {
    google.maps.DistanceMatrixService.prototype.getDistanceMatrix = function(config, callback) {
      callback({
        rows: [{ elements: [{
          duration: { value: 1800, text: '30 mins' },
          duration_in_traffic: { value: 2100, text: '35 mins' },
        }] }],
      }, 'OK');
    };
  });

  await page.fill('#startInput', '<img src=x onerror=alert(1)>');
  await page.fill('#airportInput', 'JFK - John F Kennedy International, Jamaica, New York');
  await page.click('button[type="submit"]');

  const result = page.locator('#result');
  await expect(result).toContainText('You should leave by', { timeout: 5000 });

  // Verify no img tag was injected
  const imgCount = await result.locator('img').count();
  expect(imgCount).toBe(0);
});

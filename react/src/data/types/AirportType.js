
import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLList as List,
} from 'graphql';
import CheckpointType from './CheckpointType'

const AirportType = new ObjectType({
    name: 'Airport',
    fields: {
        name: { type: new NonNull(StringType) },
        shortcode: { type: new NonNull(StringType) },
        city: { type: new NonNull(StringType) },
        state: { type: new NonNull(StringType) },
        latitude: { type: new NonNull(StringType) },
        longitude: { type: new NonNull(StringType) },
        utc: { type: StringType },
        dst: { type: StringType },
        precheck: { type: StringType },
        checkpoints: { type: new List(CheckpointType) },
    },
});

export default AirportType;

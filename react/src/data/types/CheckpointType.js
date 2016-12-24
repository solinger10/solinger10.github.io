
import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLID as IDType,
} from 'graphql';

const CheckpointType = new ObjectType({
    name: 'Checkpoint',
    fields: {
        id: { type: new NonNull(IDType) },
        longname: { type: new NonNull(StringType) },
        city: { type: new NonNull(StringType) },
        shortname: { type: new NonNull(StringType) },
    },
});

export default CheckpointType;

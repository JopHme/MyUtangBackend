const {mapSchema, getDirective, MapperKind} = require('@graphql-tools/utils');
const apollo = require('apollo-server')

function authDirectiveTransformer(schema, directiveName) {
    return mapSchema(schema, {
        // Executes once for each object field definition in the schema
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
            if (authDirective) {
                fieldConfig.resolve = async function (source, args, context, info) {
                    const result = await resolve(source, args, context, info);
                    if (!context.user) {
                        return apollo.AuthenticationError("You must be logged in to do this action")
                    }
                    return result;
                }
                return fieldConfig;
            }
        },

    });
};
module.exports = authDirectiveTransformer;

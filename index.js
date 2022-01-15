"use strict";

const db = require('./database/database');

const apolloCore = require("apollo-server-core");
//ApolloServerPluginLandingPageLocalDefault


(async () => {
    await db.sequelize.sync({alter: true});
})();

Object.defineProperty(exports, "__esModule", {value: true});
const {ApolloServer, gql} = require('apollo-server');
const typeDefs = require('./server/typedef');

const Debt = db.Models.Debt
const User = db.Models.User
const resolvers = require('./server/resolvers',);
const jwt = require('jsonwebtoken');

function getUser(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers.authorization || '';
        console.log(token);
        const user = getUser(token)
        print(user);
        // return {user};
    },
    debug: true,
    playground: true,
    introspection: true,
    plugins: [
        apolloCore.ApolloServerPluginLandingPageLocalDefault()
    ]
});

server.listen(process.env.PORT).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});


import { GraphQLServer, PubSub } from "graphql-yoga";
import mongo from "./mongo";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import User from "./resolvers/User";
import Appointment from "./resolvers/Appointment";

import { authenticate } from "./middleware/is-auth";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Appointment,
  },
  context: (request) => ({
    db,
    pubsub,
    ...request,
  }),
  middlewares: [authenticate],
});

mongo.connect();

server.start({ port: process.env.PORT || 8888 }, () => {
  console.log(`The server is up on port ${process.env.PORT || 8888}!`);
});

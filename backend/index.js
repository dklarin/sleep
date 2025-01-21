const { ApolloServer } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
const { importSchema } = require("graphql-import");
const typeDefs = importSchema("./schema.graphql");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");

const uri =
  //"mongodb+srv://macjimulac:otvorimarijavrata@cluster0.cokvy.mongodb.net/baza?retryWrites=true&w=majority";

  "mongodb+srv://macjimulac:otvorimarijavrata@cluster0.cokvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//const uri = 'mongodb://127.0.0.1/CETVRTAK'

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      (month = "" + (value.getMonth() + 1)),
        (day = "" + value.getDate()),
        (year = value.getFullYear());

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      year = year + ".";
      return [day, month, year].join(".");
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      (hours = "" + (value.getHours() + 1)),
        (minutes = "" + value.getMinutes());

      return [minutes, hours];
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
  Query,
  Mutation,
};

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, "my-secret-from-env-file-in-prod");
    }
    return null;
  } catch (err) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const tokenWithBearer = req.headers.authorization || "";
    const token = tokenWithBearer.split(" ")[1];
    const user = getUser(token);
    return {
      user,
    };
  },
});

mongoose.connection.once("open", function () {
  server.listen({ port: port }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});

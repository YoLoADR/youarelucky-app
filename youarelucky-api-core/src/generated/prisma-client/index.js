"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Prospect",
    embedded: false
  },
  {
    name: "Applicant",
    embedded: false
  },
  {
    name: "Partner",
    embedded: false
  },
  {
    name: "Customer",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/yohann-loic-ravino-51f9e2/youarelucky-api-core/dev`
});
exports.prisma = new exports.Prisma();

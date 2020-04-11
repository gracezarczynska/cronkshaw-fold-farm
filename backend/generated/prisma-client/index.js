"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Permission",
    embedded: false
  },
  {
    name: "Product",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "Enrollment",
    embedded: false
  },
  {
    name: "Farm",
    embedded: false
  },
  {
    name: "Override",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/malgorzata-zarczynska/cronkshaw-fold-farm/dev`,
  secret: `${process.env["PRISMA_SECRET"]}`
});
exports.prisma = new exports.Prisma();

import assert from "assert";
import * as jwtUtils from "../utils/jwt.js";

// set environment secret for test
process.env.JWT_SECRET = "supersecret";

const payload = { test: true };
const token = jwtUtils.signToken(payload);

const decoded = jwtUtils.verifyToken(token);
assert(decoded.test === true, "decoded payload should match original");
console.log("JWT util sign/verify works");

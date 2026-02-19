import assert from "assert";
import { Permissions } from "../utils/permissions.js";

// ensure at least a handful of expected keys exist
const keys = Object.keys(Permissions);
assert(keys.length > 0, "Permissions object should have keys");
assert(Permissions.ORG_CREATE === "org:create", "ORG_CREATE string");
assert(Permissions.TASK_VIEW === "task:view", "TASK_VIEW string");

console.log("Permissions constants look correct");

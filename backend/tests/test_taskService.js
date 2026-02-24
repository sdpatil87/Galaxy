import assert from "assert";
import * as taskService from "../services/taskService.js";
import Task from "../models/Task.js";

// since the service returns a mongoose query, we can verify that populate()
// is a chainable function and that passing options doesn't blow up.
const tests = [];

tests.push(() => {
  const q = taskService.listTasks({ project: "abc" }, { populate: ["a"] });
  assert(q && typeof q.populate === "function", "query must support populate");
});

tests.push(() => {
  const q = taskService.listTasks({}, {});
  assert(q && typeof q.exec === "function", "query should be a mongoose query");
});

try {
  tests.forEach((f) => f());
  console.log("All taskService tests passed");
} catch (err) {
  console.error("taskService test failed:", err.message);
  throw err;
}

import assert from "assert";
import { addTaskSchema, updateTaskSchema } from "../validators/task.js";

// simple sanity checks for task validation
const tests = [];

tests.push(() => {
  // valid add-task payload
  addTaskSchema.parse({ title: "do something" });
});

tests.push(() => {
  // missing required field should throw some kind of error
  assert.throws(() => addTaskSchema.parse({}));
});

tests.push(() => {
  // status must be one of allowed values
  updateTaskSchema.parse({ status: "todo" });
  updateTaskSchema.parse({ status: "inprogress" });
  updateTaskSchema.parse({ status: "done" });
});

tests.push(() => {
  // invalid status should throw
  assert.throws(() => updateTaskSchema.parse({ status: "waiting" }));
});

try {
  tests.forEach((f) => f());
  console.log("All task validator tests passed");
} catch (err) {
  console.error("task validator test failed:", err.message);
  throw err;
}

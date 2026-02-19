import assert from "assert";
import {
  calculateEntryDuration,
  summariesToCSV,
} from "../services/attendanceService.js";

function almostEqual(a, b, eps = 1e-6) {
  return Math.abs(a - b) < eps;
}

const tests = [];

tests.push(() => {
  const entry = { start: "2026-02-18T09:00:00Z", end: "2026-02-18T17:00:00Z" };
  const d = calculateEntryDuration(entry);
  assert(almostEqual(d, 8), `expected 8 got ${d}`);
});

tests.push(() => {
  const entry = { halfDay: true };
  const d = calculateEntryDuration(entry);
  assert(almostEqual(d, 4), `expected 4 got ${d}`);
});

tests.push(() => {
  const entry = { duration: 2.5 };
  const d = calculateEntryDuration(entry);
  assert(almostEqual(d, 2.5), `expected 2.5 got ${d}`);
});

tests.push(() => {
  const entry = { start: "2026-02-18T12:00:00Z", end: "2026-02-18T10:00:00Z" };
  const d = calculateEntryDuration(entry);
  assert(almostEqual(d, 0), `expected 0 for invalid range got ${d}`);
});

tests.push(() => {
  const summariesObj = {
    aggregate: {
      user: "u1",
      totalHours: 10,
      days: 2,
      byType: { office: 8, home: 2 },
    },
    days: [
      {
        date: new Date("2026-02-17"),
        user: "u1",
        totalHours: 8,
        entriesCount: 1,
        byType: { office: 8 },
      },
      {
        date: new Date("2026-02-18"),
        user: "u1",
        totalHours: 2,
        entriesCount: 1,
        byType: { home: 2 },
      },
    ],
  };
  const csv = summariesToCSV(summariesObj);
  assert(
    csv.includes("date,user,totalHours,entriesCount"),
    "CSV header missing",
  );
  assert(csv.includes("2026-02-17"), "first date missing");
  assert(csv.includes("2026-02-18"), "second date missing");
  assert(csv.includes("TOTAL"), "TOTAL row missing");
});

// Run tests
try {
  for (let i = 0; i < tests.length; i++) {
    tests[i]();
  }
  console.log("All attendanceService tests passed");
} catch (err) {
  console.error("attendanceService test failed:", err.message);
  // throw to signal failure to caller
  throw err;
}

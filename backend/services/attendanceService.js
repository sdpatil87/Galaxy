import Attendance from "../models/Attendance.js";

export const addAttendanceEntry = (data) => {
  const entry = new Attendance(data);
  return entry.save();
};

export const getAttendance = (filter) => {
  return Attendance.find(filter);
};

// calculate duration in hours for a single entry
export const calculateEntryDuration = (entry) => {
  // if duration explicitly provided, use it
  if (entry.duration) return Number(entry.duration);

  // halfDay flag support: interpret as 4 hours by default
  if (entry.halfDay) return 4;

  if (!entry.start || !entry.end) return 0;
  const start = new Date(entry.start);
  const end = new Date(entry.end);
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  return (end - start) / 3600000; // milliseconds -> hours
};

// get a daily summary for a user (or organization) for a given date
export const getDailySummary = async ({ organization, user, date }) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const filter = { organization, date: { $gte: dayStart, $lt: dayEnd } };
  if (user) filter.user = user;

  const records = await Attendance.find(filter).lean();

  // aggregate entries across all matching attendance documents
  const summary = {
    organization,
    user: user || null,
    date: dayStart,
    totalHours: 0,
    byType: {}, // e.g. { office: 8, home: 2 }
    entriesCount: 0,
  };

  for (const rec of records) {
    const entries = rec.entries || [];
    for (const e of entries) {
      const dur = calculateEntryDuration(e);
      summary.totalHours += dur;
      const t = e.type || "other";
      summary.byType[t] = (summary.byType[t] || 0) + dur;
      summary.entriesCount += 1;
    }
  }

  // round to 2 decimals
  summary.totalHours = Math.round(summary.totalHours * 100) / 100;
  for (const k of Object.keys(summary.byType)) {
    summary.byType[k] = Math.round(summary.byType[k] * 100) / 100;
  }

  return summary;
};

// get summaries for a date range (inclusive)
export const getRangeSummary = async ({
  organization,
  user,
  startDate,
  endDate,
}) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const summaries = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // clone date for safety
    const day = new Date(d);
    const s = await getDailySummary({ organization, user, date: day });
    summaries.push(s);
  }

  // aggregate totals across range
  const aggregate = {
    organization,
    user: user || null,
    startDate: start,
    endDate: end,
    totalHours: 0,
    byType: {},
    days: summaries.length,
  };
  for (const s of summaries) {
    aggregate.totalHours += s.totalHours || 0;
    for (const k of Object.keys(s.byType || {})) {
      aggregate.byType[k] = (aggregate.byType[k] || 0) + s.byType[k];
    }
  }
  aggregate.totalHours = Math.round(aggregate.totalHours * 100) / 100;
  for (const k of Object.keys(aggregate.byType)) {
    aggregate.byType[k] = Math.round(aggregate.byType[k] * 100) / 100;
  }

  return { aggregate, days: summaries };
};

// convert summaries to CSV string
export const summariesToCSV = (summariesObj) => {
  const { aggregate, days } = summariesObj;
  // determine all types
  const types = new Set();
  for (const d of days) {
    for (const t of Object.keys(d.byType || {})) types.add(t);
  }
  const typeList = Array.from(types).sort();

  const headers = ["date", "user", "totalHours", "entriesCount", ...typeList];
  const rows = [headers.join(",")];

  for (const d of days) {
    const row = [];
    row.push(d.date.toISOString().slice(0, 10));
    row.push(d.user || "");
    row.push(d.totalHours || 0);
    row.push(d.entriesCount || 0);
    for (const t of typeList) {
      row.push(d.byType && d.byType[t] ? d.byType[t] : 0);
    }
    rows.push(row.join(","));
  }

  // add aggregate row
  const aggRow = [];
  aggRow.push("TOTAL");
  aggRow.push(aggregate.user || "");
  aggRow.push(aggregate.totalHours || 0);
  aggRow.push(aggregate.days || days.length);
  for (const t of typeList) {
    aggRow.push(
      aggregate.byType && aggregate.byType[t] ? aggregate.byType[t] : 0,
    );
  }
  rows.push(aggRow.join(","));

  return rows.join("\n");
};

// get period summary for 'week' or 'month' given a reference date
export const getPeriodSummary = async ({
  organization,
  user,
  period = "week",
  refDate,
}) => {
  const ref = refDate ? new Date(refDate) : new Date();
  const start = new Date(ref);
  const end = new Date(ref);
  if (period === "week") {
    // ISO week: start on Monday
    const day = (start.getDay() + 6) % 7; // Monday=0
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 6);
    end.setHours(0, 0, 0, 0);
  } else if (period === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);
    end.setHours(0, 0, 0, 0);
  } else {
    throw new Error("unsupported period");
  }

  const res = await getRangeSummary({
    organization,
    user,
    startDate: start,
    endDate: end,
  });
  return res;
};

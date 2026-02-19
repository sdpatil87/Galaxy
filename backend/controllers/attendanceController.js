import * as attendanceService from "../services/attendanceService.js";
import { Messages } from "../utils/messages.js";
import { logEvent } from "../utils/logger.js";

export const addAttendance = async (req, res) => {
  try {
    const data = {
      user: req.user.id,
      organization: req.body.organization || req.user.currentOrg,
      date: req.body.date || new Date(),
      entries: req.body.entries || [],
    };
    const entry = await attendanceService.addAttendanceEntry(data);
    logEvent("attendance_added", "new attendance entry", { entry: entry._id, user: req.user.id });
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const listAttendance = async (req, res) => {
  try {
    const { organization, user, startDate, endDate } = req.query;
    const filter = {};
    const orgId = organization || req.user.currentOrg;
    if (orgId) filter.organization = orgId;
    if (user) filter.user = user;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const results = await attendanceService.getAttendance(filter);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const getDailySummary = async (req, res) => {
  try {
    const date = req.query.date || req.body.date || new Date();
    const organization =
      req.query.organization || req.body.organization || req.user.currentOrg;
    const user = req.query.user || req.params.userId || null;
    const summary = await attendanceService.getDailySummary({
      organization,
      user,
      date,
    });
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const getDailySummaryForUser = async (req, res) => {
  try {
    const date = req.query.date || req.body.date || new Date();
    const organization =
      req.query.organization || req.body.organization || req.user.currentOrg;
    const user = req.params.userId;
    const summary = await attendanceService.getDailySummary({
      organization,
      user,
      date,
    });
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const getRangeSummary = async (req, res) => {
  try {
    const startDate = req.query.startDate || req.body.startDate;
    const endDate = req.query.endDate || req.body.endDate;
    if (!startDate || !endDate)
      return res
        .status(400)
        .json({ message: Messages.ERRORS.REQUIRED("startDate and endDate") });
    const organization =
      req.query.organization || req.body.organization || req.user.currentOrg;
    const user = req.query.user || null;
    const result = await attendanceService.getRangeSummary({
      organization,
      user,
      startDate,
      endDate,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const exportRangeCSV = async (req, res) => {
  try {
    const startDate = req.query.startDate || req.body.startDate;
    const endDate = req.query.endDate || req.body.endDate;
    if (!startDate || !endDate)
      return res
        .status(400)
        .json({ message: Messages.ERRORS.REQUIRED("startDate and endDate") });
    const organization =
      req.query.organization || req.body.organization || req.user.currentOrg;
    const user = req.query.user || null;
    const data = await attendanceService.getRangeSummary({
      organization,
      user,
      startDate,
      endDate,
    });
    const csv = attendanceService.summariesToCSV(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendance_${startDate}_${endDate}.csv"`,
    );
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

export const getPeriodSummary = async (req, res) => {
  try {
    const { period, ref } = req.query;
    if (!period || (period !== "week" && period !== "month"))
      return res
        .status(400)
        .json({ message: Messages.ERRORS.INVALID("period") });
    const organization =
      req.query.organization || req.body.organization || req.user.currentOrg;
    const user = req.query.user || null;
    const result = await attendanceService.getPeriodSummary({
      organization,
      user,
      period,
      refDate: ref,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};


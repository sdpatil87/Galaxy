import fs from "fs";
import path from "path";
import { Messages } from "../utils/messages.js";

export const getLogs = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "logs", "app.log");
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }
    const raw = await fs.promises.readFile(filePath, "utf-8");
    const entries = raw
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter((e) => e);

    let filtered = entries;
    const requestedUser = req.query.user;
    if (requestedUser) {
      // only superadmin may request arbitrary user logs
      if (!req.user.isSuperAdmin && requestedUser !== req.user.id) {
        return res.status(403).json({ message: Messages.ERRORS.UNAUTHORIZED });
      }
      filtered = filtered.filter((e) => e.meta?.user === requestedUser);
    } else if (!req.user.isSuperAdmin) {
      // normal users only see their own
      filtered = filtered.filter((e) => e.meta?.user === req.user.id);
    }

    // return last 200 entries
    const slice = filtered.slice(-200);
    res.json(slice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: Messages.ERRORS.SERVER });
  }
};

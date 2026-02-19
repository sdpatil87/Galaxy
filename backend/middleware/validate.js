import { ZodError } from "zod";

/**
 * Generic request validator for zod schemas.
 *
 * @param {ZodSchema} schema - schema to run against req[dataSource]
 * @param {string} dataSource - one of 'body', 'query', 'params'; defaults to 'body'
 */
export const validate =
  (schema, dataSource = "body") =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req[dataSource]);
      req[dataSource] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      next(err);
    }
  };

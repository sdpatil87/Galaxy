// centralized, reusable messages for the API
export const Messages = {
  ERRORS: {
    REQUIRED: (field) => `${field} is required`,
    INVALID: (field) => `${field} is invalid`,
    NOT_FOUND: "Not found",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    DUPLICATE: (field) => `${field} already exists`,
    SERVER: "Server error",
    MISSING_ORG: "organization id required",
    MISSING_DATES: "startDate and endDate required",
    MUST_BELONG: "must belong to organization",
    INSUFFICIENT: "insufficient permission",
  },
  SUCCESS: {
    CREATED: "Created successfully",
    ORG_CREATED: "Organization created successfully",
    USER_UPDATED: "User updated successfully",
    ROLE_CREATED: "Role created successfully",
    TASK_LOG_ADDED: "Task log added",
    EMAIL_SENT: "Email sent",
    PROTECTED: "This is a protected endpoint",
    // add more as you build features
  },
};

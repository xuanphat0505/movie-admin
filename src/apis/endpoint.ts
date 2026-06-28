// Danh sách các endpoints gọi API tới Backend
export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_LOGIN: "/auth/admin/login",
    ADMIN_GOOGLE_LOGIN: "/auth/admin/google-login",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    MFA_SETUP: "/auth/mfa/setup",
    MFA_VERIFY: "/auth/mfa/verify",
    MFA_DISABLE: "/auth/mfa/disable",
    MFA_LOGIN: "/auth/admin/mfa-login",
  },
  ANALYTICS: {
    GENDER_STATS: "/analytics/gender-stats",
    OVERVIEW_STATS: "/analytics/overview-stats",
  },
  ADMIN: {
    USERS_FILTER: "/admin/users/filter",
    USERS_SEARCH: "/admin/users/search",
    USERS_ADD: "/admin/users/add",
    USERS_UPDATE: (id: string) => `/admin/users/update/${id}`,
    USERS_DELETE: (id: string) => `/admin/users/${id}`,
    UPDATE_PROFILE: (id: string) => `/admin/update-profile/${id}`,
    UPLOAD_AVATAR: "/admin/upload",
  },
  USER: {
    GET_PROFILE: "/user",
  },
  NOTIFICATION: {
    GET_ALL: "/notification",
    UPDATE: "/notification/update",
    READ_ONE: (id: string) => `/notification/read-one/${id}`,
    READ_ALL: "/notification/read-all",
  },
  SETTING: "/setting",
  REPORT: {
    GET_ALL: "/report",
    CREATE: "/report",
    UPDATE_STATUS: (id: string) => `/report/${id}/status`,
  },
};

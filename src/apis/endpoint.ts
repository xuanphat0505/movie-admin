// Danh sách các endpoints gọi API tới Backend
export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_LOGIN: "/auth/admin/login",
    ADMIN_GOOGLE_LOGIN: "/auth/admin/google-login",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
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
  },
};

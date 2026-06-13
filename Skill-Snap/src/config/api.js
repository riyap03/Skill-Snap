const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "" : "https://skill-snap-jnih.onrender.com");

export const apiUrl = (path) => {
  const base = API_BASE_URL || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export default API_BASE_URL;

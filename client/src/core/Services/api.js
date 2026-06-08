// Un wrapper sobre fetch que actúa como "interceptor":
//   • Adjunta automáticamente el JWT en cada request
//   • Si el server responde 401, limpia la sesión y redirige al login
//   • Centraliza la URL base para no repetirla en cada fetch

import { environment } from "../../environment/environment.js";

// Usamos la propiedad apiUrl que definiste en tu archivo
const BASE_URL = environment.apiUrl;

function getToken() {
  return localStorage.getItem("meetra_token");
}

function clearSession() {
  localStorage.removeItem("meetra_token");
  localStorage.removeItem("meetra_user");
}

// Core request

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // ← JWT adjunto automáticamente
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Interceptor de 401
  // Si el token expiró o es inválido, el server devuelve 401.
  // Limpiamos la sesión y forzamos redirect al login.
  if (res.status === 401) {
    clearSession();
    window.location.href = "/"; // redirect duro — rompe cualquier estado colgado
    return; // nunca llega acá, pero por claridad
  }

  // Parsear JSON (el body siempre es JSON en esta API)
  const data = await res.json();

  // Si el server devolvió un error (4xx / 5xx), lanzamos para que
  // el caller lo atrape con try/catch igual que haría con Axios
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.response = { data };
    throw err;
  }

  return data;
}

// Métodos HTTP

const api = {
  get: (path, opts = {}) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts = {}) =>
    request(path, { ...opts, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, opts = {}) =>
    request(path, { ...opts, method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body, opts = {}) =>
    request(path, { ...opts, method: "PATCH", body: JSON.stringify(body) }),
  delete: (path, opts = {}) => request(path, { ...opts, method: "DELETE" }),
};

export default api;

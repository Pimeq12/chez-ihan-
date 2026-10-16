/* =====================================================================
   IHAN — couche d'accès aux données (api/ihan-api.js)
   Partagée par index.html (site) et dashboard.html (tableau de bord).
   Aujourd'hui : stockage navigateur (localStorage), sans serveur.
   Plus tard : passer MODE à "remote" et renseigner BASE_URL pour brancher
   une vraie base (voir database/schema.sql) sans toucher aux pages.
   ===================================================================== */
(function (global) {
  "use strict";

  const CONFIG = {
    MODE: "local",                 // "local" = navigateur | "remote" = serveur/API
    BASE_URL: "",                  // ex : "https://api.ihan-volailles.ci"
  };

  /* Clés de stockage : ne pas renommer (le site et le dashboard doivent les partager) */
  const KEYS = { STOCK: "ihan_stock_v1", ORDERS: "ihan_orders_v1", META: "ihan_dash_meta_v1" };

  /* Valeurs de départ — identiques à database/seed.json */
  const DEFAULT_STOCK = { entier: 120, decoupe: 60, evenement: 40, oeufs: 80 };
  const DEFAULT_THRESHOLDS = { entier: 20, decoupe: 15, evenement: 10, oeufs: 20 };

  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* stockage plein / bloqué */ }
  }

  /* ---- Fonctions métier (utilisables telles quelles) ---- */
  const getStock  = () => ({ ...DEFAULT_STOCK, ...load(KEYS.STOCK, {}) });
  const getOrders = () => load(KEYS.ORDERS, []);

  /* Export / import JSON : sauvegarde manuelle ou migration vers une vraie base */
  function exportAll() {
    return JSON.stringify({ exportedAt: new Date().toISOString(), stock: getStock(), orders: getOrders(), thresholds: load(KEYS.META, DEFAULT_THRESHOLDS) }, null, 2);
  }
  function importAll(json) {
    const d = typeof json === "string" ? JSON.parse(json) : json;
    if (d.stock) save(KEYS.STOCK, d.stock);
    if (d.orders) save(KEYS.ORDERS, d.orders);
    if (d.thresholds) save(KEYS.META, d.thresholds);
  }

  global.IhanAPI = { CONFIG, KEYS, DEFAULT_STOCK, DEFAULT_THRESHOLDS, load, save, getStock, getOrders, exportAll, importAll };
})(window);

/**
 * Une una ruta de `public/` con el base del sitio.
 *
 * Hace falta porque el sitio se sirve en `/` cuando hay dominio propio y en
 * `/leslieypablo` cuando no (ver astro.config.mjs). Escribir `/favicon.svg`
 * a pelo rompe en el segundo caso.
 */
export function ruta(camino: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base.replace(/\/$/, '')}/${camino.replace(/^\//, '')}`;
}

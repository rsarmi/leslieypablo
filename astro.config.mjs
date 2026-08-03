// @ts-check
import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * GitHub Pages sirve el sitio en dos lugares distintos según haya o no
 * dominio propio, y las rutas de los assets cambian entre uno y otro:
 *
 *   - Con dominio propio  → https://dominio.com/          → base '/'
 *   - Sin dominio propio  → https://rsarmi.github.io/leslieypablo/ → base '/leslieypablo'
 *
 * En vez de obligar a acordarse de cambiarlo a mano, lo decide la existencia
 * de public/CNAME: ese archivo es justamente lo que activa el dominio propio
 * en Pages. Crearlo (con el dominio adentro) es el único paso necesario.
 */
const REPO = 'leslieypablo';
const USUARIO = 'rsarmi';
const DOMINIO = 'leslieypablo.com';

const tieneDominioPropio = existsSync(new URL('./public/CNAME', import.meta.url));

export default defineConfig({
  site: tieneDominioPropio ? `https://${DOMINIO}` : `https://${USUARIO}.github.io`,
  base: tieneDominioPropio ? '/' : `/${REPO}`,
  trailingSlash: 'ignore',
  build: {
    // Una sola página: mejor un <style> inline que un request extra.
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

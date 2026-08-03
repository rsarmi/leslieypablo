/**
 * Lee el ancho y el alto de un JPEG directamente de su cabecera, en tiempo de
 * compilación.
 *
 * Para qué: un <img> sin `width` ni `height` no ocupa nada hasta que la imagen
 * termina de bajar. Con 35 imágenes en lazy load eso significa que media página
 * mide cero, y al cargarse empujan todo lo de abajo miles de píxeles. Cualquier
 * enlace a una sección posterior —el «Confirmar» del nav, por ejemplo— aterriza
 * en el lugar equivocado.
 *
 * Poner las medidas reales le deja al navegador reservar la caja exacta desde
 * el primer render. No recorta nada: junto con `w-full h-auto` la imagen sigue
 * escalando con su proporción de verdad.
 *
 * Se hace a mano y no con una librería para no depender de `sharp`, que hoy
 * llega de rebote como dependencia de Astro y podría desaparecer.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface Medidas {
  ancho: number;
  alto: number;
}

/**
 * Marcadores «Start of Frame», los únicos que traen las dimensiones.
 * Se excluyen a propósito C4 (tablas Huffman), C8 (reservado) y CC (aritmético),
 * que caen en el mismo rango pero no son SOF.
 */
const SOF = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

/** Marcadores sin carga útil: no llevan longitud que saltar. */
function sinCarga(marca: number): boolean {
  return marca === 0x01 || (marca >= 0xd0 && marca <= 0xd9);
}

function leerJpeg(bytes: Buffer): Medidas | null {
  // Todo JPEG empieza con SOI (FF D8).
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;

  let i = 2;

  while (i < bytes.length - 1) {
    // Los segmentos van precedidos de FF; puede haber relleno de FFs.
    if (bytes[i] !== 0xff) {
      i++;
      continue;
    }

    const marca = bytes[i + 1];

    if (marca === 0xff) {
      i++;
      continue;
    }

    if (sinCarga(marca)) {
      i += 2;
      continue;
    }

    if (i + 4 > bytes.length) return null;
    const largo = bytes.readUInt16BE(i + 2);
    if (largo < 2) return null;

    if (SOF.has(marca)) {
      // [FF][marca][largo:2][precisión:1][alto:2][ancho:2]
      if (i + 9 > bytes.length) return null;
      return { alto: bytes.readUInt16BE(i + 5), ancho: bytes.readUInt16BE(i + 7) };
    }

    i += 2 + largo;
  }

  return null;
}

/** Las medidas no cambian durante un build; leer 38 archivos una vez basta. */
const cache = new Map<string, Medidas | null>();

/**
 * Mide una imagen de `public/` a partir de su ruta relativa
 * (por ejemplo `moodboard/martinis.jpg`).
 *
 * Devuelve null si el archivo no existe o no se puede leer, para que una imagen
 * rota nunca tire el build: simplemente se queda sin medidas.
 */
export function medir(rutaEnPublic: string): Medidas | null {
  if (cache.has(rutaEnPublic)) return cache.get(rutaEnPublic)!;

  let medidas: Medidas | null = null;

  try {
    const absoluta = fileURLToPath(new URL(`../../public/${rutaEnPublic}`, import.meta.url));
    medidas = leerJpeg(readFileSync(absoluta));
  } catch {
    medidas = null;
  }

  cache.set(rutaEnPublic, medidas);
  return medidas;
}

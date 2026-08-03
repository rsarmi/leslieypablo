/**
 * Cliente del Web App de Google Apps Script.
 *
 * Por qué `Content-Type: text/plain` y no `application/json`:
 * Apps Script no responde al preflight OPTIONS que dispara un JSON request.
 * Con text/plain el navegador lo trata como "simple request", se salta el
 * preflight, y el servidor parsea el body con JSON.parse a mano. Es el único
 * camino que funciona sin proxy. NO cambiar a application/json.
 */

import { boda } from '../config/boda';

const ENDPOINT = boda.api.endpoint;

/** Apps Script arranca en frío y a veces tarda. Mejor esperar que fallar en seco. */
const TIMEOUT_MS = 25_000;

/** Versionada: si algún día cambia la contraseña, subir el número invalida a todos. */
const CLAVE_STORAGE = 'boda-lp:v1:pass';

export interface DatosBanco {
  titular: string;
  banco: string;
  clabe: string;
  cuenta: string;
  nota: string;
}

export type ErrorApi =
  | 'password'
  | 'red'
  | 'servidor'
  | 'sin_configurar'
  | 'campos_requeridos'
  /** La búsqueda necesita al menos tres letras. */
  | 'consulta_corta'
  /** Movieron filas en la hoja entre la búsqueda y la confirmación. */
  | 'fila_cambio'
  | 'mail_invalido'
  | 'telefono_invalido';

export type ResultadoUnlock =
  | { ok: true; banco: DatosBanco }
  | { ok: false; error: ErrorApi };

export type ResultadoRsvp = { ok: true } | { ok: false; error: ErrorApi };

/**
 * Una fila de la pestaña `Invitados` que se parece a lo que buscaron.
 *
 * No trae si esa persona ya confirmó: el servidor no lo manda a propósito,
 * porque cualquiera con la contraseña puede buscar cualquier nombre.
 */
export interface InvitadoEncontrado {
  /** Fila real en la hoja. Es el identificador: el `N°` viene repetido. */
  fila: number;
  nombre: string;
}

export type ResultadoBusqueda =
  | { ok: true; resultados: InvitadoEncontrado[]; total: number }
  | { ok: false; error: ErrorApi };

export interface DatosConfirmacion {
  fila: number;
  nombre: string;
  asiste: 'si' | 'no';
  mail: string;
  telefono: string;
}

/** Envío del formulario abierto: una persona por respuesta, sin acompañantes. */
export interface DatosRsvp {
  nombre: string;
  contacto: string;
  asiste: 'si' | 'no';
  cancion: string;
  mensaje: string;
}

// ---------------------------------------------------------------------------
// Contraseña recordada
// ---------------------------------------------------------------------------

/**
 * localStorage y no sessionStorage: los invitados van a abrir el link desde
 * WhatsApp varias veces a lo largo de meses y no queremos que reescriban la
 * contraseña cada vez. La contraseña no protege nada crítico.
 */
export function leerPassword(): string | null {
  try {
    return localStorage.getItem(CLAVE_STORAGE);
  } catch {
    // Safari en privado tira al tocar localStorage.
    return null;
  }
}

export function guardarPassword(password: string): void {
  try {
    localStorage.setItem(CLAVE_STORAGE, password);
  } catch {
    /* sin storage el sitio sigue funcionando, solo hay que reescribir */
  }
}

export function olvidarPassword(): void {
  try {
    localStorage.removeItem(CLAVE_STORAGE);
  } catch {
    /* nada que hacer */
  }
}

// ---------------------------------------------------------------------------
// Peticiones
// ---------------------------------------------------------------------------

function endpointConfigurado(): boolean {
  return !ENDPOINT.includes('PEGAR_ID_AQUI');
}

async function postear(payload: Record<string, unknown>): Promise<any> {
  if (!endpointConfigurado()) {
    throw new ErrorSinConfigurar();
  }

  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), TIMEOUT_MS);

  try {
    const respuesta = await fetch(ENDPOINT, {
      method: 'POST',
      // Ver la nota de arriba: text/plain es intencional.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: control.signal,
    });

    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    return await respuesta.json();
  } finally {
    clearTimeout(reloj);
  }
}

class ErrorSinConfigurar extends Error {}

/** Valida la contraseña contra el servidor y, si es correcta, trae los datos bancarios. */
export async function unlock(password: string): Promise<ResultadoUnlock> {
  try {
    const datos = await postear({ action: 'unlock', password });

    if (datos?.ok) {
      return { ok: true, banco: datos.banco as DatosBanco };
    }

    return { ok: false, error: datos?.error === 'password' ? 'password' : 'servidor' };
  } catch (err) {
    if (err instanceof ErrorSinConfigurar) return { ok: false, error: 'sin_configurar' };
    return { ok: false, error: 'red' };
  }
}

/**
 * Busca al invitado en la lista. El emparejado difuso corre en el servidor a
 * propósito: así la lista completa de invitados nunca llega al navegador y
 * siempre se consulta la versión más reciente de la hoja, que los novios
 * siguen editando.
 */
export async function buscarInvitado(consulta: string): Promise<ResultadoBusqueda> {
  const password = leerPassword();
  if (!password) return { ok: false, error: 'password' };

  try {
    const respuesta = await postear({ action: 'buscar', password, consulta });

    if (respuesta?.ok) {
      return {
        ok: true,
        resultados: (respuesta.resultados ?? []) as InvitadoEncontrado[],
        total: Number(respuesta.total ?? 0),
      };
    }

    return { ok: false, error: codigoConocido(respuesta?.error) };
  } catch (err) {
    if (err instanceof ErrorSinConfigurar) return { ok: false, error: 'sin_configurar' };
    return { ok: false, error: 'red' };
  }
}

/** Marca la fila del invitado con su respuesta. */
export async function confirmarInvitado(datos: DatosConfirmacion): Promise<ResultadoRsvp> {
  const password = leerPassword();
  if (!password) return { ok: false, error: 'password' };

  try {
    const respuesta = await postear({ action: 'confirmar', password, ...datos });

    if (respuesta?.ok) return { ok: true };
    return { ok: false, error: codigoConocido(respuesta?.error) };
  } catch (err) {
    if (err instanceof ErrorSinConfigurar) return { ok: false, error: 'sin_configurar' };
    return { ok: false, error: 'red' };
  }
}

/** Los errores del servidor que el cliente sabe explicar; el resto es 'servidor'. */
const CODIGOS: ReadonlySet<string> = new Set([
  'password',
  'campos_requeridos',
  'consulta_corta',
  'fila_cambio',
  'mail_invalido',
  'telefono_invalido',
]);

function codigoConocido(error: unknown): ErrorApi {
  return typeof error === 'string' && CODIGOS.has(error) ? (error as ErrorApi) : 'servidor';
}

export async function enviarRsvp(datos: DatosRsvp): Promise<ResultadoRsvp> {
  const password = leerPassword();
  if (!password) return { ok: false, error: 'password' };

  try {
    // La pestaña `Respuestas` conserva las columnas de acompañantes de cuando
    // el formulario los pedía, así que se mandan en cero para no descuadrarla.
    const respuesta = await postear({
      action: 'rsvp',
      password,
      ...datos,
      acompanantes: 0,
      nombresAcompanantes: [],
    });

    if (respuesta?.ok) return { ok: true };

    const error = respuesta?.error;
    if (error === 'password' || error === 'campos_requeridos') {
      return { ok: false, error };
    }
    return { ok: false, error: 'servidor' };
  } catch (err) {
    if (err instanceof ErrorSinConfigurar) return { ok: false, error: 'sin_configurar' };
    return { ok: false, error: 'red' };
  }
}

// ---------------------------------------------------------------------------
// Puente entre el gate y la sección de regalos
// ---------------------------------------------------------------------------

/**
 * Los datos bancarios llegan en la respuesta del unlock, pero quien los pinta
 * es Regalos.astro. En vez de acoplar los dos componentes, el gate emite un
 * evento y Regalos escucha. Se guarda el último valor porque Regalos puede
 * montar después de que el gate ya resolvió.
 */
const EVENTO_BANCO = 'boda:banco';

let bancoActual: DatosBanco | null = null;

export function publicarBanco(banco: DatosBanco): void {
  bancoActual = banco;
  window.dispatchEvent(new CustomEvent<DatosBanco>(EVENTO_BANCO, { detail: banco }));
}

export function alRecibirBanco(callback: (banco: DatosBanco) => void): void {
  if (bancoActual) callback(bancoActual);
  window.addEventListener(EVENTO_BANCO, (e) => callback((e as CustomEvent<DatosBanco>).detail));
}

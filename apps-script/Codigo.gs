/**
 * Backend del sitio de boda de Leslie & Pablo.
 *
 * Cómo instalarlo:
 *   1. Abrir la Google Sheet de la boda.
 *   2. Extensiones → Apps Script.
 *   3. Pegar este archivo completo (reemplazando lo que haya).
 *   4. Ejecutar la función `instalar()` una sola vez desde el editor.
 *      Crea las pestañas `Config` y `Respuestas` y pide los permisos.
 *   5. Llenar la pestaña `Config` con la contraseña y los datos bancarios.
 *   6. Implementar → Nueva implementación → tipo "Aplicación web".
 *        - Ejecutar como: Yo
 *        - Quién tiene acceso: Cualquier usuario
 *   7. Copiar la URL /exec y pegarla en `src/config/boda.ts` → api.endpoint.
 *
 * IMPORTANTE: cada vez que edites este archivo hay que crear una NUEVA VERSIÓN
 * de la implementación (Implementar → Administrar implementaciones → editar →
 * Versión: Nueva). Si no, la URL sigue sirviendo el código viejo.
 *
 * La pestaña `Invitados` no se lee ni se escribe nunca desde aquí.
 */

var HOJA_CONFIG = 'Config';
var HOJA_RESPUESTAS = 'Respuestas';

var COLUMNAS_RESPUESTAS = [
  'Timestamp',
  'Nombre completo',
  'Contacto',
  '¿Asiste?',
  'Acompañantes',
  'Nombres acompañantes',
  'Total personas',
  'Canción',
  'Mensaje',
];

var CLAVES_CONFIG = [
  ['password', 'CAMBIAR-ESTA-CONTRASENA'],
  ['banco_titular', ''],
  ['banco_nombre', ''],
  ['banco_clabe', ''],
  ['banco_cuenta', ''],
  ['banco_nota', ''],
];

// ---------------------------------------------------------------------------
// Instalación
// ---------------------------------------------------------------------------

/** Ejecutar UNA VEZ desde el editor de Apps Script. Es idempotente. */
function instalar() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();

  var config = libro.getSheetByName(HOJA_CONFIG);
  if (!config) {
    config = libro.insertSheet(HOJA_CONFIG);
    config.getRange(1, 1, 1, 2).setValues([['clave', 'valor']]).setFontWeight('bold');
    config.getRange(2, 1, CLAVES_CONFIG.length, 2).setValues(CLAVES_CONFIG);
    config.setColumnWidth(1, 180);
    config.setColumnWidth(2, 420);
    config.setFrozenRows(1);
  }

  var respuestas = libro.getSheetByName(HOJA_RESPUESTAS);
  if (!respuestas) {
    respuestas = libro.insertSheet(HOJA_RESPUESTAS);
    respuestas
      .getRange(1, 1, 1, COLUMNAS_RESPUESTAS.length)
      .setValues([COLUMNAS_RESPUESTAS])
      .setFontWeight('bold');
    respuestas.setFrozenRows(1);
    respuestas.setColumnWidth(1, 160);
    respuestas.setColumnWidth(2, 220);
    respuestas.setColumnWidth(3, 200);
    respuestas.setColumnWidth(6, 320);
    respuestas.setColumnWidth(9, 400);
  }

  Logger.log('Listo. Ahora llena la pestaña "%s" y publica la app web.', HOJA_CONFIG);
}

// ---------------------------------------------------------------------------
// Endpoint
// ---------------------------------------------------------------------------

/**
 * El cliente manda POST con Content-Type text/plain a propósito: así el
 * navegador lo trata como "simple request" y no dispara un preflight OPTIONS,
 * que Apps Script no sabe responder. Por eso parseamos el body a mano.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responder({ ok: false, error: 'sin_datos' });
    }

    var datos = JSON.parse(e.postData.contents);

    if (!contrasenaValida(datos.password)) {
      return responder({ ok: false, error: 'password' });
    }

    switch (datos.action) {
      case 'unlock':
        return responder({ ok: true, banco: leerBanco() });
      case 'rsvp':
        return responder(guardarRsvp(datos));
      default:
        return responder({ ok: false, error: 'accion_desconocida' });
    }
  } catch (err) {
    // Nunca devolvemos el stack al cliente, pero sí lo dejamos en los logs.
    Logger.log('Error en doPost: %s', err && err.stack ? err.stack : err);
    return responder({ ok: false, error: 'servidor' });
  }
}

/** Con GET no se hace nada útil: existe solo para comprobar que la URL vive. */
function doGet() {
  return responder({ ok: true, mensaje: 'Endpoint activo.' });
}

// ---------------------------------------------------------------------------
// Lógica
// ---------------------------------------------------------------------------

function guardarRsvp(datos) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_RESPUESTAS);
  if (!hoja) return { ok: false, error: 'falta_hoja_respuestas' };

  var nombre = texto(datos.nombre, 120);
  var contacto = texto(datos.contacto, 120);
  if (!nombre || !contacto) return { ok: false, error: 'campos_requeridos' };

  var asiste = datos.asiste === 'si' ? 'Sí' : 'No';

  // Si no asiste, los acompañantes no cuentan aunque el cliente los mande.
  var acompanantes = asiste === 'Sí' ? entero(datos.acompanantes, 0, 10) : 0;

  var nombresLista = Array.isArray(datos.nombresAcompanantes) ? datos.nombresAcompanantes : [];
  var nombres = nombresLista
    .slice(0, acompanantes)
    .map(function (n) {
      return texto(n, 120);
    })
    .filter(function (n) {
      return n.length > 0;
    })
    .join(', ');

  // El bloqueo evita que dos personas que confirman al mismo tiempo pisen la misma fila.
  var candado = LockService.getScriptLock();
  candado.waitLock(20000);
  try {
    hoja.appendRow([
      new Date(),
      nombre,
      contacto,
      asiste,
      acompanantes,
      nombres,
      asiste === 'Sí' ? acompanantes + 1 : 0,
      texto(datos.cancion, 200),
      texto(datos.mensaje, 1500),
    ]);
  } finally {
    candado.releaseLock();
  }

  return { ok: true };
}

function leerBanco() {
  var config = leerConfig();
  return {
    titular: config.banco_titular || '',
    banco: config.banco_nombre || '',
    clabe: config.banco_clabe || '',
    cuenta: config.banco_cuenta || '',
    nota: config.banco_nota || '',
  };
}

function contrasenaValida(entrada) {
  var esperada = String(leerConfig().password || '');
  if (!esperada) return false;

  // Normalizamos igual que el cliente: sin espacios sobrantes y sin distinguir mayúsculas.
  return normalizar(entrada) === normalizar(esperada);
}

function normalizar(valor) {
  return String(valor == null ? '' : valor)
    .trim()
    .toLowerCase();
}

function leerConfig() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_CONFIG);
  if (!hoja) return {};

  var filas = hoja.getDataRange().getValues();
  var config = {};

  // Se salta la fila de encabezados.
  for (var i = 1; i < filas.length; i++) {
    var clave = String(filas[i][0] || '').trim();
    if (clave) config[clave] = String(filas[i][1] == null ? '' : filas[i][1]).trim();
  }

  return config;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function texto(valor, maximo) {
  return String(valor == null ? '' : valor)
    .trim()
    .slice(0, maximo);
}

function entero(valor, minimo, maximo) {
  var n = parseInt(valor, 10);
  if (isNaN(n)) return minimo;
  return Math.min(Math.max(n, minimo), maximo);
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON
  );
}

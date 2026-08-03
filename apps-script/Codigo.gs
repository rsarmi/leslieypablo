/**
 * Backend del sitio de boda de Leslie & Pablo.
 *
 * Cómo instalarlo:
 *   1. Abrir la Google Sheet de la boda.
 *   2. Extensiones → Apps Script.
 *   3. Pegar este archivo completo (reemplazando lo que haya).
 *   4. Ejecutar la función `instalar()` una sola vez desde el editor.
 *      Crea la pestaña `Config`, agrega las columnas del sitio a `Invitados`
 *      y pide los permisos. Es idempotente: se puede correr las veces que
 *      haga falta.
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
 * Sobre la pestaña `Invitados`: el sitio la LEE para el buscador y solo escribe
 * en las columnas que agrega al final (ver COLUMNAS_WEB). Las columnas de
 * trabajo de los novios —incluida `Confirmado`— no se tocan nunca.
 *
 * Quien no aparece en la lista no tiene forma de meterse solo: lo agregan los
 * novios a mano. Por eso aquí no hay ningún formulario abierto.
 */

var HOJA_CONFIG = 'Config';
var HOJA_INVITADOS = 'Invitados';

/** Encabezado de la columna de `Invitados` sobre la que corre el buscador. */
var COLUMNA_NOMBRE = 'Nombre';

/**
 * Columnas que el sitio agrega al final de `Invitados` y son las únicas que
 * escribe. Van aparte de `Confirmado` a propósito: esa la llenan los novios a
 * mano y no queremos que una confirmación desde el sitio les pise el dato.
 *
 * Si se renombran aquí hay que renombrarlas también en la hoja (o al revés):
 * se localizan por encabezado, así que un nombre que no exista se crea de nuevo
 * como columna vacía al final.
 */
var COLUMNAS_WEB = ['Confirmó web', 'Fecha confirmación', 'Mail', 'Telefono'];

var CLAVES_CONFIG = [
  ['password', 'CAMBIAR-ESTA-CONTRASENA'],
  ['banco_titular', ''],
  ['banco_nombre', ''],
  ['banco_clabe', ''],
  ['banco_cuenta', ''],
  ['banco_nota', ''],
];

/** Cuántos candidatos devuelve el buscador como máximo. */
var MAX_RESULTADOS = 8;

/** Puntaje mínimo (0–1) para que un nombre se considere candidato. */
var UMBRAL = 0.55;

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

  var invitados = libro.getSheetByName(HOJA_INVITADOS);
  if (!invitados) {
    Logger.log('OJO: no existe la pestaña "%s". El buscador no va a funcionar.', HOJA_INVITADOS);
  } else {
    asegurarColumnas(invitados, COLUMNAS_WEB);
    Logger.log('Columnas del sitio listas en "%s".', HOJA_INVITADOS);
  }

  Logger.log('Listo. Ahora llena la pestaña "%s" y publica la app web.', HOJA_CONFIG);
}

/**
 * Devuelve los índices (base 1) de las columnas pedidas, creando al final de la
 * hoja las que falten.
 *
 * Se localizan por nombre de encabezado y no por posición fija: los novios
 * siguen editando la hoja y pueden insertar, mover o borrar columnas en
 * cualquier momento sin que el sitio escriba en el lugar equivocado.
 */
function asegurarColumnas(hoja, nombres) {
  var ultima = hoja.getLastColumn();

  // Una hoja recién creada no tiene ni encabezados: getRange(...,0) reventaría.
  var encabezados = ultima > 0 ? hoja.getRange(1, 1, 1, ultima).getValues()[0] : [];

  var indices = {};
  var creadas = 0;

  for (var i = 0; i < nombres.length; i++) {
    var pos = -1;

    for (var j = 0; j < encabezados.length; j++) {
      if (String(encabezados[j]).trim() === nombres[i]) {
        pos = j + 1;
        break;
      }
    }

    if (pos === -1) {
      // Al final, después de todo lo que ya haya.
      ultima += 1;
      pos = ultima;
      creadas++;
      hoja.getRange(1, pos).setValue(nombres[i]).setFontWeight('bold');
    }

    indices[nombres[i]] = pos;
  }

  // El ancho se calcula con `ultima`, que ya trae la cuenta exacta, y no con
  // otro getLastColumn(): las columnas recién escritas podrían no estar
  // reflejadas todavía y se les pondría el ancho a las equivocadas.
  if (creadas) hoja.setColumnWidths(ultima - creadas + 1, creadas, 170);

  return indices;
}

/** Los índices de las columnas de `Invitados` que escribe el sitio. */
function asegurarColumnasWeb(hoja) {
  var indices = asegurarColumnas(hoja, COLUMNAS_WEB);
  return {
    confirmo: indices[COLUMNAS_WEB[0]],
    fecha: indices[COLUMNAS_WEB[1]],
    mail: indices[COLUMNAS_WEB[2]],
    telefono: indices[COLUMNAS_WEB[3]],
  };
}

/** Igual que la anterior pero sin escribir: para las lecturas del buscador. */
function buscarColumnas(encabezados) {
  var indices = { nombre: -1, confirmo: -1, fecha: -1, mail: -1, telefono: -1 };
  var mapa = {};
  mapa[COLUMNA_NOMBRE] = 'nombre';
  mapa[COLUMNAS_WEB[0]] = 'confirmo';
  mapa[COLUMNAS_WEB[1]] = 'fecha';
  mapa[COLUMNAS_WEB[2]] = 'mail';
  mapa[COLUMNAS_WEB[3]] = 'telefono';

  for (var j = 0; j < encabezados.length; j++) {
    var clave = mapa[String(encabezados[j]).trim()];
    if (clave && indices[clave] === -1) indices[clave] = j;
  }

  return indices;
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
      case 'buscar':
        return responder(buscarInvitados(datos));
      case 'confirmar':
        return responder(confirmarInvitado(datos));
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
// Buscador de invitados
// ---------------------------------------------------------------------------

/**
 * Busca en la columna `Nombre` de `Invitados` y devuelve los candidatos más
 * parecidos. La lista completa NUNCA sale de aquí: solo viajan al navegador
 * los pocos nombres que se parecen a lo que el invitado escribió.
 */
function buscarInvitados(datos) {
  var consulta = texto(datos.consulta, 80);
  if (consulta.replace(/\s/g, '').length < 3) {
    return { ok: false, error: 'consulta_corta' };
  }

  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_INVITADOS);
  if (!hoja) return { ok: false, error: 'falta_hoja_invitados' };

  var filas = hoja.getDataRange().getValues();
  if (filas.length < 2) return { ok: true, resultados: [] };

  var col = buscarColumnas(filas[0]);
  if (col.nombre === -1) return { ok: false, error: 'falta_columna_nombre' };

  var tq = tokenizar(consulta);
  if (!tq.length) return { ok: false, error: 'consulta_corta' };

  var fq = [];
  for (var t = 0; t < tq.length; t++) fq.push(fonetica(tq[t]));

  var candidatos = [];

  // i arranca en 1 para saltarse los encabezados; la fila real en la hoja es i+1.
  for (var i = 1; i < filas.length; i++) {
    var nombre = String(filas[i][col.nombre] == null ? '' : filas[i][col.nombre]).trim();
    if (!nombre) continue;

    var puntaje = puntuar(tq, fq, nombre);
    if (puntaje < UMBRAL) continue;

    /*
     * A propósito no se devuelve si esa persona ya confirmó: cualquiera con la
     * contraseña puede buscar cualquier nombre, y quién viene y quién no es
     * asunto de los novios.
     */
    candidatos.push({ fila: i + 1, nombre: nombre, puntaje: puntaje });
  }

  candidatos.sort(function (a, b) {
    return b.puntaje - a.puntaje;
  });

  var total = candidatos.length;
  var resultados = candidatos.slice(0, MAX_RESULTADOS);

  // El puntaje es ruido para el cliente: solo servía para ordenar.
  for (var r = 0; r < resultados.length; r++) delete resultados[r].puntaje;

  return { ok: true, resultados: resultados, total: total };
}

/**
 * Escribe la respuesta de un invitado en su fila.
 *
 * El cliente manda también el nombre que vio al buscar. Si entre la búsqueda y
 * la confirmación alguien insertó o borró filas en la hoja, el número de fila
 * ya apunta a otra persona: por eso se vuelve a comparar el nombre antes de
 * escribir y, si no cuadra, se pide repetir la búsqueda en vez de marcar a
 * quien no es.
 */
function confirmarInvitado(datos) {
  var fila = entero(datos.fila, 0, 100000);
  var nombreEsperado = texto(datos.nombre, 200);
  var asiste = datos.asiste === 'si' ? 'Sí' : 'No';
  var mail = texto(datos.mail, 120);
  var telefono = texto(datos.telefono, 60);

  if (fila < 2 || !nombreEsperado) return { ok: false, error: 'datos_invalidos' };

  var problema = validarContacto(nombreEsperado, mail, telefono);
  if (problema) return { ok: false, error: problema };

  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_INVITADOS);
  if (!hoja) return { ok: false, error: 'falta_hoja_invitados' };
  if (fila > hoja.getLastRow()) return { ok: false, error: 'fila_cambio' };

  var candado = LockService.getScriptLock();
  candado.waitLock(20000);
  try {
    var col = buscarColumnas(hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0]);
    if (col.nombre === -1) return { ok: false, error: 'falta_columna_nombre' };

    var nombreReal = String(hoja.getRange(fila, col.nombre + 1).getValue() || '').trim();
    if (aplanar(nombreReal) !== aplanar(nombreEsperado)) {
      return { ok: false, error: 'fila_cambio' };
    }

    // Se crean aquí y no en cada búsqueda: escribir en la hoja es caro.
    var web = asegurarColumnasWeb(hoja);

    hoja.getRange(fila, web.confirmo).setValue(asiste);
    hoja.getRange(fila, web.fecha).setValue(new Date());
    hoja.getRange(fila, web.mail).setValue(mail);
    // Como texto: si no, Sheets se come el + del código de país y los ceros.
    hoja.getRange(fila, web.telefono).setValue(telefono).setNumberFormat('@');
  } finally {
    candado.releaseLock();
  }

  return { ok: true, nombre: nombreEsperado, asiste: asiste };
}

// ---------------------------------------------------------------------------
// Comparación difusa de nombres
// ---------------------------------------------------------------------------

var CON_ACENTO = 'áàäâãéèëêíìïîóòöôõúùüûñçÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇ';
var SIN_ACENTO = 'aaaaaeeeeiiiiooooouuuuncAAAAAEEEEIIIIOOOOOUUUUNC';

/** Minúsculas, sin acentos y sin signos: la base de toda comparación. */
function aplanar(valor) {
  var s = String(valor == null ? '' : valor);
  var salida = '';

  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    var pos = CON_ACENTO.indexOf(c);
    salida += pos === -1 ? c : SIN_ACENTO.charAt(pos);
  }

  return salida
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Parte un nombre en palabras útiles, tirando partículas y letras sueltas. */
var PARTICULAS = { de: 1, del: 1, la: 1, las: 1, los: 1, y: 1, e: 1, da: 1, di: 1, van: 1, von: 1 };

function tokenizar(valor) {
  var crudos = aplanar(valor).split(' ');
  var salida = [];

  for (var i = 0; i < crudos.length; i++) {
    var t = crudos[i];
    if (t.length < 2) continue;
    if (PARTICULAS[t]) continue;
    salida.push(t);
  }

  // Si el nombre era puro "de la" nos quedamos con lo que haya.
  if (!salida.length) {
    for (var j = 0; j < crudos.length; j++) if (crudos[j]) salida.push(crudos[j]);
  }

  return salida;
}

/**
 * Clave fonética para español mexicano. Colapsa las confusiones que la gente
 * comete al escribir un apellido de oído: Gutierres→Gutiérrez, Baldes→Valdés,
 * Senal→Ceñal, Yorente→Llorente, Errera→Herrera.
 */
function fonetica(token) {
  // "ch" se aparta como una sola letra antes de borrar las haches sueltas.
  // La marca es una mayúscula porque `aplanar` ya dejó todo en minúsculas,
  // así que no puede chocar con ninguna letra del nombre real.
  var s = token.replace(/ch/g, 'C');

  s = s.replace(/qu([ei])/g, 'k$1');
  s = s.replace(/c([ei])/g, 's$1');
  s = s.replace(/[cqk]/g, 'k');
  s = s.replace(/g([ei])/g, 'j$1');
  s = s.replace(/ll/g, 'y');
  s = s.replace(/[vw]/g, 'b');
  s = s.replace(/z/g, 's');
  s = s.replace(/h/g, '');
  s = s.replace(/C/g, 'ch');
  s = s.replace(/(.)\1+/g, '$1'); // rr->r, ss->s, nn->n

  return s;
}

/** Levenshtein clásico, con dos filas en vez de la matriz completa. */
function distancia(a, b) {
  if (a === b) return 0;

  var la = a.length;
  var lb = b.length;
  if (!la) return lb;
  if (!lb) return la;

  var previa = [];
  for (var j = 0; j <= lb; j++) previa[j] = j;

  for (var i = 1; i <= la; i++) {
    var actual = [i];
    var ca = a.charAt(i - 1);

    for (var k = 1; k <= lb; k++) {
      var costo = ca === b.charAt(k - 1) ? 0 : 1;
      actual[k] = Math.min(actual[k - 1] + 1, previa[k] + 1, previa[k - 1] + costo);
    }

    previa = actual;
  }

  return previa[lb];
}

/**
 * Qué tanto se parecen dos palabras sueltas, de 0 a 1.
 * La tolerancia crece con la longitud: en "Ana" un error cambia la palabra,
 * en "Brandenstein" no.
 */
function puntajeToken(consulta, nombre) {
  if (!consulta || !nombre) return 0;
  if (consulta === nombre) return 1;

  // Prefijo: quien escribe "Sarmi" está buscando "Sarmiento".
  if (nombre.indexOf(consulta) === 0) return consulta.length >= 3 ? 0.92 : 0.55;

  var tolerancia = consulta.length <= 4 ? 1 : consulta.length <= 7 ? 2 : 3;
  var d = distancia(consulta, nombre);
  if (d > tolerancia) return 0;

  return 0.86 - (d - 1) * 0.12;
}

/**
 * Puntaje de un nombre completo contra la consulta ya tokenizada.
 *
 * Cada palabra de la consulta se empareja con su mejor palabra libre del
 * nombre. Se exige que al menos la mitad de lo que escribieron coincida con
 * algo, para que "Rodrigo Sarmiento" no traiga a todos los Rodrigos.
 */
function puntuar(tokensConsulta, foneticasConsulta, nombre) {
  var tn = tokenizar(nombre);
  if (!tn.length) return 0;

  var fn = [];
  for (var f = 0; f < tn.length; f++) fn.push(fonetica(tn[f]));

  var usados = {};
  var suma = 0;
  var coinciden = 0;

  for (var i = 0; i < tokensConsulta.length; i++) {
    var mejor = 0;
    var mejorJ = -1;

    for (var j = 0; j < tn.length; j++) {
      if (usados[j]) continue;

      var directo = puntajeToken(tokensConsulta[i], tn[j]);
      // La coincidencia fonética vale un poco menos que la literal.
      var oido = puntajeToken(foneticasConsulta[i], fn[j]) * 0.95;
      var p = directo > oido ? directo : oido;

      if (p > mejor) {
        mejor = p;
        mejorJ = j;
      }
    }

    if (mejor > 0) {
      usados[mejorJ] = true;
      coinciden++;
      suma += mejor;
    }
  }

  var resultado = 0;

  if (coinciden && coinciden / tokensConsulta.length >= 0.5) {
    var base = suma / tokensConsulta.length;

    // Premia cubrir el nombre entero: escribir "Elvira Müller" debe traer esa
    // fila y no las ocho que solo dicen "Elvira".
    var cobertura = Math.min(coinciden / tn.length, 1);
    resultado = base * (0.75 + 0.25 * cobertura);
  }

  // Segunda oportunidad para quien escribe sin espacios ("juanarreola") o a
  // quien el teclado del teléfono se los comió. Solo se calcula cuando el
  // número de palabras no cuadra, así que no cuesta nada en el caso normal.
  if (tokensConsulta.length !== tn.length) {
    var pegado = puntajeToken(tokensConsulta.join(''), tn.join('')) * 0.9;
    if (pegado > resultado) resultado = pegado;
  }

  return resultado;
}

/**
 * Validación mínima compartida por los dos caminos. No pretende bloquear a
 * nadie: sirve para que no se cuele un teléfono en la columna del correo.
 * Devuelve el código del problema, o null si todo va bien.
 */
function validarContacto(nombre, mail, telefono) {
  if (!nombre || !mail || !telefono) return 'campos_requeridos';
  if (mail.indexOf('@') < 1 || mail.indexOf('.') === -1) return 'mail_invalido';
  if (telefono.replace(/[^0-9]/g, '').length < 8) return 'telefono_invalido';
  return null;
}

// ---------------------------------------------------------------------------
// Config y contraseña
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Prueba del buscador (correr desde el editor, no toca nada de la hoja)
// ---------------------------------------------------------------------------

/**
 * Escribe en el log qué encuentra el buscador para varias consultas típicas,
 * incluyendo errores de dedo y de oído. Sirve para calibrar UMBRAL sin tener
 * que desplegar el sitio.
 */
function probarBuscador() {
  var pruebas = [
    'Rodrigo Sarmiento',
    'rodrigo sarmiiento',
    'Elvira Muller',
    'elvira miler',
    'Gutierres',
    'pedro senal',
    'jose luis caldu',
    'Cristina MacGregor',
    'kristina macgregor',
    'zzzzz nadie',
  ];

  for (var i = 0; i < pruebas.length; i++) {
    var r = buscarInvitados({ consulta: pruebas[i] });
    var nombres = [];

    if (r.ok) {
      for (var j = 0; j < r.resultados.length; j++) {
        nombres.push(r.resultados[j].nombre + ' (fila ' + r.resultados[j].fila + ')');
      }
    }

    Logger.log('%s → %s', pruebas[i], r.ok ? nombres.join(' · ') || '(nada)' : 'error: ' + r.error);
  }
}

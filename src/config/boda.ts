/**
 * ÚNICO archivo que hay que editar para cambiar el contenido del sitio.
 * No toquen los componentes para cambiar una hora o un texto.
 *
 * Los datos bancarios NO viven aquí a propósito: el repo de GitHub Pages es
 * público. Viven en la pestaña `Config` de la Google Sheet y solo llegan al
 * navegador cuando Apps Script ya validó la contraseña.
 */

/** Marca los valores que faltan por confirmar. Búsquenlos con: grep -rn "PENDIENTE" src/ */
const PENDIENTE = (texto: string) => texto;

export const boda = {
  novios: {
    ella: 'Leslie',
    el: 'Pablo',
    nombreCompletoElla: 'Leslie Montero',
    nombreCompletoEl: 'Pablo David Goldin',
    /** Aparece en el <title> y en el footer. */
    monograma: 'L & P',
  },

  fecha: {
    /** ISO con offset de CDMX (UTC-6 el 31 de octubre de 2026). Lo usa la cuenta regresiva. */
    iso: '2026-10-31T17:00:00-06:00',
    diaSemana: 'Sábado',
    dia: '31',
    mes: 'Octubre',
    anio: '2026',
    /** La marca del save-the-date. Va en blackletter verde ácido. */
    marca: '31·10·26',
    displayCorto: '31 · 10 · 26',
    displayLargo: 'Sábado 31 de octubre de 2026',
    horaInicio: '5:00 pm',
    horaFin: '2:00 am',
    /** Hasta cuándo se puede confirmar. */
    limiteRsvp: PENDIENTE('30 de septiembre de 2026'),
  },

  venue: {
    nombre: 'Salón Los Ángeles',
    /** Confirmado contra la ficha de Google Maps del salón. */
    calle: 'Lerdo 206, esq. Manuel González',
    colonia: 'Col. Guerrero',
    ciudad: 'Alcaldía Cuauhtémoc, Ciudad de México',
    cp: 'C.P. 06300',
    /** Link de Google Maps para el botón "Cómo llegar". */
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n+Los+%C3%81ngeles+Lerdo+206+Guerrero+CDMX',
    /** Iframe embebido del mapa. */
    mapsEmbedUrl:
      'https://www.google.com/maps?q=Sal%C3%B3n%20Los%20%C3%81ngeles%2C%20Lerdo%20206%2C%20Guerrero%2C%20CDMX&output=embed',
    /** Frase histórica del salón; se usa como epígrafe. */
    epigrafe: 'Quien no conoce Los Ángeles, no conoce México.',
  },

  /** Bloques cortos que aparecen en la sección "La boda". */
  detalles: [
    {
      titulo: 'Ceremonia civil',
      texto: 'La ceremonia se celebra en el mismo salón al comenzar la noche. No hay que trasladarse a ningún otro lugar.',
    },
    {
      titulo: 'La cena',
      texto: 'Canapés mexicanos en la recepción, tacos de guisado para la cena, mesa de dulces, y tacos de canasta en la tornaboda.',
    },
    {
      titulo: 'La música',
      texto: 'Mariachi, banda de cumbia, DJ y una banda de amigos con instrumentos. Vengan preparados para bailar hasta las dos.',
    },
  ],

  dressCode: {
    titulo: 'Etiqueta rigurosa',
    subtitulo: 'Goth black tie',
    intro:
      'Es una boda de etiqueta rigurosa y queremos que la noche se vea como el moodboard. Vengan de largo, de negro, y sin miedo al drama.',
    nota:
      'Sí, es 31 de octubre. No, no es una fiesta de disfraces. Piensen en una casa noble en luto, no en una tienda de disfraces.',
  },

  regalos: {
    intro:
      'Su presencia es el regalo. Si además quieren consentirnos, la forma más útil para nosotros es una transferencia.',
    nota: 'Los datos aparecen aquí una vez que entraron con la contraseña.',
  },

  comoLlegar: {
    intro:
      'El salón está en la Colonia Guerrero, a unas cuadras del Monumento a la Revolución. Es una zona de calles angostas y estacionamiento complicado: vale la pena planear la llegada y sobre todo la salida.',
    bloques: [
      {
        titulo: 'Estacionamiento',
        texto: PENDIENTE(
          'Habrá valet en la entrada del salón. También hay estacionamientos públicos sobre Insurgentes Norte y sobre Ricardo Flores Magón a unas cuadras.'
        ),
      },
      {
        titulo: 'Uber, Didi y taxi',
        texto:
          'Es la opción que recomendamos. La fiesta termina a las 2:00 am y va a haber barra abierta buena parte de la noche. Pidan su viaje desde la puerta del salón, no caminando por la colonia.',
      },
      {
        titulo: 'Metro y Metrobús',
        texto: PENDIENTE(
          'Las estaciones más cercanas son Guerrero (Líneas 3 y B) y Revolución (Línea 2). Sirven para llegar, pero a las 2:00 am ya están cerradas.'
        ),
      },
      {
        titulo: 'Al salir',
        texto:
          'Habrá seguridad en la puerta hasta el final del evento. Salgan acompañados y esperen su coche dentro del salón, no en la banqueta.',
      },
    ],
  },

  faq: [
    {
      pregunta: '¿A qué hora llego?',
      respuesta:
        'La recepción abre a las 5:00 pm y la ceremonia civil empieza poco después. Lleguen a tiempo: es la parte que no se repite.',
    },
    {
      pregunta: '¿Puedo llevar niños?',
      respuesta: PENDIENTE(
        'Es una celebración para adultos. Preferimos que esa noche los niños se queden en casa.'
      ),
    },
    {
      pregunta: '¿Qué tan estricto es el dress code?',
      respuesta:
        'Bastante. Etiqueta rigurosa, paleta negra. Si tienen duda sobre una prenda, revisen el moodboard o pregúntennos.',
    },
    {
      pregunta: '¿Es una fiesta de disfraces?',
      respuesta:
        'No. Cae en Halloween y la estética es gótica, pero es una boda de etiqueta. Nada de disfraces.',
    },
    {
      pregunta: '¿Hay barra libre?',
      respuesta: PENDIENTE('Sí, habrá barra durante toda la noche, además de cocteles y aguas frescas.'),
    },
    {
      pregunta: '¿Hasta cuándo puedo confirmar?',
      respuesta:
        'Necesitamos su respuesta antes del 30 de septiembre de 2026 para cerrar el número con el salón.',
    },
    {
      pregunta: '¿Puedo llevar un acompañante extra?',
      respuesta:
        'Escríbanlo en el formulario y nosotros les confirmamos. El salón tiene un cupo definido y lo vamos ajustando conforme confirman.',
    },
    {
      pregunta: '¿Hasta qué hora es?',
      respuesta:
        'La tornaboda con tacos de canasta va hasta las 2:00 am. Duerman la siesta.',
    },
  ],

  api: {
    /**
     * URL del Web App de Google Apps Script.
     * Se llena después de desplegar apps-script/Codigo.gs (ver README).
     * No es un secreto: el endpoint solo responde con la contraseña correcta.
     */
    endpoint:
      'https://script.google.com/macros/s/AKfycbxUa7YJyV63KQwpbPJSibjXcBKAB9Wy3LkBFbxljL-2ZXJOSJH8WS7m3pqA3MSr5Xv_/exec',
  },

  /** Tríptico de la portada. Van en public/fotos/. */
  portada: [
    { src: 'fotos/novios-1.jpg', alt: 'Leslie y Pablo de noche, bajo luz roja' },
    { src: 'fotos/novios-2.jpg', alt: 'Leslie y Pablo riéndose, de frente' },
    { src: 'fotos/novios-3.jpg', alt: 'Leslie y Pablo abrazados' },
  ],

  moodboard: {
    intro:
      'Terciopelo, encaje, latón viejo y corazones atravesados. Esto es lo que tenemos en la cabeza para la noche.',
    /**
     * 18 huecos del mosaico. Hoy son placeholders.
     *
     * Para poner una imagen: guardarla en `public/moodboard/` y llenar `src`
     * (ruta desde la raíz del sitio) y `alt`. El hueco se convierte solo en
     * imagen con lightbox. `ratio` define la altura dentro del mosaico y
     * `arco` recorta la imagen con la silueta de arco ojival.
     */
    items: [
      { ratio: '2 / 3', arco: true, src: '', alt: '' },
      { ratio: '1 / 1', arco: false, src: '', alt: '' },
      { ratio: '3 / 4', arco: false, src: '', alt: '' },
      { ratio: '4 / 3', arco: false, src: '', alt: '' },
      { ratio: '2 / 3', arco: false, src: '', alt: '' },
      { ratio: '1 / 1', arco: true, src: '', alt: '' },
      { ratio: '3 / 4', arco: false, src: '', alt: '' },
      { ratio: '3 / 2', arco: false, src: '', alt: '' },
      { ratio: '2 / 3', arco: false, src: '', alt: '' },
      { ratio: '4 / 5', arco: false, src: '', alt: '' },
      { ratio: '1 / 1', arco: false, src: '', alt: '' },
      { ratio: '2 / 3', arco: true, src: '', alt: '' },
      { ratio: '4 / 3', arco: false, src: '', alt: '' },
      { ratio: '3 / 4', arco: false, src: '', alt: '' },
      { ratio: '2 / 3', arco: false, src: '', alt: '' },
      { ratio: '1 / 1', arco: false, src: '', alt: '' },
      { ratio: '3 / 2', arco: false, src: '', alt: '' },
      { ratio: '3 / 4', arco: true, src: '', alt: '' },
    ],
  },

  /** Se usa en el gate y en el <title>. */
  meta: {
    titulo: 'Leslie & Pablo · 31.10.2026',
    descripcion: 'Sitio privado de la boda de Leslie Montero y Pablo Goldin.',
  },
} as const;

export type Boda = typeof boda;

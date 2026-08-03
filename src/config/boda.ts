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
    horaFin: '1:00 am',
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
  },

  dressCode: {
    titulo: 'Etiqueta rigurosa',
    subtitulo: 'Goth black tie',
    intro:
      'Es una boda de etiqueta rigurosa y queremos que la noche se vea como el moodboard. Vengan de largo y de colores obscuros.',
    nota: 'Cae el 31 de octubre, así que la idea va más por la elegancia oscura que por el disfraz.',
  },

  regalos: {
    intro:
      'Su presencia es el regalo. Si además quieren consentirnos, la forma más útil para nosotros es una transferencia.',
    nota: 'Los datos aparecen aquí una vez que entraron con la contraseña.',
  },

  comoLlegar: {
    intro:
      'El salón está en la Colonia Guerrero, a unas cuadras del Monumento a la Revolución.',
    bloques: [
      {
        titulo: 'Estacionamiento',
        texto: 'No hay valet. Hay estacionamientos públicos a unas cuadras del salón.',
      },
      {
        titulo: 'Uber, Didi y taxi',
        texto: 'Es la forma más cómoda de llegar y de irse.',
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
        'Etiqueta rigurosa y paleta negra. Si tienen duda sobre alguna prenda, revisen el moodboard o pregúntennos.',
    },
    {
      pregunta: '¿Es una fiesta de disfraces?',
      respuesta:
        'Es una boda de etiqueta con estética gótica. La idea va más por vestirse elegantísimo y oscuro que por disfrazarse.',
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
        'La tornaboda con tacos de canasta va hasta la 1:00 am. Duerman la siesta.',
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
      'Terciopelo, encaje, guantes largos y oro viejo. Esto es lo que tenemos en la cabeza para la noche.',
    /**
     * Las 12 referencias, optimizadas en `public/moodboard/`.
     *
     * Ninguna se recorta: cada una conserva su proporción real y el mosaico
     * se acomoda alrededor. `ratio` solo le da altura a un hueco cuando `src`
     * está vacío, así que para agregar una referencia nueva basta con dejar
     * `src` y `alt` llenos.
     *
     * El orden importa: el mosaico llena por columnas, así que están
     * intercaladas para que las piezas gráficas (tarjetas, carteles) no
     * queden todas juntas.
     */
    items: [
      {
        ratio: '3 / 4',
        src: 'moodboard/cortinas-fiesta.jpg',
        alt: 'Fiesta de noche entre cortinas de terciopelo rojo',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/devore-rosas.jpg',
        alt: 'Tres mujeres de vestido largo en terciopelo devoré negro, con rosas rojas',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/smokings.jpg',
        alt: 'Dos hombres de smoking, uno en marfil y otro en terciopelo negro',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/guantes-copa.jpg',
        alt: 'Manos con guantes blancos y negros sirviendo una copa entre perlas',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/slip-guantes.jpg',
        alt: 'Vestido slip negro con guantes largos de tul, en un pasillo de hotel',
      },
      {
        ratio: '3 / 5',
        src: 'moodboard/terciopelo-vino.jpg',
        alt: 'Smoking de terciopelo vino con corbata de moño negra, sirviendo champaña',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/mantillas.jpg',
        alt: 'Cuatro mujeres de encaje negro y mantilla, con bordados en oro viejo',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/sofa-rojo.jpg',
        alt: 'Mujer de negro recostada en un sofá capitoné rojo con una copa en la mano',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/smoking-cortinas.jpg',
        alt: 'Smoking negro cruzado ante un telón de terciopelo rojo y un candil',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/mesa-encaje.jpg',
        alt: 'Mesa puesta a la luz de las velas, mantel vino y encaje negro',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/velos-perlas.jpg',
        alt: 'Dos mujeres con velos sobre los ojos, perlas y labios oscuros',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/piel-verde.jpg',
        alt: 'Terciopelo negro y piel verde esmeralda sobre un tapete persa',
      },
    ],
  },

  /** Se usa en el gate y en el <title>. */
  meta: {
    titulo: 'Leslie & Pablo · 31.10.2026',
    descripcion: 'Sitio privado de la boda de Leslie Montero y Pablo Goldin.',
  },
} as const;

export type Boda = typeof boda;

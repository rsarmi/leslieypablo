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
      'Es una boda de etiqueta rigurosa y queremos que la noche se vea como el moodboard. Vengan de largo, de negro, y sin miedo al drama.',
    nota: 'Sí, es 31 de octubre. No, no es una fiesta de disfraces.',
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
      'Terciopelo, encaje, latón viejo y corazones atravesados. Esto es lo que tenemos en la cabeza para la noche.',
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
        ratio: '4 / 5',
        src: 'moodboard/lovers-enemies.jpg',
        alt: 'Tarjeta «Lovers to Enemies» sostenida por una mano con guante de encaje negro',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/puerta-roja.jpg',
        alt: 'Figura encapuchada recortada contra un portal de luz roja',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/nosferatu.jpg',
        alt: 'Cartel de Nosferatu: una mano pálida saliendo de un ataúd',
      },
      {
        ratio: '1 / 1',
        src: 'moodboard/murcielago.jpg',
        alt: 'Murciélago negro grabado sobre papel rojo',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/retrato-murcielago.jpg',
        alt: 'Retrato al óleo de una mujer de encaje blanco sosteniendo un murciélago',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/corazon-espadas.jpg',
        alt: 'Corazón rojo atravesado por tres espadas',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/circe.jpg',
        alt: 'Circe Invidiosa de Waterhouse, vertiendo una copa de líquido rojo',
      },
      {
        ratio: '1 / 1',
        src: 'moodboard/sobre-rojo.jpg',
        alt: 'Invitación en sobre de terciopelo rojo sobre una charola de plata',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/niebla-cuernos.jpg',
        alt: 'Silueta con cuernos entre niebla roja',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/catedral.jpg',
        alt: 'Figura encapuchada bajo el arco tallado de una catedral, teñida de rojo',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/fuego.jpg',
        alt: 'Mujer de vestido largo caminando hacia una pared de fuego',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/invitacion.jpg',
        alt: 'Invitación grabada en rojo y negro con un corazón atravesado por dagas',
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

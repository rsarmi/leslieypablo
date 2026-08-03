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
      'Su presencia es el regalo pero si además quieren consentirnos, la forma más útil para nosotros es una transferencia.',
    nota: 'Los datos aparecen aquí una vez que entraron con la contraseña.',
  },

  comoLlegar: {
    intro:
      'El salón está en la Colonia Guerrero, a unas cuadras del Monumento a la Revolución.',
    bloques: [
      {
        titulo: 'Estacionamiento',
        texto: 'No hay valet.',
      },
      {
        titulo: 'Uber, Didi y taxi',
        texto: 'Es la forma más fácil de llegar y de irse.',
      },
    ],
  },

  faq: [
    {
      pregunta: '¿A qué hora llego?',
      respuesta:
        'La recepción abre a las 5:00 pm y la ceremonia civil empieza poco después. Lleguen a tiempo.',
    },
    {
      pregunta: '¿Puedo llevar niños?',
      respuesta: 
        'No está permitida la entrada de niños al salón.'  
    },
    {
      pregunta: '¿Qué tan estricto es el dress code?',
      respuesta:
        'Etiqueta rigurosa y paleta negra. Si tienen duda sobre alguna prenda, revisen el moodboard.',
    },
    {
      pregunta: '¿Es una fiesta de disfraces?',
      respuesta:
        'Es una boda de etiqueta con estética gótica. La idea va más por vestirse elegantísimo y oscuro que por disfrazarse.',
    },
    {
      pregunta: '¿Hasta cuándo puedo confirmar?',
      respuesta:
        'Necesitamos su respuesta antes del 30 de septiembre de 2026 para cerrar el número con el salón.',
    },
    {
      pregunta: '¿Puedo llevar un acompañante extra?',
      respuesta:
        'No, sólo consultando con los novios.',
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
    /**
     * Las 34 referencias, optimizadas en `public/moodboard/`.
     *
     * Ninguna se recorta: cada una conserva su proporción real y el mosaico
     * se acomoda alrededor. `ratio` solo le da altura a un hueco cuando `src`
     * está vacío, así que para agregar una referencia nueva basta con dejar
     * `src` y `alt` llenos.
     *
     * El orden importa: el mosaico llena por columnas, así que las pinturas,
     * los Dráculas y los retratos de hombre van repartidos para que no se
     * amontonen en la misma columna.
     */
    items: [
      {
        ratio: '3 / 4',
        src: 'moodboard/cortinas-fiesta.jpg',
        alt: 'Fiesta de noche entre cortinas de terciopelo rojo',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/morticia.jpg',
        alt: 'Vestido negro sirena con mangas de encaje deshilachado',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/smokings.jpg',
        alt: 'Dos hombres de smoking, uno en marfil y otro en terciopelo negro',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/velo-esmeraldas.jpg',
        alt: 'Velo de encaje negro sobre los ojos, con aretes de cruz y esmeraldas',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/terciopelo-rosas.jpg',
        alt: 'Mujer de terciopelo negro sobre un mar de telas rojas y rosas',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/martinis.jpg',
        alt: 'Martinis y encaje negro con un listón rojo en la copa',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/cortejo-velos.jpg',
        alt: 'Pintura de un cortejo de mujeres de luto con velos y flores rojas',
      },
      {
        ratio: '3 / 5',
        src: 'moodboard/terciopelo-vino.jpg',
        alt: 'Smoking de terciopelo vino con corbata de moño negra, sirviendo champaña',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/devore-rosas.jpg',
        alt: 'Tres mujeres de vestido largo en terciopelo devoré negro, con rosas rojas',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/lugosi-retrato.jpg',
        alt: 'Bela Lugosi como Drácula, de capa y camisa de chorreras',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/luto-salon.jpg',
        alt: 'Pintura de un salón lleno de mujeres de luto, con velos y terciopelo negro',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/slip-guantes.jpg',
        alt: 'Vestido slip negro con guantes largos de tul, en un pasillo de hotel',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/cena-luto.jpg',
        alt: 'Pintura de una cena de luto a la luz de las velas',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/retrato-gargantilla.jpg',
        alt: 'Retrato en terciopelo negro con gargantilla de perla y guantes largos',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/beso-dracula.jpg',
        alt: 'Beso a la luz de las velas, vestido rojo y levita bordada',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/antifaces.jpg',
        alt: 'Antifaces de encaje negro en un baile de máscaras',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/mesa-luto.jpg',
        alt: 'Mesa puesta a la luz de las velas, mantel vino y encaje negro',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/smoking-cortinas.jpg',
        alt: 'Smoking negro cruzado ante un telón de terciopelo rojo y un candil',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/mano-sombra.jpg',
        alt: 'Mano de uñas largas y su sombra sobre una cortina de terciopelo rojo',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/palermo.jpg',
        alt: 'Saco de piel dorada a la luz de un candelabro, en una cena de noche',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/piel-crema.jpg',
        alt: 'Abrigo de piel color crema con medias negras y tacones de charol vino',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/mantillas.jpg',
        alt: 'Cuatro mujeres de encaje negro y mantilla, con bordados en oro viejo',
      },
      {
        ratio: '16 / 9',
        src: 'moodboard/espejo-dracula.jpg',
        alt: 'Vestido rojo reflejado en un espejo dorado',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/pintura-roja.jpg',
        alt: 'Pintura de una mujer de rojo rodeada de figuras en penumbra',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/cutout-guantes.jpg',
        alt: 'Vestido negro de satén con cut-out y guantes largos de piel',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/lugosi-pintura.jpg',
        alt: 'Retrato al óleo de Drácula de capa negra sobre un muro rojo',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/sofa-rojo.jpg',
        alt: 'Mujer de negro recostada en un sofá capitoné rojo con una copa en la mano',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/bar-lentejuelas.jpg',
        alt: 'Dos mujeres en la barra, lentejuelas vino y plumas negras',
      },
      {
        ratio: '3 / 4',
        src: 'moodboard/plumas-marco.jpg',
        alt: 'Vestido negro con mangas de plumas junto a un marco dorado',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/lucy-cementerio.jpg',
        alt: 'Capa de gasa naranja al vuelo entre lápidas',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/velos-perlas.jpg',
        alt: 'Dos mujeres con velos sobre los ojos, perlas y labios oscuros',
      },
      {
        ratio: '2 / 3',
        src: 'moodboard/mantilla-cruz.jpg',
        alt: 'Mantilla de encaje negro bajo una cruz de luz roja',
      },
      {
        ratio: '4 / 5',
        src: 'moodboard/guantes-copa.jpg',
        alt: 'Manos con guantes blancos y negros sirviendo una copa entre perlas',
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

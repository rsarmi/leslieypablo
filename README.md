# Boda Leslie & Pablo — 31.10.2026

Sitio de la boda de Leslie Montero y Pablo Goldin. Astro estático en GitHub Pages,
con RSVP y datos bancarios servidos por un Web App de Google Apps Script sobre la
Google Sheet de la boda.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/ como en producción
```

---

## Editar el contenido

Casi todo vive en **`src/config/boda.ts`**: nombres, fecha, venue, dress code,
FAQ, transporte, textos. No hace falta tocar los componentes para cambiar una
hora o una frase.

Lo que falta por definir está marcado con `PENDIENTE(...)`:

```bash
grep -rn "PENDIENTE" src/config/boda.ts
```

**Los datos bancarios no están aquí a propósito.** El repo de GitHub Pages es
público, así que viven en la pestaña `Config` de la Google Sheet.

---

## Sistema de diseño

Sacado del save-the-date en video, no inventado:

| Rol | Valor |
| --- | --- |
| Fondo | `#2A0907` sangre cálida, con un degradado fijo de **ojo de gato** (`.ojo` en `global.css`) que ilumina el centro y hunde las esquinas |
| Acento | **Verde ácido `#CDFC59`**, muestreado del `31·10·26` del video. Se dosifica: fecha, eyebrows, rombos, foco. Si se usa de más, deja de funcionar |
| Títulos | `Bodoni Moda` en versalitas con tracking abierto — la voz de las referencias «LOVERS to ENEMIES» y «YOU'RE INVITED» |
| Marca de la fecha | `Pirata One` (blackletter) en verde ácido, replicando el lockup del video |
| Cuerpo | `Cormorant Garamond` |
| Etiquetas y botones | `Courier Prime` en versalitas |

Las secciones tienen fondo **semitransparente** a propósito: si se vuelven
opacas tapan el degradado de ojo de gato y el sitio se aplana.

Las fotos de la portada (`public/fotos/`) no llevan filtro: ya vienen en la
paleta. Los originales están en `fotos/`, fuera del repo.

---

## Moodboard

18 huecos en `src/config/boda.ts` → `moodboard.items`. Hoy son placeholders.

Para poner una imagen:

1. Guardarla en `public/moodboard/` (p. ej. `public/moodboard/encaje.jpg`).
2. Llenar `src` y `alt` de ese hueco:

```ts
{ ratio: '2 / 3', arco: true, src: 'moodboard/encaje.jpg', alt: 'Encaje negro sobre terciopelo' },
```

El hueco se convierte solo en imagen con lightbox. `ratio` controla la altura
dentro del mosaico y `arco: true` la recorta con la silueta de arco ojival.

Conviene comprimir antes de subirlas (las de WhatsApp pesan ~200 KB cada una;
para web, 1600 px de ancho y calidad 80 es más que suficiente).

> Ojo con los derechos: varias referencias del moodboard original (el cartel de
> *Nosferatu*, la pintura de Waterhouse) son de terceros. Para un sitio publicado
> conviene usar imágenes propias o de licencia libre.

---

## Backend: Google Apps Script

El código está en **`apps-script/Codigo.gs`**.

### Instalación (ya hecha)

1. Google Sheet de la boda → **Extensiones → Apps Script**.
2. Pegar `apps-script/Codigo.gs` completo.
3. Ejecutar la función `instalar()` una vez. Crea las pestañas `Config` y
   `Respuestas` y pide los permisos. Es idempotente.
4. Llenar la pestaña `Config`.
5. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Pegar la URL `/exec` en `src/config/boda.ts` → `api.endpoint`.

### Al cambiar `Codigo.gs`

Hay que crear una **versión nueva** de la implementación
(*Implementar → Administrar implementaciones → editar (lápiz) → Versión: Nueva*).
Si no, la URL sigue sirviendo el código viejo. Es el error más común.

### Pestañas

| Pestaña      | Para qué                                                                     |
| ------------ | ---------------------------------------------------------------------------- |
| `Invitados`  | La lista. El sitio la **lee** para el buscador y escribe **solo** en las tres columnas que agrega al final. |
| `Config`     | `password` y datos bancarios. Cambiarlos aquí surte efecto al instante.       |
| `Respuestas` | Una fila por cada envío del formulario abierto (el plan B): `Timestamp`, `Nombre completo`, `¿Asiste?`, `Mail`, `Telefono`. |

---

## Confirmación: el buscador de invitados

El invitado escribe su nombre y da **Buscarme**; el sitio lo busca en la columna
`Nombre` de `Invitados` y le muestra los candidatos parecidos. Elige el suyo,
dice si viene y deja correo y teléfono. **Una confirmación por lugar**: cada
persona se busca a sí misma.

La búsqueda sale solo al apretar el botón, no mientras escriben: cada consulta
es un viaje de un par de segundos a Apps Script.

**Los resultados no dicen quién ya confirmó.** El servidor ni siquiera manda ese
dato, porque cualquiera con la contraseña puede buscar cualquier nombre.

### Las tres columnas que escribe el sitio

Se crean solas la primera vez, al final de `Invitados`, después de todo lo que
ya haya:

| Columna              | Qué guarda                                     |
| -------------------- | ---------------------------------------------- |
| `Confirmó web`       | `Sí` o `No`                                    |
| `Fecha confirmación` | Cuándo respondió                               |
| `Mail`               | El correo. Se pide obligatorio                 |
| `Telefono`           | El teléfono, guardado como texto para no perder el `+` ni los ceros |

**La columna `Confirmado` no se toca nunca.** Es la de trabajo de ustedes y el
sitio no la lee ni la escribe, así que lo que marquen a mano ahí no se pierde
ni lo pisa nadie. Comparar las dos columnas dice quién se confirmó solo y a
quién marcaron ustedes.

Las columnas se buscan **por nombre de encabezado**, no por posición: pueden
insertar, mover o reordenar columnas en `Invitados` sin romper nada. Lo único
que no hay que hacer es renombrar esos tres encabezados.

### Tolerancia a errores

El emparejado corre en el servidor —la lista completa nunca llega al
navegador— y compara en dos capas: distancia de edición sobre el nombre sin
acentos, y una clave fonética para español. En pruebas contra la lista real,
el nombre correcto aparece entre los candidatos en el **100 %** de los casos
con una letra de más, una de menos, dos intercambiadas, sin acentos o sin
mayúsculas, y en el primer lugar el 98 % de las veces.

Encuentra cosas como:

| Escriben              | Encuentran           |
| --------------------- | -------------------- |
| `elvira miller`       | Elvira Müller        |
| `Gutierres`           | Rodrigo Gutiérrez    |
| `pedro senal`         | Pedro Ceñal          |
| `kristina makgregor`  | Cristina MacGregor   |
| `juanarreola`         | Juan Arreola         |

Para calibrarlo sin desplegar el sitio, corran `probarBuscador()` desde el
editor de Apps Script: escribe en el log qué encuentra para una batería de
consultas típicas. El umbral está en la constante `UMBRAL` de `Codigo.gs`.

### Quien no se encuentra

Hoy hay filas de la lista con solo un nombre de pila, y esas no son
distinguibles entre sí. Por eso la pantalla tiene abajo un enlace de
**«No me encuentro en la lista»** que abre un formulario que pide lo mismo que
la confirmación normal —nombre, si viene, correo y teléfono— y cae en
`Respuestas` para reconciliarlo a mano. Tampoco acepta grupos: una respuesta
por persona, igual que la lista.

Las columnas de `Respuestas` también se localizan por encabezado, así que las
que quedaron de la versión anterior del formulario (`Contacto`, `Acompañantes`,
`Canción`, `Mensaje`…) se pueden borrar a mano cuando quieran.

Cambiar la contraseña en `Config` **no requiere redesplegar el sitio**. Los
invitados que ya habían entrado tendrán que escribirla de nuevo.

### Probar el endpoint

```bash
./scripts/probar-endpoint.sh unlock 'la-contraseña'
./scripts/probar-endpoint.sh rsvp   'la-contraseña'   # escribe una fila de prueba, borrarla después
```

`curl -L` a secas **no** funciona contra Apps Script: al seguir el 302 hacia
`script.googleusercontent.com`, curl conserva el header `Content-Type` y Google
devuelve 404. Los navegadores sí eliminan ese header al convertir el POST en
GET, por eso el sitio funciona. El script sigue el redirect en dos pasos.

---

## Seguridad: qué protege y qué no

La contraseña es una **puerta de cortesía, no seguridad real**. El HTML con la
fecha, el venue y el dress code se descarga al navegador y alguien técnico puede
leerlo sin escribirla. Para una boda es suficiente.

Lo que sí queda protegido de verdad:

- **Los datos bancarios.** No están en el repo ni en el bundle. Solo llegan al
  navegador en la respuesta del `unlock`, que Apps Script contesta únicamente
  con la contraseña correcta.
- La validación de la contraseña ocurre en el servidor, no comparando un hash
  en el cliente.
- `noindex, nofollow` + `robots.txt` mantienen el sitio fuera de buscadores.

> **La Google Sheet tiene que estar restringida.** Si está compartida como
> «Cualquier persona con el enlace», entonces la contraseña, los datos bancarios
> y la lista completa de invitados son públicos para quien tenga el link de la
> hoja, y todo lo anterior deja de servir.
>
> Compartir → **Restringido**. El Apps Script sigue funcionando porque se
> ejecuta como el dueño de la hoja («Ejecutar como: Yo»), no como el visitante.

---

## Despliegue

**En vivo: https://rsarmi.github.io/leslieypablo/**

Cada push a `main` construye y publica. Pages ya está habilitado en modo
`workflow`; se activó con la API porque el `GITHUB_TOKEN` del propio workflow
no tiene permiso para crear el sitio:

```bash
gh api -X POST repos/rsarmi/leslieypablo/pages -f build_type=workflow
```

Equivale a *Settings → Pages → Source: **GitHub Actions***. Solo hace falta una
vez; si alguna vez el deploy vuelve a fallar con `Get Pages site failed`, es
que esa configuración se perdió.

### Dominio propio

`astro.config.mjs` decide el `base` según exista o no `public/CNAME`, así que
no hay que acordarse de cambiarlo a mano:

| Situación          | URL                              | `base`          |
| ------------------ | -------------------------------- | --------------- |
| Sin `public/CNAME` | `rsarmi.github.io/leslieypablo`  | `/leslieypablo` |
| Con `public/CNAME` | el dominio propio                | `/`             |

**El orden importa: primero el DNS, después el `CNAME`.** Si se despliega el
archivo antes de que el dominio resuelva, GitHub lo marca como no verificado
y hay que rehacerlo.

1. **DNS del registrador.** Para el dominio pelón (`ejemplo.com`), cuatro
   registros `A`:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   Para un subdominio (`www.ejemplo.com`), en cambio, un solo `CNAME` que
   apunte a `rsarmi.github.io`.

2. Esperar a que propague: `dig +short ejemplo.com` debe devolver esas IPs.

3. **En el repo**: crear `public/CNAME` con una sola línea —el dominio, sin
   `https://` ni diagonal— y actualizar `site` en `astro.config.mjs`. Push.

   El archivo tiene que vivir en `public/` y no solo en la configuración de
   GitHub: con el modo `workflow`, cada deploy reemplaza el sitio con lo que
   traiga `dist/`, así que un CNAME puesto solo desde la interfaz se perdería.

4. **En GitHub**: `gh api -X PUT repos/rsarmi/leslieypablo/pages -f cname=ejemplo.com`
   (o Settings → Pages → Custom domain).

5. Cuando GitHub termine de emitir el certificado —puede tardar hasta una
   hora— activar **Enforce HTTPS**.

---

## Estructura

```
apps-script/Codigo.gs      backend (copiar/pegar en Apps Script)
scripts/probar-endpoint.sh prueba del endpoint desde la terminal
src/config/boda.ts         TODO el contenido editable
src/lib/api.ts             cliente del Apps Script
src/lib/rutas.ts           une rutas de public/ con el base del sitio
src/styles/global.css      paleta, tipografías y componentes base
src/layouts/Base.astro     head, noindex, grano, revelado al scroll
src/components/            una sección por archivo
src/pages/index.astro      ensambla las secciones
```

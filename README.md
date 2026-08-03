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

| Pestaña      | Para qué                                                              |
| ------------ | --------------------------------------------------------------------- |
| `Invitados`  | La lista de trabajo de ustedes. **El sitio no la lee ni la escribe.**  |
| `Config`     | `password` y datos bancarios. Cambiarlos aquí surte efecto al instante. |
| `Respuestas` | Una fila por cada RSVP enviado.                                        |

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

Cada push a `main` construye y publica. Configuración única en GitHub:

**Settings → Pages → Source: GitHub Actions.**

### Dominio

`astro.config.mjs` decide el `base` según exista o no `public/CNAME`:

| Situación               | URL                                    | `base`           |
| ----------------------- | -------------------------------------- | ---------------- |
| Sin `public/CNAME`      | `rsarmi.github.io/leslieypablo`        | `/leslieypablo`  |
| Con `public/CNAME`      | el dominio propio                      | `/`              |

Para activar el dominio propio:

1. Crear `public/CNAME` con una sola línea: el dominio, sin `https://`.
2. Actualizar `site` en `astro.config.mjs` con ese mismo dominio.
3. En el DNS del dominio:
   - Apex (`ejemplo.com`) → cuatro registros `A` a `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Subdominio (`www.ejemplo.com`) → un `CNAME` a `rsarmi.github.io`.
4. Settings → Pages → Custom domain → escribir el dominio y activar
   **Enforce HTTPS** cuando GitHub termine de emitir el certificado.

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

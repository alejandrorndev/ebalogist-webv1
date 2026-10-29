# E-Balogist Carpintería — Sitio web

Sitio web de **E-Balogist Carpintería**, taller de carpintería a medida en Medellín (Calle 52A # 18-58) que fabrica e instala cocinas integrales, closets y muebles en toda Colombia.

Hecho con **HTML5, CSS y JavaScript puro**: sin frameworks, sin dependencias y sin paso de compilación.

## Secciones

- **Inicio**: portada con llamado a cotizar.
- **Sobre nosotros**: historia y compromisos del taller.
- **Servicios**: cocinas integrales, closets y empotrados, puertas y acabados, remodelaciones, decks y pérgolas, restauración.
- **Nuestro trabajo**: galería con filtros por categoría y visor de imágenes ampliadas.
- **Proceso**: los cuatro pasos, de la consulta a la entrega.
- **Reseñas**: carrusel de testimonios (automático, con flechas, puntos y deslizamiento táctil).
- **Preguntas frecuentes**: acordeón desplegable.
- **Cotización**: formulario con validación de campos.

## Estructura

```
├── index.html          # Contenido y estructura de la página
├── assets/
│   └── favicon.svg
├── css/
│   ├── variables.css   # Colores, fuentes y medidas (design tokens)
│   ├── base.css        # Estilos base, tipografía, botones, utilidades
│   ├── layout.css      # Barra superior, cabecera, menú y pie de página
│   └── sections.css    # Estilos de cada sección
└── js/
    ├── main.js         # Punto de entrada: inicializa los módulos
    ├── nav.js          # Menú móvil, cabecera fija, sección activa, volver arriba
    ├── gallery.js      # Filtros de la galería y visor de imágenes
    ├── faq.js          # Acordeón de preguntas frecuentes
    ├── reviews.js      # Carrusel de reseñas
    ├── form.js         # Validación del formulario de cotización
    └── reveal.js       # Animaciones al hacer scroll
```

## Ejecutar en local

Los archivos JS son módulos ES, así que el navegador no los carga si se abre `index.html` con doble clic (`file://`). Sírvelo con cualquier servidor estático:

```bash
# Con Python
python -m http.server 8080

# o con Node
npx serve .
```

Luego abre <http://localhost:8080>.

## Personalizar

- **Colores y fuentes**: `css/variables.css`.
- **Textos, servicios, reseñas y preguntas**: `index.html`.
- **Mensajes de error del formulario**: `js/form.js`.

## Pendientes antes de publicar

- [x] Número de WhatsApp real (`+57 312 637 8236`).
- [ ] Confirmar el correo de contacto (`hola@ebalogistcarpinteria.com`).
- [x] Usar fotos de proyectos propios en la galería y en "Sobre nosotros".
- [ ] Cambiar la foto de portada (Unsplash) por una propia.
- [ ] Reemplazar las reseñas de ejemplo por testimonios reales.
- [x] Formulario conectado a Web3Forms: las solicitudes llegan al correo registrado en web3forms.com.

## Despliegue

Al ser un sitio estático, se puede publicar gratis en **GitHub Pages**, **Netlify**, **Vercel** o **Cloudflare Pages** apuntando a la raíz del repositorio.

## Créditos

- Diseño inspirado en la plantilla *Carpenter Classic* de Zarla.
- Fotografías: [Unsplash](https://unsplash.com).
- Fuentes: Playfair Display y Source Sans 3 (Google Fonts).

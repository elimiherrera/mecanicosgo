# MecánicosGo 🔧

Plataforma web para encontrar talleres mecánicos verificados en **Izalco, Sonsonate, El Salvador**. Conecta conductores con talleres de confianza para servicios, emergencias y mantenimiento vehicular.

---

## Demo — Flujo completo

### Como Mecánico
1. Ve a `/registro` → pestaña **"Soy Mecánico"**
2. **Paso 1** — datos personales: nombre, teléfono, correo, contraseña, años de experiencia
3. **Paso 2** — datos del taller: nombre, dirección, especialidades, coordenadas GPS
4. Al registrar ingresa directo al **Panel del Mecánico**
5. Desde `/panel/taller` puedes agregar servicios, editar horarios y alternar disponibilidad

### Como Usuario
1. Ve a `/login` → selecciona **"Soy Usuario"**
2. Inicia sesión con `maria@gmail.com / 123456` o regístrate nuevo
3. Explora todos los talleres en `/talleres`, incluyendo el que acabas de registrar como mecánico
4. Entra al detalle de cualquier taller → ve servicios, agenda una cita, lee reseñas, mapa

---

## Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Mecánico | `carlos@talleres.sv` | `123456` |
| Mecánico | `roberto@mecanico.sv` | `123456` |
| Mecánico | `ana@taller.sv` | `123456` |
| Usuario | `maria@gmail.com` | `123456` |
| Usuario | `jose@gmail.com` | `123456` |

> Las cuentas demo también aparecen listadas en la pantalla de login para facilitar la prueba.

---

## Características

| Módulo | Descripción |
|--------|-------------|
| **Login con selector de rol** | El usuario elige si entra como cliente o mecánico antes de autenticar |
| **Registro en pasos** | El mecánico registra su cuenta y taller al mismo tiempo en un formulario de 2 pasos |
| **Base de datos fake** | 3 talleres pre-cargados con servicios, reseñas y citas de ejemplo |
| **Búsqueda y filtros** | Por nombre, especialidad, disponibilidad, verificación y ordenamiento |
| **Sistema de citas** | Agendar, confirmar, completar y cancelar; con notificaciones al mecánico |
| **Reseñas y calificaciones** | Histograma de estrellas, calificación promedio, protección contra doble reseña |
| **Horarios de atención** | Editables por día con toggle de abierto/cerrado y franjas horarias |
| **Mapa OpenStreetMap** | Vista de ubicación de cada taller sin necesidad de API key |
| **Panel del mecánico** | Dashboard con stats, ingresos estimados, gestión de servicios y citas |
| **Estado global persistente** | Context + useReducer + localStorage — el estado no se pierde al recargar |
| **Notificaciones** | Bell icon con contador; se genera una notificación al mecánico por cada cita nueva |

---

## Stack técnico

- **React 18** — sin TypeScript
- **React Router v6** — rutas protegidas por rol
- **Context API + useReducer** — estado global
- **localStorage** — persistencia de datos (clave: `mecanicosgo_v1`)
- **CSS puro** con variables CSS — sin Tailwind ni librerías de UI
- **OpenStreetMap iframe** — mapas sin API key

---

## Estructura del proyecto

```
src/
├── context/
│   └── AppContext.js        # Estado global + todas las acciones
├── data/
│   └── mockData.js          # Base de datos fake (usuarios, talleres, citas, reseñas)
├── styles/
│   └── index.css            # Estilos globales con variables CSS
├── components/
│   ├── Navbar.js            # Barra de navegación con notificaciones
│   ├── WorkshopCard.js      # Tarjeta de taller para el listado
│   ├── StarRating.js        # Componente de estrellas (interactivo y de solo lectura)
│   ├── Modal.js             # Modal reutilizable
│   └── ProtectedRoute.js    # Guard de rutas por rol
├── pages/
│   ├── Landing.js           # Página de inicio pública
│   ├── Login.js             # Login con selector de rol y cuentas demo
│   ├── Register.js          # Registro usuario / mecánico+taller
│   ├── user/
│   │   ├── UserDashboard.js     # Inicio del usuario: stats, próximas citas, top talleres
│   │   ├── BrowseWorkshops.js   # Listado con búsqueda y filtros
│   │   ├── WorkshopDetail.js    # Detalle: servicios, reseñas, horarios, mapa, agendar
│   │   └── MyAppointments.js    # Historial de citas del usuario
│   └── mechanic/
│       ├── MechanicDashboard.js   # Panel principal: stats, ingresos, citas recientes
│       ├── ManageWorkshop.js      # Editar taller, servicios y horarios
│       └── ManageAppointments.js  # Gestionar todas las citas (confirmar/completar/cancelar)
└── App.js                   # Rutas y providers
```

---

## Instalación y uso local

```bash
# Clonar o descargar el proyecto
cd mecanicosgo

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar en desarrollo
npm start
# → http://localhost:3000
```

---

## Despliegue a producción

El build de producción pasa sin errores. Puedes desplegar en:

### Vercel (recomendado — más fácil)
```bash
npm install -g vercel
vercel
# Sigue las instrucciones; detecta CRA automáticamente
```

### Netlify
```bash
npm run build
# Sube la carpeta /build al dashboard de Netlify
# O conecta el repositorio en app.netlify.com → Build command: npm run build · Publish dir: build
```

### GitHub Pages
```bash
# 1. Agrega en package.json:
#    "homepage": "https://<usuario>.github.io/<repo>"

# 2. Instala gh-pages
npm install gh-pages --save-dev

# 3. Agrega en package.json scripts:
#    "predeploy": "npm run build",
#    "deploy": "gh-pages -d build"

# 4. Despliega
npm run deploy
```

> **Nota importante para Netlify y GitHub Pages:** Esta app usa React Router con rutas del lado del cliente. Debes configurar el redirect de `/*` a `/index.html` para que las rutas funcionen al recargar la página.
>
> - **Netlify:** crea `public/_redirects` con el contenido: `/* /index.html 200`
> - **GitHub Pages:** esta configuración es más compleja; se recomienda Vercel o Netlify

---

## Consideraciones para producción real

Si quisieras llevar este proyecto a producción real, los siguientes puntos serían el siguiente paso:

- **Backend/API** — Reemplazar el estado en localStorage con una API REST o GraphQL (Node.js + Express + PostgreSQL, o Firebase)
- **Autenticación real** — JWT, OAuth o Firebase Auth
- **Imágenes** — Subida de fotos del taller con Cloudinary o S3
- **Pagos** — Integración con pasarela de pagos para cobro de citas
- **SMS/Email** — Notificaciones reales con Twilio o SendGrid
- **Geolocalización real** — API de geolocalización del navegador para ordenar talleres por distancia exacta
- **Panel administrativo** — Módulo para verificar talleres y moderar reseñas

---

*Desarrollado para Izalco, Sonsonate, El Salvador · 2026*

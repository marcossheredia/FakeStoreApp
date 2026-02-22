# FakeStoreApp

Aplicación Angular 21 que consume la API pública de Platzi Fake Store (Escuelajs) para autenticación con JWT y gestión de productos (listar, ver detalle, crear, editar y eliminar). Está pensada para una defensa docente: código claro, flujos controlados y protección por roles.

## Resumen técnico
- Framework: Angular 21 con Standalone Components y Reactive Forms.
- Estado: señales simples en AuthService para sesión; servicios HTTP para datos.
- API: https://api.escuelajs.co/api/v1
  - Login: POST /auth/login → access_token.
  - Users: POST /users → registro.
  - Products: /products con CRUD completo protegido por Bearer.
- Autorización:
  - AuthGuard exige sesión.
  - adminGuard exige rol admin (atajo local admin@admin.com / 123456).
  - Interceptor añade Authorization: Bearer.

## Requisitos previos
- Node 18+ y npm.
- Angular CLI 17+ (el repo ya incluye scripts).

## Instalación y ejecución
- Instalar dependencias:
  - npm i
- Variables de entorno:
  - src/environments/environment.ts
    - apiBase: base de la API (por defecto https://api.escuelajs.co/api/v1).
- Ejecutar en local:
  - npm start
  - Navega a http://localhost:4200
- Compilar producción:
  - npm run build

## Cuentas de prueba
- Admin local (atajo educativo):
  - email: admin@admin.com
  - password: 123456
  - Acceso a /dashboard y botones Editar/Eliminar.
- Usuario normal (API Platzi):
  - Regístrate en /auth/register; el sistema crea el usuario y hace login para obtener JWT.

## Arquitectura de carpetas (src/app)
- core
  - services/auth.ts: login, registro, persistencia de token y estado.
  - interceptors/auth-interceptor.ts: inyecta Authorization: Bearer.
  - guards/auth-guard.ts y core/guards/admin.guard.ts: protección de rutas.
- features
  - auth: login y registro.
  - products: list, detail, create, edit y servicio products.ts.
  - dashboard: panel protegido para admin con métricas.
  - home: landing pública.
- shared
  - navbar, not-found, forbidden, loader.

## Flujo de autenticación
- Registro:
  - POST /users con name, email, password, avatar.
  - A continuación, POST /auth/login → access_token.
  - El token se guarda en localStorage y se actualiza el estado de sesión.
- Login:
  - POST /auth/login con email y password → access_token.
  - Opción “admin local” para defensa rápida: admin@admin.com / 123456.
- Logout:
  - Limpia token y datos de usuario, redirige a /auth/login.

## Guards y rutas
- /products: protegido con AuthGuard (requiere sesión).
- /products/create y /products/edit/:id: requieren sesión; las acciones admin (editar/eliminar) se muestran solo si user.role === 'admin'.
- /dashboard: AuthGuard + adminGuard; sin sesión redirige a /auth/login, con sesión sin rol admin → /forbidden.
- NotFound: ruta comodín a componente 404.

## Servicio de productos (mapping)
- Base URL: ${environment.apiBase}/products.
- La API devuelve:
  - category: objeto { id, name, ... }.
  - images: string[].
- El servicio mapea al modelo local Product:
  - category → category.name
  - image → images[0]
- Create/Update: envía { title, price, description, categoryId, images[] }.
  - Por simplicidad categoryId usa un valor por defecto (1). Se puede mejorar cargando /categories y escogiendo una.

## Formularios (Reactive Forms)
- Login: email (required + email), password (required).
- Registro: name, email (email), password (min 6), confirmPassword (= password).
- Crear/Editar producto: title, price, description, category obligatorios; image opcional.
- Validación visible en UI y botones deshabilitados mientras se procesa.

## Navbar y navegación
- Navbar siempre visible.
  - Invitado: Inicio, Login, Registro.
  - Autenticado: Inicio, Productos, Panel (si admin), menú usuario con Logout.
- El guard de admin redirige a /auth/login si no hay sesión.

## Despliegue
- Frontend estático: Vercel/Netlify/Render/Railway.
- Pasos sugeridos:
  - Ajusta environment.apiBase si fuese necesario.
  - npm run build y sube la carpeta dist/fakestore-app.
  - Configura la app para servir rutas SPA (fallback a index.html).

## Consideraciones de seguridad
- Nunca persistas credenciales en repositorio.
- Usa https (la API ya lo usa) y Authorization: Bearer.
- Limpia el token en logout.


https://fake-store-app-teal.vercel.app/
## Mejoras futuras
- Selector real de categorías (GET /categories y envío de categoryId).
- Mensajes de éxito/error y toasts consistentes en CRUD.
- Tests unitarios en servicios y guards.

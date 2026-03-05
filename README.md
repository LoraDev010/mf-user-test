# Andres Lora S.A.S People — Monorepo Micro Frontend

Aplicación de referencia **Micro Frontend** lista para producción, construida con **Vite Module Federation**, React 19, TypeScript y Tailwind CSS. Demuestra el patrón host/remote dentro de un monorepo npm workspaces.

---

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del monorepo](#estructura-del-monorepo)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecutar el proyecto completo](#ejecutar-el-proyecto-completo)
- [Ejecutar cada app de forma independiente](#ejecutar-cada-app-de-forma-independiente)
- [Scripts disponibles](#scripts-disponibles)
- [Docker](#docker)
- [Tests](#tests)
- [Module Federation — configuración](#module-federation--configuración)
- [Comunicación entre apps](#comunicación-entre-apps)
- [Design tokens](#design-tokens)
- [Despliegue en Netlify](#despliegue-en-netlify)
- [URLs de producción](#urls-de-producción)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                       Navegador (runtime)                   │
│                                                             │
│  ┌──────────────────────────┐   Module Federation (HTTP)    │
│  │  shell  (HOST)           │◄──────────────────────────┐   │
│  │  :5173                   │    remoteEntry.js          │   │
│  │                          │                            │   │
│  │  Rutas:                  │  ┌─────────────────────────┤   │
│  │  /          → UsersFeature│  │  users-mfe  (REMOTE)   │   │
│  │  /users/:id → Zustand    │  │  :5174                  │   │
│  │  /countries → Countries  │  │  Expone: ./UsersFeature │   │
│  │                          │  └─────────────────────────┘   │
│  │  Zustand (selectedUser)  │                            │   │
│  └──────────────────────────┘  ┌─────────────────────────┤   │
│                                 │  countries-mfe (REMOTE) │   │
│                                 │  :5175                  │   │
│                                 │  Expone: ./Countries    │   │
│                                 │  Feature                │   │
│                                 └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Decisiones arquitectónicas clave

| Decisión | Detalle |
|----------|---------|
| **Module Federation** | `@originjs/vite-plugin-federation` — los MFEs exponen sus features; la shell los consume de forma lazy en runtime |
| **Singletons compartidos** | `react`, `react-dom`, `react-router-dom` declarados como `shared` — solo se carga una copia por sesión |
| **MFE autocontenido** | Cada MFE lleva su propio `QueryClient` y store Zustand; el host no conoce sus internos |
| **Comunicación cross-app** | Prop callback `onUserSelect(user)` + `CustomEvent('user:selected')` como event bus |
| **Async boundary** | `React.lazy` + `<Suspense>` envuelve cada import remoto — la shell muestra `<LoadingScreen>` hasta que llega el bundle |
| **Estado persistente** | `useUsersStore` usa `zustand/persist` — los cambios locales sobreviven al refresco |
| **Routing** | La shell es dueña del routing; los MFEs son route-agnostic (no tienen `BrowserRouter` propio) |

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Build tool | Vite | ^6.2.0 |
| Module Federation | @originjs/vite-plugin-federation | ^1.3.6 |
| UI | React | ^19.0.0 |
| Lenguaje | TypeScript (strict) | ~5.7.2 |
| Estilos | Tailwind CSS | ^3.4.17 |
| Preprocesador CSS | Sass | ^1.97.3 |
| Estado servidor | TanStack React Query | ^5.67.2 |
| Estado cliente | Zustand (persist) | ^5.0.3 |
| Routing | React Router | ^7.2.0 |
| Animaciones | Motion (Framer Motion) | ^11.18.2 |
| GraphQL | graphql-request | ^7.1.2 |
| Testing | Jest | ^30.2.0 |
| Testing DOM | @testing-library/react | ^16.3.2 |
| Matchers adicionales | @testing-library/jest-dom | ^6.9.1 |
| Transpilación tests | Babel + babel-jest | ^7.29.0 |
| Package manager | npm workspaces | ≥10 |
| Contenedor | Docker + Docker Compose | — |

---

## Estructura del monorepo

```
mf-user-test/
├── package.json              ← scripts raíz + workspaces config
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
├── start-dev.sh              ← script para levantar todo en orden
├── shared/
│   └── variables.css         ← design tokens CSS compartidos
└── apps/
    ├── shell/                ← HOST  (puerto 5173)
    │   ├── vite.config.ts    ← declara remotes: usersMfe, countriesMfe
    │   ├── netlify.toml
    │   └── src/
    │       ├── App.tsx
    │       ├── pages/
    │       │   ├── HomePage.tsx        ← lazy-import UsersFeature
    │       │   ├── CountriesPage.tsx   ← lazy-import CountriesFeature
    │       │   └── UserDetailPage.tsx
    │       ├── stores/
    │       │   └── selectedUserStore.ts
    │       ├── shared/components/
    │       │   ├── Layout.tsx
    │       │   └── LoadingScreen.tsx
    │       └── types/
    │           ├── index.ts
    │           └── remote.d.ts
    │
    ├── users-mfe/            ← REMOTE  (puerto 5174)
    │   ├── vite.config.ts    ← expone ./UsersFeature
    │   ├── netlify.toml
    │   └── src/
    │       └── features/users/
    │           ├── index.tsx           ← API pública: QueryClientProvider + UsersPage
    │           ├── types.ts
    │           ├── pages/UsersPage.tsx
    │           ├── components/
    │           │   ├── UserList.tsx
    │           │   ├── UserCard.tsx
    │           │   ├── UserSearch.tsx
    │           │   ├── UserFormModal.tsx
    │           │   └── Pagination.tsx
    │           ├── hooks/useUsers.ts
    │           ├── services/users.service.ts  ← randomuser.me API
    │           └── store/usersStore.ts
    │
    └── countries-mfe/        ← REMOTE  (puerto 5175)
        ├── vite.config.ts    ← expone ./CountriesFeature
        ├── netlify.toml
        └── src/
            └── features/countries/
                ├── index.tsx
                ├── types.ts
                ├── pages/CountriesPage.tsx
                ├── components/
                └── services/  ← GraphQL via graphql-request
```

---

## Requisitos previos

- **Node.js ≥ 20**
- **npm ≥ 10**
- **Docker Desktop** (solo si usas Docker)

```bash
node -v
npm -v
docker -v
```

---

## Instalación

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/mf-user-test.git
cd mf-user-test

# Instala todas las dependencias del monorepo de una sola vez
npm install
```

---

## Ejecutar el proyecto completo

Los MFEs necesitan compilarse primero (`vite build`) antes de que la shell pueda consumirlos, porque `@originjs/vite-plugin-federation` requiere un build estático para exponer los módulos remotos.

### Opción A — Script automático (Linux/Mac/Docker)

```bash
bash start-dev.sh
```

El script hace lo siguiente en orden:
1. Compila `users-mfe` y `countries-mfe`
2. Los levanta con `vite preview` (puerto 5174 y 5175)
3. Levanta `shell` con `vite dev` (puerto 5173)

### Opción B — Comandos manuales (Windows u otras plataformas)

Abre **3 terminales** y ejecuta cada una:

**Terminal 1 — Build y preview de users-mfe:**
```bash
npm run build:mfe
npm run preview:mfe
```

**Terminal 2 — Build y preview de countries-mfe:**
```bash
npm run build:countries
npm run preview:countries
```

**Terminal 3 — Shell (dev server):**
```bash
npm run dev:shell
```

Luego abre **http://localhost:5173**

---

## Ejecutar cada app de forma independiente

Cada app puede correr sola para desarrollo aislado:

### Shell
```bash
npm run dev:shell
# → http://localhost:5173
# (los MFEs no cargarán si no están activos)
```

### users-mfe
```bash
npm run dev:mfe
# → http://localhost:5174
# Funciona standalone como app React normal
```

### countries-mfe
```bash
npm run dev:countries
# → http://localhost:5175
# Funciona standalone como app React normal
```

---

## Scripts disponibles

Todos los scripts se ejecutan desde la **raíz del repositorio**:

| Script | Descripción |
|--------|-------------|
| `npm run dev:shell` | Dev server de shell en puerto 5173 |
| `npm run dev:mfe` | Dev server de users-mfe en puerto 5174 |
| `npm run dev:countries` | Dev server de countries-mfe en puerto 5175 |
| `npm run build` | Build completo: users-mfe → countries-mfe → shell |
| `npm run build:mfe` | Build solo de users-mfe |
| `npm run build:countries` | Build solo de countries-mfe |
| `npm run build:shell` | Build solo de shell |
| `npm run preview:mfe` | Sirve el build de users-mfe en puerto 5174 |
| `npm run preview:countries` | Sirve el build de countries-mfe en puerto 5175 |
| `npm run preview:shell` | Sirve el build de shell en puerto 5173 |
| `npm test` | Ejecuta tests de users-mfe con cobertura |
| `npm run test:ci` | Tests con umbral mínimo de 90% de cobertura |

---

## Docker

### Requisitos

- Docker Desktop instalado y corriendo

### Levantar el proyecto con Docker

```bash
# Primera vez (construye la imagen)
docker compose up --build

# Siguiente vez (imagen ya existe)
docker compose up

# En segundo plano
docker compose up -d
```

Accede en: **http://localhost:5173**

### Ver logs

```bash
docker compose logs -f
```

### Detener

```bash
docker compose down
```

### Cómo funciona

El `Dockerfile` usa Node 20 Alpine e instala todas las dependencias del monorepo. El `docker-compose.yml` monta el código fuente como volumen para que los cambios se reflejen sin reconstruir la imagen. Los `node_modules` viven en volúmenes Docker separados para evitar conflictos con rutas de Windows.

```
Puertos mapeados:
  5173 → shell      (vite dev — hot reload)
  5174 → users-mfe  (vite preview — build estático)
  5175 → countries-mfe (vite preview — build estático)
```

> **Nota:** Si editas código de los MFEs dentro del contenedor, necesitas reconstruirlos manualmente:
> ```bash
> docker compose exec app bash start-dev.sh
> ```

---

## Tests

El proyecto usa **Jest 30** con **Testing Library** y **Babel** como transpilador.

### Ejecutar tests

```bash
# Tests de users-mfe con reporte de cobertura
npm test

# Modo CI — falla si la cobertura de líneas es menor al 90%
npm run test:ci

# Tests de un app específica directamente
npm run test -w users-mfe
npm run test -w shell
```

### Configuración de tests

| Configuración | Archivo |
|--------------|---------|
| Jest config | `apps/{app}/test/jest.config.cjs` |
| Babel config | `apps/{app}/test/babel.config.cjs` |
| Setup global | `apps/{app}/test/jest.setup.ts` |

- **Entorno:** jsdom
- **Cobertura:** excluye `main.tsx`, `bootstrap.tsx`, mocks y archivos `.d.ts`
- **Alias:** `@/*` → `src/*`
- **CSS modules:** mockeados con `identity-obj-proxy`
- **Motion:** mockeado en `src/__mocks__/motion.tsx`

### Qué se testea

- `features/users/` — store, hooks (`useUsers`), service, todos los componentes, página
- `shared/` — `useDebounce`, `httpClient`, `queryClient`, `ErrorFallback`
- API pública del MFE (`features/users/index.tsx`)
- Shell — `selectedUserStore`, `UserDetailPage`

---

## Module Federation — configuración

### users-mfe expone (`vite.config.ts`)

```typescript
federation({
  name: 'usersMfe',
  filename: 'remoteEntry.js',
  exposes: {
    './UsersFeature': './src/features/users/index.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### countries-mfe expone (`vite.config.ts`)

```typescript
federation({
  name: 'countriesMfe',
  filename: 'remoteEntry.js',
  exposes: {
    './CountriesFeature': './src/features/countries/index.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### Shell consume (`vite.config.ts`)

```typescript
federation({
  name: 'shell',
  remotes: {
    usersMfe: `${process.env.VITE_USERS_MFE_URL ?? 'http://localhost:5174'}/assets/remoteEntry.js`,
    countriesMfe: `${process.env.VITE_COUNTRIES_MFE_URL ?? 'http://localhost:5175'}/assets/remoteEntry.js`,
  },
  shared: ['react', 'react-dom', 'react-router-dom'],
})
```

### Consumo en la shell

```tsx
const UsersFeature = React.lazy(() => import('usersMfe/UsersFeature'))
const CountriesFeature = React.lazy(() => import('countriesMfe/CountriesFeature'))

<Suspense fallback={<LoadingScreen />}>
  <UsersFeature onUserSelect={handleUserSelect} />
</Suspense>
```

---

## Comunicación entre apps

Cuando se hace clic en una tarjeta de usuario, se disparan dos canales simultáneamente:

```
users-mfe (UsersPage)
  │
  ├── props.onUserSelect(user)        ← prop callback
  │     shell lo recibe en HomePage.tsx
  │     → actualiza Zustand selectedUserStore
  │     → navega a /users/:uuid
  │
  └── CustomEvent('user:selected')   ← event bus global
        útil para otros hosts o listeners de analytics
```

---

## Design tokens

Los tokens CSS están definidos en `shared/variables.css` y son compartidos por todas las apps:

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#f0f2f8` | Fondo de página |
| `--surface` | `#ffffff` | Tarjetas, modales |
| `--surface-2` | `#f0f4ff` | Fondos secundarios |
| `--border` | `#dde3f5` | Bordes |
| `--brand` | `#1400CC` | Acciones primarias |
| `--brand-dark` | `#0e0099` | Hover de acciones primarias |
| `--accent` | `#FFD400` | Highlight del logo |
| `--text-primary` | `#06084a` | Títulos |
| `--text-secondary` | `#5a5e8a` | Texto de soporte |

Fuentes: **Syne** (display/headings) · **DM Sans** (body)

---

## Despliegue en Netlify

Cada app se despliega como un **sitio Netlify independiente** desde el mismo repositorio. El orden importa porque la shell necesita las URLs de los MFEs en tiempo de compilación.

### Orden de despliegue

```
1. users-mfe  →  obtener URL
2. countries-mfe  →  obtener URL
3. shell  →  configurar env vars con las URLs anteriores → deploy
```

---

### 1. Desplegar users-mfe

En Netlify → **Add new site** → **Import from Git**:

| Campo | Valor |
|-------|-------|
| Repositorio | tu repositorio de GitHub |
| Base directory | `apps/users-mfe` |
| Build command | *(vacío — se lee del `netlify.toml`)* |
| Publish directory | *(vacío — se lee del `netlify.toml`)* |
| Variables de entorno | ninguna |

El `netlify.toml` configura automáticamente:
```toml
[build]
  command = "npm ci && npm run build:mfe"
  publish = "apps/users-mfe/dist"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

> El header CORS en `/assets/*` es obligatorio para que la shell pueda cargar los módulos remotos desde otro dominio.

---

### 2. Desplegar countries-mfe

Mismo proceso, con **Base directory**: `apps/countries-mfe`

```toml
[build]
  command = "npm ci && npm run build:countries"
  publish = "apps/countries-mfe/dist"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

---

### 3. Desplegar shell

**Base directory**: `apps/shell`

Antes de hacer deploy, agrega las **Environment variables** en Netlify (Site settings → Environment variables):

| Variable | Valor |
|----------|-------|
| `VITE_USERS_MFE_URL` | `https://mf-users-mfe.netlify.app` |
| `VITE_COUNTRIES_MFE_URL` | `https://mf-countries-mfe.netlify.app` |

> Estas variables se leen en `vite.config.ts` **en tiempo de build**, no en runtime. Deben estar configuradas antes de lanzar el deploy.

```toml
[build]
  command = "npm ci && npm run build:shell"
  publish = "apps/shell/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

> La regla `[[redirects]]` es necesaria para que React Router funcione correctamente al refrescar la página o acceder a rutas directamente.

---

### Re-deploys

Cuando se hace push a la rama `main`, Netlify re-deploya automáticamente los sitios afectados. Si modificas un MFE y la shell también necesita actualizarse (por cambios en la API pública), trigerea manualmente el re-deploy de la shell desde el dashboard de Netlify.

---

## URLs de producción

| App | URL |
|-----|-----|
| Shell (host) | https://mf-shell-fd.netlify.app |
| users-mfe | https://mf-users-mfe.netlify.app |
| countries-mfe | https://mf-countries-mfe.netlify.app |

# 📖 README - Arquitectura del Proyecto: Red Social Futura

## 📋 Descripción General

Este documento describe la arquitectura de alto nivel de una futura red social. El proyecto está diseñado siguiendo principios de separación de responsabilidades, escalabilidad y mantenimiento sencillo, utilizando **CosmosDB (NoSQL)** como base de datos principal.

---

## 🏗️ Arquitectura del Sistema

La arquitectura se basa en un modelo **cliente-servidor** con separación clara entre el backend y el frontend, comunicándose a través de una API REST (o GraphQL si se decide en el futuro).

```
┌─────────────┐      HTTPS/REST      ┌──────────────────┐      CosmosDB      ┌─────────────────┐
│   Frontend  │ ◄───────────────────► │     Backend      │ ◄───────────────► │  CosmosDB NoSQL │
│  (React/Vue)│                       │   (Node/.NET/Py) │                   │   (Documentos)  │
└─────────────┘                       └──────────────────┘                   └─────────────────┘
```

### Capas Principales

1. **Frontend**: Interfaz de usuario responsable de la presentación y experiencia del usuario.
2. **Backend**: Lógica de negocio, autenticación, validación y comunicación con la base de datos.
3. **Base de Datos**: Almacenamiento no relacional de documentos (perfiles, publicaciones, comentarios, mensajes, etc.).

---

## 📂 Estructura de Carpetas Principales

```
red-social-futura/
├── README.md                      # Este archivo: documentación del proyecto
├── .gitignore                     # Archivos ignorados por Git
├── package.json (o equivalente)   # Dependencias y scripts raíz (monorepo opcional)
├── docker-compose.yml             # Orquestación de servicios locales (opcional)
│
├── backend/                       # 🖥️ Capa del servidor
│   ├── src/
│   │   ├── controllers/           # Controladores de rutas (HTTP handlers)
│   │   ├── services/              # Lógica de negocio
│   │   ├── models/                # Esquemas/interfaces de documentos CosmosDB
│   │   ├── repositories/          # Acceso a datos (CosmosDB client)
│   │   ├── middleware/            # Autenticación, validación, manejo de errores
│   │   ├── routes/                # Definición de endpoints API
│   │   ├── config/                # Configuración (CosmosDB connection string, JWT, etc.)
│   │   └── app.js (o index.js)    # Punto de entrada del servidor
│   ├── tests/                     # Pruebas unitarias e de integración
│   ├── package.json
│   └── Dockerfile (opcional)
│
├── frontend/                      # 🌐 Capa del cliente
│   ├── src/
│   │   ├── components/            # Componentes reutilizables (UI)
│   │   ├── pages/                 # Páginas principales (Feed, Perfil, Chat, etc.)
│   │   ├── services/              # Llamadas HTTP al backend (Axios/Fetch)
│   │   ├── store/                 # Manejo de estado global (Redux, Zustand, Context, etc.)
│   │   ├── hooks/                 # Custom hooks
│   │   ├── utils/                 # Utilidades y helpers
│   │   ├── assets/                # Imágenes, iconos, estilos globales
│   │   └── App.js (o main.tsx)    # Punto de entrada de la aplicación
│   ├── public/
│   ├── package.json
│   └── Dockerfile (opcional)
│
└── docs/                          # 📄 Documentación adicional (API, diagramas, etc.)
```

---

## 🔙 Backend

El backend expone una API que el frontend consume para realizar todas las operaciones de la red social.

### Responsabilidades

- Autenticación y autorización de usuarios (JWT, OAuth, etc.)
- Gestión de perfiles de usuario
- CRUD de publicaciones, comentarios y reacciones
- Sistema de seguidores / seguidos
- Mensajería privada (opcional en fases futuras)
- Subida y gestión de archivos multimedia (integrando con Azure Blob Storage si se usa Azure CosmosDB)
- Validación de datos de entrada

### Tecnologías Sugeridas (ejemplo)

- **Node.js + Express** o **Python + FastAPI** o **.NET 8+**
- **Azure CosmosDB SDK** para NoSQL
- **JWT** para sesiones
- **Swagger/OpenAPI** para documentación de la API

---

## 🌐 Frontend

El frontend es una aplicación de página única (SPA) que ofrece la interfaz de la red social.

### Responsabilidades

- Renderizado de la interfaz de usuario
- Gestión del estado de autenticación
- Consumo de la API del backend
- Navegación entre vistas (feed, perfil, notificaciones, mensajes)
- Diseño responsivo (mobile-first)

### Tecnologías Sugeridas (ejemplo)

- **React**, **Vue.js** o **Angular**
- **TypeScript** (recomendado para mayor tipado y mantenimiento)
- **Axios** o **Fetch** para peticiones HTTP
- **Tailwind CSS** o **Styled Components** para estilos
- **React Query / SWR** para caché y sincronización de datos del servidor

---

## 🗄️ Base de Datos: CosmosDB NoSQL

Se utiliza **Azure CosmosDB** como base de datos NoSQL orientada a documentos.

### ¿Por qué CosmosDB?

| Ventaja | Descripción |
|---------|-------------|
| **Escalabilidad global** | Distribución de datos en múltiples regiones con baja latencia. |
| **Esquema flexible** | Ideal para datos de redes sociales que evolucionan rápido (perfiles, posts, comentarios con estructuras variables). |
| **Alta disponibilidad** | Acuerdos de nivel de servicio (SLA) de 99.999% para lecturas y escrituras. |
| **Indexación automática** | Consultas rápidas sin necesidad de definir índices manuales en todos los campos. |
| **Multi-modelo** | Soporta documentos (JSON), columnar, grafos y key-value. |

### Ejemplo de Estructura de Documentos (JSON)

```json
// Usuario
{
  "id": "usr_123",
  "type": "user",
  "username": "ana_dev",
  "email": "ana@example.com",
  "displayName": "Ana Developer",
  "avatarUrl": "https://...",
  "bio": "Apasionada por el código",
  "createdAt": "2024-01-15T10:00:00Z",
  "followersCount": 150,
  "followingCount": 200
}

// Publicación
{
  "id": "post_456",
  "type": "post",
  "authorId": "usr_123",
  "content": "¡Hola mundo! Este es mi primer post.",
  "mediaUrls": [],
  "likesCount": 10,
  "commentsCount": 3,
  "createdAt": "2024-01-20T14:30:00Z",
  "partitionKey": "usr_123"
}
```

> **Nota:** Se recomienda usar un campo `type` para distinguir entre distintos tipos de documentos en el mismo contenedor y elegir una `partitionKey` adecuada (por ejemplo, `userId`) para optimizar consultas y rendimiento.

---

## ⚖️ Decisiones Arquitectónicas y Justificación

### 1. Separación Backend / Frontend
**Decisión:** Mantener el frontend y el backend en carpetas separadas, con comunicación vía API.  
**Justificación:** Permite equipos independientes, despliegues separados, escalabilidad individual y reutilización de la API para futuros clientes (móvil, web, terceros).

### 2. Base de Datos NoSQL (CosmosDB)
**Decisión:** Usar CosmosDB en lugar de una base de datos relacional (SQL).  
**Justificación:** Las redes sociales manejan datos semiestructurados y en constante cambio. CosmosDB ofrece escalabilidad horizontal, baja latencia global y esquema flexible, ideal para feeds de actividad y perfiles de usuario.

### 3. Arquitectura por Capas en el Backend
**Decisión:** Organizar el backend en capas: `controllers` → `services` → `repositories` → `CosmosDB`.  
**Justificación:** Separación de responsabilidades, facilita pruebas unitarias, mantenimiento y cambio de proveedor de base de datos en el futuro sin afectar la lógica de negocio.

### 4. Autenticación Stateless (JWT)
**Decisión:** Usar JSON Web Tokens para autenticación sin estado en el servidor.  
**Justificación:** Reduce carga en el backend, facilita escalabilidad horizontal y es estándar para APIs consumidas por SPAs.

### 5. Posible Monorepo (futuro)
**Decisión:** Mantener backend y frontend en el mismo repositorio, pero en carpetas distintas.  
**Justificación:** Facilita el versionado conjunto, cambios coordinados y uso de herramientas compartidas (TypeScript, ESLint, CI/CD).

---



> Este documento es una guía arquitectónica inicial para una red social futura. Puede evolucionar conforme avance el desarrollo y se tomen decisiones técnicas definitivas.

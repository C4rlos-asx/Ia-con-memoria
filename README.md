# AION Media Developers - IA con Memoria

Plataforma de IA con memoria persistente usando Gemini, PostgreSQL y Redis.

## 🚀 Características

- **IA con Memoria**: Integración con Google Gemini Pro
- **Almacenamiento Persistente**: PostgreSQL para datos históricos
- **Cache Rápido**: Redis para respuestas frecuentes
- **Interfaz Moderna**: Frontend con Next.js y Tailwind CSS
- **Animaciones Suaves**: Framer Motion para mejor UX
- **Configuración Completa**: Panel de configuración desde la interfaz

## 🏗️ Arquitectura

### Backend
- **Node.js + Express + TypeScript**
- **PostgreSQL**: Base de datos principal
- **Redis**: Cache y sesiones
- **Google Gemini API**: Modelo de IA

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**: Estilos según guía AION
- **Framer Motion**: Animaciones

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- Redis 7+
- API Key de Google Gemini

## 🔧 Instalación Local

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd "Ia con memoria"
```

### 2. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configurar variables de entorno

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=aion_ai
DB_USER=postgres
DB_PASSWORD=tu_password

REDIS_URL=redis://localhost:6379

GEMINI_API_KEY=tu_api_key_aqui
GEMINI_MODEL=gemini-pro
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Inicializar base de datos

PostgreSQL creará automáticamente las tablas al iniciar el servidor.

### 5. Ejecutar aplicación

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🚀 Deployment en Render

### Opción 1: Usando render.yaml (Recomendado)

1. Conecta tu repositorio en Render
2. Render detectará automáticamente el archivo `render.yaml`
3. Render creará todos los servicios necesarios

### Opción 2: Crear servicios manualmente

#### Backend
1. Crear nuevo **Web Service**
2. Conectar repositorio
3. Configuración:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: `Node`
   - **Plan**: Starter o superior

4. Variables de entorno:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (desde PostgreSQL)
   - `REDIS_URL` (desde Redis)
   - `GEMINI_API_KEY` (tu API key)
   - `GEMINI_MODEL=gemini-pro`
   - `FRONTEND_URL` (URL de tu frontend)

#### Frontend
1. Crear nuevo **Web Service**
2. Conectar repositorio
3. Configuración:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Environment**: `Node`
   - **Plan**: Starter o superior

4. Variables de entorno:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_API_URL` (URL de tu backend)

#### PostgreSQL
1. Crear **PostgreSQL** database
2. Render proporcionará las variables de conexión automáticamente

#### Redis
1. Crear **Redis** instance
2. Render proporcionará la URL de conexión automáticamente

## 📁 Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── redis.ts
│   │   ├── routes/
│   │   │   ├── chat.routes.ts
│   │   │   ├── memory.routes.ts
│   │   │   ├── config.routes.ts
│   │   │   └── conversation.routes.ts
│   │   ├── services/
│   │   │   └── gemini.service.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── ConfigPanel.tsx
│   │   ├── MemoryPanel.tsx
│   │   └── ConversationsList.tsx
│   ├── lib/
│   │   └── api.ts
│   └── public/
│       └── logo.png
├── render.yaml
└── README.md
```

## 🔑 Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Copia la key y configúrala en la aplicación

## 🎨 Guía de Estilos

La aplicación sigue la guía de identidad visual de AION Media Developers:

- **Colores**: Negro profundo (#0B0D0E), Gris oscuro (#121417), Verde AION (#00E676)
- **Tipografía**: Inter o Poppins
- **Efectos**: Glow en verde, bordes redondeados (22px)
- **Animaciones**: Fade + slide suaves

Ver `estilos.txt` para más detalles.

## 📝 API Endpoints

### Chat
- `POST /api/chat` - Enviar mensaje
- `GET /api/chat/history/:conversationId` - Obtener historial

### Memoria
- `POST /api/memory` - Guardar memoria
- `GET /api/memory/:userId` - Obtener memorias
- `DELETE /api/memory/:userId/:key` - Eliminar memoria

### Configuración
- `POST /api/config` - Guardar configuración
- `GET /api/config/:userId` - Obtener configuraciones
- `DELETE /api/config/:userId/:key` - Eliminar configuración

### Conversaciones
- `GET /api/conversations/:userId` - Listar conversaciones
- `DELETE /api/conversations/:conversationId` - Eliminar conversación

## 🔒 Seguridad

- Las API Keys se almacenan en variables de entorno
- Las configuraciones del usuario se guardan en PostgreSQL
- Redis se usa solo para cache, no para datos sensibles

## 📄 Licencia

Este proyecto es privado.

## 🤝 Soporte

Para soporte, contacta al equipo de AION Media Developers.

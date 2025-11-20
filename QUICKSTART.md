# ⚡ Inicio Rápido - AION AI Memory

Guía rápida para comenzar con la aplicación.

## 🎯 Tecnologías Utilizadas

### Backend ✅
- **Node.js + Express + TypeScript**: Framework web robusto
- **PostgreSQL**: Base de datos principal
- **Redis**: Cache para respuestas rápidas
- **Google Gemini API**: Modelo de IA

### Frontend ✅
- **Next.js 14 + TypeScript**: Framework React moderno
- **Tailwind CSS**: Estilos según guía AION
- **Framer Motion**: Animaciones suaves
- **Axios**: Cliente HTTP

## 🚀 Inicio Rápido Local

### 1. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar Variables de Entorno

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

### 3. Iniciar Servicios

#### Terminal 1 - PostgreSQL
```bash
# Asegúrate de que PostgreSQL esté corriendo
# Si usas Docker:
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15

# O si ya tienes PostgreSQL instalado, solo inicia el servicio
```

#### Terminal 2 - Redis
```bash
# Si usas Docker:
docker run -d --name redis -p 6379:6379 redis:7

# O si ya tienes Redis instalado, solo inicia el servicio
```

#### Terminal 3 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 4 - Frontend
```bash
cd frontend
npm run dev
```

### 4. Acceder a la Aplicación

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔑 Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Configúrala en la aplicación (pestaña Configuración)

## 📋 Primeros Pasos

1. **Configuración**: Ve a la pestaña "Configuración" y agrega tu API Key de Gemini
2. **Chat**: Comienza a chatear con la IA
3. **Memoria**: Guarda información importante en la pestaña "Memoria"
4. **Conversaciones**: Revisa tu historial en "Conversaciones"

## 🚀 Deployment en Render

Ver `DEPLOY.md` para instrucciones detalladas.

### Opción Rápida:
1. Conecta tu repositorio en Render
2. Render detectará automáticamente `render.yaml`
3. Configura `GEMINI_API_KEY` en las variables de entorno
4. ¡Listo!

## 🛠️ Troubleshooting

### Backend no conecta a PostgreSQL
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `.env`
- Verifica que el puerto 5432 esté disponible

### Backend no conecta a Redis
- Verifica que Redis esté corriendo
- Revisa `REDIS_URL` en `.env`
- Verifica que el puerto 6379 esté disponible

### Frontend no conecta al Backend
- Verifica que `NEXT_PUBLIC_API_URL` sea correcto
- Asegúrate de que el backend esté corriendo
- Revisa los CORS en el backend

### Error de API Key
- Verifica que tu API Key de Gemini sea válida
- Configúrala en la pestaña "Configuración"
- O agrégalo en las variables de entorno del backend

## 📚 Documentación

- `README.md`: Documentación completa
- `DEPLOY.md`: Guía de deployment
- `TECNOLOGIAS.md`: Tecnologías y recomendaciones adicionales

## 💡 Características Principales

- ✅ **IA con Memoria**: La IA recuerda conversaciones anteriores
- ✅ **Almacenamiento Persistente**: Todo se guarda en PostgreSQL
- ✅ **Cache Inteligente**: Redis cachea respuestas frecuentes
- ✅ **Interfaz Moderna**: Diseño siguiendo guía AION
- ✅ **Configuración Completa**: Todo desde la interfaz
- ✅ **Historial Completo**: Revisa todas tus conversaciones

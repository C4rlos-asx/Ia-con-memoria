# 🚀 Guía de Deployment en Render

Esta guía te ayudará a desplegar la aplicación AION AI Memory en Render.

## 📋 Pre-requisitos

1. Cuenta en [Render](https://render.com)
2. Repositorio Git (GitHub, GitLab, o Bitbucket)
3. API Key de Google Gemini

## 🎯 Opción 1: Deployment Automático con render.yaml

### Pasos:

1. **Conectar Repositorio**
   - Ve a tu dashboard en Render
   - Click en "New" → "Blueprint"
   - Conecta tu repositorio Git
   - Render detectará automáticamente el archivo `render.yaml`

2. **Configurar Variables de Entorno**
   - Render creará los servicios automáticamente
   - En el servicio de backend, agrega:
     - `GEMINI_API_KEY`: Tu API Key de Gemini
     - Otras variables se configurarán automáticamente desde los servicios relacionados

3. **Esperar el Deployment**
   - Render construirá y desplegará todos los servicios
   - El proceso puede tomar 5-10 minutos

4. **Verificar**
   - Accede a la URL del frontend
   - Deberías ver la aplicación funcionando

## 🛠️ Opción 2: Deployment Manual

### Paso 1: Crear Base de Datos PostgreSQL

1. Ve a Render Dashboard
2. Click en "New" → "PostgreSQL"
3. Configuración:
   - **Name**: `aion-ai-db`
   - **Database**: `aion_ai`
   - **User**: `aion_user`
   - **Plan**: Starter (o superior)
4. Guarda las credenciales de conexión

### Paso 2: Crear Redis

1. Click en "New" → "Redis"
2. Configuración:
   - **Name**: `aion-ai-redis`
   - **Plan**: Starter (o superior)
3. Guarda la URL de conexión

### Paso 3: Crear Backend Service

1. Click en "New" → "Web Service"
2. Conecta tu repositorio
3. Configuración:
   - **Name**: `aion-ai-backend`
   - **Environment**: `Node`
   - **Region**: Elige la más cercana
   - **Branch**: `main` (o tu rama principal)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (o superior)

4. **Variables de Entorno**:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=<del servicio PostgreSQL>
   DB_PORT=5432
   DB_NAME=aion_ai
   DB_USER=aion_user
   DB_PASSWORD=<del servicio PostgreSQL>
   REDIS_URL=<del servicio Redis>
   GEMINI_API_KEY=<tu_api_key>
   GEMINI_MODEL=gemini-pro
   FRONTEND_URL=<url_del_frontend>
   ```

   **Nota**: Puedes usar las variables de referencia de Render:
   - `DB_HOST` → Desde PostgreSQL service
   - `DB_PASSWORD` → Desde PostgreSQL service
   - `REDIS_URL` → Desde Redis service

### Paso 4: Crear Frontend Service

1. Click en "New" → "Web Service"
2. Conecta tu repositorio
3. Configuración:
   - **Name**: `aion-ai-frontend`
   - **Environment**: `Node`
   - **Region**: Misma que el backend
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (o superior)

4. **Variables de Entorno**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=<url_del_backend>
   ```

   **Nota**: Actualiza `NEXT_PUBLIC_API_URL` con la URL del backend después de crearlo.

### Paso 5: Actualizar URLs

1. Una vez creados todos los servicios, actualiza:
   - En Backend: `FRONTEND_URL` con la URL del frontend
   - En Frontend: `NEXT_PUBLIC_API_URL` con la URL del backend

2. Reinicia ambos servicios después de actualizar las variables.

## 🔧 Troubleshooting

### Backend no se conecta a PostgreSQL

- Verifica que las variables de entorno estén correctas
- Asegúrate de que PostgreSQL esté en el mismo plan y región
- Verifica los logs del backend para ver el error específico

### Backend no se conecta a Redis

- Verifica que `REDIS_URL` esté configurada correctamente
- Asegúrate de que Redis esté activo

### Frontend no se conecta al Backend

- Verifica que `NEXT_PUBLIC_API_URL` esté configurada
- Asegúrate de que el backend esté corriendo
- Verifica los CORS en el backend

### Error de Build

- Verifica los logs de build en Render
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que TypeScript compile correctamente

## 📝 Notas Importantes

1. **Primer Deployment**: El primer deployment puede tardar más tiempo
2. **Variables de Entorno**: Render puede tardar unos segundos en actualizar las variables
3. **HTTPS**: Render proporciona HTTPS automáticamente
4. **Logs**: Revisa los logs en Render Dashboard para debugging
5. **Planes**: Starter plan tiene limitaciones, considera upgrade para producción

## 🔒 Seguridad

- **Nunca** commitees archivos `.env`
- Usa variables de entorno de Render para secrets
- Asegúrate de que `GEMINI_API_KEY` esté solo en variables de entorno

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Render Dashboard
2. Verifica las variables de entorno
3. Asegúrate de que todos los servicios estén corriendo
4. Contacta al equipo de AION Media Developers

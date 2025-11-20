import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function initRedis() {
  if (redisClient?.isOpen) return redisClient;

  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  
  redisClient = createClient({
    url,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('❌ Redis: Demasiados intentos de reconexión');
          return new Error('Demasiados intentos de reconexión');
        }
        return retries * 100;
      }
    }
  });

  redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
  redisClient.on('connect', () => console.log('🔄 Redis conectando...'));
  redisClient.on('ready', () => console.log('✅ Redis listo'));

  await redisClient.connect();
  return redisClient;
}

export function getRedis() {
  if (!redisClient?.isOpen) {
    throw new Error('Redis no inicializado. Llama a initRedis() primero.');
  }
  return redisClient;
}

// Helper para cache
export async function cacheGet(key: string): Promise<string | null> {
  try {
    const redis = getRedis();
    return await redis.get(key);
  } catch (error) {
    console.error('Error en cacheGet:', error);
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  try {
    const redis = getRedis();
    if (ttlSeconds) {
      await redis.setEx(key, ttlSeconds, value);
    } else {
      await redis.set(key, value);
    }
  } catch (error) {
    console.error('Error en cacheSet:', error);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch (error) {
    console.error('Error en cacheDelete:', error);
  }
}

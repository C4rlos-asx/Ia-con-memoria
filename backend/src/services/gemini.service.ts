import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPool } from '../config/database';
import { cacheGet, cacheSet } from '../config/redis';
import { encrypt, decrypt } from './encryption.service';

let genAI: GoogleGenerativeAI | null = null;

export function initGemini(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

export function getGeminiClient(apiKey: string): GoogleGenerativeAI {
  if (!genAI) {
    initGemini(apiKey);
  }
  if (!genAI) {
    throw new Error("Gemini client not initialized");
  }
  return genAI;
}

interface MemoryContext {
  conversations: Array<{ role: string; content: string }>;
  memories: Array<{ key: string; value: string }>;
}

export async function generateWithMemory(
  userId: string,
  message: string,
  apiKey: string,
  modelName: string = 'gemini-1.5-flash'
): Promise<{ response: string; conversationId: string }> {
  const pool = getPool();

  // 1. Guardar mensaje del usuario ANTES de procesar
  const conversationResult = await pool.query(
    `INSERT INTO conversations (user_id, title) 
     VALUES ($1, $2) 
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [userId, message.substring(0, 100)]
  );

  let conversationId: string;
  if (conversationResult.rows.length > 0) {
    conversationId = conversationResult.rows[0].id;
  } else {
    const existing = await pool.query(
      `SELECT id FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    conversationId = existing.rows[0]?.id || conversationResult.rows[0]?.id;
  }

  // Guardar mensaje del usuario (ENCRIPTADO)
  await pool.query(
    `INSERT INTO messages (conversation_id, role, content) 
     VALUES ($1, $2, $3)`,
    [conversationId, 'user', encrypt(message)]
  );

  // 2. Obtener contexto de memoria (últimas 10 conversaciones + memorias relevantes)
  const recentMessages = await pool.query(
    `SELECT role, content FROM messages 
     WHERE conversation_id = $1 
     ORDER BY created_at DESC LIMIT 10`,
    [conversationId]
  );

  const memories = await pool.query(
    `SELECT key, value FROM memory WHERE user_id = $1 LIMIT 5`,
    [userId]
  );

  // 3. Verificar cache en Redis
  const cacheKey = `gemini:${userId}:${Buffer.from(message).toString('base64').substring(0, 50)}`;
  const cached = await cacheGet(cacheKey);

  if (cached) {
    const cachedResponse = JSON.parse(cached);
    // Guardar respuesta cacheada también
    await pool.query(
      `INSERT INTO messages (conversation_id, role, content, metadata) 
       VALUES ($1, $2, $3, $4)`,
      [conversationId, 'assistant', cachedResponse.response, JSON.stringify({ cached: true })]
    );
    return { response: cachedResponse.response, conversationId };
  }

  // 4. Construir contexto para Gemini
  const contextMessages = recentMessages.rows.reverse().map((msg: { role: string; content: string }) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: decrypt(msg.content) }] // Desencriptar para el contexto
  }));

  const memoryContext = memories.rows.length > 0
    ? `\nMemoria del usuario:\n${memories.rows.map((m: { key: string; value: string }) => `- ${m.key}: ${decrypt(m.value)}`).join('\n')}\n`
    : '';

  // 5. Generar respuesta con Gemini
  console.log(`🤖 Using Gemini Model: ${modelName}`);
  const client = getGeminiClient(apiKey);
  const model = client.getGenerativeModel({ model: modelName });

  const systemPrompt = `Eres un asistente IA de AION Media Developers. 
Eres útil, preciso y mantienes contexto de conversaciones anteriores.
${memoryContext}
Responde de manera clara y concisa.`;

  try {
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Estoy listo para ayudarte.' }]
        },
        ...contextMessages.slice(0, -1) // Todos excepto el último mensaje
      ]
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    // 6. Guardar respuesta en DB (ENCRIPTADO)
    await pool.query(
      `INSERT INTO messages (conversation_id, role, content) 
       VALUES ($1, $2, $3)`,
      [conversationId, 'assistant', encrypt(response)]
    );

    // 7. Cachear respuesta en Redis (1 hora)
    await cacheSet(cacheKey, JSON.stringify({ response }), 3600);

    // 8. Actualizar timestamp de conversación
    await pool.query(
      `UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [conversationId]
    );

    return { response, conversationId };
  } catch (error: any) {
    console.error('Error en Gemini:', error);
    throw new Error(`Error al generar respuesta: ${error.message}`);
  }
}

export async function saveMemory(userId: string, key: string, value: string, context: Record<string, any> = {}) {
  const pool = getPool();

  await pool.query(
    `INSERT INTO memory (user_id, key, value, context) 
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, key) 
     DO UPDATE SET value = $3, context = $4, updated_at = CURRENT_TIMESTAMP`,
    [userId, key, encrypt(value), JSON.stringify(context)]
  );

  // También cachear en Redis
  await cacheSet(`memory:${userId}:${key}`, value, 86400 * 7); // 7 días
}

export async function getMemory(userId: string, key?: string) {
  const pool = getPool();

  if (key) {
    const result = await pool.query(
      `SELECT key, value, context FROM memory WHERE user_id = $1 AND key = $2`,
      [userId, key]
    );
    if (result.rows[0]) {
      result.rows[0].value = decrypt(result.rows[0].value);
    }
    return result.rows[0] || null;
  }

  const result = await pool.query(
    `SELECT key, value, context FROM memory WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    ...row,
    value: decrypt(row.value)
  }));
}

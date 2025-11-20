import { Router } from 'express';
import { z } from 'zod';
import { saveMemory, getMemory } from '../services/gemini.service';
import { getPool } from '../config/database';

const router = Router();

const saveMemorySchema = z.object({
  userId: z.string().min(1),
  key: z.string().min(1).max(500),
  value: z.string().min(1),
  context: z.record(z.any()).optional(),
});

// POST /api/memory
router.post('/', async (req, res) => {
  try {
    const body = saveMemorySchema.parse(req.body);
    
    await saveMemory(body.userId, body.key, body.value, body.context);

    res.json({
      success: true,
      message: 'Memoria guardada correctamente',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    }
    console.error('Error al guardar memoria:', error);
    res.status(500).json({ error: 'Error al guardar memoria' });
  }
});

// GET /api/memory/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { key } = req.query;

    const memories = await getMemory(userId, key as string | undefined);

    res.json({
      success: true,
      memories: Array.isArray(memories) ? memories : (memories ? [memories] : []),
    });
  } catch (error: any) {
    console.error('Error al obtener memoria:', error);
    res.status(500).json({ error: 'Error al obtener memoria' });
  }
});

// DELETE /api/memory/:userId/:key
router.delete('/:userId/:key', async (req, res) => {
  try {
    const { userId, key } = req.params;
    const pool = getPool();

    await pool.query(
      `DELETE FROM memory WHERE user_id = $1 AND key = $2`,
      [userId, key]
    );

    res.json({
      success: true,
      message: 'Memoria eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error al eliminar memoria:', error);
    res.status(500).json({ error: 'Error al eliminar memoria' });
  }
});

export { router as memoryRoutes };

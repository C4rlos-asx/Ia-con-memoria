import { Router } from 'express';
import { z } from 'zod';
import { getPool } from '../config/database';

const router = Router();

const configSchema = z.object({
  userId: z.string().min(1),
  key: z.string().min(1),
  value: z.string().min(1),
});

// POST /api/config
router.post('/', async (req, res) => {
  try {
    const body = configSchema.parse(req.body);
    const pool = getPool();

    await pool.query(
      `INSERT INTO configurations (user_id, key, value) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, key) 
       DO UPDATE SET value = $3, updated_at = CURRENT_TIMESTAMP`,
      [body.userId, body.key, body.value]
    );

    res.json({
      success: true,
      message: 'Configuración guardada correctamente',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
    }
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
});

// GET /api/config/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { key } = req.query;
    const pool = getPool();

    let result;
    if (key) {
      result = await pool.query(
        `SELECT key, value FROM configurations WHERE user_id = $1 AND key = $2`,
        [userId, key]
      );
    } else {
      result = await pool.query(
        `SELECT key, value FROM configurations WHERE user_id = $1`,
        [userId]
      );
    }

    const configs = result.rows.reduce((acc: Record<string, string>, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    res.json({
      success: true,
      configs,
    });
  } catch (error: any) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// DELETE /api/config/:userId/:key
router.delete('/:userId/:key', async (req, res) => {
  try {
    const { userId, key } = req.params;
    const pool = getPool();

    await pool.query(
      `DELETE FROM configurations WHERE user_id = $1 AND key = $2`,
      [userId, key]
    );

    res.json({
      success: true,
      message: 'Configuración eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error al eliminar configuración:', error);
    res.status(500).json({ error: 'Error al eliminar configuración' });
  }
});

export { router as configRoutes };

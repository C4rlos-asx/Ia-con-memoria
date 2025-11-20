import { Router } from 'express';
import { getPool } from '../config/database';

const router = Router();

// GET /api/conversations/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();

    const conversations = await pool.query(
      `SELECT id, title, created_at, updated_at 
       FROM conversations 
       WHERE user_id = $1 
       ORDER BY updated_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json({
      success: true,
      conversations: conversations.rows,
    });
  } catch (error: any) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
});

// DELETE /api/conversations/:conversationId
router.delete('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const pool = getPool();

    await pool.query(
      `DELETE FROM conversations WHERE id = $1`,
      [conversationId]
    );

    res.json({
      success: true,
      message: 'Conversación eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error al eliminar conversación:', error);
    res.status(500).json({ error: 'Error al eliminar conversación' });
  }
});

export { router as conversationRoutes };

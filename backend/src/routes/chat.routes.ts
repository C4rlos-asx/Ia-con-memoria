userId: z.string().min(1),
  conversationId: z.string().uuid().optional(),
    apiKey: z.string().optional(),
      modelName: z.string().optional(),
    );

res.json({
  success: true,
  response: result.response,
  conversationId: result.conversationId,
});
  } catch (error: any) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
  }
  console.error('Error en chat:', error);
  res.status(500).json({ error: error.message || 'Error al procesar mensaje' });
}
});

// GET /api/chat/history/:conversationId
router.get('/history/:conversationId', async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const pool = getPool();

    const messages = await pool.query(
      `SELECT id, role, content, created_at, metadata 
       FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    res.json({
      success: true,
      messages: messages.rows,
    });
  } catch (error: any) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

export { router as chatRoutes };

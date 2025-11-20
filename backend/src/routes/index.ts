import { Express } from 'express';
import { chatRoutes } from './chat.routes';
import { memoryRoutes } from './memory.routes';
import { configRoutes } from './config.routes';
import { conversationRoutes } from './conversation.routes';

export function setupRoutes(app: Express) {
  app.use('/api/chat', chatRoutes);
  app.use('/api/memory', memoryRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/conversations', conversationRoutes);
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, MessageSquare, Calendar } from 'lucide-react'
import { conversationsApi, chatApi, Conversation } from '@/lib/api'

interface ConversationsListProps {
  userId: string
}

export default function ConversationsList({ userId }: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadConversations()
  }, [userId])

  const loadConversations = async () => {
    try {
      const data = await conversationsApi.list(userId)
      setConversations(data || [])
    } catch (error) {
      console.error('Error al cargar conversaciones:', error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    setSelectedId(conversationId)
    setLoading(true)
    try {
      const data = await chatApi.getHistory(conversationId)
      setMessages(data || [])
    } catch (error) {
      console.error('Error al cargar mensajes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (conversationId: string) => {
    if (!confirm('¿Eliminar esta conversación?')) return

    try {
      await conversationsApi.delete(conversationId)
      if (selectedId === conversationId) {
        setSelectedId(null)
        setMessages([])
      }
      await loadConversations()
    } catch (error) {
      console.error('Error al eliminar conversación:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-6 h-[calc(100vh-12rem)]"
    >
      {/* Lista de conversaciones */}
      <div className="w-1/3 border-r border-aion-green/20 pr-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-aion-green" />
          Conversaciones
        </h2>

        {conversations.length === 0 ? (
          <div className="text-center text-aion-gray-light py-12">
            <p>No hay conversaciones guardadas</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => loadMessages(conv.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all group ${
                  selectedId === conv.id
                    ? 'bg-aion-green text-black'
                    : 'bg-aion-black hover:bg-aion-gray border aion-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 truncate">
                      {conv.title || 'Sin título'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Calendar className="w-3 h-3" />
                      {new Date(conv.updated_at).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(conv.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mensajes de la conversación seleccionada */}
      <div className="flex-1 overflow-y-auto">
        {selectedId ? (
          loading ? (
            <div className="text-center text-aion-gray-light py-12">Cargando...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-aion-gray-light py-12">
              <p>No hay mensajes en esta conversación</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Historial de Mensajes</h3>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-aion-green text-black ml-auto max-w-[80%]'
                      : 'bg-aion-gray aion-border max-w-[80%]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(msg.created_at).toLocaleString('es-ES')}
                  </p>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center text-aion-gray-light py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Selecciona una conversación para ver su historial</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

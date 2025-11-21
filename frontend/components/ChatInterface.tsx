'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'
import { chatApi, configApi, ChatMessage } from '@/lib/api'

interface ChatInterfaceProps {
  userId: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Fetch user config to get the selected model
      let modelName = undefined;
      try {
        const configs = await configApi.get(userId);
        const modelConfig = configs.find((c: any) => c.key === 'GEMINI_MODEL');
        if (modelConfig) {
          modelName = modelConfig.value;
        }
      } catch (err) {
        console.error('Error fetching config:', err);
      }

      const chatData: ChatMessage = {
        message: input,
        userId,
        conversationId: conversationId || undefined,
        modelName,
      }

      const response = await chatApi.sendMessage(chatData)

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      if (response.conversationId) {
        setConversationId(response.conversationId)
      }
    } catch (error: any) {
      console.error('Error al enviar mensaje') // Log genérico para seguridad
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.response?.data?.error || error.message || 'Error desconocido'}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-aion-gray-light py-12"
            >
              <p className="text-lg">Inicia una conversación con la IA</p>
              <p className="text-sm mt-2">La IA recordará el contexto de tus conversaciones</p>
            </motion.div>
          )}
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                  ? 'bg-aion-green text-black'
                  : 'bg-aion-gray aion-border text-white'
                  }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-aion-gray aion-border rounded-2xl p-4">
                <Loader2 className="w-5 h-5 animate-spin text-aion-green" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 bg-aion-gray border aion-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-aion-green focus:border-transparent"
          disabled={loading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-aion-green text-black font-semibold px-6 py-3 rounded-lg hover:bg-aion-green-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed aion-glow"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
}

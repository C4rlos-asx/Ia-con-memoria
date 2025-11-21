'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ChatInterface from '@/components/ChatInterface'
import MemoryPanel from '@/components/MemoryPanel'
import ConversationsList from '@/components/ConversationsList'
import ConfigPanel from '@/components/ConfigPanel'
import { MessageSquare, Brain, History, Settings } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'conversations' | 'config'>('chat')
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('userId')
      if (!id) {
        id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('userId', id)
      }
      return id
    }
    return 'default_user'
  })

  return (
    <div className="min-h-screen bg-aion-black text-white">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-aion-gray/80 backdrop-blur-md z-50 border-b border-aion-green/20"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Image
              src="/logo.png"
              alt="AION Media Developers"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">AION Media Developers</h1>
              <p className="text-aion-gray-light text-sm">IA con Memoria</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'chat'
                  ? 'bg-aion-green text-black font-semibold'
                  : 'bg-aion-gray text-white hover:bg-aion-gray/80'
                }`}
            >
              <MessageSquare className="w-5 h-5 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('conversations')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'conversations'
                  ? 'bg-aion-green text-black font-semibold'
                  : 'bg-aion-gray text-white hover:bg-aion-gray/80'
                }`}
            >
              <History className="w-5 h-5 inline mr-2" />
              Conversaciones
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'memory'
                  ? 'bg-aion-green text-black font-semibold'
                  : 'bg-aion-gray text-white hover:bg-aion-gray/80'
                }`}
            >
              <Brain className="w-5 h-5 inline mr-2" />
              Memoria
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'config'
                  ? 'bg-aion-green text-black font-semibold'
                  : 'bg-aion-gray text-white hover:bg-aion-gray/80'
                }`}
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Configuración
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-24 pb-8 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="aion-card p-6"
        >
          {activeTab === 'chat' && <ChatInterface userId={userId} />}
          {activeTab === 'memory' && <MemoryPanel userId={userId} />}
          {activeTab === 'conversations' && <ConversationsList userId={userId} />}
          {activeTab === 'config' && <ConfigPanel userId={userId} />}
        </motion.div>
      </main>
    </div>
  )
}

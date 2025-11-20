'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Brain } from 'lucide-react'
import { memoryApi, Memory } from '@/lib/api'

interface MemoryPanelProps {
  userId: string
}

export default function MemoryPanel({ userId }: MemoryPanelProps) {
  const [memories, setMemories] = useState<Memory[]>([])
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMemories()
  }, [userId])

  const loadMemories = async () => {
    try {
      const data = await memoryApi.get(userId)
      setMemories(data || [])
    } catch (error) {
      console.error('Error al cargar memorias:', error)
    }
  }

  const handleSave = async () => {
    if (!newKey.trim() || !newValue.trim()) return

    setLoading(true)
    try {
      await memoryApi.save(userId, newKey, newValue)
      setNewKey('')
      setNewValue('')
      setShowForm(false)
      await loadMemories()
    } catch (error) {
      console.error('Error al guardar memoria:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (key: string) => {
    if (!confirm('¿Eliminar esta memoria?')) return

    try {
      await memoryApi.delete(userId, key)
      await loadMemories()
    } catch (error) {
      console.error('Error al eliminar memoria:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-aion-green" />
          Memoria de la IA
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-aion-green text-black font-semibold px-4 py-2 rounded-lg hover:bg-aion-green-secondary transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Memoria
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-aion-black rounded-lg p-4 border aion-border"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-aion-gray-light">
                  Clave
                </label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Ej: preferencia_color"
                  className="w-full bg-aion-gray border aion-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-aion-green"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-aion-gray-light">
                  Valor
                </label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Información que la IA debe recordar"
                  rows={3}
                  className="w-full bg-aion-gray border aion-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-aion-green resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-aion-green text-black font-semibold py-2 rounded-lg hover:bg-aion-green-secondary transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setNewKey('')
                    setNewValue('')
                  }}
                  className="px-4 py-2 bg-aion-gray rounded-lg hover:bg-aion-gray/80 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {memories.length === 0 ? (
          <div className="text-center text-aion-gray-light py-12">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay memorias guardadas</p>
            <p className="text-sm mt-2">La IA puede recordar información importante para ti</p>
          </div>
        ) : (
          memories.map((memory, index) => (
            <motion.div
              key={memory.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-aion-black rounded-lg p-4 border aion-border flex items-start justify-between group"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-aion-green mb-2">{memory.key}</h3>
                <p className="text-sm text-aion-gray-light">{memory.value}</p>
              </div>
              <button
                onClick={() => handleDelete(memory.key)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Settings, Loader2 } from 'lucide-react'
import { configApi } from '@/lib/api'

interface ConfigPanelProps {
    userId: string
}

const GEMINI_MODELS = [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B' },
    { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)' },
]

export default function ConfigPanel({ userId }: ConfigPanelProps) {
    const [modelName, setModelName] = useState('gemini-1.5-pro')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        loadConfig()
    }, [userId])

    const loadConfig = async () => {
        try {
            const configs = await configApi.get(userId)
            const modelConfig = configs.find((c: any) => c.key === 'GEMINI_MODEL')

            if (modelConfig) setModelName(modelConfig.value)
        } catch (error) {
            console.error('Error al cargar configuración:', error)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        setMessage(null)

        try {
            await configApi.save(userId, 'GEMINI_MODEL', modelName)
            setMessage({ type: 'success', text: '✅ Configuración guardada correctamente' })
        } catch (error: any) {
            setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-aion-green" />
                <h2 className="text-2xl font-bold">Configuración de IA</h2>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-aion-gray-light">
                    Modelo de IA
                </label>
                <select
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full bg-aion-gray border aion-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-aion-green focus:border-transparent"
                >
                    {GEMINI_MODELS.map((model) => (
                        <option key={model.value} value={model.value}>
                            {model.label}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-aion-gray-light">
                    Selecciona el modelo de Gemini a utilizar. Si uno no funciona, prueba otro.
                </p>
            </div>

            {/* Save Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-aion-green text-black font-semibold px-6 py-3 rounded-lg hover:bg-aion-green-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed aion-glow flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        Guardar Configuración
                    </>
                )}
            </motion.button>

            {/* Message */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-aion-green/20 text-aion-green'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                >
                    {message.text}
                </motion.div>
            )}

            {/* Info */}
            <div className="bg-aion-gray/50 border aion-border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-aion-green">ℹ️ Información</h3>
                <ul className="text-sm text-aion-gray-light space-y-1 list-disc list-inside">
                    <li>La API Key está configurada en el servidor (Render)</li>
                    <li>Los modelos más recientes pueden tener mejor rendimiento</li>
                    <li>Si un modelo da error 404, prueba con otro de la lista</li>
                </ul>
            </div>
        </div>
    )
}

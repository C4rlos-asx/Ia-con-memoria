import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env en la raíz del backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

console.log('--- Test Gemini API ---');
console.log(`API Key present: ${!!apiKey}`);
console.log(`Model: ${modelName}`);

if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY no encontrada en .env');
    process.exit(1);
}

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey!);
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log('Sending message to Gemini...');
        const result = await model.generateContent('Hola, ¿estás funcionando?');
        const response = result.response;
        const text = response.text();

        console.log('✅ Success!');
        console.log('Response:', text);
    } catch (error: any) {
        console.error('❌ Error:', error);
        if (error.message) {
            console.error('Message:', error.message);
        }
    }
}

testGemini();

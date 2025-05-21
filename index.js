// tina-ai-api/index.js
const fs = require('fs').promises;
const fetch = global.fetch || require('node-fetch');
const axios = require('axios');

const TINA_API_BASE = 'http://108.181.199.60:3000/api/tina';

async function chat({ message, userId }) {
  if (!message || !userId) throw new Error('message e userId são obrigatórios');

  try {
    const response = await axios.post(`${TINA_API_BASE}/chat`, { message, userId });
    return response.data.answer;
  } catch (error) {
    console.error('Erro no chat:', error.response?.data || error.message);
    throw new Error('Erro ao obter resposta do chat');
  }
}

async function imageGen() {
  // Placeholder, pois está em desenvolvimento
  throw new Error('imageGen ainda está em desenvolvimento');
}

async function analyzeImage({ imageBase64, imageUrl, imagePath, path, prompt = "Descreva esta imagem" }) {
  try {
    if (imagePath && path) {
      const buffer = await fs.readFile(path);
      imageBase64 = buffer.toString('base64');
    }

    if (!imageBase64 && !imageUrl) {
      throw new Error('Você deve fornecer imageBase64 ou imageUrl ou imagePath com path');
    }

    let mimeType = "image/png";
    if (path) {
      if (path.endsWith('.jpg') || path.endsWith('.jpeg')) mimeType = "image/jpeg";
      else if (path.endsWith('.gif')) mimeType = "image/gif";
      else if (path.endsWith('.bmp')) mimeType = "image/bmp";
    }

    const body = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    if (imageBase64) {
      body.contents[0].parts.push({
        inline_data: {
          mime_type: mimeType,
          data: imageBase64
        }
      });
    } else if (imageUrl) {
      body.contents[0].parts.push({ image_url: imageUrl });
    }

    const response = await fetch(`${TINA_API_BASE}/image-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Erro na API Tina: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.resposta || data.answer || "Sem resposta da IA";
  } catch (error) {
    console.error("Erro no analyzeImage:", error);
    throw error;
  }
}

function createLib() {
  return { chat, imageGen, analyzeImage };
}

module.exports = { createLib };

/**
 * © 2025 Eliobros Tech. Todos os direitos reservados.
 * Proibida a cópia, modificação ou distribuição sem autorização.
 */


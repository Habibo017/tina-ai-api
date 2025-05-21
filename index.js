// tina-ai-api/index.js
const fs = require('fs').promises;
const fetch = global.fetch || require('node-fetch');
const axios = require('axios');

const TINA_API_BASE = 'http://108.181.199.60:3000/api/tina';

/**
 * Envia uma mensagem para a IA Tina e retorna a resposta.
 * @param {Object} params
 * @param {string} params.message - A mensagem a ser enviada para a IA.
 * @param {string} params.userId - Um identificador único do usuário.
 * @returns {Promise<string>} - Retorna a resposta da IA Tina.
 * @throws {Error} - Se ocorrer um erro ao enviar ou receber a resposta.
 */
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

/**
 * Geração de imagem ainda está em desenvolvimento.
 * @throws {Error} - Função ainda não implementada.
 */
async function imageGen() {
  throw new Error('imageGen ainda está em desenvolvimento');
}

/**
 * Analisa uma imagem com base em base64, URL ou caminho do arquivo e retorna uma descrição.
 * @param {Object} params
 * @param {string} [params.imageBase64] - Imagem em base64 (opcional).
 * @param {string} [params.imageUrl] - URL da imagem (opcional).
 * @param {string} [params.imagePath] - Caminho da imagem no disco (opcional).
 * @param {string} [params.path] - Caminho do arquivo da imagem, usado com imagePath (opcional).
 * @param {string} [params.prompt="Descreva esta imagem"] - Prompt a ser enviado para a IA.
 * @returns {Promise<string>} - Retorna a descrição gerada pela IA.
 * @throws {Error} - Se não for fornecida nenhuma imagem ou se ocorrer erro na API.
 */
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

/**
 * Cria uma instância da biblioteca Tina AI.
 * @returns {{ chat: typeof chat, imageGen: typeof imageGen, analyzeImage: typeof analyzeImage }}
 */
function createLib() {
  return { chat, imageGen, analyzeImage };
}

module.exports = { createLib };

/**
 * © 2025 Eliobros Tech. Todos os direitos reservados.
 * Proibida a cópia, modificação ou distribuição sem autorização.
 */


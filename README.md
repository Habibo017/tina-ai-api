# tina-ai-api

Biblioteca Node.js para comunicação simples com a API da Tina, uma assistente virtual baseada em IA.

---

## Instalação

```bash
npm install tina-ai-api


---

Uso

const { createLib } = require('tina-ai-api');
const tina = createLib();

// Usar chat
async function exemploChat() {
  const resposta = await tina.chat({ message: "Olá, Tina!", userId: "usuario123" });
  console.log(resposta);
}
exemploChat();

// Usar análise de imagem
async function exemploAnalyzeImage() {
  const resposta = await tina.analyzeImage({
    imagePath: true,
    path: "./imagens/hello.png",
    prompt: "Descreva esta imagem"
  });
  console.log(resposta);
}
exemploAnalyzeImage();


---

API

chat({ message, userId })

Envia uma mensagem para a Tina e recebe a resposta.

message (string): Texto da mensagem para a Tina.

userId (string): Identificador único do usuário.


Retorna: Promise<string> com a resposta da Tina.


---

analyzeImage({ imageBase64, imageUrl, imagePath, path, prompt })

Envia uma imagem para análise. Você deve fornecer ao menos um dos seguintes:

imageBase64 (string): Imagem em base64.

imageUrl (string): URL pública da imagem.

imagePath (boolean) e path (string): caminho local para arquivo de imagem.


prompt (string) é opcional e define a descrição que a IA deve gerar.

Retorna: Promise<string> com a descrição gerada.


---

imageGen()

Funcionalidade em desenvolvimento. Atualmente gera erro se usada.


---

Sobre as Chaves de API

Esta biblioteca não exige que você informe nenhuma chave de API (API Key) ao usá-la.
Todas as autenticações e chaves necessárias já estão protegidas e configuradas no backend da API pública da Tina, que você acessa via URL.

Isso significa que você só precisa chamar os métodos fornecidos (chat, analyzeImage, etc.) passando os parâmetros necessários, sem se preocupar com tokens ou segredos.


---

Vantagens

Facilidade de uso: Sem necessidade de configurar chaves no seu código.

Segurança: As chaves ficam protegidas no servidor, não expostas no cliente.

Pronto para usar: Basta instalar a biblioteca e começar a conversar com a Tina.



---

Licença

MIT License - Copyright (c) Eliobros Tech 2025
Veja o arquivo LICENSE para detalhes.


---

Contato

Se tiver dúvidas, envie um e-mail para suporteeliobrostech@gmail.com

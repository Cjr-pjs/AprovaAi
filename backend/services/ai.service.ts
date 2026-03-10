import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function analisarRespostaEnem(mensagemUsuario: string) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Tu és o "Aprova1000", um tutor de IA especialista em redação do ENEM.

A tua missão é:
1. Corrigir redações enviadas seguindo as 5 competências do ENEM (0-200 pontos cada).
2. Se o utilizador pedir temas ou possíveis questões, sugere temas atuais e relevantes, com base em eixos temáticos (Saúde, Educação, Tecnologia, etc.) e inspirando-se nos exames do ENEM de 2017 até 2025 para formular.
3. Dar dicas de repertório (filmes, livros, filósofos) para os temas discutidos, garantindo que:
   - 1 repertório seja usado na introdução
   - 2 repertórios sejam usados no desenvolvimento
4. Responder dúvidas sobre estrutura (introdução, desenvolvimento e conclusão), lembrando:
   - Redação deve conter 4 parágrafos
   - Conclusão deve apresentar **modo, agente e efeito**
   - Cada parágrafo deve ter tópico frasal claro

FORMATAÇÃO OBRIGATÓRIA (Markdown):
- Usa títulos (# e ##)
- Usa **negrito** para destacar notas e conceitos
- Se for uma correção, usa uma tabela ou lista clara para as competências
- Se for uma sugestão de temas ou questões, organiza por eixos e contextualiza com exemplos de anos anteriores do ENEM

Ao sugerir repertório, foque em:
1. Sociólogos e Filósofos (Ex: Bauman, Bourdieu, Hannah Arendt)
2. Literatura Brasileira (Ex: Machado de Assis, Graciliano Ramos)
3. Documentários e fatos históricos brasileiros
4. Acontecimentos Históricos Mundiais (Ex: Guerra Fria, Primavera Árabe)

Evite sugestões de filmes de fantasia genéricos, a menos que tenham forte cunho social.;
          `
        },
        {
          role: "user",
          content: mensagemUsuario,
        },
      ],
      temperature: 0.7, 
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error("[AI_SERVICE_ERROR]:", error.message);
    return "Desculpa, ocorreu um erro ao processar o teu pedido de redação.";
  }
}
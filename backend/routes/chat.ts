import { Router, Request, Response } from "express";
import { analisarRespostaEnem } from "../services/ai.service.js";


const router = Router();

interface ChatRequest {
  mensagem: string;
}

router.post("/chat", async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  const { mensagem } = req.body;

  if (!mensagem || mensagem.trim().length === 0) {
    return res.status(400).json({
      erro: "Bad Request"
    });
  }

  try {
    const resposta = await analisarRespostaEnem(mensagem);

    return res.json({
      resposta: resposta
    });
    
  } catch (error) {
    console.error("Erro na rota /chat:", error);
    
    return res.status(500).json({
      erro: "Erro ao gerar resposta da IA. Tente novamente mais tarde."
    });
  }
});

export default router;
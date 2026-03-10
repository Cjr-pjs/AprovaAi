import dotenv from "dotenv";
import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import Tesseract from "tesseract.js";
import { analisarRespostaEnem } from "./services/ai.service.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

app.use("/api", chatRoutes);

app.post("/corrigir-redacao", upload.single("image"), async (req: any, res: any) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    try {
        console.log(` Imagem recebida: ${file.path}. Iniciando OCR...`);

        const result = await Tesseract.recognize(file.path, "por");
        const textoExtraido = result.data.text;

        if (!textoExtraido || textoExtraido.trim().length < 5) {
            throw new Error("O texto extraído está vazio ou é ilegível.");
        }

        const promptCompleto = `
        Esta é uma redação extraída por OCR. Por favor, analise e corrija seguindo os critérios do ENEM.
        
        Texto extraído:
        ${textoExtraido}
        `;

        const feedbackIA = await analisarRespostaEnem(promptCompleto);

        fs.unlink(file.path, (err) => {
            if (err) console.error("Erro ao deletar arquivo temporário:", err);
        });

        return res.json({
            textoOriginal: textoExtraido,
            feedback: feedbackIA
        });

    } catch (error: any) {
        console.error("❌ Erro no processamento:", error.message);

        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return res.status(500).json({
            error: "Erro ao processar a redação.",
            detalhes: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Servidor rodando em http://localhost:${PORT}`);
});
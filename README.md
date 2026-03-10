# 🎓 Aprova1000 - Tutor Especialista em ENEM

O **Aprova1000** é uma plataforma inteligente projetada para transformar a preparação de estudantes para o ENEM. Diferente de IAs genéricas, este sistema foi calibrado especificamente para as diretrizes do INEP, oferecendo correções técnicas e sugestões de repertório baseadas em eixos temáticos reais.

---

## 📺 Demonstração em Vídeo





https://github.com/user-attachments/assets/20383f24-9e0f-4c31-a432-be61b18b6f6c



---

## 🎯 O Diferencial do Aprova1000

Muitas IAs respondem dúvidas gerais, mas o **Aprova1000** foi construído com foco em **responsividade técnica para o ENEM**:

* **Análise por Competências:** Diferente de um feedback comum, a IA analisa sua redação com base nas 5 competências oficiais (0 a 200 pontos cada).
* **Foco em Assuntos Recorrentes:** O motor da IA prioriza temas e eixos temáticos que apareceram constantemente nas provas de 2017 a 2025.
* **Repertório Sociocultural:** Sugestões automáticas de filósofos, sociólogos e literatura brasileira para fortalecer a argumentação.
* **OCR Integrado:** Permite o envio de fotos de redações manuscritas, facilitando o estudo de quem prefere treinar no papel.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Modern Dark Theme), JavaScript (Vanilla).
* **Backend:** Node.js, TypeScript, Express.
* **IA:** Llama 3.3 70B via Groq Cloud.
* **Visão Computacional:** Tesseract.js (OCR para leitura de imagens).
* **Banco de Dados:** IndexedDB (Persistência local de chats).

---

## 🚀 Como usar o Aprova1000

Siga o passo a passo abaixo para rodar ou utilizar a aplicação:

### 1. Inicie um novo chat
No menu lateral esquerdo, clique em **"Novo Chat"** para abrir uma sala de conversa limpa.

### 2. Escolha o método de entrada
* **Texto:** Digite sua dúvida ou cole sua redação diretamente no campo de texto.
* **Imagem:** Clique no ícone de upload (ícone de seta/nuvem) para enviar uma foto da sua redação escrita à mão.

### 3. Receba o Feedback Técnico
Aguarde alguns segundos enquanto a IA processa o texto. Você receberá uma tabela com as notas por competência e sugestões de melhoria.

### 4. Consulte o Histórico
Suas conversas ficam salvas automaticamente no navegador. Você pode alternar entre elas ou excluir as que não precisa mais usando o ícone de ❌ na barra lateral.

---

## ⚙️ Instalação Local 

1. Clone o repositório:
 ```bash
   git clone [https://github.com/Cjr-pjs/AprovaAi.git](https://github.com/Cjr-pjs/AprovaAi.git)
   ```
2. Instale as dependências, configure a chave e inicie o servidor:

```bash
# Instale as dependências
npm install 
```
3.  Configure sua chave da Groq no arquivo .env
```bash
 echo "GROQ_API_KEY=sua_chave_aqui" > .env
```


```bash
4. # Inicie o servidor
npm start 

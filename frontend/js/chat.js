const chatArea = document.getElementById("chatArea");
const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");
const listaChats = document.getElementById("listaChats");
const welcome = document.getElementById("welcome");
const imageInput = document.getElementById("imageInput");
const newChat = document.getElementById("newChat");

let chats = {};
let currentChat = null;
let chatCounter = 1;
let db;

const request = indexedDB.open("chatDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("chats")) {
        db.createObjectStore("chats", { keyPath: "id" });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    carregarChatsDoBanco();
};

request.onerror = function () {
    console.error("Erro ao abrir IndexedDB");
};


function salvarChats() {
    if (!db) return;
    const transaction = db.transaction(["chats"], "readwrite");
    const store = transaction.objectStore("chats");

    Object.keys(chats).forEach(chatId => {
        store.put({
            id: chatId,
            mensagens: chats[chatId]
        });
    });
}


function carregarChatsDoBanco() {
    const transaction = db.transaction(["chats"], "readonly");
    const store = transaction.objectStore("chats");
    const request = store.getAll();

    request.onsuccess = function () {
        const result = request.result;
        result.forEach(chat => {
            chats[chat.id] = chat.mensagens;
        });

        const ids = Object.keys(chats).map(id =>
            parseInt(id.replace("chat", ""))
        );

        if (ids.length > 0) {
            chatCounter = Math.max(...ids) + 1;
        }
        carregarListaChats();
    };
}


function renderizarMensagem(conteudo, classe, tipo = "text") {
    if (welcome) welcome.style.display = "none";

    const msg = document.createElement("div");
    msg.classList.add(classe);

    if (tipo === "image") {
        const img = document.createElement("img");
        img.src = conteudo;
        img.classList.add("user-image");
        msg.appendChild(img);
    } else {
        if (typeof marked !== 'undefined') {
            msg.innerHTML = conteudo ? marked.parse(conteudo) : "";
        } else {
            msg.textContent = conteudo;
        }
    }

    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
}


function deletarChat(chatId) {
    const transaction = db.transaction(["chats"], "readwrite");
    const store = transaction.objectStore("chats");
    store.delete(chatId);

    delete chats[chatId];

    if (currentChat === chatId) {
        chatArea.innerHTML = "";
        currentChat = null;
        if (welcome) welcome.style.display = "block";
    }
    carregarListaChats();
}


function carregarListaChats() {
    listaChats.innerHTML = "";
    Object.keys(chats).forEach((chatId, index) => {
        const chatItem = document.createElement("div");
        chatItem.classList.add("chat-item");

        const titulo = document.createElement("span");
        titulo.textContent = "Conversa " + (index + 1);
        titulo.onclick = () => carregarChat(chatId);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-chat");
        deleteBtn.onclick = (event) => {
            event.stopPropagation();
            deletarChat(chatId);
        };

        chatItem.appendChild(titulo);
        chatItem.appendChild(deleteBtn);
        listaChats.appendChild(chatItem);
    });
}


function carregarChat(chatId) {
    currentChat = chatId;
    chatArea.innerHTML = "";

    if (chats[chatId] && chats[chatId].length > 0) {
        if (welcome) welcome.style.display = "none";
        chats[chatId].forEach(msg => {
            const classe = msg.role === "user" ? "user-message" : "ai-message";
            renderizarMensagem(msg.content, classe, msg.type || "text");
        });
    } else {
        
        if (welcome) welcome.style.display = "block";
    }
}


function criarNovoChat() {
    const chatId = `chat_${crypto.randomUUID().split('-')[0]}`;
    chats[chatId] = [];
    salvarChats();
    carregarListaChats();
    currentChat = chatId;
    chatArea.innerHTML = "";
  
    if (welcome) welcome.style.display = "block";
    return chatId;
}

async function enviarMensagem() {
    const texto = chatInput.value.trim();
    if (texto === "") return;

    if (!currentChat) {
        criarNovoChat();
    }

    chats[currentChat].push({
        role: "user",
        type: "text",
        content: texto
    });

    renderizarMensagem(texto, "user-message");
    chatInput.value = "";
    salvarChats();

    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("ai-message");
    loadingMsg.textContent = "Analisando...";
    chatArea.appendChild(loadingMsg);

    try {
        const respostaIA = await responderIA(texto);
        loadingMsg.remove();

        chats[currentChat].push({
            role: "ai",
            type: "text",
            content: respostaIA
        });

        renderizarMensagem(respostaIA, "ai-message");
        salvarChats();
    } catch (error) {
        if (loadingMsg) loadingMsg.remove();
        renderizarMensagem("Erro ao conectar com o servidor.", "ai-message");
    }
}


async function responderIA(texto) {
    const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto })
    });
    const data = await response.json();
    return data.resposta;
}


sendButton.onclick = (e) => {
    e.preventDefault();
    enviarMensagem();
};

chatInput.onkeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
};


imageInput.addEventListener("change", async (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) return;

    if (!currentChat) {
        criarNovoChat();
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const base64 = event.target.result;

        chats[currentChat].push({
            role: "user",
            type: "image",
            content: base64
        });

        renderizarMensagem(base64, "user-message", "image");
        salvarChats();

        const loadingMsg = document.createElement("div");
        loadingMsg.classList.add("ai-message");
        loadingMsg.innerHTML = "<em>Lendo imagem e gerando feedback... 📝</em>";
        chatArea.appendChild(loadingMsg);
        chatArea.scrollTop = chatArea.scrollHeight;

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("http://localhost:3000/corrigir-redacao", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            loadingMsg.remove();

            if (data.feedback) {
                chats[currentChat].push({
                    role: "ai",
                    type: "text",
                    content: data.feedback
                });
                renderizarMensagem(data.feedback, "ai-message");
                salvarChats();
            }
        } catch (error) {
            if (loadingMsg) loadingMsg.remove();
            console.error(error);
        }
    };
    reader.readAsDataURL(file);
    imageInput.value = "";
});

newChat.onclick = criarNovoChat;
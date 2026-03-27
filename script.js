const API_KEY = "AIzaSyDbBRJgky64sdoI-U3YrF-e_IcbX3y5rdo"; 
let chatHistory = []; 

async function sendMessage() {
    const input = document.getElementById('user-input');
    const messageText = input.value.trim();
    if (messageText === "") return;

    addMessage(messageText, 'sent');
    input.value = "";

    chatHistory.push({ role: "user", parts: [{ text: messageText }] });

    try {
        // Usando la versión estable v1 para que no falle
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: chatHistory,
                systemInstruction: {
                    parts: [{ text: "Tu nombre es Alenzi. Eres una IA creada por Erick. Hablas de forma natural, eres inteligente y aprendes rápido de lo que te cuentan. Eres experta en temas de la Semana 76." }]
                }
            })
        });

        const data = await response.json();
        
        // Si hay un error en la respuesta de Google, esto lo atrapa
        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
        addMessage(aiResponse, 'received');

    } catch (error) {
        addMessage("¡Ups! Alenzi se desconectó un momento. Revisa tu internet o la API Key.", 'received');
        console.error("Error detallado:", error);
    }
}

function addMessage(text, type) {
    const container = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.innerText = text;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

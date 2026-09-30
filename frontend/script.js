const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = themeToggleBtn.querySelector('i');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');

function addMessage(text, sender = 'user') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.textContent = text;
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') {
        return;
    }

    addMessage(text, 'user');

    // 1. ALTERADO: enviamos 'mensagem' para corresponder ao Pydantic (ChatMessage) do FastAPI
    const payload = {
        mensagem: text
    };

    fetch('http://localhost:800/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // 2. ALTERADO: o backend retorna a resposta da IA na propriedade 'resposta'
        const responseMessage = data?.resposta || 'Não foi possível obter a resposta do Jarvis.';
        addMessage(responseMessage, 'bot');
        console.log('Resposta do backend:', data);
    })
    .catch(error => {
        console.error('Erro ao enviar mensagem:', error);
        addMessage('Não foi possível conectar ao servidor.', 'bot');
    })
    .finally(() => {
        userInput.value = '';
        userInput.focus();
    });
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
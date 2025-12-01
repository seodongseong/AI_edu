// 고양이 상담 챗봇
const CatChatbot = {
    isOpen: false,
    messageHistory: [],
    apiKey: '-',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    
    initializeChatbot() {
        const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
        const chatbotModal = document.getElementById('chatbotModal');
        const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
        const chatbotSendBtn = document.getElementById('chatbotSendBtn');
        const chatbotInput = document.getElementById('chatbotInput');
        
        if (chatbotToggleBtn) {
            chatbotToggleBtn.addEventListener('click', () => {
                this.toggleChatbot();
            });
        }
        
        if (chatbotCloseBtn) {
            chatbotCloseBtn.addEventListener('click', () => {
                this.closeChatbot();
            });
        }
        
        if (chatbotSendBtn) {
            chatbotSendBtn.addEventListener('click', () => {
                this.handleSendMessage();
            });
        }
        
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSendMessage();
                }
            });
        }
    },
    
    toggleChatbot() {
        this.isOpen = !this.isOpen;
        const chatbotModal = document.getElementById('chatbotModal');
        if (chatbotModal) {
            if (this.isOpen) {
                chatbotModal.classList.add('active');
            } else {
                chatbotModal.classList.remove('active');
            }
        }
    },
    
    closeChatbot() {
        this.isOpen = false;
        const chatbotModal = document.getElementById('chatbotModal');
        if (chatbotModal) {
            chatbotModal.classList.remove('active');
        }
    },
    
    async handleSendMessage() {
        const chatbotInput = document.getElementById('chatbotInput');
        const chatbotSendBtn = document.getElementById('chatbotSendBtn');
        
        if (!chatbotInput) return;
        
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // 입력 비활성화
        chatbotInput.disabled = true;
        if (chatbotSendBtn) chatbotSendBtn.disabled = true;
        
        this.addUserMessage(message);
        chatbotInput.value = '';
        
        // 로딩 메시지 표시
        const loadingMessageId = this.addLoadingMessage();
        
        try {
            await this.generateBotResponse(message);
        } catch (error) {
            console.error('챗봇 오류:', error);
            this.removeLoadingMessage(loadingMessageId);
            this.addBotMessage('죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 😿');
        } finally {
            // 입력 활성화
            chatbotInput.disabled = false;
            if (chatbotSendBtn) chatbotSendBtn.disabled = false;
            chatbotInput.focus();
        }
    },
    
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message user-message';
        messageElement.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">${this.escapeHtml(message)}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messageHistory.push({ type: 'user', content: message });
    },
    
    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot-message';
        messageElement.innerHTML = `
            <div class="message-avatar">🐾</div>
            <div class="message-content">${this.formatMessage(message)}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messageHistory.push({ type: 'bot', content: message });
    },
    
    addLoadingMessage() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return null;
        
        const loadingId = 'loading-' + Date.now();
        const messageElement = document.createElement('div');
        messageElement.id = loadingId;
        messageElement.className = 'chatbot-message bot-message';
        messageElement.innerHTML = `
            <div class="message-avatar">🐾</div>
            <div class="message-content">
                <span class="typing-indicator">
                    <span></span><span></span><span></span>
                </span>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return loadingId;
    },
    
    removeLoadingMessage(loadingId) {
        if (!loadingId) return;
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.remove();
        }
    },
    
    async generateBotResponse(userMessage) {
        try {
            // 대화 히스토리 구성
            const conversationHistory = this.messageHistory
                .slice(-10) // 최근 10개 메시지만 사용
                .map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }));
            
            // 시스템 프롬프트 추가
            const systemMessage = {
                role: 'system',
                content: '당신은 고양이 키우기 전문 상담 챗봇입니다. 사용자들이 고양이를 키우는 데 도움이 되는 친절하고 전문적인 조언을 제공합니다. 답변은 한국어로 작성하고, 이모지를 적절히 사용하여 친근하게 대화합니다. 고양이의 건강, 먹이, 행동, 케어 등 다양한 주제에 대해 도움을 줄 수 있습니다.'
            };
            
            // API 요청 (CORS 우회를 위해 프록시 사용 고려)
            // 직접 호출이 안 될 경우 CORS 프록시 사용 가능
            const proxyUrl = ''; // 필요시 CORS 프록시 URL 추가
            
            const apiRequestUrl = proxyUrl ? `${proxyUrl}${this.apiUrl}` : this.apiUrl;
            
            const response = await fetch(apiRequestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [systemMessage, ...conversationHistory, {
                        role: 'user',
                        content: userMessage
                    }],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API 오류: ${response.status}`);
            }
            
            const data = await response.json();
            const botResponse = data.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.';
            
            // 로딩 메시지 제거
            const loadingMessages = document.querySelectorAll('.chatbot-message .typing-indicator').length;
            if (loadingMessages > 0) {
                const messagesContainer = document.getElementById('chatbotMessages');
                const lastMessage = messagesContainer?.lastElementChild;
                if (lastMessage && lastMessage.querySelector('.typing-indicator')) {
                    lastMessage.remove();
                }
            }
            
            this.addBotMessage(botResponse);
        } catch (error) {
            console.error('OpenAI API 오류:', error);
            
            // 로딩 메시지 제거
            const messagesContainer = document.getElementById('chatbotMessages');
            const lastMessage = messagesContainer?.lastElementChild;
            if (lastMessage && lastMessage.querySelector('.typing-indicator')) {
                lastMessage.remove();
            }
            
            // 폴백 응답
            this.addBotMessage('죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 😿\n\n고양이에 대해 궁금한 점이 있으시면 구체적으로 질문해주세요!');
        }
    },
    
    formatMessage(text) {
        // 마크다운 형식의 텍스트를 HTML로 변환
        let formatted = this.escapeHtml(text);
        
        // 줄바꿈 처리
        formatted = formatted.replace(/\n/g, '<br>');
        
        // 이모지 유지 (이미 이스케이프되어 있으므로 그대로 사용)
        
        return formatted;
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 챗봇 초기화
document.addEventListener('DOMContentLoaded', () => {
    CatChatbot.initializeChatbot();
});


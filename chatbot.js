// DS Studio 챗봇 관리 클래스
class ChatbotManager {
    constructor() {
        this.isOpen = false;
        this.messageHistory = [];
        this.apiKey = null;
        this.apiKeyStorageKey = 'ds_studio_gemini_api_key';
        this.init();
    }

    init() {
        // 저장된 API 키 불러오기
        this.loadApiKey();
        
        // DOM 요소 가져오기
        this.toggleBtn = document.getElementById('chatbotToggleBtn');
        this.modal = document.getElementById('chatbotModal');
        this.closeBtn = document.getElementById('chatbotCloseBtn');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.inputField = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSendBtn');

        // 이벤트 리스너 설정
        this.setupEventListeners();
    }

    loadApiKey() {
        const savedKey = localStorage.getItem(this.apiKeyStorageKey);
        if (savedKey) {
            this.apiKey = savedKey;
        }
    }

    saveApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem(this.apiKeyStorageKey, apiKey);
    }

    setupEventListeners() {
        // 챗봇 열기/닫기
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.openChatbot();
            });
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeChatbot();
            });
        }

        // 모달 배경 클릭 시 닫기
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeChatbot();
                }
            });
        }

        // 메시지 전송
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (this.inputField) {
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChatbot();
            }
        });
    }

    openChatbot() {
        if (!this.apiKey) {
            this.promptApiKey();
            return;
        }

        this.isOpen = true;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.inputField.focus();
    }

    closeChatbot() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    promptApiKey() {
        const apiKey = prompt('Google Gemini API 키를 입력해주세요.\n\nAPI 키는 Google AI Studio에서 발급받을 수 있습니다:\nhttps://makersuite.google.com/app/apikey');
        
        if (apiKey && apiKey.trim()) {
            this.saveApiKey(apiKey.trim());
            this.openChatbot();
        }
    }

    async sendMessage() {
        const userMessage = this.inputField.value.trim();
        
        if (!userMessage) {
            return;
        }

        // API 키 확인
        if (!this.apiKey) {
            this.promptApiKey();
            return;
        }

        // 사용자 메시지 추가
        this.addMessage('user', userMessage);
        this.inputField.value = '';
        this.inputField.disabled = true;
        this.sendBtn.disabled = true;

        // 로딩 메시지 표시
        const loadingId = this.addMessage('bot', '답변을 생성하는 중...', true);

        try {
            // Google Gemini API 호출
            const botResponse = await this.callGeminiAPI(userMessage);
            
            // 로딩 메시지 제거
            this.removeMessage(loadingId);
            
            // 봇 응답 추가
            this.addMessage('bot', botResponse);
        } catch (error) {
            console.error('챗봇 오류:', error);
            
            // 로딩 메시지 제거
            this.removeMessage(loadingId);
            
            // 에러 메시지 표시
            let errorMessage = '죄송합니다. 오류가 발생했습니다.';
            
            if (error.message.includes('API_KEY')) {
                errorMessage = 'API 키가 유효하지 않습니다. API 키를 다시 확인해주세요.';
                localStorage.removeItem(this.apiKeyStorageKey);
                this.apiKey = null;
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage = 'API 키 인증에 실패했습니다. API 키를 확인해주세요.';
            } else if (error.message.includes('429')) {
                errorMessage = 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            }
            
            this.addMessage('bot', errorMessage);
        } finally {
            this.inputField.disabled = false;
            this.sendBtn.disabled = false;
            this.inputField.focus();
        }
    }

    async callGeminiAPI(userMessage) {
        // 대화 히스토리 구성 (최근 10개 메시지)
        const conversationHistory = this.messageHistory
            .slice(-10)
            .map(msg => ({
                role: msg.type === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

        // 시스템 프롬프트
        const systemPrompt = `당신은 DS Studio의 챗봇입니다. DS Studio는 모듈형 디지털 서비스 플랫폼을 개발하는 테크 컴퍼니입니다. 
다양한 웹 서비스를 유연하게 실험·개발해볼 수 있는 기술 중심 회사입니다.
사용자에게 친절하고 전문적으로 답변해주세요. 답변은 한국어로 작성하고, 이모지를 적절히 사용하여 친근하게 대화합니다.`;

        // API 요청
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\n사용자: ${userMessage}` }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        // 대화 히스토리가 있으면 추가
        if (conversationHistory.length > 0) {
            requestBody.contents = [
                ...conversationHistory,
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ];
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('API 응답 형식이 올바르지 않습니다.');
        }

        return data.candidates[0].content.parts[0].text;
    }

    addMessage(type, content, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}-message`;
        
        if (isLoading) {
            messageDiv.id = `loading-message-${Date.now()}`;
            messageDiv.classList.add('loading');
        }

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'user' ? '👤' : '🤖';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isLoading) {
            messageContent.innerHTML = '<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
        } else {
            messageContent.textContent = content;
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        this.messagesContainer.appendChild(messageDiv);

        // 스크롤을 맨 아래로
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // 메시지 히스토리에 추가
        if (!isLoading) {
            this.messageHistory.push({
                type: type,
                content: content,
                timestamp: new Date().toISOString()
            });
        }

        return messageDiv.id;
    }

    removeMessage(messageId) {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            messageElement.remove();
        }
    }
}

// 페이지 로드 시 챗봇 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotManager = new ChatbotManager();
});


// DS Studio 챗봇 관리 클래스
class ChatbotManager {
    constructor() {
        this.isOpen = false;
        this.messageHistory = [];
        this.apiKey = '';
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
        this.apiKeyInput = document.getElementById('chatbotApiKeyInput');
        this.apiKeySaveBtn = document.getElementById('chatbotApiKeySaveBtn');
        this.apiKeyStatus = document.getElementById('chatbotApiKeyStatus');
        this.clearBtn = document.getElementById('chatbotClearBtn');

        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // API 키 상태 업데이트
        this.updateApiKeyStatus();
    }

    loadApiKey() {
        const savedKey = localStorage.getItem(this.apiKeyStorageKey);
        if (savedKey && savedKey.trim()) {
            this.apiKey = savedKey.trim();
        } else {
            this.apiKey = '';
        }
    }

    saveApiKey(apiKey) {
        this.apiKey = apiKey.trim();
        if (this.apiKey) {
            localStorage.setItem(this.apiKeyStorageKey, this.apiKey);
        } else {
            localStorage.removeItem(this.apiKeyStorageKey);
        }
        this.updateApiKeyStatus();
    }

    updateApiKeyStatus() {
        if (this.apiKeyStatus) {
            if (this.apiKey) {
                this.apiKeyStatus.textContent = '✓ API 키가 설정되었습니다';
                this.apiKeyStatus.className = 'api-key-status active';
            } else {
                this.apiKeyStatus.textContent = '⚠ API 키를 입력해주세요';
                this.apiKeyStatus.className = 'api-key-status inactive';
            }
        }
        if (this.apiKeyInput) {
            this.apiKeyInput.value = this.apiKey ? '•'.repeat(20) : '';
        }
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

        // API 키 저장 버튼
        if (this.apiKeySaveBtn) {
            this.apiKeySaveBtn.addEventListener('click', () => {
                this.saveApiKeyFromInput();
            });
        }

        if (this.apiKeyInput) {
            this.apiKeyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.saveApiKeyFromInput();
                }
            });
            
            // 포커스 시 실제 값 표시
            this.apiKeyInput.addEventListener('focus', () => {
                if (this.apiKey) {
                    this.apiKeyInput.value = this.apiKey;
                }
            });
            
            // 포커스 아웃 시 마스킹
            this.apiKeyInput.addEventListener('blur', () => {
                if (this.apiKey) {
                    this.apiKeyInput.value = '•'.repeat(20);
                }
            });
        }

        // 대화 기록 삭제 버튼
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => {
                if (confirm('대화 기록을 모두 삭제하시겠습니까?')) {
                    this.clearHistory();
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

    saveApiKeyFromInput() {
        const inputValue = this.apiKeyInput.value.trim();
        if (inputValue) {
            this.saveApiKey(inputValue);
            this.apiKeyInput.value = '•'.repeat(20);
            this.showNotification('API 키가 저장되었습니다.', 'success');
        } else {
            this.showNotification('API 키를 입력해주세요.', 'error');
        }
    }

    openChatbot() {
        this.isOpen = true;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // API 키가 없으면 입력 필드에 포커스, 있으면 메시지 입력 필드에 포커스
        if (!this.apiKey) {
            if (this.apiKeyInput) {
                setTimeout(() => this.apiKeyInput.focus(), 100);
            }
        } else {
            if (this.inputField) {
                setTimeout(() => this.inputField.focus(), 100);
            }
        }
    }

    closeChatbot() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `chatbot-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async sendMessage() {
        const userMessage = this.inputField.value.trim();
        
        if (!userMessage) {
            return;
        }

        // API 키 확인
        if (!this.apiKey) {
            this.showNotification('먼저 API 키를 설정해주세요.', 'error');
            if (this.apiKeyInput) {
                this.apiKeyInput.focus();
            }
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
            
            if (error.message.includes('API_KEY_ERROR') || error.message.includes('401') || error.message.includes('403')) {
                errorMessage = 'API 키 인증에 실패했습니다. API 키를 확인해주세요.';
                this.showNotification('API 키를 다시 확인해주세요.', 'error');
            } else if (error.message.includes('429')) {
                errorMessage = 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
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

        // API 요청 URL
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
        
        // 요청 본문 구성
        const requestBody = {
            contents: [],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        // 첫 메시지인 경우 시스템 프롬프트 포함
        if (conversationHistory.length === 0) {
            requestBody.contents.push({
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n사용자: ${userMessage}` }]
            });
        } else {
            // 대화 히스토리와 함께 전송
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
            const errorMessage = errorData.error?.message || `API 요청 실패: ${response.status}`;
            
            // API 키 관련 오류 처리
            if (response.status === 400 || response.status === 401 || response.status === 403) {
                throw new Error(`API_KEY_ERROR: ${errorMessage}`);
            }
            
            throw new Error(errorMessage);
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

        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isLoading) {
            messageContent.innerHTML = '<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
        } else {
            // 줄바꿈 처리
            messageContent.innerHTML = content.replace(/\n/g, '<br>');
        }

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        const now = new Date();
        messageTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        messageWrapper.appendChild(messageContent);
        messageWrapper.appendChild(messageTime);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageWrapper);
        this.messagesContainer.appendChild(messageDiv);

        // 스크롤을 맨 아래로
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);

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

    clearHistory() {
        this.messageHistory = [];
        const messages = this.messagesContainer.querySelectorAll('.chatbot-message:not(.bot-message:first-child)');
        messages.forEach(msg => msg.remove());
        this.showNotification('대화 기록이 삭제되었습니다.', 'success');
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


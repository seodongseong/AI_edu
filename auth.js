// 사용자 인증 관리 클래스
class AuthManager {
    constructor() {
        this.storageKey = 'ds_studio_users';
        this.currentUserKey = 'ds_studio_current_user';
        this.init();
    }

    init() {
        // 사용자 데이터가 없으면 초기화
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // 사용자 등록
    register(userData) {
        const users = this.getUsers();
        
        // 이메일 중복 확인
        if (users.find(user => user.email === userData.email)) {
            throw new Error('이미 등록된 이메일입니다.');
        }

        // 비밀번호 확인
        if (userData.password !== userData.confirmPassword) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        // 비밀번호 길이 확인
        if (userData.password.length < 6) {
            throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
        }

        // 새 사용자 생성
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: this.hashPassword(userData.password), // 실제로는 해시화해야 함
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(this.storageKey, JSON.stringify(users));

        return newUser;
    }

    // 로그인
    login(email, password) {
        const users = this.getUsers();
        const hashedPassword = this.hashPassword(password);
        
        const user = users.find(
            u => u.email === email && u.password === hashedPassword
        );

        if (!user) {
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        // 로그인 성공 - 현재 사용자 저장 (비밀번호 제외)
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));

        return userWithoutPassword;
    }

    // 로그아웃
    logout() {
        localStorage.removeItem(this.currentUserKey);
    }

    // 현재 로그인한 사용자 가져오기
    getCurrentUser() {
        const userStr = localStorage.getItem(this.currentUserKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    // 로그인 상태 확인
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    // 모든 사용자 가져오기
    getUsers() {
        const usersStr = localStorage.getItem(this.storageKey);
        return usersStr ? JSON.parse(usersStr) : [];
    }

    // 비밀번호 해시 (간단한 해시 함수 - 실제로는 bcrypt 등 사용 권장)
    hashPassword(password) {
        // 간단한 해시 함수 (실제 프로덕션에서는 더 강력한 해시 사용)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }
}

// 전역 인증 관리자 인스턴스
const authManager = new AuthManager();

// 회원가입 폼 처리
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        // 에러 메시지 숨기기
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };

        try {
            // 유효성 검사
            if (!formData.name || !formData.email || !formData.password) {
                throw new Error('모든 필드를 입력해주세요.');
            }

            // 이메일 형식 검사
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('올바른 이메일 형식을 입력해주세요.');
            }

            // 회원가입 처리
            authManager.register(formData);
            
            // 성공 메시지 표시
            successMessage.textContent = '회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.';
            successMessage.classList.add('show');
            
            // 2초 후 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.add('show');
        }
    });
}

// 로그인 폼 처리
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        // 에러 메시지 숨기기
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            if (!email || !password) {
                throw new Error('이메일과 비밀번호를 입력해주세요.');
            }

            // 로그인 처리
            authManager.login(email, password);
            
            // 성공 메시지 표시
            successMessage.textContent = '로그인 성공! 홈페이지로 이동합니다.';
            successMessage.classList.add('show');
            
            // 1초 후 홈페이지로 이동
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.add('show');
        }
    });
}

// 프로필 이미지 초기 생성 함수
function getInitials(name) {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
}

// 프로필 사이드 메뉴 관리
function initializeProfileMenu() {
    const profileAvatar = document.getElementById('profileAvatar');
    const profileSidebar = document.getElementById('profileSidebar');
    const profileSidebarOverlay = document.getElementById('profileSidebarOverlay');
    const logoutMenuItem = document.getElementById('logoutMenuItem');
    
    // 프로필 아바타 클릭 시 메뉴 열기
    if (profileAvatar) {
        profileAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            profileSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // 오버레이 클릭 시 메뉴 닫기
    if (profileSidebarOverlay) {
        profileSidebarOverlay.addEventListener('click', () => {
            profileSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 로그아웃 메뉴 아이템 클릭
    if (logoutMenuItem) {
        logoutMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            authManager.logout();
            profileSidebar.classList.remove('active');
            document.body.style.overflow = '';
            window.location.reload();
        });
    }
    
    // ESC 키로 메뉴 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileSidebar && profileSidebar.classList.contains('active')) {
            profileSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// 페이지 로드 시 로그인 상태 확인 및 UI 업데이트
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

// 인증 상태에 따른 UI 업데이트 함수
function updateAuthUI() {
    const currentUser = authManager.getCurrentUser();
    const authLinks = document.querySelectorAll('.auth-links');
    
    authLinks.forEach(container => {
        if (currentUser) {
            // 로그인된 경우 - 프로필 이미지만 표시
            const initials = getInitials(currentUser.name);
            container.innerHTML = `
                <div class="profile-avatar" id="profileAvatar" title="${currentUser.name}">
                    <span>${initials}</span>
                </div>
            `;
            
            // 프로필 사이드 메뉴 정보 업데이트
            const profileSidebarName = document.getElementById('profileSidebarName');
            const profileSidebarEmail = document.getElementById('profileSidebarEmail');
            const profileSidebarInitial = document.getElementById('profileSidebarInitial');
            
            if (profileSidebarName) profileSidebarName.textContent = currentUser.name;
            if (profileSidebarEmail) profileSidebarEmail.textContent = currentUser.email;
            if (profileSidebarInitial) profileSidebarInitial.textContent = initials;
            
            // 프로필 메뉴 초기화
            setTimeout(() => {
                initializeProfileMenu();
            }, 100);
        } else {
            // 로그인되지 않은 경우
            container.innerHTML = `
                <a href="login.html" class="nav-link">로그인</a>
                <a href="register.html" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-left: 0.5rem;">회원가입</a>
            `;
        }
    });
}

// 전역 함수로 내보내기
window.authManager = authManager;
window.updateAuthUI = updateAuthUI;


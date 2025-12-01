// 사용자 데이터 관리
const UserDataManager = {
    currentUser: null,
    
    initializeUserData() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    },
    
    saveUserData(userData) {
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
    },
    
    clearUserData() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    },
    
    getCurrentUser() {
        return this.currentUser;
    }
};

// 게시물 데이터 관리
const PostDataManager = {
    posts: [],
    
    initializePostData() {
        const savedPosts = localStorage.getItem('posts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        } else {
            this.generateSamplePosts();
        }
    },
    
    generateSamplePosts() {
        const samplePosts = [
            {
                id: 1,
                userId: 'user1',
                username: '루나',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
                catImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
                caption: '루나가 오늘도 너무 귀여워요 😊 달처럼 밝게 빛나는 우리 루나',
                likes: 42,
                comments: 5,
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                liked: false
            },
            {
                id: 2,
                userId: 'user2',
                username: '레오',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
                catImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
                caption: '레오가 햇빛 받으며 낮잠 자는 모습이 너무 사랑스러워요 🐾 사자처럼 당당한 우리 레오',
                likes: 78,
                comments: 12,
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                liked: true
            },
            {
                id: 3,
                userId: 'user3',
                username: '망고',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
                catImage: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&q=80',
                caption: '망고가 새로운 장난감에 푹 빠졌어요! 달콤한 망고처럼 귀여운 우리 고양이',
                likes: 56,
                comments: 8,
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                liked: false
            },
            {
                id: 4,
                userId: 'user4',
                username: '벨라',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
                catImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
                caption: '벨라가 오늘은 특별히 조용하네요 😴 아름다운 벨라의 하루',
                likes: 34,
                comments: 3,
                timestamp: new Date(Date.now() - 14400000).toISOString(),
                liked: false
            },
            {
                id: 5,
                userId: 'user5',
                username: '루시',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
                catImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80',
                caption: '루시가 창밖을 보며 생각에 잠겨있어요. 똑똑한 우리 루시',
                likes: 91,
                comments: 15,
                timestamp: new Date(Date.now() - 18000000).toISOString(),
                liked: true
            },
            {
                id: 6,
                userId: 'user6',
                username: '찰리',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6',
                catImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
                caption: '찰리가 먹는 모습도 너무 귀여워요 🍽️ 밥 먹는 찰리가 최고예요',
                likes: 67,
                comments: 9,
                timestamp: new Date(Date.now() - 21600000).toISOString(),
                liked: false
            },
            {
                id: 7,
                userId: 'user7',
                username: '키티',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user7',
                catImage: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800&q=80',
                caption: '키티가 귀여운 포즈를 취했어요 🐾 작고 귀여운 우리 키티',
                likes: 89,
                comments: 11,
                timestamp: new Date(Date.now() - 25200000).toISOString(),
                liked: false
            },
            {
                id: 8,
                userId: 'user8',
                username: '로키',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user8',
                catImage: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80',
                caption: '로키가 오늘도 예쁘게 포즈를 취했어요 💕 장난꾸러기 로키의 일상',
                likes: 72,
                comments: 7,
                timestamp: new Date(Date.now() - 28800000).toISOString(),
                liked: true
            },
            {
                id: 9,
                userId: 'user9',
                username: '장군',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user9',
                catImage: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800&q=80',
                caption: '장군이 우아하게 앉아있는 모습이 멋져요 👑 당당한 우리 장군',
                likes: 95,
                comments: 14,
                timestamp: new Date(Date.now() - 32400000).toISOString(),
                liked: false
            },
            {
                id: 10,
                userId: 'user10',
                username: '루루',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user10',
                catImage: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&q=80',
                caption: '루루가 오늘도 너무 귀여워요! 루루와 함께하는 행복한 하루',
                likes: 63,
                comments: 6,
                timestamp: new Date(Date.now() - 36000000).toISOString(),
                liked: false
            },
            {
                id: 11,
                userId: 'user11',
                username: '타이거',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user11',
                catImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
                caption: '타이거가 호랑이처럼 당당하게 걸어다녀요! 🐅',
                likes: 81,
                comments: 10,
                timestamp: new Date(Date.now() - 39600000).toISOString(),
                liked: true
            },
            {
                id: 12,
                userId: 'user12',
                username: '오레오',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user12',
                catImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
                caption: '오레오가 오늘도 달콤하게 잠들었어요 🍪 오레오처럼 달콤한 우리 고양이',
                likes: 58,
                comments: 8,
                timestamp: new Date(Date.now() - 43200000).toISOString(),
                liked: false
            },
            {
                id: 13,
                userId: 'user13',
                username: '심바',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user13',
                catImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
                caption: '심바가 사자처럼 당당하게 앉아있어요 👑 왕의 품격',
                likes: 87,
                comments: 12,
                timestamp: new Date(Date.now() - 46800000).toISOString(),
                liked: true
            },
            {
                id: 14,
                userId: 'user14',
                username: '쿠키',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user14',
                catImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80',
                caption: '쿠키가 오늘도 너무 귀여워요! 🍪 달콤한 쿠키의 하루',
                likes: 74,
                comments: 9,
                timestamp: new Date(Date.now() - 50400000).toISOString(),
                liked: false
            },
            {
                id: 15,
                userId: 'user15',
                username: '스노우',
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user15',
                catImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
                caption: '스노우가 눈처럼 하얗고 깨끗해요 ❄️ 순수한 우리 스노우',
                likes: 92,
                comments: 13,
                timestamp: new Date(Date.now() - 54000000).toISOString(),
                liked: true
            }
        ];
        this.posts = samplePosts;
        this.savePostData();
    },
    
    savePostData() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
    },
    
    getAllPosts() {
        return this.posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    
    addPost(postData) {
        const currentUser = UserDataManager.getCurrentUser();
        const newPost = {
            id: Date.now(),
            userId: currentUser?.id || 'guest',
            username: currentUser?.name || '익명',
            userAvatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
            catImage: postData.imageUrl,
            caption: postData.caption,
            likes: 0,
            comments: 0,
            timestamp: new Date().toISOString(),
            liked: false
        };
        this.posts.unshift(newPost);
        this.savePostData();
        return newPost;
    },
    
    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
            this.savePostData();
        }
    },
    
    getUserPosts(userId) {
        return this.posts.filter(p => p.userId === userId);
    }
};

// 인증 관리
const AuthManager = {
    checkAuth() {
        const currentUser = UserDataManager.getCurrentUser();
        if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
            window.location.href = 'login.html';
        }
    },
    
    handleLogin(loginData) {
        const userData = {
            id: 'user_' + Date.now(),
            name: loginData.email.split('@')[0],
            email: loginData.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginData.email}`,
            bio: '고양이를 사랑하는 사람입니다 🐾',
            catName: ''
        };
        UserDataManager.saveUserData(userData);
        return true;
    },
    
    handleRegister(registerData) {
        const userData = {
            id: 'user_' + Date.now(),
            name: registerData.name,
            email: registerData.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${registerData.email}`,
            bio: '고양이를 사랑하는 사람입니다 🐾',
            catName: registerData.catName || ''
        };
        UserDataManager.saveUserData(userData);
        return true;
    },
    
    handleLogout() {
        UserDataManager.clearUserData();
        window.location.href = 'login.html';
    }
};

// UI 렌더링 관리
const UIRenderer = {
    renderFeedGrid(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const posts = PostDataManager.getAllPosts();
        container.innerHTML = '';
        
        posts.forEach(post => {
            const feedCard = this.createFeedCard(post);
            container.appendChild(feedCard);
        });
    },
    
    createFeedCard(post) {
        const card = document.createElement('div');
        card.className = 'feed-card';
        card.innerHTML = `
            <img src="${post.catImage}" alt="고양이 사진" class="feed-card-image" onerror="this.src='https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80'">
            <div class="feed-card-content">
                <div class="feed-card-header">
                    <div class="feed-card-avatar">
                        <img src="${post.userAvatar}" alt="${post.username}">
                    </div>
                    <div class="feed-card-user-info">
                        <div class="feed-card-username">${post.username} 집사님</div>
                        <div class="feed-card-time">${this.formatTime(post.timestamp)}</div>
                    </div>
                </div>
                <div class="feed-card-caption">${post.caption}</div>
                <div class="feed-card-actions">
                    <button class="feed-card-action ${post.liked ? 'liked' : ''}" onclick="handleLikeClick(${post.id})">
                        <span>${post.liked ? '❤️' : '🤍'}</span>
                        <span>${post.likes}</span>
                    </button>
                    <button class="feed-card-action">
                        <span>💬</span>
                        <span>${post.comments}</span>
                    </button>
                </div>
            </div>
        `;
        return card;
    },
    
    renderFeedList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const posts = PostDataManager.getAllPosts();
        container.innerHTML = '';
        
        posts.forEach(post => {
            const feedItem = this.createFeedItem(post);
            container.appendChild(feedItem);
        });
    },
    
    renderFeedGrid(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const posts = PostDataManager.getAllPosts();
        container.innerHTML = '';
        
        posts.forEach(post => {
            const gridItem = this.createFeedGridItem(post);
            container.appendChild(gridItem);
        });
    },
    
    createFeedGridItem(post) {
        const item = document.createElement('div');
        item.className = 'feed-grid-item';
        item.innerHTML = `
            <div class="feed-grid-image-wrapper">
                <img src="${post.catImage}" alt="고양이 사진" class="feed-grid-image" onerror="this.src='https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80'">
                <div class="feed-grid-overlay">
                    <div class="feed-grid-stats">
                        <span class="feed-grid-stat">❤️ ${post.likes}</span>
                        <span class="feed-grid-stat">💬 ${post.comments}</span>
                    </div>
                </div>
            </div>
        `;
        return item;
    },
    
    createFeedItem(post) {
        const item = document.createElement('div');
        item.className = 'feed-item instagram-post';
        item.innerHTML = `
            <div class="post-header">
                <div class="post-user-info">
                    <div class="post-avatar">
                        <img src="${post.userAvatar}" alt="${post.username}">
                    </div>
                    <div class="post-user-details">
                        <span class="post-username">${post.username} 집사님</span>
                    </div>
                </div>
                <button class="post-more-btn">⋯</button>
            </div>
            <div class="post-image-container" ondblclick="handleDoubleTapLike(${post.id})">
                <img src="${post.catImage}" alt="고양이 사진" class="post-image" onerror="this.src='https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80'">
                <div class="like-animation" id="likeAnim${post.id}">❤️</div>
            </div>
            <div class="post-content">
                <div class="post-actions">
                    <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="handleLikeClick(${post.id})" aria-label="좋아요">
                        ${post.liked ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="red"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'}
                    </button>
                    <button class="post-action-btn" aria-label="댓글">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </button>
                    <button class="post-action-btn" aria-label="공유">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    </button>
                    <button class="post-action-btn post-save-btn" aria-label="저장">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="19 21 12 16 5 21 5 3 19 3 19 21"/></svg>
                    </button>
                </div>
                <div class="post-likes">좋아요 <strong>${post.likes}</strong>개</div>
                <div class="post-caption">
                    <span class="post-caption-username">${post.username} 집사님</span>
                    <span class="post-caption-text">${post.caption}</span>
                </div>
                ${post.comments > 0 ? `<div class="post-comments-link">댓글 ${post.comments}개 모두 보기</div>` : ''}
                <div class="post-time">${this.formatTime(post.timestamp)}</div>
                <div class="post-comment-input-container">
                    <input type="text" class="post-comment-input" placeholder="댓글 달기...">
                    <button class="post-comment-submit">게시</button>
                </div>
            </div>
        `;
        return item;
    },
    
    showLikeAnimation(postId) {
        const animElement = document.getElementById(`likeAnim${postId}`);
        if (animElement) {
            animElement.style.display = 'flex';
            setTimeout(() => {
                animElement.style.display = 'none';
            }, 600);
        }
    },
    
    renderProfilePosts(containerId, userId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const posts = PostDataManager.getUserPosts(userId);
        container.innerHTML = '';
        
        if (posts.length === 0) {
            container.innerHTML = '<div class="empty-state"><span class="empty-icon">📷</span><p>아직 게시물이 없습니다</p></div>';
            return;
        }
        
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'feed-card';
            postCard.innerHTML = `
                <img src="${post.catImage}" alt="고양이 사진" class="feed-card-image" onerror="this.src='https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80'">
                <div class="feed-card-content">
                    <div class="feed-card-caption">${post.caption}</div>
                    <div class="feed-card-actions">
                        <button class="feed-card-action ${post.liked ? 'liked' : ''}">
                            <span>${post.liked ? '❤️' : '🤍'}</span>
                            <span>${post.likes}</span>
                        </button>
                        <button class="feed-card-action">
                            <span>💬</span>
                            <span>${post.comments}</span>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(postCard);
        });
    },
    
    updateUserInfo() {
        const currentUser = UserDataManager.getCurrentUser();
        if (!currentUser) return;
        
        const userNameElements = document.querySelectorAll('#currentUserName, #sidebarUserName, #profileName');
        userNameElements.forEach(el => {
            if (el) el.textContent = `${currentUser.name} 집사님`;
        });
        
        const avatarElements = document.querySelectorAll('#sidebarUserAvatar img, #profileAvatar img, #navUserAvatar img, #bottomNavUserAvatar img');
        avatarElements.forEach(el => {
            if (el) el.src = currentUser.avatar;
        });
        
        const bioElement = document.getElementById('profileBio');
        if (bioElement) bioElement.textContent = currentUser.bio || '고양이를 사랑하는 사람입니다 🐾';
        
        const postCount = PostDataManager.getUserPosts(currentUser.id).length;
        const postCountElement = document.getElementById('postCount');
        if (postCountElement) postCountElement.textContent = postCount;
    },
    
    formatTime(timestamp) {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diff = now - postTime;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        return postTime.toLocaleDateString('ko-KR');
    },
    
    updateBottomNavActive() {
        const currentPage = window.location.pathname;
        const navItems = document.querySelectorAll('.bottom-nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href) {
                if (currentPage.includes('index.html') && href.includes('index.html')) {
                    item.classList.add('active');
                } else if (currentPage.includes('feed.html') && href.includes('feed.html')) {
                    item.classList.add('active');
                } else if (currentPage.includes('profile.html') && href.includes('profile.html')) {
                    item.classList.add('active');
                }
            }
        });
    }
};

// 좋아요 처리
function handleLikeClick(postId) {
    PostDataManager.toggleLike(postId);
    const currentPage = window.location.pathname;
    if (currentPage.includes('index.html') || currentPage.includes('feed.html')) {
        UIRenderer.renderFeedList('feedList');
    }
}

// 더블 탭 좋아요
function handleDoubleTapLike(postId) {
    const post = PostDataManager.posts.find(p => p.id === postId);
    if (post && !post.liked) {
        PostDataManager.toggleLike(postId);
        UIRenderer.showLikeAnimation(postId);
        const currentPage = window.location.pathname;
        if (currentPage.includes('index.html') || currentPage.includes('feed.html')) {
            setTimeout(() => {
                UIRenderer.renderFeedList('feedList');
            }, 500);
        }
    }
}

// 사진 업로드 처리
const UploadManager = {
    initializeUploadModal() {
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadBtnBottom = document.getElementById('uploadBtnBottom');
        const uploadModal = document.getElementById('uploadModal');
        const uploadModalClose = document.getElementById('uploadModalClose');
        const fileInput = document.getElementById('fileInput');
        const uploadPreview = document.getElementById('uploadPreview');
        const uploadSubmitBtn = document.getElementById('uploadSubmitBtn');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                uploadModal.classList.add('active');
            });
        }
        
        if (uploadBtnBottom) {
            uploadBtnBottom.addEventListener('click', () => {
                uploadModal.classList.add('active');
            });
        }
        
        if (uploadModalClose) {
            uploadModalClose.addEventListener('click', () => {
                uploadModal.classList.remove('active');
                this.resetUploadForm();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e.target.files[0]);
            });
        }
        
        if (uploadPreview) {
            uploadPreview.addEventListener('click', () => {
                fileInput.click();
            });
        }
        
        if (uploadSubmitBtn) {
            uploadSubmitBtn.addEventListener('click', () => {
                this.handleUploadSubmit();
            });
        }
    },
    
    handleFileSelect(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const uploadPreview = document.getElementById('uploadPreview');
            uploadPreview.innerHTML = `
                <img src="${e.target.result}" alt="미리보기" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px;">
            `;
            uploadPreview.dataset.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    },
    
    handleUploadSubmit() {
        const uploadPreview = document.getElementById('uploadPreview');
        const captionInput = document.getElementById('postCaption');
        const imageUrl = uploadPreview.dataset.imageUrl;
        
        if (!imageUrl) {
            alert('사진을 선택해주세요.');
            return;
        }
        
        const postData = {
            imageUrl: imageUrl,
            caption: captionInput.value || '고양이 사진을 공유합니다 🐾'
        };
        
        PostDataManager.addPost(postData);
        this.resetUploadForm();
        document.getElementById('uploadModal').classList.remove('active');
        
        const currentPage = window.location.pathname;
        if (currentPage.includes('index.html')) {
            UIRenderer.renderFeedList('feedList');
        } else if (currentPage.includes('feed.html')) {
            UIRenderer.renderFeedGrid('feedGrid');
        }
    },
    
    resetUploadForm() {
        const uploadPreview = document.getElementById('uploadPreview');
        const captionInput = document.getElementById('postCaption');
        const fileInput = document.getElementById('fileInput');
        
        uploadPreview.innerHTML = `
            <label for="fileInput" class="upload-label">
                <span>📷</span>
                <span>사진 선택</span>
            </label>
        `;
        captionInput.value = '';
        fileInput.value = '';
        delete uploadPreview.dataset.imageUrl;
    }
};

// 프로필 편집 관리
const ProfileManager = {
    initializeProfileEdit() {
        const editProfileBtn = document.getElementById('editProfileBtn');
        const editModal = document.getElementById('editModal');
        const editModalClose = document.getElementById('editModalClose');
        const editCancelBtn = document.getElementById('editCancelBtn');
        const editSaveBtn = document.getElementById('editSaveBtn');
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const editAvatarInput = document.getElementById('editAvatarInput');
        
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.openEditModal();
            });
        }
        
        if (editModalClose || editCancelBtn) {
            [editModalClose, editCancelBtn].forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        editModal.classList.remove('active');
                    });
                }
            });
        }
        
        if (editSaveBtn) {
            editSaveBtn.addEventListener('click', () => {
                this.saveProfile();
            });
        }
        
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                editAvatarInput.click();
            });
        }
        
        if (editAvatarInput) {
            editAvatarInput.addEventListener('change', (e) => {
                this.handleAvatarChange(e.target.files[0]);
            });
        }
    },
    
    openEditModal() {
        const currentUser = UserDataManager.getCurrentUser();
        if (!currentUser) return;
        
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editBio').value = currentUser.bio || '';
        document.getElementById('editCatName').value = currentUser.catName || '';
        document.getElementById('editAvatarPreview').src = currentUser.avatar;
        
        document.getElementById('editModal').classList.add('active');
    },
    
    handleAvatarChange(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('editAvatarPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    },
    
    saveProfile() {
        const currentUser = UserDataManager.getCurrentUser();
        if (!currentUser) return;
        
        currentUser.name = document.getElementById('editName').value;
        currentUser.bio = document.getElementById('editBio').value;
        currentUser.catName = document.getElementById('editCatName').value;
        
        const avatarPreview = document.getElementById('editAvatarPreview');
        if (avatarPreview.src.startsWith('data:')) {
            currentUser.avatar = avatarPreview.src;
        }
        
        UserDataManager.saveUserData(currentUser);
        UIRenderer.updateUserInfo();
        
        if (window.location.pathname.includes('profile.html')) {
            UIRenderer.renderProfilePosts('profileGrid', currentUser.id);
        }
        
        document.getElementById('editModal').classList.remove('active');
    }
};

// 탭 관리
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const targetTab = document.getElementById(tabName + 'Tab');
            if (targetTab) targetTab.classList.add('active');
        });
    });
}

// 페이지 초기화
function initializePage() {
    UserDataManager.initializeUserData();
    PostDataManager.initializePostData();
    
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('login.html')) {
        initializeLoginPage();
    } else if (currentPage.includes('register.html')) {
        initializeRegisterPage();
    } else {
        AuthManager.checkAuth();
        initializeMainPages();
    }
}

function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            if (AuthManager.handleLogin(loginData)) {
                window.location.href = 'index.html';
            }
        });
    }
}

function initializeRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const registerData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                catName: formData.get('catName')
            };
            
            if (formData.get('password') !== formData.get('passwordConfirm')) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            
            if (AuthManager.handleRegister(registerData)) {
                window.location.href = 'index.html';
            }
        });
    }
}

function initializeMainPages() {
    const currentUser = UserDataManager.getCurrentUser();
    if (!currentUser) return;
    
    UIRenderer.updateUserInfo();
    UIRenderer.updateBottomNavActive();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AuthManager.handleLogout();
        });
    }
    
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html')) {
        UIRenderer.renderFeedList('feedList');
        UploadManager.initializeUploadModal();
    } else if (currentPage.includes('feed.html')) {
        UIRenderer.renderFeedGrid('feedGrid');
        UploadManager.initializeUploadModal();
    } else if (currentPage.includes('profile.html')) {
        UIRenderer.renderProfilePosts('profileGrid', currentUser.id);
        ProfileManager.initializeProfileEdit();
        initializeTabs();
    }
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', initializePage);


// 네비게이션 스크롤 효과
const handleNavbarScroll = () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        } else {
        navbar.classList.remove('scrolled');
    }
};

// 모바일 메뉴 토글
const initializeMobileMenu = () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
};

// 부드러운 스크롤
const initializeSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// 스크롤 애니메이션
const initializeScrollAnimation = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.service-card, .feature-item, .about-text, .about-image');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
};

// 폼 제출 처리
const initializeContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // 실제 구현에서는 서버로 데이터를 전송합니다
            console.log('폼 제출:', formData);
            
            // 성공 메시지 표시
            alert('메시지가 전송되었습니다! 빠른 시일 내에 답변드리겠습니다.');
            
            // 폼 초기화
            contactForm.reset();
        });
    }
};

// Hero 슬라이드쇼 기능
const initializeHeroSlideshow = () => {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlideIndex = 0;
    const slideshowInterval = 5000; // 5초마다 전환
    
    const transitionToNextSlide = () => {
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        slides[currentSlideIndex].classList.add('active');
    };
    
    // 슬라이드가 존재하는 경우에만 자동 전환 시작
    if (slides.length > 1) {
        setInterval(transitionToNextSlide, slideshowInterval);
    }
};

// 페이지 로드 시 초기화
const initializePage = () => {
    window.addEventListener('scroll', handleNavbarScroll);
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeScrollAnimation();
    initializeContactForm();
    initializeHeroSlideshow();
    
    // 초기 스크롤 위치 확인
    handleNavbarScroll();
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', initializePage);

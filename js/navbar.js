let lastScrollPosition = 0;
const navbar = document.querySelector('.navbar');
const showNavbarThreshold = 100;

function handleScroll() {
    const currentScrollPosition = window.pageYOffset;
    
    if (currentScrollPosition < lastScrollPosition || currentScrollPosition < showNavbarThreshold) {
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible');
    }
    
    lastScrollPosition = currentScrollPosition;
}

// 检查是否是页面加载后的首次显示
let isFirstLoad = true;

document.addEventListener('DOMContentLoaded', () => {
    if (isFirstLoad) {
        // 首次加载时禁用过渡动画
        navbar.classList.add('no-transition');
        navbar.classList.add('visible');
        
        // Force reflow
        navbar.offsetHeight;
        
        // 移除禁用过渡的类
        requestAnimationFrame(() => {
            navbar.classList.remove('no-transition');
            isFirstLoad = false;
        });
    }
});

// 在页面即将卸载时记录状态
window.addEventListener('beforeunload', () => {
    localStorage.setItem('navbarVisible', navbar.classList.contains('visible'));
});

// 添加滚动事件监听器
window.addEventListener('scroll', handleScroll, { passive: true });
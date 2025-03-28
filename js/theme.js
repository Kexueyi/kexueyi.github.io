function initTheme() {
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = `
      <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;

  // Get theme from localStorage or system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // 设置初始主题
  document.documentElement.setAttribute('data-theme', theme);
  
  // 确保在初始化时显示正确的图标
  if (theme === 'dark') {
    // 深色模式下显示太阳图标（表示可切换到亮色模式）
    themeToggle.querySelector('.moon-icon').style.display = 'none';
    themeToggle.querySelector('.sun-icon').style.display = 'block';
  } else {
    // 亮色模式下显示月亮图标（表示可切换到深色模式）
    themeToggle.querySelector('.sun-icon').style.display = 'none';
    themeToggle.querySelector('.moon-icon').style.display = 'block';
  }

  // Toggle theme
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 更新主题
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 切换图标显示
    if (newTheme === 'dark') {
      themeToggle.querySelector('.moon-icon').style.display = 'none';
      themeToggle.querySelector('.sun-icon').style.display = 'block';
    } else {
      themeToggle.querySelector('.sun-icon').style.display = 'none';
      themeToggle.querySelector('.moon-icon').style.display = 'block';
    }
  });

  // Add the toggle to the body for fixed positioning
  document.body.appendChild(themeToggle);
  
  // Function to update the toggle position when footer visibility changes
  function updateTogglePosition() {
    const footerBar = document.querySelector('.footer-bar');
    if (footerBar) {
      const footerHeight = footerBar.offsetHeight;
      const footerVisible = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 10;
      
      if (footerVisible) {
        themeToggle.style.bottom = `${footerHeight + 10}px`;
      } else {
        themeToggle.style.bottom = '20px';
      }
    }
  }
  
  // Update position on scroll and resize
  window.addEventListener('scroll', updateTogglePosition);
  window.addEventListener('resize', updateTogglePosition);
  
  // Initial position update
  updateTogglePosition();
}

document.addEventListener('DOMContentLoaded', initTheme);
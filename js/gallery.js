const crypto = require('crypto');

function hashFileName(originalName) {
  const hash = crypto.createHash('sha256')
    .update(originalName)
    .digest('hex')
    .substring(0, 12); // Using first 12 characters for shorter names
  return hash;
}

const gallery = {
  images: [
    {
      src: 'images/gallery/000117640002.jpg',
      title: 'Natural Chimney',
      location: 'Bromo, Indonesia'
    },
    {
      src: 'images/gallery/000117640014.jpg',
      title: 'Natural Chimney',
      location: 'Bromo, Indonesia'
    },
    {
      src: 'images/gallery/000117640033_1.jpg',
      title: 'Ocean Bonsai',
      location: 'Nusa Lembongan, Indonesia'
    },
    {
      src: 'images/gallery/000117640034.jpg',
      title: 'Ocean Bonsai',
      location: 'Nusa Lembongan, Indonesia'
    },
    {
      src: 'images/gallery/000117640022.jpg',
      title: 'Foggy Mountain',
      location: 'Bromo, Indonesia'
    },
    {
      src: 'images/gallery/000053.JPG',
      title: 'Cloud Ruins',
      location: 'Yuanmingyuan, Beijing, China'
    },
    {
      src: 'images/gallery/000049.JPG',
      title: 'Ruins',
      location: 'Yuanmingyuan, Beijing, China'
    },
    {
      src: 'images/gallery/000050.JPG',
      title: 'Dashuifa',
      location: 'Yuanmingyuan, Beijing, China'
    },
    {
      src: 'images/gallery/000064.JPG',
      title: 'Golden Fish',
      location: 'Yiheyuan, Beijing, China'
    },
    {
      src: 'images/gallery/000070.JPG',
      title: 'Arch',
      location: 'Forbidden City, Beijing, China'
    },
    {
      src: 'images/gallery/000067.JPG',
      title: 'End Gate',
      location: 'Forbidden City, Beijing, China'
    },
    {
      src: 'images/gallery/000040.JPG',
      title: 'Volkswagen Beetle',
      location: 'Haji Lane, Singapore'
    },
    {
      src: 'images/gallery/000005.JPG',
      title: 'Luminous Bazaar',
      location: 'Haji Lane, Singapore'
    },
    {
      src: 'images/gallery/001009810037.JPG',
      title: 'The Other Side',
      location: 'Gaylang, Singapore'
    },
    {
      src: 'images/gallery/001299740030.jpg',
      title: 'Wheels',
      location: 'Whampoa, Singapore'
    },
    {
      src: 'images/gallery/001299740023.jpg',
      title: 'Sunset',
      location: 'Tuas, Singapore'
    },
    {
      src: 'images/gallery/001299740021.jpg',
      title: 'Now Playing',
      location: 'Tuas, Singapore'
    },
    {
      src: 'images/gallery/001299740017.jpg',
      title: 'Blue Hour',
      location: 'Tuas, Singapore'
    },
    // {
    //   src: 'images/gallery/001299740022.jpg',
    //   title: 'Bay',
    //   location: 'Tuas, Singapore'
    // },
    {
      src: 'images/gallery/00F80A73-16F7-457E-A485-5F7E53895F45.JPG',
      title: 'Youth',
      location: 'Wuhan University, China'
    },
    {
      src: 'images/gallery/003_0301.jpg',
      title: 'Sunrise',
      location: 'Wuhan University, China'
    },
    {
      src: 'images/gallery/deb4f229et1946f6eb2ed0c2a61d639a.JPG',
      title: 'Dorm',
      location: 'Wuhan University, China'
    },
    {
      src: 'images/gallery/246BC05C-ABF4-49BD-8ABD-BAEE5DB8CB93.JPEG',
      title: 'Meow?',
      location: 'Wuhan, China'
    },
    {
      src: 'images/gallery/F43C5961-23F4-4775-84CF-272E8EE51931.JPEG',
      title: 'Tipsy',
      location: 'Wuhan University, China'
    },
    {
      src: 'images/gallery/ffecf9e2ai4189cd7295f03aa5721b08.JPG',
      title: 'Craftsman\'s spirit',
      location: 'Wuhan, China'
    },
    {
      src: 'images/gallery/c42ff6d78t3c66cd49d30ca383680b11.JPG',
      title: 'Memories',
      location: 'Wuhan, China'
    },
    {
      src: 'images/gallery/d430e75f0l966c2ceb73ff478b7dce43.JPG',
      title: 'Afternoon',
      location: 'Wuhan, China'
    },
    {
      src: 'images/gallery/IMG_3891.JPG',
      title: 'Cherry blossom',
      location: 'Wuhan University, China'
    },
    {
      src: 'images/gallery/IMG_3890.JPG',
      title: 'Cherry blossom',
      location: 'Wuhan University, China'
    },
  ],

  init: async function() {
    try {
      const imageMap = require('./data/imageMap.json');
      const images = Object.entries(imageMap).map(([original, hashed]) => ({
        original: original,
        src: `/images/gallery/${hashed}`,
        title: original.split('.')[0], // Or your custom title logic
        alt: original.split('.')[0]    // Or your custom alt text
      }));
      
      // Load images into gallery
      this.loadImages(images);
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  },
  
  createColumns() {
    this.container.innerHTML = '';
    const columnCount = window.innerWidth > 768 ? 3 : (window.innerWidth > 480 ? 2 : 1);
    this.columns = [];
    
    for (let i = 0; i < columnCount; i++) {
      const column = document.createElement('div');
      column.className = 'gallery-column';
      this.container.appendChild(column);
      this.columns.push(column);
    }
  },

  loadImages(images) {
    // 重置列高度
    const columnHeights = new Array(this.columns.length).fill(0);
    
    // 预加载所有图片
    const imagePromises = images.map(image => {
      return new Promise((resolve) => {
        const img = new Image();
        
        // 添加随机查询参数防止缓存
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        img.src = `${image.src}?v=${timestamp}-${randomStr}`;
        
        // 添加图片加载时的安全属性
        img.setAttribute('crossorigin', 'anonymous');
        img.setAttribute('referrerpolicy', 'no-referrer');
        
        // 添加随机的数据属性用于跟踪
        const trackingId = Math.random().toString(36).substr(2, 9);
        img.setAttribute('data-tracking', trackingId);
        
        img.onload = () => {
          resolve({
            ...image,
            trackingId,
            timestamp,
            aspectRatio: img.naturalHeight / img.naturalWidth,
            height: img.naturalHeight,
            width: img.naturalWidth
          });
        };
        img.onerror = () => resolve(null);
      });
    });

    Promise.all(imagePromises).then(loadedImages => {
      loadedImages = loadedImages.filter(img => img !== null);
      
      loadedImages.forEach(image => {
        // 找出最短的列
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        item.innerHTML = `
          <img src="${image.src}" alt="${image.title}" loading="lazy">
          <div class="gallery-item-info">
            <div class="gallery-item-title">${image.title}</div>
            <div class="gallery-item-location">${image.location}</div>
          </div>
        `;

        // 将图片添加到最短的列中
        this.columns[shortestColumnIndex].appendChild(item);
        columnHeights[shortestColumnIndex] += image.aspectRatio;
        
        item.addEventListener('click', () => this.showImage(image.src));
        
        // 添加加载时的质量控制
        const img = item.querySelector('img');
        img.style.imageRendering = 'high-quality';
        img.decoding = 'async';
        img.loading = 'lazy';
        img.setAttribute('fetchpriority', 'high');
        
        // 添加错误处理
        img.onerror = () => {
          console.error('Failed to load image:', image.src);
          item.classList.add('image-error');
        };
      });
    });
  },

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.innerHTML = `
      <div class="modal-wrapper">
        <img class="modal-content">
      </div>
    `;

    // 修改点击事件处理
    this.modal.addEventListener('click', (e) => {
      // 如果点击的是modal本身或modal-wrapper，则关闭
      if (e.target.classList.contains('modal') || 
          e.target.classList.contains('modal-wrapper')) {
        this.hideImage();
      }
    });

    // 添加键盘ESC关闭支持
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.hideImage();
      }
    });

    document.body.appendChild(this.modal);
  },

  showImage(src) {
    const img = this.modal.querySelector('img');
    const preloadImg = new Image();
    
    preloadImg.onload = () => {
      img.removeAttribute('style');
      img.src = src;
      img.setAttribute('data-protected', 'true');
      
      // 添加随机ID用于追踪
      const uniqueId = Math.random().toString(36).substr(2, 9);
      img.setAttribute('data-image-id', uniqueId);
      
      this.modal.classList.add('active');
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          img.classList.add('modal-content-active');
        });
      });
    };
    
    // 添加错误处理
    preloadImg.onerror = () => {
      console.error('Image failed to load');
    };
    
    preloadImg.src = src;
  },

  hideImage() {
    const img = this.modal.querySelector('img');
    
    // 移除水印和图片的活动状态
    img.classList.remove('modal-content-active');
    this.modal.classList.remove('active');
    
    // 等待过渡完成后清理
    setTimeout(() => {
      img.src = '';
    }, 300);
  },

  initImageTracking() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const trackingData = {
            id: img.getAttribute('data-tracking'),
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
          };
          
          // 可以将数据发送到分析服务
          console.log('Image view tracked:', trackingData);
        }
      });
    });

    document.querySelectorAll('.gallery-item img').forEach(img => {
      observer.observe(img);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => gallery.init());

// Prevent image dragging
document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImages() {
  const sourceDir = path.join(__dirname, '../images/gallery');
  const files = fs.readdirSync(sourceDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  
  const imageMap = new Map(); // Store original name to hash mapping
  
  for (const file of files) {
    const fileExt = path.extname(file);
    const hashedName = hashFileName(file) + fileExt;
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(sourceDir, hashedName);
    
    // Store mapping
    imageMap.set(file, hashedName);
    
    const metadata = {
      IFD0: {
        Copyright: '© 2025 Xueyi Ke. All rights reserved.',
        Artist: 'Xueyi Ke',
        WebStatement: 'https://kexueyi.com/gallery.html, https://kexueyi.github.io/gallery.html'
      },
      IPTC: {
        CopyrightNotice: '© 2025 Xueyi Ke. All rights reserved.',
        WebStatement: 'https://kexueyi.com/gallery.html, https://kexueyi.github.io/gallery.html'
      }
    };

    // Process and rename the image
    await sharp(sourcePath)
      .withMetadata(metadata)
      .toFile(targetPath);
  }
  
  // Save the mapping to a JSON file
  fs.writeFileSync(
    path.join(__dirname, 'imageMap.json'),
    JSON.stringify(Object.fromEntries(imageMap), null, 2)
  );
}
document.addEventListener('DOMContentLoaded', function() {
    // 使用id选择器更可靠
    const cvLink = document.querySelector('#cv-link');
    if (!cvLink) {
        console.error('CV link not found');
        return;
    }
    
    async function updateCVInfo() {
        try {
            const response = await fetch('documents/CV-KeXueyi.pdf', { method: 'HEAD' });
            if (!response.ok) throw new Error('CV file not found');
            
            const lastModified = response.headers.get('last-modified');
            const date = new Date(lastModified);
            
            const formatted = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
            cvLink.setAttribute('title', `Last updated: ${formatted}`);
            
            // 移除旧的更新日期（如果存在）
            const oldDate = document.querySelector('.cv-update-date');
            if (oldDate) oldDate.remove();
            
            // 添加新的更新日期
            cvLink.insertAdjacentHTML('afterend', 
                `<span class="cv-update-date" style="font-size: 0.9em; color: var(--text-tertiary);"> (Updated: ${formatted})</span>`);
            
        } catch (error) {
            console.error('Error fetching CV metadata:', error);
            cvLink.setAttribute('title', 'Update date unavailable');
        }
    }
    
    updateCVInfo();
});
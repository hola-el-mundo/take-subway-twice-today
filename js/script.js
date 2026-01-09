/**
 * DATA MANAGER
 * Call Serverless Functions in /api
 */
const DataManager = {
    async getBlogs() {
        try {
            const response = await fetch('/api/blog');
            if (!response.ok) throw new Error('Network response was not ok');
            const blogs = await response.json();
            
            // Format for UI
            return blogs.map(blog => ({
                id: blog.id,
                title: blog.title,
                content: blog.content,
                emoji: blog.emoji,
                // Convert timestamp to string
                date: new Date(blog.created_at).toLocaleDateString('zh-CN', { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                })
            }));
        } catch (error) {
            console.error('获取博客失败:', error);
            return [];
        }
    },

    async saveBlog(title, content) {
        // Random Emoji
        const emojis = ['🎈', '✨', '🚀', '🌈', '🍦', '🍕', '🎮', '💡', '👻', '🥑'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        const response = await fetch('/api/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                content: content,
                emoji: randomEmoji
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save');
        }

        return true; 
    },

    async deleteBlog(id) {
        // Use query params for delete
        const response = await fetch(`/api/blog?id=${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete');
        }
    }
};

/**
 * UI CONTROLLER
 * 处理界面交互和渲染
 */
const UI = {
    elements: {
        trigger: document.getElementById('blog-toggle'),
        panel: document.getElementById('blog-panel'),
        overlay: document.getElementById('overlay'),
        closeBtn: document.getElementById('close-blog'),
        newPostBtn: document.getElementById('new-post-btn'),
        editorArea: document.getElementById('editor-area'),
        cancelBtn: document.getElementById('cancel-btn'),
        publishBtn: document.getElementById('publish-btn'),
        blogList: document.getElementById('blog-list'),
        titleInput: document.getElementById('blog-title'),
        contentInput: document.getElementById('blog-content')
    },

    init() {
        this.renderBlogs();
        this.bindEvents();
    },

    bindEvents() {
        // 打开/关闭面板
        this.elements.trigger.addEventListener('click', () => this.togglePanel(true));
        this.elements.closeBtn.addEventListener('click', () => this.togglePanel(false));
        this.elements.overlay.addEventListener('click', () => this.togglePanel(false));

        // 写作相关
        this.elements.newPostBtn.addEventListener('click', () => this.toggleEditor(true));
        this.elements.cancelBtn.addEventListener('click', () => this.toggleEditor(false));
        this.elements.publishBtn.addEventListener('click', () => this.handlePublish());
    },

    togglePanel(show) {
        if (show) {
            this.elements.panel.classList.add('active');
            this.elements.overlay.classList.add('active');
        } else {
            this.elements.panel.classList.remove('active');
            this.elements.overlay.classList.remove('active');
        }
    },

    toggleEditor(show) {
        if (show) {
            this.elements.editorArea.classList.remove('hidden');
            this.elements.newPostBtn.classList.add('hidden');
            this.elements.titleInput.focus();
        } else {
            this.elements.editorArea.classList.add('hidden');
            this.elements.newPostBtn.classList.remove('hidden');
            this.clearInputs();
        }
    },

    clearInputs() {
        this.elements.titleInput.value = '';
        this.elements.contentInput.value = '';
    },

    async handlePublish() {
        const title = this.elements.titleInput.value.trim();
        const content = this.elements.contentInput.value.trim();

        if (!title || !content) {
            alert('Oops! You forgot something! 😅');
            return;
        }

        // 简单的防误触，防止游客乱发（虽然是前端验证，防君子不防小人）
        // 实际使用如果想给自己用，可以把这里改成一个密码输入框
        // const password = prompt("请输入发布密码:");
        // if (password !== "zoe") return; 

        // 按钮变 loading 态
        const originalText = this.elements.publishBtn.innerText;
        this.elements.publishBtn.innerText = 'Publishing...';
        this.elements.publishBtn.disabled = true;

        try {
            await DataManager.saveBlog(title, content);
            await this.renderBlogs(); // 重新拉取列表
            this.toggleEditor(false);
            alert('🎉 Published successfully!');
        } catch (error) {
            alert('Failed to publish: ' + error.message);
        } finally {
            this.elements.publishBtn.innerText = originalText;
            this.elements.publishBtn.disabled = false;
        }
    },

    async renderBlogs() {
        const container = this.elements.blogList;
        container.innerHTML = '<div style="text-align:center; padding: 20px;">Loading wonderful memories... ⏳</div>';

        const blogs = await DataManager.getBlogs();
        
        container.innerHTML = '';

        if (blogs.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; margin-top: 50px; opacity: 0.6;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">👻</div>
                    <p>It's a ghost town here!</p>
                    <p>Write something fun!</p>
                </div>
            `;
            return;
        }

        blogs.forEach(blog => {
            const article = document.createElement('article');
            article.className = 'blog-item';
            
            article.innerHTML = `
                <h3>${blog.emoji} ${this.escapeHtml(blog.title)}</h3>
                <span class="blog-date">${blog.date}</span>
                <p class="blog-excerpt">${this.escapeHtml(blog.content)}</p>
                <div class="delete-post" data-id="${blog.id}">🗑️</div>
            `;
            
            // 绑定删除事件
            article.querySelector('.delete-post').addEventListener('click', async (e) => {
                if(confirm('Are you sure you want to delete this memory? 🥺')) {
                    // 转圈圈提示
                    e.target.innerText = '...';
                    await DataManager.deleteBlog(blog.id);
                    this.renderBlogs();
                }
            });

            container.appendChild(article);
        });
    },

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});




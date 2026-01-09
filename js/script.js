/**
 * DATA MANAGER
 * 处理数据的存储和读取
 */
const DataManager = {
    // 现在的博客数据将从 JSON 文件读取
    async getBlogs() {
        try {
            // 添加时间戳防止缓存，确保读取最新数据
            const response = await fetch(`data/posts.json?v=${new Date().getTime()}`);
            if (!response.ok) throw new Error('Failed to load posts');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading blogs:', error);
            return []; // 如果加载失败，返回空数组
        }
    },

    // 以前是直接保存，现在我们只生成数据对象供用户复制
    // 因为纯前端网页没有权限直接修改服务器上的文件（GitHub）
    createBlogObject(title, content) {
        const emojis = ['🎈', '✨', '🚀', '🌈', '🍦', '🍕', '🎮', '💡'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        return {
            id: Date.now(),
            title: title,
            date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
            emoji: randomEmoji,
            content: content
        };
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
            alert('Oops! You forgot to write something! 😅');
            return;
        }

        // 生成新博客数据
        const newPost = DataManager.createBlogObject(title, content);
        
        // 格式化为 JSON 字符串
        const jsonString = JSON.stringify(newPost, null, 4);

        // 复制到剪贴板
        try {
            await navigator.clipboard.writeText(jsonString + ",");
            alert(`
🎉 Awesome! Your post is ready!
            
Since this is a static site, I've copied the JSON data to your clipboard.
            
👉 Please paste it into 'data/posts.json' file to publish it permanently.
(Just paste it at the top of the list!)
            `);
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('New post created! Please manually add it to data/posts.json');
        }

        // 暂时在界面上显示出来（刷新后会消失，直到你更新 json 文件）
        this.previewNewPost(newPost);
        this.toggleEditor(false);
    },

    previewNewPost(blog) {
        const article = this.createBlogElement(blog);
        // 插入到最前面
        if (this.elements.blogList.firstChild) {
            this.elements.blogList.insertBefore(article, this.elements.blogList.firstChild);
        } else {
            this.elements.blogList.appendChild(article);
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
            const article = this.createBlogElement(blog);
            container.appendChild(article);
        });
    },

    createBlogElement(blog) {
        const article = document.createElement('article');
        article.className = 'blog-item';
        const emoji = blog.emoji || '📝';
        
        article.innerHTML = `
            <h3>${emoji} ${this.escapeHtml(blog.title)}</h3>
            <span class="blog-date">${blog.date}</span>
            <p class="blog-excerpt">${this.escapeHtml(blog.content)}</p>
        `;
        return article;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});




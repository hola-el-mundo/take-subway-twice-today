/**
 * INIT LEANCLOUD
 * 初始化云端数据库
 */
// ⚠️ 注意：MasterKey 千万不要在前端代码中使用，这里只用 AppID 和 AppKey
const APP_ID = 'qEYwTkeThH7jmDC6mPx0hqHf-MdYXbMMI';
const APP_KEY = 'UbfCwDa4EYvIZiSLzsjSKTjh';

// 使用全局变量 AV (通过 HTML 引入的 SDK)
AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
    serverURL: "https://qeywtket.api.lncldglobal.com" // 国际版默认 API 域名，通常根据 AppID 生成
});

/**
 * DATA MANAGER
 * 处理云端数据的存储和读取
 */
const DataManager = {
    async getBlogs() {
        try {
            const query = new AV.Query('Blog');
            query.descending('createdAt'); // 按创建时间倒序（最新的在前面）
            const results = await query.find();
            
            // 转换数据格式
            return results.map(blog => ({
                id: blog.id,
                title: blog.get('title'),
                content: blog.get('content'),
                emoji: blog.get('emoji'),
                // 格式化日期
                date: blog.createdAt.toLocaleDateString('zh-CN', { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                })
            }));
        } catch (error) {
            console.error('获取博客失败:', error);
            // 这里我们不报错，返回空数组以免页面崩坏
            return [];
        }
    },

    async saveBlog(title, content) {
        // 声明 class
        const Blog = AV.Object.extend('Blog');
        const blog = new Blog();
        
        // 随机 Emoji
        const emojis = ['🎈', '✨', '🚀', '🌈', '🍦', '🍕', '🎮', '💡', '👻', '🥑'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // 设置属性
        blog.set('title', title);
        blog.set('content', content);
        blog.set('emoji', randomEmoji);

        // 保存到云端
        const savedBlog = await blog.save();
        
        return {
            id: savedBlog.id,
            title: title,
            content: content,
            emoji: randomEmoji,
            date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
        };
    },

    async deleteBlog(id) {
        // 创建一个不包含数据的对象，只用 id 来删除
        const blog = AV.Object.createWithoutData('Blog', id);
        await blog.destroy();
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




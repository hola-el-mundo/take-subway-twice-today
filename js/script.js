/**
 * DATA MANAGER (API Calls)
 */
const API = {
    // --- Blog ---
    async getBlogs() {
        const res = await fetch('/api/blog');
        return res.ok ? res.json() : [];
    },
    async saveBlog(title, content) {
        // No emojis, just pure content
        const emoji = null; 
        await fetch('/api/blog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, content, emoji })
        });
    },

    // --- Guestbook ---
    async getMessages() {
        const res = await fetch('/api/guestbook');
        return res.ok ? res.json() : [];
    },
    async postMessage(nickname, content) {
        await fetch('/api/guestbook', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nickname, content })
        });
    },

    // --- Visitors ---
    async logVisitor() {
        try { await fetch('/api/visitors', { method: 'POST' }); } catch(e){}
    },
    async getVisitors() {
        const res = await fetch('/api/visitors');
        return res.ok ? res.json() : [];
    }
};

/**
 * UI CONTROLLER
 */
const UI = {
    init() {
        this.bindNav();
        this.bindBlog();
        this.bindGuestbook();
        
        // Initial Loads
        this.renderBlogs();
        this.renderGuestbook();
        this.renderVisitors();
        
        // Log visit
        API.logVisitor();
    },

    bindNav() {
        const buttons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.view-section');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                buttons.forEach(b => b.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                // Add active class
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
            });
        });
    },

    // --- Blog Logic ---
    bindBlog() {
        const newBtn = document.getElementById('new-post-btn');
        const editor = document.getElementById('editor-area');
        const cancelBtn = document.getElementById('cancel-btn');
        const publishBtn = document.getElementById('publish-btn');
        
        if(newBtn) {
            newBtn.addEventListener('click', () => {
                editor.classList.remove('hidden');
                newBtn.classList.add('hidden');
            });
            
            cancelBtn.addEventListener('click', () => {
                editor.classList.add('hidden');
                newBtn.classList.remove('hidden');
            });

            publishBtn.addEventListener('click', async () => {
                const title = document.getElementById('blog-title').value;
                const content = document.getElementById('blog-content').value;
                if(title && content) {
                    publishBtn.innerText = 'Posting...';
                    await API.saveBlog(title, content);
                    publishBtn.innerText = 'Publish';
                    editor.classList.add('hidden');
                    newBtn.classList.remove('hidden');
                    document.getElementById('blog-title').value = '';
                    document.getElementById('blog-content').value = '';
                    this.renderBlogs();
                }
            });
        }
    },

    async renderBlogs() {
        const container = document.getElementById('blog-list');
        if(!container) return;
        container.innerHTML = 'Loading...';
        const blogs = await API.getBlogs();
        
        container.innerHTML = blogs.map(blog => `
            <article class="blog-item">
                <h3>${this.escape(blog.title)}</h3>
                <span class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</span>
                <p>${this.escape(blog.content)}</p>
            </article>
        `).join('') || '<p>The journal is empty.</p>';
    },

    // --- Guestbook Logic ---
    bindGuestbook() {
        const sendBtn = document.getElementById('send-msg-btn');
        if(sendBtn) {
            sendBtn.addEventListener('click', async () => {
                const name = document.getElementById('guest-name').value;
                const msg = document.getElementById('guest-msg').value;
                
                if(name && msg) {
                    sendBtn.innerText = 'Sending...';
                    await API.postMessage(name, msg);
                    sendBtn.innerText = 'Send Message';
                    document.getElementById('guest-msg').value = '';
                    this.renderGuestbook();
                }
            });
        }
    },

    async renderGuestbook() {
        const container = document.getElementById('guestbook-list');
        if(!container) return;
        const msgs = await API.getMessages();
        
        container.innerHTML = msgs.map(msg => `
            <div class="guest-msg">
                <span class="guest-name">${this.escape(msg.nickname)}</span>
                <p>${this.escape(msg.content)}</p>
            </div>
        `).join('') || '<p>Be the first to say hi!</p>';
    },

    // --- Visitors Logic ---
    async renderVisitors() {
        const list = document.getElementById('visitors-list');
        if(!list) return;
        const visitors = await API.getVisitors();
        
        list.innerHTML = visitors.map(v => `
            <tr>
                <td>${v.ip_address}</td>
                <td>${new Date(v.visited_at).toLocaleString()}</td>
                <td style="font-size: 0.8em; color: #888;">${this.escape(v.user_agent ? v.user_agent.substring(0, 30) : 'Unknown')}...</td>
            </tr>
        `).join('');
    },

    escape(str) {
        if(!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => UI.init());




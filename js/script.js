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
        await fetch('/api/blog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, content, emoji: null })
        });
    },

    // --- Gallery (Mock or API if exists) ---
    // If api/photos.js exists, use it. If not, we might need to handle it.
    // Assuming api/photos.js was restored or exists.
    async getPhotos() {
        try {
            const res = await fetch('/api/photos');
            if(res.ok) return await res.json();
        } catch(e) { console.error(e); }
        return [];
    },

    async savePhoto(url, caption) {
        try {
            await fetch('/api/photos', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ url, caption })
            });
        } catch(e) { console.error(e); }
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
        this.bindGallery(); // New
        this.bindGuestbook();
        
        // Initial Loads
        this.renderBlogs();
        this.renderGallery(); // New
        this.renderGuestbook();
        this.renderVisitors();
        
        API.logVisitor();
    },

    bindNav() {
        const buttons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.view-section');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

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
        const blogs = await API.getBlogs();
        
        // Random slight rotation for sticky note feel
        container.innerHTML = blogs.map(blog => {
            const rot = (Math.random() * 2 - 1).toFixed(1); // -1 to 1 deg
            return `
            <article class="blog-item" style="transform: rotate(${rot}deg)">
                <h3>${this.escape(blog.title)}</h3>
                <span style="font-family: var(--font-heading); color: #888;">${new Date(blog.created_at).toLocaleDateString()}</span>
                <p>${this.escape(blog.content)}</p>
            </article>
            `;
        }).join('') || '<p style="font-family:var(--font-heading); font-size:1.5rem">No stories yet. Start writing!</p>';
    },

    // --- Gallery Logic (New) ---
    bindGallery() {
        const addBtn = document.getElementById('add-photo-btn');
        const inputArea = document.getElementById('photo-input-area');
        const cancelBtn = document.getElementById('cancel-photo-btn');
        const saveBtn = document.getElementById('save-photo-btn');

        if(addBtn) {
            addBtn.addEventListener('click', () => {
                inputArea.classList.toggle('hidden');
            });

            cancelBtn.addEventListener('click', () => {
                inputArea.classList.add('hidden');
            });

            saveBtn.addEventListener('click', async () => {
                const url = document.getElementById('photo-url').value;
                const caption = document.getElementById('photo-caption').value;
                if(url) {
                    saveBtn.innerText = 'Pinning...';
                    await API.savePhoto(url, caption);
                    saveBtn.innerText = 'Pin It';
                    document.getElementById('photo-url').value = '';
                    document.getElementById('photo-caption').value = '';
                    inputArea.classList.add('hidden');
                    this.renderGallery();
                }
            });
        }
    },

    async renderGallery() {
        const container = document.getElementById('gallery-grid');
        if(!container) return;
        const photos = await API.getPhotos();

        container.innerHTML = photos.map(photo => {
            // Random rotation for polaroid effect
            const rot = (Math.random() * 10 - 5).toFixed(1); // -5 to 5 deg
            return `
            <div class="photo-card" style="--rotation: ${rot}deg">
                <img src="${this.escape(photo.url)}" class="photo-img" onerror="this.src='https://via.placeholder.com/200?text=Error'">
                <div class="photo-caption">${this.escape(photo.caption)}</div>
            </div>
            `;
        }).join('');
    },

    // --- Guestbook Logic ---
    bindGuestbook() {
        const sendBtn = document.getElementById('send-msg-btn');
        if(sendBtn) {
            sendBtn.addEventListener('click', async () => {
                const name = document.getElementById('guest-name').value;
                const msg = document.getElementById('guest-msg').value;
                
                if(name && msg) {
                    sendBtn.innerText = 'Signing...';
                    await API.postMessage(name, msg);
                    sendBtn.innerText = 'Sign';
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
                <p style="font-family: 'Caveat'; font-size: 1.4rem;">${this.escape(msg.content)}</p>
            </div>
        `).join('') || '<p>Be the first to sign!</p>';
    },

    // --- Visitors Logic ---
    async renderVisitors() {
        const list = document.getElementById('visitors-list');
        if(!list) return;
        
        let visitors = [];
        try {
            visitors = await API.getVisitors();
        } catch (e) {
            console.error("Failed to load visitors", e);
        }
        
        if (!visitors || visitors.length === 0) {
            list.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px;">暂无数据 或 需要运行 <a href="/api/seed" target="_blank">数据库迁移</a></td></tr>`;
            return;
        }
        
        list.innerHTML = visitors.map(v => {
            // Unmask IP (User requested to see full IP)
            // const ipParts = (v.ip_address || '').split('.');
            // const maskedIP = ipParts.length === 4 
            //    ? `${ipParts[0]}.${ipParts[1]}.*.*` 
            //    : (v.ip_address || 'Unknown');
            const displayIP = v.ip_address || 'Unknown';

            // Location
            let location = 'Unknown Place';
            // Prefer City, Country
            if (v.city && v.country) location = `${v.city}, ${v.country}`;
            else if (v.country) location = v.country;
            else if (v.city) location = v.city;
            
            // User Friendly Device Name
            const ua = (v.user_agent || '').toLowerCase();
            let device = 'Unknown';
            if(ua.includes('windows')) device = 'Windows PC';
            else if(ua.includes('mac os')) device = 'Mac';
            else if(ua.includes('android')) device = 'Android';
            else if(ua.includes('iphone') || ua.includes('ipad')) device = 'iOS';
            else if(ua.includes('linux')) device = 'Linux';

            return `
            <tr>
                <td>
                    <div style="font-family: 'Caveat', cursive; font-size: 1.1rem; color: #2c3e50;">${this.escape(location)}</div>
                    <div style="font-family: monospace; font-size: 0.75rem; color: #95a5a6;">${displayIP}</div>
                </td>
                <td style="font-size: 0.9rem;">${new Date(v.visited_at).toLocaleString()}</td>
                <td style="font-size: 0.9rem;">${device}</td>
            </tr>
            `;
        }).join('');
    },

    escape(str) {
        if(!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => UI.init());




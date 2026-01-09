// 博客数据存储（使用 localStorage 持久化）
let blogs = JSON.parse(localStorage.getItem('blogs')) || [];

// 页面加载时显示所有博客
document.addEventListener('DOMContentLoaded', function() {
    displayBlogs();
});

// 发布博客函数
function publishBlog() {
    const title = document.getElementById('blog-title').value.trim();
    const content = document.getElementById('blog-content').value.trim();

    // 验证输入
    if (!title) {
        alert('请输入博客标题！');
        return;
    }

    if (!content) {
        alert('请输入博客内容！');
        return;
    }

    // 创建新博客对象
    const newBlog = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString('zh-CN')
    };

    // 添加到博客列表（新博客放在最前面）
    blogs.unshift(newBlog);

    // 保存到 localStorage
    saveBlogsToStorage();

    // 清空输入框
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-content').value = '';

    // 重新显示博客列表
    displayBlogs();

    // 显示成功消息
    alert('博客发布成功！');

    // 滚动到博客列表
    document.getElementById('blog-list').scrollIntoView({ behavior: 'smooth' });
}

// 显示所有博客
function displayBlogs() {
    const container = document.getElementById('posts-container');

    // 如果没有博客，显示空状态
    if (blogs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 还没有博客文章</p>
                <p>开始写你的第一篇博客吧！</p>
            </div>
        `;
        return;
    }

    // 生成博客 HTML
    container.innerHTML = blogs.map(blog => `
        <article class="blog-post" data-id="${blog.id}">
            <h3>${escapeHtml(blog.title)}</h3>
            <div class="blog-meta">
                <span>📅 ${blog.date}</span>
            </div>
            <p>${escapeHtml(blog.content)}</p>
            <button class="delete-btn" onclick="deleteBlog(${blog.id})">删除</button>
        </article>
    `).join('');
}

// 删除博客
function deleteBlog(id) {
    if (!confirm('确定要删除这篇博客吗？')) {
        return;
    }

    // 从数组中移除
    blogs = blogs.filter(blog => blog.id !== id);

    // 保存到 localStorage
    saveBlogsToStorage();

    // 重新显示
    displayBlogs();

    // 显示提示
    alert('博客已删除');
}

// 保存到 localStorage
function saveBlogsToStorage() {
    localStorage.setItem('blogs', JSON.stringify(blogs));
}

// 防止 XSS 攻击的 HTML 转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 平滑滚动到指定区域
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (targetId === '#blog') {
            document.getElementById('blog-list').scrollIntoView({ behavior: 'smooth' });
        } else {
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// 键盘快捷键：Ctrl/Cmd + Enter 发布博客
document.getElementById('blog-content').addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        publishBlog();
    }
});

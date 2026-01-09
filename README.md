# 个人博客网站 📝

一个简洁、美观、功能完整的个人博客网站，可以直接使用！

## ✨ 功能特点

- ✍️ **发布博客** - 轻松编写和发布博客文章
- 📱 **响应式设计** - 完美适配电脑、平板和手机
- 💾 **本地存储** - 使用 localStorage 保存博客数据
- 🎨 **精美界面** - 渐变色设计，动画效果
- 🗑️ **删除功能** - 管理你的博客文章
- ⌨️ **快捷键支持** - Ctrl/Cmd + Enter 快速发布

## 🚀 快速开始

### 方法1：直接打开（最简单）
1. 双击 `index.html` 文件
2. 网站会在浏览器中自动打开
3. 开始写博客！

### 方法2：使用本地服务器（推荐）
使用 VS Code 的 Live Server 插件：
1. 在 VS Code 中打开项目文件夹
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"
4. 浏览器会自动打开网站

## 📖 使用说明

### 发布博客
1. 在"发布新博客"区域输入标题
2. 在文本框中写入博客内容
3. 点击"发布博客"按钮
4. 或使用快捷键 `Ctrl + Enter` (Windows) 或 `Cmd + Enter` (Mac)

### 查看博客
- 所有发布的博客会显示在"最新文章"区域
- 最新的博客会显示在最上面

### 删除博客
- 点击每篇博客下方的"删除"按钮
- 确认后即可删除

### 修改个人信息
在 `index.html` 中找到以下部分并修改：
```html
<!-- 修改网站标题 -->
<h1>我的个人博客</h1>

<!-- 修改副标题 -->
<p class="subtitle">记录生活，分享技术</p>

<!-- 修改关于我 -->
<section id="about" class="about-section">
    ...修改这里的内容...
</section>

<!-- 修改联系方式 -->
<section id="contact" class="contact-section">
    ...修改邮箱和社交账号...
</section>
```

## 📁 文件结构

```
个人网站/
├── index.html      # 主页面文件
├── style.css       # 样式文件
├── script.js       # 功能脚本
└── README.md       # 说明文档（本文件）
```

## 🎨 自定义样式

在 `style.css` 中可以修改：
- **主题色** - 搜索 `#667eea` 和 `#764ba2` 修改渐变色
- **字体** - 修改 `font-family`
- **布局** - 调整 `.container` 的 `max-width`

## 💡 技巧

1. **数据持久化** - 博客数据保存在浏览器的 localStorage 中
2. **备份数据** - 打开浏览器控制台（F12），在 Application > Local Storage 中可以查看和备份数据
3. **清除数据** - 在控制台中执行 `localStorage.clear()` 可以清除所有博客

## 🌐 部署到网上

### 使用 GitHub Pages（免费）
1. 在 GitHub 创建一个新仓库
2. 上传所有文件到仓库
3. 在仓库设置中启用 GitHub Pages
4. 你的网站就可以在线访问了！

### 其他选项
- **Netlify** - 拖拽文件夹即可部署
- **Vercel** - 连接 GitHub 自动部署
- **Cloudflare Pages** - 快速且免费

## 🔧 技术栈

- HTML5
- CSS3（渐变、动画、Flexbox）
- JavaScript（ES6+）
- LocalStorage API

## 📝 未来功能（可扩展）

- [ ] 博客分类和标签
- [ ] 搜索功能
- [ ] 评论系统
- [ ] Markdown 支持
- [ ] 图片上传
- [ ] 导出/导入数据

## 💬 问题反馈

如果遇到任何问题，可以：
1. 检查浏览器控制台是否有错误信息
2. 确保使用现代浏览器（Chrome、Firefox、Edge、Safari）
3. 清除浏览器缓存后重试

## 📄 许可证

此项目可自由使用和修改。

---

**祝你写博客愉快！** 🎉

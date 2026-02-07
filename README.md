# 创业聊天模拟器

一个基于 React + Vite 构建的创业主题聊天模拟游戏。

## 项目特性

- 创业主题的聊天模拟游戏
- Vite + React 技术栈
- Tailwind CSS 样式框架
- 响应式设计
- 支持中文界面

## 本地开发

### 环境要求

- Node.js >= 16.0.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建完成后，`dist` 目录包含所有生产文件。

## 宝塔面板部署指南

### 前置条件

1. 已安装宝塔面板
2. 已创建网站（支持 Nginx 或 Apache）
3. 网站已配置 SSL 证书（推荐）

### 部署步骤

#### 1. 上传文件

将项目构建后的 `dist` 目录下的所有文件上传到宝塔网站根目录：

```
/www/wwwroot/your-domain.com/
```

#### 2. Nginx 伪静态配置

如果是 Nginx 服务器，在宝塔面板中进入 **网站设置 → 伪静态**，添加以下配置：

```nginx
# React SPA 路由支持
location / {
    try_files $uri $uri/ /index.html;
}

# 静态资源缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Gzip 压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

**重要提示**：本项目已配置为使用相对路径 (`base: './'`)，因此可以直接部署到子目录中。如果部署到子目录如 `/chat/`，请确保：
1. 将所有文件上传到 `/www/wwwroot/your-domain.com/chat/` 目录
2. 访问地址为 `https://your-domain.com/chat/`

#### 3. Apache 伪静态配置

如果是 Apache 服务器，在网站根目录创建 `.htaccess` 文件：

```apache
RewriteEngine On

# React SPA 路由支持
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# 静态资源缓存
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/svg "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip 压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

#### 4. 宝塔面板配置优化

在 **网站设置 → PHP版本** 中选择 **纯静态**（因为这是前端项目）。

在 **网站设置 → 配置文件** 中确认以下设置：

```nginx
# Nginx 配置优化
server {
    listen 80;
    listen 443 ssl http2;
    server_name your-domain.com;
    index index.html;
    root /www/wwwroot/your-domain.com;
    
    # SSL 证书配置（如果使用 HTTPS）
    ssl_certificate /www/server/panel/vhost/cert/your-domain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/your-domain.com/privkey.pem;
    
    # 上面提到的伪静态配置内容...
}
```

#### 5. 部署验证

1. 访问你的域名，确认网站正常运行
2. 检查浏览器控制台是否有 404 错误
3. 测试页面刷新功能（SPA 路由应该正常工作）
4. 检查静态资源是否正确加载

### 常见问题

#### Q: 页面刷新后出现 404 错误
A: 确认伪静态配置已正确设置，特别是 `try_files $uri $uri/ /index.html;` 这一行。

#### Q: 静态资源加载失败（如 CSS/JS 文件 404）
A: 这个问题通常由以下原因造成：

**原因 1：路径配置问题**
- 确认 `vite.config.js` 中已设置 `base: './'`
- 重新构建项目：`npm run build`
- 上传新的 `dist` 目录内容

**原因 2：文件上传不完整**
- 确认 `assets/` 目录及其中的所有文件都已上传
- 检查文件名是否包含正确的哈希值

**原因 3：Nginx 配置问题**
- 确认伪静态规则正确
- 检查 `root` 路径是否指向正确的目录

**调试步骤：**
1. 检查浏览器开发者工具 Network 面板
2. 确认资源请求 URL 是否正确
3. 检查服务器上是否存在对应的文件

#### Q: 网站访问很慢
A: 启用 Gzip 压缩和静态资源缓存，如上面的配置所示。

#### Q: 部署到子目录后资源加载失败
A: 确认：
1. `vite.config.js` 中设置了 `base: './'`
2. 所有文件都上传到正确的子目录
3. 伪静态配置中的路径正确

### 自动化部署脚本

创建一个部署脚本 `deploy.sh`：

```bash
#!/bin/bash

# 构建项目
npm run build

# 上传到服务器（使用 rsync）
rsync -avz --delete dist/ user@your-server:/www/wwwroot/your-domain.com/

echo "部署完成！"
```

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **状态管理**: Zustand
- **图标库**: Lucide React
- **日期处理**: date-fns

## 许可证

MIT License
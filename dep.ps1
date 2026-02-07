# deploy.ps1 - uni-app 自动化构建部署脚本
# 修复编码问题和路径问题

param(
    [string]$RemoteDir = "/www/wwwroot/xai.tutlab.tech/public/demos/startupchatsimulator",
    [string]$Server = "root@tutlab.tech",
    [string]$LocalDirPub = ".\dist\",
    [switch]$BuildOnly = $false,
    [switch]$SkipBuild = $false,
    [switch]$Clean = $false,
    [string]$RemoteAssetsDir = "/www/wwwroot/xai.tutlab.tech/public/assets/"
)

# 设置控制台编码为UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 设置错误处理
$ErrorActionPreference = "Stop"

# 颜色输出函数
function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

# 获取正确的构建目录
function Get-BuildPath {
    $possiblePaths = @(
        "./dist/"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            Write-Info "找到构建目录: $path"
            return $path
        }
    }
    
    return $null
}

# 检查Node.js环境
function Test-NodeEnvironment {
    Write-Info "检查Node.js环境..."
    
    try {
        $nodeVersion = node --version
        $npmVersion = npm --version
        
        Write-Success "Node.js: $nodeVersion"
        Write-Success "npm: $npmVersion"
        
        return $true
    }
    catch {
        Write-ErrorMsg "Node.js 或 npm 未安装"
        return $false
    }
}

# 安装依赖
function Install-Dependencies {
    Write-Info "检查并安装依赖..."
    
    if (Test-Path "node_modules") {
        # 检查package.json是否有更新
        $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
        $nodeModulesExists = Test-Path "node_modules\vue\package.json"
        
        if (-not $nodeModulesExists) {
            Write-Warning "node_modules不完整，重新安装..."
            npm install
        }
        else {
            Write-Success "依赖已存在，跳过安装"
        }
    }
    else {
        Write-Info "安装项目依赖..."
        npm install
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMsg "依赖安装失败"
        return $false
    }
    
    return $true
}

# 清理构建目录
function Clean-Build {
    Write-Info "清理构建目录..."
    
    $directories = @("dist", "build", "unpackage")
    
    foreach ($dir in $directories) {
        if (Test-Path $dir) {
            Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
            Write-Info "已清理: $dir"
        }
    }
    
    Write-Success "清理完成"
}

# 构建项目
function Build-Project {
    Write-Info "开始构建项目..."
    
   
    if (Test-Path "vite.config.ts") {
        Write-Info "使用Vite构建"
    }
    
    # 执行构建命令
    Write-Info "正在构建..."
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMsg "构建失败"
        return $null
    }
    
    # 等待构建完成并查找构建目录
    Start-Sleep -Seconds 2
    
    $buildPath = Get-BuildPath
    
    if (-not $buildPath) {
        Write-ErrorMsg "未找到构建产物"
        
        # 尝试查找可能的构建文件
        Write-Info "尝试查找构建文件..."
        Get-ChildItem -Path . -Filter "dist" -Recurse -Directory | ForEach-Object {
            Write-Info "找到目录: $($_.FullName)"
        }
        
        return $null
    }
    
    # 检查构建产物
    $files = Get-ChildItem -Path $buildPath -File
    if ($files.Count -eq 0) {
        Write-Warning "构建目录为空，检查子目录..."
        
        # 检查子目录
        Get-ChildItem -Path $buildPath -Directory | ForEach-Object {
            $subFiles = Get-ChildItem -Path $_.FullName -File
            Write-Info "子目录 $($_.Name) 中有 $($subFiles.Count) 个文件"
        }
    }
    else {
        Write-Success "构建成功! 生成 $($files.Count) 个文件"
        
        # 显示主要文件
        Write-Info "主要文件:"
        $files | Select-Object -First 10 | ForEach-Object {
            $size = if ($_.Length -lt 1024) { "$($_.Length) B" }
                    elseif ($_.Length -lt 1048576) { "$([math]::Round($_.Length/1KB, 2)) KB" }
                    else { "$([math]::Round($_.Length/1MB, 2)) MB" }
            Write-Host "  $($_.Name) ($size)" -ForegroundColor Gray
        }
    }
    
    return $buildPath
}

# 部署到服务器
function Deploy-ToServer {
    param(
        [string]$LocalDir,
        [string]$RemoteDir,
        [string]$Server
    )
    Write-Info "开始部署到服务器: $Server"
    
    # 检查本地目录
    if (-not (Test-Path $LocalDirPub)) {
        Write-ErrorMsg "本地目录不存在: $LocalDirPub"
        return $false
    }
    
    try {
        # 使用 scp 上传
        Write-Info "正在上传文件..."
        
        # 构建完整的scp命令
        $sourcePath = $LocalDirPub + "*"
        $destination = "${Server}:${RemoteDir}"
        Write-Host "执行命令: scp -r `"$sourcePath`" `"$destination`"" -ForegroundColor Gray
        
        scp -r "$sourcePath" "$destination"
        
        if ($LASTEXITCODE -ne 0) {
            throw "SCP上传失败 (退出码: $LASTEXITCODE)"
        }
        
        Write-Success "文件上传完成!"
       
        return $true
    }
    catch {
        Write-ErrorMsg "部署失败: $_"
        Write-Info "解决方案:"
        Write-Host "  1. 确保SSH密钥已配置: ssh-copy-id $Server" -ForegroundColor Gray
        Write-Host "  3. 检查服务器目录权限" -ForegroundColor Gray
        return $false
    }
}

# 主流程
function Main {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host "    uni-app 自动化部署脚本" -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host ""
    
    # 0. 清理（如果需要）
    if ($Clean) {
        Clean-Build
    }
    
    # 1. 检查环境
    if (-not (Test-NodeEnvironment)) {
        Write-ErrorMsg "请安装Node.js: https://nodejs.org/"
        exit 1
    }
    
    # 2. 安装依赖
    if (-not (Install-Dependencies)) {
        exit 1
    }
    
    # 3. 构建项目（除非跳过）
    $buildPath = $null
    if (-not $SkipBuild) {
        $buildPath = Build-Project
        
        if (-not $buildPath) {
            Write-ErrorMsg "构建失败，退出"
            exit 1
        }
    }
  
    
    Write-Info "使用构建目录: $buildPath"
    
    # 4. 如果只构建不部署，则停止
    if ($BuildOnly) {
        Write-Success "构建完成，跳过部署"
        Write-Host ""
        Write-Host "构建目录: $buildPath" -ForegroundColor Green
        Write-Host "本地预览: 打开 $buildPath\index.html" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "手动部署命令:" -ForegroundColor Yellow
        Write-Host "  scp -r `"$buildPath*`" ${Server}:${RemoteDir}" -ForegroundColor Gray
        return
    }
    
    # 5. 部署到服务器
    if (-not (Deploy-ToServer -LocalDir $buildPath -RemoteDir $RemoteDir -Server $Server)) {
        exit 1
    }
    
    Write-Host " https://xai.tutlab.tech/"
}

# 执行主函数
Main
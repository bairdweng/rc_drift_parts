# 代理使用指南

## 功能说明

下载脚本现在支持代理功能，可以通过命令行参数控制是否使用代理。

## 使用方法

### 1. 设置代理环境变量

在终端中设置代理环境变量：

```bash
# HTTP代理
export http_proxy=http://127.0.0.1:9090
export HTTP_PROXY=http://127.0.0.1:9090

# HTTPS代理
export https_proxy=http://127.0.0.1:9090
export HTTPS_PROXY=http://127.0.0.1:9090

# 全局代理（SOCKS5）
export all_proxy=socks5://127.0.0.1:9091
export ALL_PROXY=socks5://127.0.0.1:9091
```

### 2. 使用代理下载图片

启用代理模式：
```bash
node utils/download-images.js download --proxy
# 或者使用简写
node utils/download-images.js download -p
```

### 3. 不使用代理下载图片

禁用代理模式（默认）：
```bash
node utils/download-images.js download
```

### 4. 检查远程URL状态

检查远程URL状态（可配合代理）：
```bash
# 使用代理检查
node utils/download-images.js check --proxy

# 不使用代理检查
node utils/download-images.js check
```

## 命令行参数

- `download` - 下载所有远程图片
- `check` - 检查远程URL状态
- `--proxy` 或 `-p` - 启用代理模式

## 代理配置优先级

脚本会按照以下优先级使用代理配置：

1. **HTTPS URL**: 使用 `https_proxy` > `all_proxy`
2. **HTTP URL**: 使用 `http_proxy` > `all_proxy`

## 示例

### 示例1：使用代理下载

```bash
# 设置代理环境变量
export https_proxy=http://127.0.0.1:9090

# 使用代理下载
node utils/download-images.js download --proxy
```

### 示例2：检查代理配置

```bash
# 设置代理
export all_proxy=socks5://127.0.0.1:9091

# 检查远程URL状态（显示代理配置）
node utils/download-images.js check --proxy
```

## 注意事项

1. **代理环境变量**：脚本会自动读取系统环境变量中的代理设置
2. **SSL证书验证**：在代理模式下，HTTPS连接会禁用SSL证书验证（仅用于开发环境）
3. **错误处理**：如果代理配置无效或连接失败，脚本会尝试直连
4. **超时设置**：代理连接的超时时间为10秒

## 故障排除

如果代理连接失败，检查以下内容：

1. 代理服务器是否正常运行
2. 代理端口是否正确
3. 代理协议是否匹配（HTTP/HTTPS/SOCKS5）
4. 防火墙设置是否允许连接

## 支持的代理类型

- HTTP代理
- HTTPS代理  
- SOCKS5代理（通过all_proxy环境变量）
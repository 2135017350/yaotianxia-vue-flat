# 存储服务抽象层

本目录包含文件存储的抽象层实现，支持多种存储后端，方便未来无缝切换。

## 架构设计

```
StorageService (抽象基类)
├── LocalStorageService (本地文件系统存储) ✓ 已实现
└── S3StorageService (S3 兼容存储) ✓ 已预留
```

## 快速开始

### 默认配置（本地存储）

项目默认使用 `LocalStorageService`，文件保存在 `server/public/downloads` 目录。

**无需任何配置，开箱即用！**

### 切换到云存储（S3 兼容）

如需切换到阿里云 OSS、腾讯云 COS 或 AWS S3，按以下步骤操作：

#### 1. 安装依赖
```bash
npm install aws-sdk
# 或使用 yarn
yarn add aws-sdk
```

#### 2. 配置环境变量（.env 文件）

**阿里云 OSS 示例：**
```env
# 存储服务类型
STORAGE_SERVICE=s3

# S3 配置
S3_REGION=oss-cn-hangzhou
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key
S3_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
```

**腾讯云 COS 示例：**
```env
S3_REGION=ap-beijing
S3_BUCKET=your-bucket-id
S3_ACCESS_KEY_ID=your-secret-id
S3_SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=https://cos.ap-beijing.myqcloud.com
```

**AWS S3 示例：**
```env
S3_REGION=us-east-1
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key
# 不需要设置 S3_ENDPOINT
```

#### 3. 修改 server/routes/upload.js

找到以下代码：
```javascript
// 初始化存储服务（默认使用本地存储）
const storageService = new LocalStorageService()
```

改为：
```javascript
// 初始化存储服务（使用 S3 兼容存储）
import S3StorageService from '../services/S3StorageService.js'
const storageService = new S3StorageService()
```

#### 4. 重启后端服务

```bash
node server/index.js
```

## API 接口

所有存储实现都必须实现以下接口：

### saveFile(fileName, fileBuffer, mimeType)
保存文件到存储后端。

**参数：**
- `fileName` (string): 原始文件名（包含扩展名）
- `fileBuffer` (Buffer): 文件内容缓冲区
- `mimeType` (string): 文件 MIME 类型

**返回：**
```javascript
{
  path: string,      // 文件路径（用于数据库存储）
  url: string,       // 文件访问 URL
  fileName: string   // 实际保存的文件名
}
```

### getFileStream(filePath)
获取文件内容（用于下载）。

**参数：**
- `filePath` (string): 文件路径（由 saveFile 返回）

**返回：**
- `Buffer` 或 `Stream`: 文件内容

### deleteFile(filePath)
删除文件。

**参数：**
- `filePath` (string): 文件路径（由 saveFile 返回）

**返回：**
- `boolean`: 删除成功返回 true

### fileExists(filePath)
检查文件是否存在。

**参数：**
- `filePath` (string): 文件路径（由 saveFile 返回）

**返回：**
- `boolean`: 存在返回 true

## 实现自定义存储后端

如需实现自定义存储后端（如 MinIO、七牛云等），请按以下步骤操作：

### 1. 创建新的存储类

创建文件 `server/services/CustomStorageService.js`：

```javascript
import { StorageService } from './StorageService.js'

export class CustomStorageService extends StorageService {
  constructor() {
    super()
    // 初始化您的存储客户端
  }

  async saveFile(fileName, fileBuffer, mimeType) {
    // 实现保存逻辑
    return {
      path: '...',
      url: '...',
      fileName: fileName
    }
  }

  async getFileStream(filePath) {
    // 实现读取逻辑
    return fileBuffer
  }

  async deleteFile(filePath) {
    // 实现删除逻辑
    return true
  }

  async fileExists(filePath) {
    // 实现检查逻辑
    return true
  }
}

export default CustomStorageService
```

### 2. 在 upload.js 中使用

```javascript
import CustomStorageService from '../services/CustomStorageService.js'
const storageService = new CustomStorageService()
```

## 常见问题

### Q: 本地存储的文件会在服务器重启后丢失吗？
**A:** 不会。文件保存在磁盘上的 `server/public/downloads` 目录，服务器重启不会影响文件。

### Q: 如何备份本地存储的文件？
**A:** 直接备份 `server/public/downloads` 目录即可。

### Q: 如何从本地存储迁移到云存储？
**A:** 
1. 按照上述步骤配置云存储
2. 修改 upload.js 中的存储服务
3. 重启服务后，新上传的文件将保存到云存储
4. 旧文件仍保存在本地，可手动迁移或删除

### Q: S3 存储支持哪些云服务商？
**A:** 支持所有 S3 兼容的服务，包括：
- AWS S3
- 阿里云 OSS
- 腾讯云 COS
- MinIO
- 其他 S3 兼容服务

## 性能考虑

| 存储方案 | 优点 | 缺点 | 适用场景 |
|--------|------|------|--------|
| 本地存储 | 无网络延迟，简单易用 | 单机限制，容器重启丢失 | 开发、测试、小规模部署 |
| S3 存储 | 高可用，自动备份，支持 CDN | 网络延迟，需要付费 | 生产环境，大规模部署 |

## 许可证

MIT

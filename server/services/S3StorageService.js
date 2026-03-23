import { StorageService } from './StorageService.js'

/**
 * S3 兼容存储实现（阿里云 OSS、腾讯云 COS、AWS S3 等）
 * 
 * 使用说明：
 * 1. 安装依赖: npm install aws-sdk
 * 2. 配置 .env 文件:
 *    S3_REGION=oss-cn-hangzhou
 *    S3_BUCKET=your-bucket-name
 *    S3_ACCESS_KEY_ID=your-access-key
 *    S3_SECRET_ACCESS_KEY=your-secret-key
 *    S3_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com (可选，用于自定义端点)
 * 3. 在 server/index.js 中切换存储服务:
 *    import S3StorageService from './services/S3StorageService.js'
 *    const storageService = new S3StorageService()
 */
export class S3StorageService extends StorageService {
  constructor() {
    super()
    // 延迟加载 aws-sdk，避免未安装时报错
    this.s3Client = null
    this.bucket = process.env.S3_BUCKET || 'your-bucket'
    this.region = process.env.S3_REGION || 'oss-cn-hangzhou'
    this.endpoint = process.env.S3_ENDPOINT || null
    
    console.log('[S3Storage] 初始化 S3 存储服务')
    console.log(`  - Bucket: ${this.bucket}`)
    console.log(`  - Region: ${this.region}`)
    if (this.endpoint) {
      console.log(`  - Endpoint: ${this.endpoint}`)
    }
  }

  /**
   * 初始化 S3 客户端
   */
  async initS3Client() {
    if (this.s3Client) return

    try {
      const AWS = await import('aws-sdk')
      const s3 = AWS.default.S3

      this.s3Client = new s3({
        region: this.region,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        endpoint: this.endpoint,
        s3ForcePathStyle: true, // 用于兼容 MinIO 等自建 S3 服务
      })

      console.log('[S3Storage] S3 客户端初始化成功')
    } catch (error) {
      console.error('[S3Storage] 初始化失败，请先安装 aws-sdk: npm install aws-sdk')
      throw error
    }
  }

  /**
   * 保存文件到 S3
   * @param {string} fileName - 原始文件名
   * @param {Buffer} fileBuffer - 文件内容缓冲区
   * @param {string} mimeType - 文件 MIME 类型
   * @returns {Promise<{path: string, url: string}>}
   */
  async saveFile(fileName, fileBuffer, mimeType) {
    try {
      await this.initS3Client()

      // 生成唯一的 S3 对象键
      const timestamp = Date.now()
      const objectKey = `uploads/${timestamp}_${fileName}`

      const params = {
        Bucket: this.bucket,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: mimeType,
        Metadata: {
          'original-name': fileName,
        }
      }

      const result = await this.s3Client.upload(params).promise()

      console.log(`[S3Storage] 文件已上传: ${objectKey}`)

      return {
        path: objectKey,
        url: result.Location, // S3 返回的完整 URL
        fileName: fileName
      }
    } catch (error) {
      console.error('[S3Storage] 上传文件失败:', error)
      throw error
    }
  }

  /**
   * 获取文件流
   * @param {string} filePath - 文件对象键
   * @returns {Promise<Buffer>}
   */
  async getFileStream(filePath) {
    try {
      await this.initS3Client()

      const params = {
        Bucket: this.bucket,
        Key: filePath
      }

      const result = await this.s3Client.getObject(params).promise()
      console.log(`[S3Storage] 文件已读取: ${filePath}`)

      return result.Body
    } catch (error) {
      console.error('[S3Storage] 读取文件失败:', error)
      throw error
    }
  }

  /**
   * 删除文件
   * @param {string} filePath - 文件对象键
   * @returns {Promise<boolean>}
   */
  async deleteFile(filePath) {
    try {
      await this.initS3Client()

      const params = {
        Bucket: this.bucket,
        Key: filePath
      }

      await this.s3Client.deleteObject(params).promise()
      console.log(`[S3Storage] 文件已删除: ${filePath}`)

      return true
    } catch (error) {
      console.error('[S3Storage] 删除文件失败:', error)
      throw error
    }
  }

  /**
   * 检查文件是否存在
   * @param {string} filePath - 文件对象键
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      await this.initS3Client()

      const params = {
        Bucket: this.bucket,
        Key: filePath
      }

      await this.s3Client.headObject(params).promise()
      return true
    } catch (error) {
      if (error.code === 'NotFound' || error.statusCode === 404) {
        return false
      }
      console.error('[S3Storage] 检查文件失败:', error)
      throw error
    }
  }
}

export default S3StorageService

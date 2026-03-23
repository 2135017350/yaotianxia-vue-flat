import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { StorageService } from './StorageService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 本地文件系统存储实现
 * 将文件保存到服务器磁盘
 */
export class LocalStorageService extends StorageService {
  constructor(uploadDir = null) {
    super()
    // 默认上传目录：server/public/downloads
    this.uploadDir = uploadDir || path.join(__dirname, '../public/downloads')
    
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
      console.log(`[LocalStorage] 创建上传目录: ${this.uploadDir}`)
    }
  }

  /**
   * 保存文件到本地磁盘
   * @param {string} fileName - 原始文件名（包含中文）
   * @param {Buffer} fileBuffer - 文件内容缓冲区
   * @param {string} mimeType - 文件 MIME 类型
   * @returns {Promise<{path: string, url: string}>}
   */
  async saveFile(fileName, fileBuffer, mimeType) {
    try {
      // 修复 multer 中文乱码问题：将 latin1 编码的文件名转换为 UTF-8
      let correctedFileName = fileName
      try {
        // 尝试从 latin1 转换为 UTF-8
        correctedFileName = Buffer.from(fileName, 'latin1').toString('utf8')
        console.log(`[LocalStorage] 文件名编码修正: ${fileName} -> ${correctedFileName}`)
      } catch (err) {
        console.warn(`[LocalStorage] 文件名编码修正失败，使用原始名称: ${err.message}`)
        correctedFileName = fileName
      }

      // 生成唯一的文件名（避免重名覆盖）
      const timestamp = Date.now()
      const uniqueFileName = `${timestamp}_${correctedFileName}`
      const filePath = path.join(this.uploadDir, uniqueFileName)

      // 写入文件到磁盘
      await fs.promises.writeFile(filePath, fileBuffer)

      // 返回相对路径（用于数据库存储）和访问 URL
      const relativePath = `/downloads/${uniqueFileName}`
      console.log(`[LocalStorage] 文件已保存: ${filePath}`)

      return {
        path: relativePath,
        url: relativePath, // 本地存储中，path 和 url 相同
        fileName: uniqueFileName
      }
    } catch (error) {
      console.error('[LocalStorage] 保存文件失败:', error)
      throw error
    }
  }

  /**
   * 获取文件流（用于下载）
   * @param {string} filePath - 文件相对路径
   * @returns {Promise<Buffer>}
   */
  async getFileStream(filePath) {
    try {
      // 检查路径是否有效
      if (!filePath || typeof filePath !== 'string') {
        throw new Error(`无效的文件路径: ${filePath}`)
      }

      // 构建完整路径
      const fullPath = path.join(__dirname, '../public', filePath)

      // 检查文件是否存在
      if (!fs.existsSync(fullPath)) {
        throw new Error(`文件不存在: ${fullPath}`)
      }

      // 读取文件内容
      const fileBuffer = await fs.promises.readFile(fullPath)
      console.log(`[LocalStorage] 文件已读取: ${fullPath}`)

      return fileBuffer
    } catch (error) {
      console.error('[LocalStorage] 读取文件失败:', error)
      throw error
    }
  }

  /**
   * 删除文件
   * @param {string} filePath - 文件相对路径
   * @returns {Promise<boolean>}
   */
  async deleteFile(filePath) {
    try {
      // 检查路径是否有效
      if (!filePath || typeof filePath !== 'string') {
        console.warn(`[LocalStorage] 跳过删除：无效的文件路径: ${filePath}`)
        return false
      }

      const fullPath = path.join(__dirname, '../public', filePath)

      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath)
        console.log(`[LocalStorage] 文件已删除: ${fullPath}`)
        return true
      } else {
        console.warn(`[LocalStorage] 文件不存在，无法删除: ${fullPath}`)
        return false
      }
    } catch (error) {
      console.error('[LocalStorage] 删除文件失败:', error)
      throw error
    }
  }

  /**
   * 检查文件是否存在
   * @param {string} filePath - 文件相对路径
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      // 检查路径是否有效
      if (!filePath || typeof filePath !== 'string') {
        console.warn(`[LocalStorage] 跳过检查：无效的文件路径: ${filePath}`)
        return false
      }

      const fullPath = path.join(__dirname, '../public', filePath)
      return fs.existsSync(fullPath)
    } catch (error) {
      console.error('[LocalStorage] 检查文件失败:', error)
      return false
    }
  }
}

export default LocalStorageService

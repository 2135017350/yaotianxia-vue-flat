import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { StorageService } from './StorageService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 本地文件系统存储实现
 * 将文件保存到服务器磁盘的 server/public/downloads 目录
 */
export default class LocalStorageService extends StorageService {
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
   * @returns {Promise<{path: string, url: string, fileName: string}>}
   */
  async saveFile(fileName, fileBuffer, mimeType) {
    try {
      // 修复 multer 中文乱码问题：将 latin1 编码的文件名转换为 UTF-8
      let correctedFileName = fileName
      try {
        const decoded = Buffer.from(fileName, 'latin1').toString('utf8')
        if (this.isValidFileName(decoded)) {
          correctedFileName = decoded
          console.log(`[LocalStorage] 文件名编码修正: ${fileName} -> ${correctedFileName}`)
        } else {
          correctedFileName = this.sanitizeFileName(fileName)
        }
      } catch (err) {
        console.warn(`[LocalStorage] 文件名编码修正失败: ${err.message}`)
        correctedFileName = this.sanitizeFileName(fileName)
      }

      // 生成唯一的文件名（避免重名覆盖）
      const timestamp = Date.now()
      const uniqueFileName = `${timestamp}_${correctedFileName}`
      const filePath = path.join(this.uploadDir, uniqueFileName)

      // 检查 fileBuffer 是否有效
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error(`文件内容为空: Buffer 大小 = ${fileBuffer ? fileBuffer.length : 0} bytes`)
      }

      console.log(`[LocalStorage] 准备写入文件: ${filePath}, 大小 = ${fileBuffer.length} bytes`)

      // 写入文件到磁盘
      await fs.promises.writeFile(filePath, fileBuffer)

      // 验证文件是否成功写入
      const stats = await fs.promises.stat(filePath)
      if (stats.size === 0) {
        throw new Error(`文件写入失败: 实际文件大小为 0 bytes`)
      }
      if (stats.size !== fileBuffer.length) {
        console.warn(`[LocalStorage] 警告: 文件大小不匹配，预期 = ${fileBuffer.length} bytes, 实际 = ${stats.size} bytes`)
      }

      // 返回相对路径（用于数据库存储和前端访问）
      const relativePath = `/downloads/${uniqueFileName}`
      console.log(`[LocalStorage] 文件已保存: ${filePath}, 大小 = ${stats.size} bytes, 相对路径 = ${relativePath}`)

      return {
        path: relativePath,
        url: relativePath,
        fileName: uniqueFileName
      }
    } catch (error) {
      console.error('[LocalStorage] 保存文件失败:', error)
      throw error
    }
  }

  /**
   * 获取文件流（用于下载）
   * @param {string} filePath - 文件相对路径（如 /downloads/123_file.pdf）
   * @returns {Promise<Buffer>}
   */
  async getFileStream(filePath) {
    try {
      if (!filePath || typeof filePath !== 'string') {
        throw new Error(`无效的文件路径: ${filePath}`)
      }

      // 移除前缀 /downloads/，得到文件名
      const fileName = filePath.startsWith('/downloads/')
        ? filePath.slice(10)
        : filePath

      const fullPath = path.join(this.uploadDir, fileName)

      // 安全检查：确保路径在 uploadDir 内
      const realPath = await fs.promises.realpath(fullPath)
      const realUploadDir = await fs.promises.realpath(this.uploadDir)
      if (!realPath.startsWith(realUploadDir)) {
        throw new Error(`路径越界: ${filePath}`)
      }

      console.log(`[LocalStorage] 读取文件: ${fullPath}`)
      const buffer = await fs.promises.readFile(fullPath)
      return buffer
    } catch (error) {
      console.error('[LocalStorage] 读取文件失败:', error)
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
      if (!filePath || typeof filePath !== 'string') {
        return false
      }

      const fileName = filePath.startsWith('/downloads/')
        ? filePath.slice(10)
        : filePath

      const fullPath = path.join(this.uploadDir, fileName)
      await fs.promises.access(fullPath, fs.constants.F_OK)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 删除文件
   * @param {string} filePath - 文件相对路径
   * @returns {Promise<void>}
   */
  async deleteFile(filePath) {
    try {
      if (!filePath || typeof filePath !== 'string') {
        throw new Error(`无效的文件路径: ${filePath}`)
      }

      const fileName = filePath.startsWith('/downloads/')
        ? filePath.slice(10)
        : filePath

      const fullPath = path.join(this.uploadDir, fileName)

      // 安全检查
      const realPath = await fs.promises.realpath(fullPath)
      const realUploadDir = await fs.promises.realpath(this.uploadDir)
      if (!realPath.startsWith(realUploadDir)) {
        throw new Error(`路径越界: ${filePath}`)
      }

      await fs.promises.unlink(fullPath)
      console.log(`[LocalStorage] 文件已删除: ${fullPath}`)
    } catch (error) {
      console.error('[LocalStorage] 删除文件失败:', error)
      throw error
    }
  }

  /**
   * 验证文件名是否有效（不包含非法字符）
   */
  isValidFileName(fileName) {
    // 检查是否包含非法字符
    const invalidChars = /[<>:"|?*\x00-\x1f]/g
    return !invalidChars.test(fileName) && fileName.length > 0 && fileName.length <= 255
  }

  /**
   * 清理文件名（移除非法字符）
   */
  sanitizeFileName(fileName) {
    return fileName
      .replace(/[<>:"|?*\x00-\x1f]/g, '_')
      .replace(/\.{2,}/g, '.')
      .slice(0, 255)
  }
}

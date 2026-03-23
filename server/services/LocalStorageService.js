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
   * 保存文件到本地窗盘
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
        const decoded = Buffer.from(fileName, 'latin1').toString('utf8')
        // 检查转换后的字符串是否有效（消除控制字符和非法字符）
        if (this.isValidFileName(decoded)) {
          correctedFileName = decoded
          console.log(`[LocalStorage] 文件名编码修正: ${fileName} -> ${correctedFileName}`)
        } else {
          console.warn(`[LocalStorage] 转换后的文件名包含非法字符，使用清理后的名称`)
          correctedFileName = this.sanitizeFileName(fileName)
        }
      } catch (err) {
        console.warn(`[LocalStorage] 文件名编码修正失败: ${err.message}，使用清理后的名称`)
        correctedFileName = this.sanitizeFileName(fileName)
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

  /**
   * 检查文件名是否有效（不含非法字符）
   * @param {string} fileName - 文件名
   * @returns {boolean}
   */
  isValidFileName(fileName) {
    if (!fileName || typeof fileName !== 'string') return false
    // Windows 不允许的字符: < > : " / \ | ? *
    // 也不允许控制字符 (ASCII 0-31)
    const invalidChars = /[<>:"|/?*\x00-\x1f]/g
    return !invalidChars.test(fileName)
  }

  /**
   * 清理文件名中的非法字符
   * @param {string} fileName - 原始文件名
   * @returns {string} 清理后的文件名
   */
  sanitizeFileName(fileName) {
    if (!fileName || typeof fileName !== 'string') {
      return `file_${Date.now()}`
    }

    // 离沐非法字符（不删除，改为下划线）
    let sanitized = fileName
      .replace(/[<>:"|/?*\x00-\x1f]/g, '_')  // Windows 非法字符
      .replace(/\.{2,}/g, '.')                // 不允许连续的点
      .trim()

    // 如果清理后为空，使用时间戳作为文件名
    if (!sanitized || sanitized === '') {
      sanitized = `file_${Date.now()}`
    }

    console.log(`[LocalStorage] 文件名已清理: ${fileName} -> ${sanitized}`)
    return sanitized
  }
}

export default LocalStorageService

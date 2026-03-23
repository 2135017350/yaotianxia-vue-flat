/**
 * 存储服务抽象基类
 * 定义所有存储实现必须遵循的接口
 */
export class StorageService {
  /**
   * 保存文件
   * @param {string} fileName - 原始文件名（包含扩展名）
   * @param {Buffer} fileBuffer - 文件内容缓冲区
   * @param {string} mimeType - 文件 MIME 类型
   * @returns {Promise<{path: string, url: string}>} 返回文件路径和访问 URL
   */
  async saveFile(fileName, fileBuffer, mimeType) {
    throw new Error('saveFile 方法必须由子类实现')
  }

  /**
   * 获取文件流（用于下载）
   * @param {string} filePath - 文件路径（由 saveFile 返回）
   * @returns {Promise<Buffer|Stream>} 返回文件内容或流
   */
  async getFileStream(filePath) {
    throw new Error('getFileStream 方法必须由子类实现')
  }

  /**
   * 删除文件
   * @param {string} filePath - 文件路径（由 saveFile 返回）
   * @returns {Promise<boolean>} 删除成功返回 true
   */
  async deleteFile(filePath) {
    throw new Error('deleteFile 方法必须由子类实现')
  }

  /**
   * 检查文件是否存在
   * @param {string} filePath - 文件路径（由 saveFile 返回）
   * @returns {Promise<boolean>} 存在返回 true
   */
  async fileExists(filePath) {
    throw new Error('fileExists 方法必须由子类实现')
  }
}

export default StorageService

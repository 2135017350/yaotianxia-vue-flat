-- 药天下数据库初始化脚本（MySQL 版本）

-- 删除已存在的数据库
DROP DATABASE IF EXISTS `yaotianxia`;

-- 创建数据库
CREATE DATABASE `yaotianxia` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `yaotianxia`;

-- 用户表
CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
  `password` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `phone` VARCHAR(20) COMMENT '电话',
  `role` ENUM('admin', 'user') DEFAULT 'user' COMMENT '角色',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 下载资源表
CREATE TABLE `download_resources` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT '资源名称',
  `description` TEXT COMMENT '资源描述',
  `size` VARCHAR(50) COMMENT '文件大小',
  `file_name` VARCHAR(255) NOT NULL COMMENT '文件名',
  `file_path` VARCHAR(500) NOT NULL COMMENT '文件路径（相对于 /downloads）',
  `type` ENUM('contract', 'video') DEFAULT 'contract' COMMENT '资源类型',
  `media_type` VARCHAR(100) COMMENT 'MIME 类型',
  `created_by` INT COMMENT '上传者 ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='下载资源表';

-- 联系信息表
CREATE TABLE `contact_messages` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '姓名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) COMMENT '电话',
  `company` VARCHAR(100) COMMENT '公司',
  `subject` VARCHAR(255) NOT NULL COMMENT '主题',
  `message` LONGTEXT NOT NULL COMMENT '留言内容',
  `status` ENUM('unread', 'read', 'replied') DEFAULT 'unread' COMMENT '状态',
  `reply_message` LONGTEXT COMMENT '回复内容',
  `replied_at` TIMESTAMP NULL COMMENT '回复时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='联系信息表';

-- 表单提交记录表
CREATE TABLE `form_submissions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `form_type` VARCHAR(50) NOT NULL COMMENT '表单类型（如 trial_apply, project_report）',
  `name` VARCHAR(100) NOT NULL COMMENT '姓名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) COMMENT '电话',
  `company` VARCHAR(100) COMMENT '公司',
  `content` LONGTEXT COMMENT '表单内容',
  `status` ENUM('pending', 'processing', 'completed') DEFAULT 'pending' COMMENT '状态',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='表单提交记录表';

-- 创建索引
CREATE INDEX `idx_users_email` ON `users` (`email`);
CREATE INDEX `idx_users_role` ON `users` (`role`);
CREATE INDEX `idx_download_resources_created_by` ON `download_resources` (`created_by`);
CREATE INDEX `idx_download_resources_created_at` ON `download_resources` (`created_at`);
CREATE INDEX `idx_contact_messages_status` ON `contact_messages` (`status`);
CREATE INDEX `idx_contact_messages_created_at` ON `contact_messages` (`created_at`);
CREATE INDEX `idx_form_submissions_form_type` ON `form_submissions` (`form_type`);
CREATE INDEX `idx_form_submissions_created_at` ON `form_submissions` (`created_at`);

-- 插入默认管理员用户（密码：admin123，已使用 bcrypt 加密）
-- 使用 bcryptjs 生成的哈希值：$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv9a
INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES 
('admin', 'admin@yaotianxia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv9a', 'admin');

-- 插入示例下载资源
INSERT INTO `download_resources` (`name`, `description`, `size`, `file_name`, `file_path`, `type`, `created_by`) VALUES 
('示例合同', '这是一份示例合同文件', '100KB', 'sample_contract.pdf', '/downloads/sample_contract.pdf', 'contract', 1);

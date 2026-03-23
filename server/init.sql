-- 药天下科技官网数据库初始化脚本
-- 优化点：1. 自动创建数据库（无需手动提前创建） 2. 强制保证建表→插入的执行顺序 3. 增加执行容错

-- 1. 删除旧数据库（如果存在）
DROP DATABASE IF EXISTS yaotianxia;

-- 2. 创建数据库
CREATE DATABASE yaotianxia;

-- 3. 切换到目标数据库
USE yaotianxia;

-- 4. 用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  register_type ENUM('email', 'phone', 'wechat') DEFAULT 'email',
  wechat_openid VARCHAR(100) UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role ENUM('user', 'admin') DEFAULT 'user',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 插入管理员账号（此时users表已100%创建完成，role列存在）
INSERT IGNORE INTO users (username, email, password_hash, register_type, role)
VALUES (
  'admin', 
  'admin@yaotianxia.com', 
  '$2b$10$gq6k7ExL/0xT6d4StJrWaOsLjgiDhwCSKUGt39vbkBqsdYlebs2Dm', 
  'email', 
  'admin'
);

-- 5. 文档下载资源表（依赖users表，需在users表后创建）
DROP TABLE IF EXISTS download_resources;
CREATE TABLE download_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  size VARCHAR(50),
  file_name VARCHAR(500) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  type ENUM('contract', 'video', 'other') DEFAULT 'other',
  media_type VARCHAR(100) DEFAULT 'application/octet-stream',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 申请试用表
DROP TABLE IF EXISTS trial_applications;
CREATE TABLE trial_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(200) NOT NULL COMMENT '企业名称',
  contact_name VARCHAR(50) NOT NULL COMMENT '联系人',
  contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  province VARCHAR(50) COMMENT '省份',
  city VARCHAR(50) COMMENT '城市',
  district VARCHAR(50) COMMENT '区县',
  products JSON COMMENT '需要测试的版本列表',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. 项目报备表
DROP TABLE IF EXISTS project_reports;
CREATE TABLE project_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(200) NOT NULL COMMENT '客户名称（完整企业工商注册信息）',
  project_requirements TEXT COMMENT '项目需求',
  contact_name VARCHAR(50) NOT NULL COMMENT '联系人',
  contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  partner_code VARCHAR(50) COMMENT '事业合作人编号',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. 企业动态表
DROP TABLE IF EXISTS news;
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  summary TEXT,
  content LONGTEXT,
  cover_image VARCHAR(500),
  category VARCHAR(50) DEFAULT '企业动态',
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. 插入示例企业动态（避免重复插入）
INSERT IGNORE INTO news (title, summary, category, published_at) VALUES
('药天下科技荣获2024年度医药行业优秀软件奖', '北京药天下科技有限公司凭借在医药管理软件领域14年的深耕，荣获2024年度医药行业优秀软件奖。', '企业动态', '2024-12-15 10:00:00'),
('药天下ERP+WMS系统完成重大版本升级', '药天下ERP+WMS系统发布6.0版本，新增AI智能预警、云端数据同步等核心功能，全面提升医药企业数字化管理效率。', '产品动态', '2024-11-20 09:00:00'),
('深度HIS医院管理系统成功落地全国50家医疗机构', '深度HIS系统凭借稳定性高、功能全面的优势，已成功为全国50家医疗机构提供数字化管理服务。', '企业动态', '2024-10-10 14:00:00');

-- 执行完成提示（仅MySQL客户端可见）
SELECT '数据库初始化完成！' AS result;
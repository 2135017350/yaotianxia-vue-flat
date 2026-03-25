-- 药天下科技官网数据库初始化脚本（SQL Server 版本）
-- 优化点：1. 自动创建数据库 2. 强制保证建表→插入的执行顺序 3. 增加执行容错

-- 1. 删除旧数据库（如果存在）
IF DB_ID('yaotianxia') IS NOT NULL
  DROP DATABASE yaotianxia;

-- 2. 创建数据库
CREATE DATABASE yaotianxia;

-- 3. 切换到目标数据库
USE yaotianxia;

-- 4. 用户表
CREATE TABLE users (
  id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  register_type VARCHAR(20) DEFAULT 'email' CHECK (register_type IN ('email', 'phone', 'wechat')),
  wechat_openid VARCHAR(100) UNIQUE,
  is_verified BIT DEFAULT 0,
  last_login DATETIME NULL,
  created_at DATETIME DEFAULT GETDATE(),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  updated_at DATETIME DEFAULT GETDATE()
);

-- 5. 插入管理员账号
INSERT INTO users (username, email, password_hash, register_type, role)
VALUES (
  'admin', 
  'admin@yaotianxia.com', 
  '$2b$10$gq6k7ExL/0xT6d4StJrWaOsLjgiDhwCSKUGt39vbkBqsdYlebs2Dm', 
  'email', 
  'admin'
);

-- 6. 文档下载资源表（依赖users表，需在users表后创建）
CREATE TABLE download_resources (
  id INT PRIMARY KEY IDENTITY(1,1),
  name VARCHAR(500) NOT NULL,
  description TEXT,
  size VARCHAR(50),
  file_name VARCHAR(500) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  type VARCHAR(50) DEFAULT 'other' CHECK (type IN ('contract', 'video', 'other')),
  media_type VARCHAR(100) DEFAULT 'application/octet-stream',
  created_by INT,
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 7. 申请试用表
CREATE TABLE trial_applications (
  id INT PRIMARY KEY IDENTITY(1,1),
  company_name VARCHAR(200) NOT NULL,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  products NVARCHAR(MAX),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at DATETIME DEFAULT GETDATE()
);

-- 8. 项目报备表
CREATE TABLE project_reports (
  id INT PRIMARY KEY IDENTITY(1,1),
  customer_name VARCHAR(200) NOT NULL,
  project_requirements TEXT,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  partner_code VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at DATETIME DEFAULT GETDATE()
);

-- 9. 企业动态表
CREATE TABLE news (
  id INT PRIMARY KEY IDENTITY(1,1),
  title VARCHAR(200) NOT NULL,
  summary TEXT,
  content NVARCHAR(MAX),
  cover_image VARCHAR(500),
  category VARCHAR(50) DEFAULT '企业动态',
  published_at DATETIME DEFAULT GETDATE(),
  created_at DATETIME DEFAULT GETDATE()
);

-- 10. 联系我们表
CREATE TABLE contact_messages (
  id INT PRIMARY KEY IDENTITY(1,1),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(200),
  subject VARCHAR(200) NOT NULL,
  message NVARCHAR(MAX) NOT NULL,
  status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at DATETIME DEFAULT GETDATE(),
  replied_at DATETIME NULL,
  reply_message NVARCHAR(MAX)
);

-- 11. 插入示例企业动态
INSERT INTO news (title, summary, category, published_at) VALUES
('药天下科技荣获2024年度医药行业优秀软件奖', '北京药天下科技有限公司凭借在医药管理软件领域14年的深耕，荣获2024年度医药行业优秀软件奖。', '企业动态', '2024-12-15 10:00:00'),
('药天下ERP+WMS系统完成重大版本升级', '药天下ERP+WMS系统发布6.0版本，新增AI智能预警、云端数据同步等核心功能，全面提升医药企业数字化管理效率。', '产品动态', '2024-11-20 09:00:00'),
('深度HIS医院管理系统成功落地全国50家医疗机构', '深度HIS系统凭借稳定性高、功能全面的优势，已成功为全国50家医疗机构提供数字化管理服务。', '企业动态', '2024-10-10 14:00:00');

-- 执行完成提示
PRINT '数据库初始化完成！';

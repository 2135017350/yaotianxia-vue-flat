-- 药天下数据库初始化脚本（SQL Server 版本）
-- 适用于 SQL Server 2016 及以上版本

-- 切换到 master 库，删除并重建目标数据库
USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'yaotianxia')
BEGIN
    ALTER DATABASE yaotianxia SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE yaotianxia;
END
GO

CREATE DATABASE yaotianxia
    COLLATE Chinese_PRC_CI_AS;
GO

USE yaotianxia;
GO

-- ============================================================
-- 用户表
-- ============================================================
CREATE TABLE users (
    id            INT           IDENTITY(1,1) PRIMARY KEY,
    username      NVARCHAR(50)  NOT NULL,
    email         NVARCHAR(100) NULL,
    phone         NVARCHAR(20)  NULL,
    password_hash NVARCHAR(255) NOT NULL,
    register_type NVARCHAR(20)  NOT NULL DEFAULT 'email',   -- email | phone
    role          NVARCHAR(20)  NOT NULL DEFAULT 'user',    -- admin | user
    last_login    DATETIME2     NULL,
    created_at    DATETIME2     NOT NULL DEFAULT GETDATE(),
    updated_at    DATETIME2     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email    UNIQUE (email),
    CONSTRAINT uq_users_phone    UNIQUE (phone)
);
GO

-- ============================================================
-- 下载资源表
-- ============================================================
CREATE TABLE download_resources (
    id          INT            IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(255)  NOT NULL,
    description NVARCHAR(MAX)  NULL,
    size        NVARCHAR(50)   NULL,
    file_name   NVARCHAR(255)  NOT NULL,
    file_path   NVARCHAR(500)  NOT NULL,
    type        NVARCHAR(20)   NOT NULL DEFAULT 'contract', -- contract | video
    media_type  NVARCHAR(100)  NULL,
    created_by  INT            NULL,
    created_at  DATETIME2      NOT NULL DEFAULT GETDATE(),
    updated_at  DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_download_resources_users
        FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);
GO

-- ============================================================
-- 联系信息表
-- ============================================================
CREATE TABLE contact_messages (
    id            INT            IDENTITY(1,1) PRIMARY KEY,
    name          NVARCHAR(100)  NOT NULL,
    email         NVARCHAR(100)  NOT NULL,
    phone         NVARCHAR(20)   NULL,
    company       NVARCHAR(100)  NULL,
    subject       NVARCHAR(255)  NOT NULL,
    message       NVARCHAR(MAX)  NOT NULL,
    status        NVARCHAR(20)   NOT NULL DEFAULT 'unread', -- unread | read | replied
    reply_message NVARCHAR(MAX)  NULL,
    replied_at    DATETIME2      NULL,
    created_at    DATETIME2      NOT NULL DEFAULT GETDATE(),
    updated_at    DATETIME2      NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- 申请试用表
-- ============================================================
CREATE TABLE trial_applications (
    id            INT            IDENTITY(1,1) PRIMARY KEY,
    company_name  NVARCHAR(200)  NOT NULL,
    contact_name  NVARCHAR(100)  NOT NULL,
    contact_phone NVARCHAR(20)   NOT NULL,
    province      NVARCHAR(50)   NULL,
    city          NVARCHAR(50)   NULL,
    district      NVARCHAR(50)   NULL,
    products      NVARCHAR(MAX)  NULL,  -- JSON 字符串
    status        NVARCHAR(20)   NOT NULL DEFAULT 'pending', -- pending | processing | completed
    created_at    DATETIME2      NOT NULL DEFAULT GETDATE(),
    updated_at    DATETIME2      NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- 项目报备表
-- ============================================================
CREATE TABLE project_reports (
    id                   INT            IDENTITY(1,1) PRIMARY KEY,
    customer_name        NVARCHAR(200)  NOT NULL,
    project_requirements NVARCHAR(MAX)  NULL,
    contact_name         NVARCHAR(100)  NOT NULL,
    contact_phone        NVARCHAR(20)   NOT NULL,
    partner_code         NVARCHAR(100)  NULL,
    status               NVARCHAR(20)   NOT NULL DEFAULT 'pending',
    created_at           DATETIME2      NOT NULL DEFAULT GETDATE(),
    updated_at           DATETIME2      NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- 企业动态表
-- ============================================================
CREATE TABLE news (
    id           INT            IDENTITY(1,1) PRIMARY KEY,
    title        NVARCHAR(255)  NOT NULL,
    summary      NVARCHAR(MAX)  NULL,
    content      NVARCHAR(MAX)  NULL,
    category     NVARCHAR(50)   NULL,
    published_at DATETIME2      NULL DEFAULT GETDATE(),
    created_at   DATETIME2      NOT NULL DEFAULT GETDATE(),
    updated_at   DATETIME2      NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- 索引
-- ============================================================
CREATE INDEX idx_users_email                    ON users (email);
CREATE INDEX idx_users_role                     ON users (role);
CREATE INDEX idx_download_resources_created_by  ON download_resources (created_by);
CREATE INDEX idx_download_resources_created_at  ON download_resources (created_at);
CREATE INDEX idx_contact_messages_status        ON contact_messages (status);
CREATE INDEX idx_contact_messages_created_at    ON contact_messages (created_at);
CREATE INDEX idx_trial_applications_created_at  ON trial_applications (created_at);
CREATE INDEX idx_project_reports_created_at     ON project_reports (created_at);
CREATE INDEX idx_news_published_at              ON news (published_at);
GO

-- ============================================================
-- 初始数据：默认管理员（密码：admin123，bcrypt 哈希）
-- ============================================================
INSERT INTO users (username, email, password_hash, register_type, role)
VALUES (
    'admin',
    'admin@yaotianxia.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv9a',
    'email',
    'admin'
);
GO

-- ============================================================
-- 初始数据：示例下载资源
-- ============================================================
INSERT INTO download_resources (name, description, size, file_name, file_path, type, created_by)
VALUES (
    N'示例合同',
    N'这是一份示例合同文件',
    '100KB',
    'sample_contract.pdf',
    '/downloads/sample_contract.pdf',
    'contract',
    1
);
GO

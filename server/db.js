// 内存数据库模拟
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@yaotianxia.com',
    phone: null,
    password_hash: '$2b$10$gq6k7ExL/0xT6d4StJrWaOsLjgiDhwCSKUGt39vbkBqsdYlebs2Dm',
    register_type: 'email',
    wechat_openid: null,
    is_verified: 1,
    last_login: null,
    created_at: new Date().toISOString(),
    role: 'admin',
    updated_at: new Date().toISOString()
  }
]

let download_resources = []
let trial_applications = []
let project_reports = []
let news = [
  {
    id: 1,
    title: '药天下科技荣获2024年度医药行业优秀软件奖',
    summary: '北京药天下科技有限公司凭借在医药管理软件领域14年的深耕，荣获2024年度医药行业优秀软件奖。',
    content: '',
    cover_image: null,
    category: '企业动态',
    published_at: '2024-12-15 10:00:00',
    created_at: '2024-12-15 10:00:00'
  },
  {
    id: 2,
    title: '药天下ERP+WMS系统完成重大版本升级',
    summary: '药天下ERP+WMS系统发布6.0版本，新增AI智能预警、云端数据同步等核心功能，全面提升医药企业数字化管理效率。',
    content: '',
    cover_image: null,
    category: '产品动态',
    published_at: '2024-11-20 09:00:00',
    created_at: '2024-11-20 09:00:00'
  },
  {
    id: 3,
    title: '深度HIS医院管理系统成功落地全国50家医疗机构',
    summary: '深度HIS系统凭借稳定性高、功能全面的优势，已成功为全国50家医疗机构提供数字化管理服务。',
    content: '',
    cover_image: null,
    category: '企业动态',
    published_at: '2024-10-10 14:00:00',
    created_at: '2024-10-10 14:00:00'
  }
]

let nextId = {
  users: 2,
  download_resources: 1,
  trial_applications: 1,
  project_reports: 1,
  news: 4
}

// 模拟数据库查询
const pool = {
  query: async (sql, params = []) => {
    sql = sql.trim().toUpperCase()

    if (sql.startsWith('SELECT')) {
      // 简单的 SELECT 模拟
      if (sql.includes('FROM USERS')) {
        let result = users
        if (sql.includes('WHERE EMAIL = ?')) {
          result = users.filter(u => u.email === params[0])
        } else if (sql.includes('WHERE PHONE = ?')) {
          result = users.filter(u => u.phone === params[0])
        } else if (sql.includes('WHERE USERNAME = ?')) {
          result = users.filter(u => u.username === params[0])
        } else if (sql.includes('WHERE ID = ?')) {
          result = users.filter(u => u.id === params[0])
        }
        return [result]
      } else if (sql.includes('FROM NEWS')) {
        return [news]
      } else if (sql.includes('FROM DOWNLOAD_RESOURCES')) {
        return [download_resources]
      } else if (sql.includes('FROM TRIAL_APPLICATIONS')) {
        return [trial_applications]
      } else if (sql.includes('FROM PROJECT_REPORTS')) {
        return [project_reports]
      }
      return [[]]
    } else if (sql.startsWith('INSERT')) {
      // 简单的 INSERT 模拟
      if (sql.includes('INTO USERS')) {
        const newUser = {
          id: nextId.users++,
          username: params[0] || params[1]?.split('@')[0] || params[1],
          email: params[1] || null,
          phone: params[0] || null,
          password_hash: params[2],
          register_type: params[3],
          role: params[4] || 'user',
          wechat_openid: null,
          is_verified: 0,
          last_login: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        users.push(newUser)
        return [{ insertId: newUser.id }]
      } else if (sql.includes('INTO TRIAL_APPLICATIONS')) {
        const newApp = {
          id: nextId.trial_applications++,
          company_name: params[0],
          contact_name: params[1],
          contact_phone: params[2],
          province: params[3],
          city: params[4],
          district: params[5],
          products: params[6],
          status: 'pending',
          created_at: new Date().toISOString()
        }
        trial_applications.push(newApp)
        return [{ insertId: newApp.id }]
      } else if (sql.includes('INTO PROJECT_REPORTS')) {
        const newReport = {
          id: nextId.project_reports++,
          customer_name: params[0],
          project_requirements: params[1],
          contact_name: params[2],
          contact_phone: params[3],
          partner_code: params[4],
          status: 'pending',
          created_at: new Date().toISOString()
        }
        project_reports.push(newReport)
        return [{ insertId: newReport.id }]
      }
      return [{ insertId: 1 }]
    } else if (sql.startsWith('UPDATE')) {
      // 简单的 UPDATE 模拟
      if (sql.includes('USERS')) {
        const user = users.find(u => u.id === params[1])
        if (user) {
          user.last_login = params[0]
        }
      }
      return [{ affectedRows: 1 }]
    }

    return [[]]
  }
}

export default pool

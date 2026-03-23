=== 试用下载文件存放说明 ===

将安装包文件放入此目录，即可通过网站"试用下载"页面提供下载。

文件命名规则：
- 避免使用特殊字符：@ # % & 等
- 推荐使用中文、字母、数字、连字符(-)、下划线(_)
- 示例：药天下分享版-fenxiaoban.zip

下载页面配置文件：src/pages/Download.vue
- 修改其中的 downloadGroups 数组即可更新下载列表
- 每个文件的 file 字段对应此目录中的文件名

当前已配置的下载文件列表（需要将对应文件放入此目录）：
- 药天下分享版-fenxiaoban.zip
- 药天下医院版-yiyuanban.zip
- 药天下养老版-yanglaoban.zip
- 药天下WMS版-wmsban.zip
（更多请查看 src/pages/Download.vue）

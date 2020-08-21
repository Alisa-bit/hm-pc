// 关闭eslint效验
module.exports = {
  // 保存时关闭校验
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '': '/' 
}

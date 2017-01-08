// 研发/测试/线上构建配置项
const config = {
  dev: {
    outputDir: '',
    publicPath: '',
    upload: {
      receiver: 'http://115.29.96.33:8999/receiver',
      to: '/data/res/frontend/rs/huzhu'
    }
  },

  test: {
    publicPath: ''
  },

  production: {
    publicPath: ''
  }
};


module.exports = config;

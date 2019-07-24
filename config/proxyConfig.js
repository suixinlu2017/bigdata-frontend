module.exports = {
  proxy: {
    '/test': {
      target: 'https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/test': ''
      }
    },
    '/service-house': {
      target: process.env.VUE_APP_BASE_API + '/service-house',
      changeOrigin: true,
      pathRewrite: {
        '^/service-house': ''
      }
    },
    '/service-user': {
      target: process.env.VUE_APP_BASE_API + '/service-user',
      changeOrigin: true,
      pathRewrite: {
        '^/service-user': ''
      }
    }
  }
}

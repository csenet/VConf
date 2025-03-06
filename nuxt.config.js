export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',
  
  // Modern mode for better performance
  modern: 'client',

  bridge: true,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'VConf',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '3Dアバターで会議ができるWeb会議システム' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // Load Bootstrap
    'bootstrap/dist/css/bootstrap.min.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/main.js' },
    { src: '~/plugins/skyway-compat.js' },
    { src: '~/plugins/vrm-compat.js' }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    'nuxt-fontawesome'
  ],
  
  // For better performance
  performance: {
    gzip: true
  },

  toast: {
    position: 'top-right',
    theme: 'outline',
    duration: 2000
  },

  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // Transpile specific dependencies
    transpile: [
      'three',
      '@pixiv/three-vrm',
      '@skyway-sdk/room'
    ],
    // Optimize chunks
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        name: undefined
      }
    }
  }
};

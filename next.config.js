/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/flask-api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/flask-api/:path*'
            : '/flask-api/',
      },
      {
        source: '/pages/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/pages/:path*'
            : '/pages/',
      },
    ]
  },
}

module.exports = nextConfig

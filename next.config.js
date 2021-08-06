module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/todos',
        permanent: false,
      },
    ]
  },
}

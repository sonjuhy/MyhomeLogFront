const nextConfig = {
  reactStrictMode: true,
  env:{
    BASE_URL: process.env.SERVER_ADDRESS,
    BASE_SECURITY_URL: process.env.SERVER_SECURITY_ADDRESS,
  },
  async rewrites(){
    return[
      {
        source: '/:path*',
        destination: process.env.SERVER_ADDRESS+'/:path*',
      },
    ];
  },
}
// module.exports = {
//   reactStrictMode: true
// };
module.exports = nextConfig;
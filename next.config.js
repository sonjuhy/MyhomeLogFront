const nextConfig = {
  reactStrictMode: true,
  env:{
    BASE_URL: process.env.SERVER_ADDRESS,
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
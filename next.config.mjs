/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // 個人 API
    // NEXT_PUBLIC_API_URL_8102: "http://172.16.161.118:8102/test_api",
    // NEXT_PUBLIC_API_URL_8102: "http://192.168.68.100:8102/test_api",

    // 測試 API
    NEXT_PUBLIC_API_URL_8100: "http://172.16.150.31:8100/test_api",
    NEXT_PUBLIC_API_URL_8101: "http://172.16.150.31:8101/test_api",
    NEXT_PUBLIC_API_URL_8102: "http://172.16.150.31:8102/test_api",

    // 正式 API
    NEXT_PUBLIC_API_URL_VIDEO: "http://172.16.150.39:8200"
    // NEXT_PUBLIC_API_URL_8100: "http://172.16.150.26:8100",
    // NEXT_PUBLIC_API_URL_8101: "http://172.16.150.26:8101",
    // NEXT_PUBLIC_API_URL_8102: "http://172.16.150.26:8102"
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  devIndicators:false,
  images: {
    domains: ["vahaanbazar-wip.s3.ap-south-2.amazonaws.com","auction-import-images.s3.ap-south-2.amazonaws.com","djl8cizpwq8nq.cloudfront.net","ops.adroitauto.in"],
    contentDispositionType: 'inline',
  }
}
   
export default nextConfig;

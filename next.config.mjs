/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "work-test-web-2024-eze6j4scpq-lz.a.run.app",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;

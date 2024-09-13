import type { Metadata } from "next";

import Logo from "@/app/assets/logo.svg";

import "./globals.scss";

export const metadata: Metadata = {
	title: "Munchies",
	description: "Find your favorite restaurant!",
	icons: { icon: "/favicon.ico?v=1" },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<header>
					<Logo />
				</header>
				{children}
			</body>
		</html>
	);
}

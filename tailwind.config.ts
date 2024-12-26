import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	plugins: [],
	theme: {
		extend: {
			textColor: {
				primary_from: 'var(--color-primary-from)',
				primary_to: 'var(--color-primary-to)'
			},
			colors: {
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				playwrite: ["Playwrite US Trad", "serif"]
			},
			screens: {
				'portrait': {
					'raw': '(orientation: portrait)'
				},
				'landscape': {
					'raw': '(orientation: landscape)'
				},
			}
		}
	}
} satisfies Config;

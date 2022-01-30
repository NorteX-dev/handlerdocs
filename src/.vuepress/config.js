const { description } = require("../../package");

module.exports = {
	title: "NorteX Handler",
	description: description,
	head: [
		["meta", { name: "theme-color", content: "#005eff" }],
		["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
		["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
	],
	theme: "book",
	themeConfig: {
		repo: "",
		editLinks: false,
		docsDir: "",
		editLinkText: "",
		lastUpdated: false,
		nav: [
			{
				text: "Guide",
				link: "/guide/",
			},
			{
				text: "API",
				link: "/api/",
			},
			{
				text: "GitHub",
				link: "https://github.com/NorteX-dev/Handler",
			},
		],
		sidebar: {
			"/guide/": [
				{
					title: "Guide",
					collapsable: false,
					children: ["", "prerequisites.md", "basic-command-handler.md"],
				},
			],
		},
	},
	plugins: ["@vuepress/plugin-back-to-top", "@vuepress/plugin-medium-zoom"],
};

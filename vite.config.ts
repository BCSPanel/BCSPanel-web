import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import viteCompression from 'vite-plugin-compression'
import htmlMinimize from '@sergeymakinen/vite-plugin-html-minimize'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		// 监听所有地址（包括局域网与公网），方便内网调试
		host: '0.0.0.0',
		port: 24173,
		proxy: {
			'^/(api|login)/': 'http://127.0.0.1:24124',
		},
	},
	base: './',
	plugins: [
		vue(),
		vueJsx(),
		mockDevServerPlugin(),
		// viteCompression({
		//   algorithm: 'gzip',
		//   threshold: 1024,
		//   verbose: false,
		//   deleteOriginFile: false
		// }),
		htmlMinimize({
			minifierOptions: {
				collapseWhitespace: true,
				html5: true,
				keepClosingSlash: false,
				minifyCSS: true,
				minifyJS: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true,
			}
		}),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
		// {
		// 	// script执行前阻止网页渲染
		// 	// https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script
		// 	name: "scriptBlockingRender",
		// 	transformIndexHtml(html) {
		// 		return html.replaceAll(
		// 			'<script type="module"',
		// 			'<script type="module" blocking="render" async'
		// 		);
		// 	}
		// },
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	build: {
		target: 'es2022',
		reportCompressedSize: true, // 是否使用vite自带的方式打印压缩后的大小
		rollupOptions: {
			input: {
				index: path.resolve('index.html'),
				"404": path.resolve('404.html')
			},
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
				manualChunks(id) {
					if (id.includes("/node_modules/")) {
						return "node_modules"
					}
				},
			}
		},
		modulePreload: {
			polyfill: false,
		},
		chunkSizeWarningLimit: Infinity,
		cssCodeSplit: true,
		assetsInlineLimit: 0,
	}
})

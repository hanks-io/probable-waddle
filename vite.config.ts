import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import dayjs from 'dayjs';
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { build, defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { viteVConsole } from 'vite-plugin-vconsole';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { linkIcon } from './scripts/useFavicon';

dotenvExpand.expand(dotenv.config());

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const isDev = 'development' === mode;
	const isPord = process.env.VITE_ENV === 'prod';
	const isPre = process.env.VITE_ENV === 'pre';
	const vConsoleEnabled = isDev || isPre;
	let config = false;
	if (isDev) {
		try {
			config = require('./fetch.config.json');
		} catch (error) {
			console.warn('fetch.config.json 文件不存在');
		}
	}
	return {
		build: {
			assetsInlineLimit: 0,
			sourcemap: !isPord,
			// 	rollupOptions: {
			// 		input: {
			// 			// 配置指向与 src 目录同级的 HTML 文件
			// 			main: resolve(__dirname, 'index.html'),
			// 			download: resolve(__dirname, 'download.html'),
			// 		},
			// },
			rollupOptions: {
				output: {
					manualChunks(id, options) {
						
						if (id.includes('node_modules')) {
							return 'vendor_modules'
						}
						return 'vendor'
					}
				}
			},
		},
		plugins: [
			vue(
				{
					reactivityTransform: true,
					// 关闭严格模式
					script: {
						reactivityTransform: true
					}
				}
			),
			legacy(),
			{
				name: 'version',
				apply: 'build',
				buildStart() {
					const version = dayjs().format('YYYYMMDDHHmmss');
					try {
						// 读取 package.json 文件
						const packageJsonPath = path.resolve(__dirname, 'package.json');
						const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
						const versionJsPath = path.resolve(__dirname, 'public/version.js');

						// 修改版本号
						packageJson.version = `V${version}`

						fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
						fs.writeFileSync(versionJsPath, JSON.stringify({ version }, null, 2));
						this.warn(`写入版本：${version}`);
					} catch (err) {
						this.error(`写入版本失败：${err}`);
					}
				},
				buildEnd() {
					console.log('eslodashzise')
				}
			},
			AutoImport({
				eslintrc: {
					enabled: true,
				},
				imports: [
					'vue',
					'vue-router',
					'@vueuse/core',    // vueuse hooks
					'pinia',
					{
						'@/utils/custom': [
							'formatMoneyToShow',
							'convertMoneyToShow',
							'formatRatioToShow',
							'convertRatioToShow',
						],
						'@/utils/lodash.local': ['merge']
					}
				],
				dirs: ['src/store', 'src/hooks'],
				dts: './auto-imports.d.ts',
			}),
			viteVConsole({
				entry: [path.resolve('src/main.ts')], // entry for each page, different from the above
				enabled: vConsoleEnabled,
				config: {
					maxLogNumber: 1000,
					theme: 'dark'
				}
			}),
			createHtmlPlugin({
				inject: {
					data: {
						viteEnv: process.env.VITE_ENV,
						APP_CONFIG__: config ? `<script>window.__APP_CONFIG__ = ${JSON.stringify(config)}</script>` : '',
						linkIcon: config ? linkIcon(config?.linkIcon) : ''
					}
				}
			})
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				// Ensure runtime template compilation for project
				'vue': 'vue/dist/vue.esm-bundler.js',
			},
		},
		optimizeDeps: {
			include: ['vue'],
		},

		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
					additionalData: [`@import "${path.resolve(__dirname, 'src/common/theme.less')}";`]
				}
			}
		},
	}
})


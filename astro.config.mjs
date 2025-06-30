// @ts-check
import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Untitled 服务器文档站',
            // https://starlight.astro.build/zh-cn/guides/customization/#%E7%A6%81%E7%94%A8%E9%BB%98%E8%AE%A4-404-%E9%A1%B5%E9%9D%A2
            disable404Route: true,
            logo: {
                src: './src/assets/logo_64_64.svg',
            },
            // https://starlight.astro.build/zh-cn/reference/configuration/#favicon
            favicon: '/logo_64_64.ico',
            // https://starlight.astro.build/zh-cn/reference/configuration/#lastupdated
            lastUpdated: true,
            social: [{icon: 'github', label: 'GitHub', href: 'https://github.com/DingerBtn/UntitledServerRule'}],
            sidebar: [
                {
                    label: '规则（详细版）',
                    autogenerate: {directory: '规则（详细版）'},
                },
                {
                    label: '公示及教程',
                    autogenerate: {directory: '公示及教程'},
                },
            ],
            // https://starlight.astro.build/zh-cn/reference/configuration/#lastupdated
            locales: {
                root: {
                    label: '简体中文',
                    lang: 'zh-CN',
                },
            },
        }),
    ],
});

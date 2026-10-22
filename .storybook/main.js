/** @type {import('@storybook/vue3-vite').StorybookConfig} */
export default {
  framework: '@storybook/vue3-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
  staticDirs: ['../public'],
}

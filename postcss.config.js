import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import tailwindcssFour from '@tailwindcss/postcss'

const tailwindThreePlugin = tailwindcss()
const tailwindFourPlugin = tailwindcssFour()
const tailwindFourFolders = ['Words-of-Wisdom', 'mindscape-defence']

export default {
  plugins: [
    {
      postcssPlugin: 'arcade-tailwind-dispatcher',
      async Once(root, { result, postcss }) {
        const source = result.opts.from || ''
        const useTailwindFour = tailwindFourFolders.some((folder) => source.includes(folder))

        if (useTailwindFour) {
          for (const plugin of tailwindFourPlugin.plugins || []) {
            await plugin.Once?.(root, { result, postcss })
          }
          return
        }

        await tailwindThreePlugin.plugins?.[0]?.(root, result)
      },
    },
    autoprefixer(),
  ],
}

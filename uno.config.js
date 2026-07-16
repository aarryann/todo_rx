import { defineConfig, presetUno, presetAttributify, presetIcons, presetWind4, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons(),
    presetTypography({
      cssExtend: {
        // Adjust standard body size and line-height
        'p, ul, ol, pre': {
          'font-size': '1rem', // E.g., matches prose-lg
          'line-height': '1.75',
        },
        // Force headings to scale proportionally
        h1: {
          'font-size': '1.5rem',
          'font-weight': '700',
          'line-height': '2rem',
        },
        h2: {
          'font-size': '1.25rem',
          'line-height': '1.75',
        },
      },
    }),
  ],
  content: {
    pipeline: {
      include: [
        './**/*.html',
        './**/*.rx.html',
      ],
    },
  },
})

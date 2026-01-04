import { defineConfig, presetAttributify, presetIcons } from 'unocss'
import presetWind3 from '@unocss/preset-wind3'

export default defineConfig({
  presets: [
    presetWind3(),         // replaces presetUno
    presetAttributify(),
    presetIcons(),
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

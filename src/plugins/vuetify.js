/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import colors from 'vuetify/lib/util/colors'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'lightTheme',
    variations: {
      colors: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      lighten: 1,
      darken: 2
    },
    themes: {
      lightTheme: {
        colors: {
          'primary': colors.lightBlue.darken3, // #1867C0
          'secondary': colors.blue.lighten1,
          'success': colors.green.lighten1,
          'danger': colors.red.lighten1,
          'warning': colors.deepOrange.lighten1,
          'info': colors.lightBlue.darken1,

          'navigation': colors.grey.darken4,
          'background': colors.grey.lighten4,
        },
      },
      darkTheme: {
        dark: true,
        colors: {
          'primary': colors.lightBlue.darken3, // #1867C0
          'secondary': colors.blue.lighten1,
          'success': colors.green.lighten1,
          'danger': colors.red.lighten1,
          'warning': colors.deepOrange.lighten1,
          'info': colors.lightBlue.darken1,

          'navigation': '#0F0F0F',
          'background': '#141414',
        },
      }
    },
  },
  icons: {
    defaultSet: 'mdi'
  }
})

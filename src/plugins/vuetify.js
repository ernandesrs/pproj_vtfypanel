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

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          // primary: '#1867C0',
          primary: '#0277BD',
          secondary: '#42A5F5',
          success: '#66BB6A',
          danger: '#EF5350',
          warning: '#FF7043',
          info: '#039BE5',

          dark: '#212121',
          
          light: '#F5F5F5',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi'
  }
})

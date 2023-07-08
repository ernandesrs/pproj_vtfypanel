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

          'dark-4': '#757575',
          'dark-3': '#616161',
          'dark-2': '#424242',
          'dark-1': '#212121',
          'dark': '#212121',

          'light-4': '#F5F5F5',
          'light-3': '#EEEEEE',
          'light-2': '#E0E0E0',
          'light-1': '#BDBDBD',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi'
  }
})

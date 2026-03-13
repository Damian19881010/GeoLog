import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0B5ED7',
          secondary: '#6C757D',
          success: '#198754',
          info: '#0DCAF0',
          warning: '#FFC107',
          error: '#DC3545',
          background: '#F6F8FB',
          surface: '#FFFFFF',
        },
      },
    },
  },
})

export default vuetify
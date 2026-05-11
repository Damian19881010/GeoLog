import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          deepblue: '#0D1117',
          icewhite: '#161B22',
          orange21: '#F77F00',
          taipeigreen: '#28bcc9',
          primary: '#44B3FF',
          primary2: '#1A1A1A',
          btncolor: '#46546d',
          subheader: '#383838f6',
          black: '#ffffff',
          black2: '#424242',
          // white: '#424242',
          white: '#fffdfd',
          white2: '#ffffff',
          white3: '#666b6d',
          white4: '#2f2f2f',
          liteblue: '#54585A',
          liteblue2: '#e0f5ff',
          chip: '#EDEDED',
          cream: '#FFFCCF',
          red: '#FF0059',
          litegrey: '#d3d3d3',
          litegrey2: '#EEEEEE',
          litegrey3: '#969798',
          litegrey4: '#B8B8B8',
          litegrey5: '#D3D3D3',
          table: '#ededed',
          bottom: '#2b2b2b',
          yellow: '#FFFF00',
        },
      },
    },
  },
})

export default vuetify
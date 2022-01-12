module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('daisyui'),
    ],
    daisyui: {
      themes: [

        {
          light: {
               primary : '#0ed3cf',           /* Primary color */
              'primary-focus' : '#03abad',     /* Primary color - focused */
              "primary-content":
                  "#ffffff" /* Foreground content color to use on primary color */,

              secondary: "#14171A" /* Secondary color */,
              "secondary-focus":
                  "#0E1319" /* Secondary color - focused */,
              "secondary-content":
                  "#ffffff" /* Foreground content color to use on secondary color */,

              accent: "#ad72ff" /* Accent color */,
              "accent-focus": "#7B1FFC" /* Accent color - focused */,
              "accent-content":
                  "#ffffff" /* Foreground content color to use on accent color */,

              neutral: "#ffffff" /* Neutral color */,
              "neutral-focus": "#f9fafb" /* Neutral color - focused */,
              "neutral-content":
                  "#1f2937" /* Foreground content color to use on neutral color */,

              "base-100":
                  "#ffffff" /* Base color of page, used for blank backgrounds */,
              "base-200": "#f9fafb" /* Base color, a little darker */,
              "base-300": "#edf0f3" /* Base color, even more darker */,
              "base-content":
                  "#1f2937" /* Foreground content color to use on base color */,

              info: "#2094f3" /* Info */,
              success: "#009485" /* Success */,
              warning: "#ff9900" /* Warning */,
              error: "#ff5724" /* Error */,
          },
      },
      {
          dark: {
              primary : '#0ed3cf',           /* Primary color */
              'primary-focus' : '#03abad',     /* Primary color - focused */
              "primary-content":
                  "#ffffff" /* Foreground content color to use on primary color */,


              secondary: "#ffffff" /* Secondary color */,
              "secondary-focus":
                  "#EFEFEF" /* Secondary color - focused */,
              "secondary-content":
                  "#14171A" /* Foreground content color to use on secondary color */,

              accent: "#ad72ff" /* Accent color */,
              "accent-focus": "#7B1FFC" /* Accent color - focused */,
              "accent-content":
                  "#ffffff" /* Foreground content color to use on accent color */,

              neutral: "#16181d" /* Neutral color */,
              "neutral-focus": "#34373E" /* Neutral color - focused */,
              "neutral-content":
                  "#ffffff" /* Foreground content color to use on neutral color */,

              "base-100":
                  "#3d4451" /* Base color of page, used for blank backgrounds */,
              "base-200": "#222832" /* Base color, a little darker */,
              "base-300": "#15181e" /* Base color, even more darker */,
              "base-content":
                  "#ffffff" /* Foreground content color to use on base color */,

              info: "#2094f3" /* Info */,
              success: "#00bda0" /* Success */,
              warning: "#ff9900" /* Warning */,
              error: "#ff5724" /* Error */,
          },
      },
      ],
    },
  }
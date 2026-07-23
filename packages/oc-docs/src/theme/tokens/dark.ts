import type { Theme } from '../types';

interface Palette {
  primary: Record<string, string>;
  hues: Record<string, string>;
  system: Record<string, string>;
  background: Record<string, string>;
  text: Record<string, string>;
  overlay: Record<string, string>;
  border: Record<string, string>;
  utility: Record<string, string>;
  intent: Record<string, string>;
  syntax: Record<string, string>;
}

export const palette: Palette = {
  primary: {
    SOLID: 'hsl(39, 74%, 59%)',
    TEXT: 'hsl(39, 74%, 64%)',
    STRONG: 'hsl(39, 74%, 64%)',
    SUBTLE: 'hsl(39, 74%, 54%)'
  },
  hues: {
    RED: 'hsl(8, 70%, 52%)',
    ROSE: 'hsl(367, 84%, 70%)',
    BROWN: 'hsl(35,  65%, 72%)',
    ORANGE: 'hsl(24,  88%, 72%)',
    YELLOW: 'hsl(41, 93%, 72%)',
    GREEN: 'hsl(140, 72%, 68%)',
    GREEN_DARK: 'hsl(160, 90%, 44%)',
    TEAL: 'hsl(170, 70%, 60%)',
    CYAN: 'hsl(190, 82%, 72%)',
    BLUE: 'hsl(210, 90%, 76%)',
    INDIGO: 'hsl(202, 88%, 72%)',
    VIOLET: 'hsl(260, 75%, 78%)',
    PURPLE: 'hsl(285, 72%, 75%)',
    PINK: 'hsl(305, 59%, 74%)'
  },
  system: {
    CONTROL_ACCENT: '#D9A342'
  },
  background: {
    BASE: 'hsl(0deg 0% 10%)',
    MANTLE: '#222224',
    CRUST: '#1e1e1e',
    SURFACE0: '#26292b',
    SURFACE1: 'hsl(204, 4%, 23%)',
    SURFACE2: '#666666'
  },
  text: {
    BASE: 'hsl(0deg 0% 80%)',
    SUBTEXT2: '#bbb',
    SUBTEXT1: '#aaa',
    SUBTEXT0: '#999'
  },
  overlay: {
    OVERLAY2: '#666666',
    OVERLAY1: '#555555',
    OVERLAY0: '#444444'
  },
  border: {
    BORDER2: '#444444',
    BORDER1: '#333333',
    BORDER0: '#2a2a2a'
  },
  utility: {
    WHITE: '#ffffff',
    BLACK: '#000000'
  },
  intent: {},
  syntax: {}
};

palette.intent = {
  INFO: palette.hues.BLUE,
  SUCCESS: palette.hues.GREEN,
  WARNING: palette.hues.ORANGE,
  DANGER: palette.hues.RED
};

palette.syntax = {
  // Core language structure
  KEYWORD: palette.hues.ROSE,
  TAG: palette.hues.ROSE,
  // Identifiers & properties (collapsed)
  VARIABLE: palette.hues.PINK,
  PROPERTY: palette.hues.BLUE,
  DEFINITION: palette.hues.BLUE,

  // Literals
  STRING: palette.hues.BROWN,
  NUMBER: palette.hues.PINK,
  ATOM: palette.hues.ROSE,

  // Operators & punctuation (quiet)
  OPERATOR: palette.text.SUBTEXT1,
  TAG_BRACKET: palette.text.SUBTEXT1,

  // Comments should recede
  COMMENT: palette.text.SUBTEXT0
};

const p = palette;

const colors = {
  GRAY_2: '#3D3D3D',
  GRAY_3: '#444444',
  GRAY_4: '#666666',
  GRAY_5: '#b0b0b0'
};

export const dark: Theme = {
  mode: 'dark',
  brand: p.primary.SOLID,
  text: p.text.BASE,
  textLink: p.hues.BLUE,
  draftColor: '#cc7b1b',
  bg: p.background.BASE,

  primary: {
    solid: p.primary.SOLID,
    text: p.primary.TEXT,
    strong: p.primary.STRONG,
    subtle: p.primary.SUBTLE
  },

  accents: {
    primary: p.primary.SOLID
  },

  background: {
    base: p.background.BASE,
    mantle: p.background.MANTLE,
    crust: '#333333',
    surface0: p.background.SURFACE0,
    surface1: colors.GRAY_3,
    surface2: colors.GRAY_4,
    // Raised surface; keeps the dark switcher track identical to surface0.
    surfaceBright: p.background.SURFACE0
  },

  status: {
    info: {
      background: 'rgba(139,194,249,0.15)',
      text: p.intent.INFO,
      border: p.intent.INFO
    },
    success: {
      background: 'rgba(115,232,154,0.15)',
      text: p.intent.SUCCESS,
      border: p.intent.SUCCESS
    },
    warning: {
      background: 'rgba(246,171,121,0.15)',
      text: p.intent.WARNING,
      border: p.intent.WARNING
    },
    danger: {
      background: 'rgba(218,70,47,0.15)',
      text: p.intent.DANGER,
      border: p.intent.DANGER
    }
  },

  overlay: {
    overlay2: '#666666',
    overlay1: '#555555',
    overlay0: '#444444'
  },

  font: {
    size: {
      xs: '0.6875rem', // 11px
      sm: '0.75rem', // 12px
      base: '0.8125rem', // 13px
      md: '0.875rem', // 14px
      lg: '1rem', // 16px
      xl: '1.125rem' // 18px
    }
  },

  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.3)',
    md: '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.4)',
    lg: '0 2px 12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.4)'
  },

  border: {
    radius: {
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '10px',
      xl: '12px'
    },
    border2: p.border.BORDER2,
    border1: p.border.BORDER1,
    border0: p.border.BORDER0
  },

  colors: {
    text: {
      white: p.text.BASE,
      green: p.intent.SUCCESS,
      danger: p.intent.DANGER,
      warning: p.intent.WARNING,
      muted: p.text.SUBTEXT1,
      purple: p.hues.PURPLE,
      yellow: p.hues.YELLOW,
      subtext2: p.text.SUBTEXT2,
      subtext1: p.text.SUBTEXT1,
      subtext0: p.text.SUBTEXT0
    },
    bg: {
      danger: p.hues.RED
    },
    accent: p.system.CONTROL_ACCENT
  },

  input: {
    bg: 'transparent',
    border: p.border.BORDER2,
    focusBorder: 'rgba(228,174,73,0.8)',
    placeholder: {
      color: p.text.SUBTEXT1,
      opacity: 0.6
    }
  },

  checkbox: {
    border: p.border.BORDER1,
    checkedBg: p.primary.SOLID,
    checkColor: p.utility.BLACK
  },

  sidebar: {
    color: p.text.BASE,
    muted: p.text.SUBTEXT1,
    bg: p.background.BASE,
    dragbar: {
      border: p.border.BORDER1,
      activeBorder: p.border.BORDER2
    },

    collection: {
      item: {
        bg: p.background.SURFACE0,
        hoverBg: p.background.MANTLE,
        focusBorder: p.border.BORDER2,
        indentBorder: p.background.SURFACE0,
        active: {
          indentBorder: p.background.SURFACE0
        },
        example: {
          iconColor: p.text.BASE
        }
      }
    },

    dropdownIcon: {
      color: p.text.BASE
    }
  },

  dropdown: {
    color: p.text.BASE,
    iconColor: p.text.SUBTEXT2,
    bg: p.background.MANTLE,
    hoverBg: p.background.SURFACE0,
    shadow: 'none',
    border: p.border.BORDER1,
    separator: p.border.BORDER1,
    selectedColor: p.primary.TEXT,
    mutedText: p.text.SUBTEXT1
  },

  workspace: {
    accent: '#D9A342',
    border: '#444',
    button: {
      bg: colors.GRAY_2
    }
  },

  request: {
    methods: {
      get: p.hues.GREEN,
      post: p.hues.INDIGO,
      put: p.hues.ORANGE,
      delete: '#e06552',
      patch: p.hues.ORANGE,
      options: p.hues.TEAL,
      head: p.hues.CYAN
    },

    grpc: p.hues.TEAL,
    ws: p.hues.ORANGE,
    gql: p.hues.PINK
  },

  requestTabPanel: {
    url: {
      bg: p.background.BASE,
      icon: 'rgb(204, 204, 204)',
      iconDanger: '#fa5343',
      border: `solid 1px ${p.border.BORDER1}`
    },
    dragbar: {
      border: p.border.BORDER1,
      activeBorder: p.border.BORDER2
    },
    responseStatus: '#ccc',
    responseOk: p.hues.GREEN,
    responseError: p.hues.RED,
    responsePending: p.hues.BLUE,
    responseOverlayBg: 'rgba(26,26,26,0.8)',

    card: {
      bg: '#252526',
      border: 'transparent',
      hr: '#424242'
    },

    graphqlDocsExplorer: {
      bg: '#1e1e1e',
      color: '#d4d4d4'
    }
  },

  notifications: {
    bg: colors.GRAY_3,
    list: {
      bg: '#3D3D3D', // diverges from Bruno dark.js (missing '#' typo upstream); corrected so it emits a valid CSS var
      borderRight: '#4f4f4f',
      borderBottom: '#545454',
      hoverBg: '#434343',
      active: {
        border: '#569cd6',
        bg: '#4f4f4f',
        hoverBg: '#4f4f4f'
      }
    }
  },

  modal: {
    title: {
      color: p.text.BASE,
      bg: p.background.BASE
    },
    body: {
      color: p.text.BASE,
      bg: p.background.MANTLE
    },
    input: {
      bg: 'transparent',
      border: p.border.BORDER2,
      focusBorder: 'rgba(228,174,73,0.8)'
    },
    backdrop: {
      opacity: 0.2
    }
  },

  button: {
    secondary: {
      color: 'rgb(204, 204, 204)',
      bg: '#185387',
      border: '#185387',
      hoverBorder: '#696969'
    },
    close: {
      color: '#ccc',
      bg: 'transparent',
      border: 'transparent',
      hoverBorder: ''
    },
    disabled: {
      color: '#a5a5a5',
      bg: '#626262',
      border: '#626262'
    },
    danger: {
      color: '#fff',
      bg: '#dc3545',
      border: '#dc3545'
    }
  },
  button2: {
    color: {
      primary: {
        bg: p.primary.SOLID,
        text: p.utility.BLACK,
        border: p.primary.SOLID
      },
      light: {
        bg: 'rgba(228,174,73,0.08)',
        text: p.primary.SOLID,
        border: 'rgba(228,174,73,0.06)'
      },
      secondary: {
        bg: p.background.MANTLE,
        text: p.text.BASE,
        border: p.border.BORDER1
      },
      success: {
        bg: p.hues.GREEN,
        text: p.utility.WHITE,
        border: p.hues.GREEN
      },
      warning: {
        bg: p.hues.ORANGE,
        text: '#1e1e1e',
        border: p.hues.ORANGE
      },
      danger: {
        bg: p.hues.RED,
        text: p.utility.WHITE,
        border: p.hues.RED
      }
    }
  },

  tabs: {
    marginRight: '1.2rem',
    active: {
      fontWeight: 400,
      color: '#CCCCCC',
      border: p.primary.STRONG
    },
    secondary: {
      active: {
        bg: p.background.SURFACE0,
        color: p.text.BASE
      },
      inactive: {
        bg: p.background.SURFACE0,
        color: p.text.SUBTEXT1
      }
    }
  },

  requestTabs: {
    color: p.text.BASE,
    bg: p.background.SURFACE0,
    bottomBorder: p.border.BORDER2,
    icon: {
      color: '#9f9f9f',
      hoverColor: 'rgb(204, 204, 204)',
      hoverBg: '#1e1e1e'
    },
    example: {
      iconColor: colors.GRAY_5
    }
  },

  codemirror: {
    bg: p.background.BASE,
    border: p.background.BASE,
    placeholder: {
      color: '#a2a2a2',
      opacity: 0.5
    },
    gutter: {
      bg: p.background.BASE
    },
    variable: {
      valid: p.hues.GREEN_DARK,
      invalid: p.hues.RED,
      prompt: p.hues.BLUE
    },
    tokens: {
      definition: p.syntax.DEFINITION,
      property: p.syntax.PROPERTY,
      string: p.syntax.STRING,
      number: p.syntax.NUMBER,
      atom: p.syntax.ATOM,
      variable: p.syntax.VARIABLE,
      keyword: p.syntax.KEYWORD,
      comment: p.syntax.COMMENT,
      operator: p.syntax.OPERATOR,
      tag: p.syntax.TAG,
      tagBracket: p.syntax.TAG_BRACKET
    },
    searchLineHighlightCurrent: 'rgba(120,120,120,0.18)',
    searchMatch: '#FFD700',
    searchMatchActive: '#FFFF00'
  },

  table: {
    border: '#333',
    thead: {
      color: 'rgb(204, 204, 204)'
    },
    striped: '#1e1e1e',
    input: {
      color: '#ccc'
    }
  },

  plainGrid: {
    hoverBg: colors.GRAY_3
  },

  scrollbar: {
    color: 'rgb(52 51 49)'
  },

  dragAndDrop: {
    border: '#666666',
    borderStyle: '2px solid',
    hoverBg: 'rgba(102, 102, 102, 0.08)',
    transition: 'all 0.1s ease'
  },
  infoTip: {
    bg: p.background.MANTLE,
    border: '#333333',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
  },

  statusBar: {
    border: '#323233',
    color: 'rgb(169, 169, 169)'
  },

  console: {
    bg: '#1e1e1e',
    headerBg: '#242424',
    contentBg: '#1e1e1e',
    border: '#3c3c3c',
    titleColor: '#cccccc',
    countColor: '#858585',
    buttonColor: '#cccccc',
    buttonHoverBg: 'rgba(255, 255, 255, 0.1)',
    buttonHoverColor: '#ffffff',
    messageColor: '#cccccc',
    timestampColor: '#858585',
    emptyColor: '#858585',
    logHoverBg: 'rgba(255, 255, 255, 0.05)',
    resizeHandleHover: '#0078d4',
    resizeHandleActive: '#0078d4',
    dropdownBg: '#2d2d30',
    dropdownHeaderBg: '#3c3c3c',
    optionHoverBg: 'rgba(255, 255, 255, 0.05)',
    optionLabelColor: '#cccccc',
    optionCountColor: '#858585',
    checkboxColor: p.primary.SOLID,
    scrollbarTrack: '#2d2d30',
    scrollbarThumb: '#5a5a5a',
    scrollbarThumbHover: '#6a6a6a'
  },

  grpc: {
    tabNav: {
      container: {
        bg: '#262626'
      },
      button: {
        active: {
          bg: '#404040',
          color: '#ffffff'
        },
        inactive: {
          bg: 'transparent',
          color: '#a3a3a3'
        }
      }
    },
    importPaths: {
      header: {
        text: p.text.SUBTEXT1,
        button: {
          color: p.text.SUBTEXT1,
          hoverColor: '#d4d4d4'
        }
      },
      error: {
        bg: 'transparent',
        text: '#f06f57',
        link: {
          color: '#f06f57',
          hoverColor: '#ff8a7a'
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: 'rgba(255, 255, 255, 0.05)',
        text: '#d4d4d4',
        icon: p.text.SUBTEXT1,
        checkbox: {
          color: '#d4d4d4'
        },
        invalid: {
          opacity: 0.6,
          text: '#f06f57'
        }
      },
      empty: {
        text: p.text.SUBTEXT1
      },
      button: {
        bg: '#185387',
        color: '#d4d4d4',
        border: '#185387',
        hoverBorder: '#696969'
      }
    },
    protoFiles: {
      header: {
        text: p.text.SUBTEXT1,
        button: {
          color: p.text.SUBTEXT1,
          hoverColor: '#d4d4d4'
        }
      },
      error: {
        bg: 'transparent',
        text: '#f06f57',
        link: {
          color: '#f06f57',
          hoverColor: '#ff8a7a'
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: 'rgba(255, 255, 255, 0.05)',
        selected: {
          bg: 'rgba(245, 158, 11, 0.2)',
          border: '#d9a342'
        },
        text: '#d4d4d4',
        secondaryText: p.text.SUBTEXT1,
        icon: p.text.SUBTEXT1,
        invalid: {
          opacity: 0.6,
          text: '#f06f57'
        }
      },
      empty: {
        text: p.text.SUBTEXT1
      },
      button: {
        bg: '#185387',
        color: '#d4d4d4',
        border: '#185387',
        hoverBorder: '#696969'
      }
    }
  },
  deprecationWarning: {
    bg: 'rgba(250, 83, 67, 0.1)',
    border: 'rgba(250, 83, 67, 0.1)',
    icon: '#FA5343',
    text: '#B8B8B8'
  },

  examples: {
    buttonBg: '#d9a3421A',
    buttonColor: '#d9a342',
    buttonText: '#fff',
    buttonIconColor: '#fff',
    border: '#444',
    urlBar: {
      border: colors.GRAY_3,
      bg: '#292929'
    },
    table: {
      thead: {
        bg: '#292929',
        color: '#969696'
      }
    },
    checkbox: {
      color: '#000'
    }
  },

  app: {
    collection: {
      toolbar: {
        environmentSelector: {
          bg: p.background.BASE,
          border: colors.GRAY_3,
          icon: p.primary.TEXT,
          text: p.text.BASE,
          caret: p.text.SUBTEXT1,
          separator: colors.GRAY_3,
          hoverBg: p.background.BASE,
          hoverBorder: colors.GRAY_4,

          noEnvironment: {
            text: p.text.SUBTEXT1,
            bg: p.background.BASE,
            border: colors.GRAY_3,
            hoverBg: p.background.BASE,
            hoverBorder: colors.GRAY_4
          }
        },
        sandboxMode: {
          safeMode: {
            bg: 'rgba(78, 201, 176, 0.12)',
            color: p.hues.GREEN
          },
          developerMode: {
            bg: 'rgba(217, 163, 66, 0.11)',
            color: p.hues.YELLOW
          }
        }
      }
    }
  }
} as Theme;

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
    SOLID: 'hsl(33, 80%, 46%)',
    TEXT: 'hsl(33, 67%, 45%)',
    STRONG: 'hsl(33, 67%, 50%)',
    SUBTLE: 'hsl(33, 69%, 56%)'
  },
  hues: {
    RED: 'hsl(8,   60%, 52%)',
    ROSE: 'hsl(352, 45%, 50%)',
    BROWN: 'hsl(28,  55%, 38%)',
    ORANGE: 'hsl(35,  85%, 42%)',
    YELLOW: 'hsl(45,  75%, 42%)',
    LIME: 'hsl(85,  45%, 40%)',
    GREEN: 'hsl(145, 50%, 36%)',
    TEAL: 'hsl(178, 50%, 36%)',
    CYAN: 'hsl(195, 55%, 42%)',
    BLUE: 'hsl(214, 55%, 45%)',
    INDIGO: 'hsl(235, 45%, 45%)',
    VIOLET: 'hsl(258, 42%, 50%)',
    PURPLE: 'hsl(280, 45%, 48%)',
    PINK: 'hsl(328, 50%, 48%)'
  },
  system: {
    CONTROL_ACCENT: '#b96f1d'
  },
  background: {
    BASE: '#ffffff',
    MANTLE: '#f8f8f8',
    CRUST: '#f6f6f6',
    SURFACE0: '#f1f1f1',
    SURFACE1: '#eaeaea',
    SURFACE2: '#e5e5e5'
  },
  text: {
    BASE: '#343434',
    SUBTEXT2: '#666666',
    SUBTEXT1: '#838383',
    SUBTEXT0: '#9B9B9B'
  },
  overlay: {
    OVERLAY2: '#8b8b8b',
    OVERLAY1: '#B0B0B0',
    OVERLAY0: '#C0C0C0'
  },
  border: {
    BORDER2: '#cccccc',
    BORDER1: '#e5e5e5',
    BORDER0: '#efefef'
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

export const light: Theme = {
  mode: 'light',
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
    crust: p.background.CRUST,
    surface2: p.background.SURFACE2,
    surface1: p.background.SURFACE1,
    surface0: p.background.SURFACE0,
    // Near-white raised surface (Figma: playground view-switcher track fill).
    surfaceBright: '#fafafa'
  },

  status: {
    info: {
      background: 'rgba(52,106,178,0.15)',
      text: p.intent.INFO,
      border: p.intent.INFO
    },
    success: {
      background: 'rgba(46,138,84,0.15)',
      text: p.intent.SUCCESS,
      border: p.intent.SUCCESS
    },
    warning: {
      background: 'rgba(198,122,16,0.15)',
      text: p.intent.WARNING,
      border: p.intent.WARNING
    },
    danger: {
      background: 'rgba(206,79,59,0.15)',
      text: p.intent.DANGER,
      border: p.intent.DANGER
    }
  },

  overlay: {
    overlay2: p.overlay.OVERLAY2,
    overlay1: p.overlay.OVERLAY1,
    overlay0: p.overlay.OVERLAY0
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
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    md: '0 2px 8px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.06)',
    lg: '0 2px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
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
      white: p.utility.WHITE,
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
    bg: p.utility.WHITE,
    border: p.border.BORDER2,
    focusBorder: p.overlay.OVERLAY2,
    placeholder: {
      color: p.overlay.OVERLAY1,
      opacity: 0.8
    }
  },

  sidebar: {
    color: p.text.BASE,
    muted: p.text.SUBTEXT1,
    bg: p.background.MANTLE,
    dragbar: {
      border: p.background.SURFACE2,
      activeBorder: p.background.SURFACE2
    },

    collection: {
      item: {
        bg: p.background.SURFACE1,
        hoverBg: p.background.SURFACE1,
        focusBorder: p.border.BORDER2,
        indentBorder: p.border.BORDER1,
        active: {
          indentBorder: p.border.BORDER1
        },
        example: {
          iconColor: p.text.SUBTEXT2
        }
      }
    },

    dropdownIcon: {
      color: p.text.SUBTEXT2
    }
  },

  dropdown: {
    color: p.text.BASE,
    iconColor: p.text.SUBTEXT2,
    bg: p.utility.WHITE,
    hoverBg: p.background.CRUST,
    shadow: '0 0px 3px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    border: 'none',
    separator: p.border.BORDER1,
    selectedColor: p.primary.TEXT,
    mutedText: p.text.SUBTEXT0
  },

  workspace: {
    accent: p.system.CONTROL_ACCENT,
    border: p.border.BORDER1,
    button: {
      bg: p.background.MANTLE
    }
  },

  request: {
    methods: {
      get: p.hues.GREEN,
      post: p.hues.PURPLE,
      put: p.hues.ORANGE,
      delete: p.hues.RED,
      patch: p.hues.PURPLE,
      options: p.hues.TEAL,
      head: p.hues.CYAN
    },

    grpc: p.hues.INDIGO,
    ws: p.hues.ORANGE,
    gql: p.hues.PINK
  },

  requestTabPanel: {
    url: {
      bg: p.utility.WHITE,
      icon: p.text.SUBTEXT2,
      iconDanger: p.hues.RED,
      border: `solid 1px ${p.border.BORDER1}`
    },
    dragbar: {
      border: p.background.SURFACE2,
      activeBorder: p.border.BORDER2
    },
    responseStatus: p.text.SUBTEXT1,
    responseOk: p.hues.GREEN,
    responseError: p.hues.RED,
    responsePending: p.hues.BLUE,
    responseOverlayBg: 'rgba(255, 255, 255, 0.6)',
    card: {
      bg: p.background.BASE,
      border: p.border.BORDER1,
      hr: p.border.BORDER1
    },
    graphqlDocsExplorer: {
      bg: p.background.BASE,
      color: p.text.BASE
    }
  },

  notifications: {
    bg: p.background.BASE,
    list: {
      bg: p.background.SURFACE0,
      borderRight: 'transparent',
      borderBottom: p.border.BORDER2,
      hoverBg: p.background.SURFACE1,
      active: {
        border: p.hues.BLUE,
        bg: p.background.SURFACE1,
        hoverBg: p.background.SURFACE2
      }
    }
  },

  modal: {
    title: {
      color: p.text.BASE,
      bg: p.background.SURFACE0
    },
    body: {
      color: p.text.BASE,
      bg: p.background.BASE
    },
    input: {
      bg: p.background.BASE,
      border: p.border.BORDER2,
      focusBorder: p.overlay.OVERLAY2
    },
    backdrop: {
      opacity: 0.4
    }
  },

  button: {
    secondary: {
      color: '#212529',
      bg: '#e2e6ea',
      border: '#dae0e5',
      hoverBorder: '#696969'
    },
    close: {
      color: '#212529',
      bg: 'white',
      border: 'white',
      hoverBorder: ''
    },
    disabled: {
      color: '#9f9f9f',
      bg: p.border.BORDER0,
      border: 'rgb(234, 234, 234)'
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
        text: p.utility.WHITE,
        border: p.primary.SOLID
      },
      light: {
        bg: 'rgba(211,127,23,0.08)',
        text: p.primary.SOLID,
        border: 'rgba(211,127,23,0.06)'
      },
      secondary: {
        bg: p.background.MANTLE,
        border: p.border.BORDER2,
        text: p.text.BASE
      },
      success: {
        bg: p.hues.GREEN,
        text: p.utility.WHITE,
        border: p.hues.GREEN
      },
      warning: {
        bg: p.hues.ORANGE,
        text: p.utility.WHITE,
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
      color: p.text.BASE,
      border: p.primary.STRONG
    },
    secondary: {
      active: {
        bg: p.background.SURFACE1,
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
    bg: p.background.CRUST,
    bottomBorder: p.border.BORDER0,
    icon: {
      color: p.text.SUBTEXT0,
      hoverColor: p.text.BASE,
      hoverBg: p.background.SURFACE1
    },
    example: {
      iconColor: p.text.SUBTEXT2
    }
  },

  codemirror: {
    bg: p.utility.WHITE,
    border: p.utility.WHITE,
    placeholder: {
      color: p.overlay.OVERLAY1,
      opacity: 0.75
    },
    gutter: {
      bg: p.utility.WHITE
    },
    variable: {
      valid: p.hues.GREEN,
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
    searchLineHighlightCurrent: 'rgba(120,120,120,0.10)',
    searchMatch: '#B8860B',
    searchMatchActive: '#DAA520'
  },

  table: {
    border: p.border.BORDER0,
    thead: {
      color: p.text.SUBTEXT2
    },
    striped: p.background.SURFACE0,
    input: {
      color: p.text.BASE
    }
  },

  plainGrid: {
    hoverBg: p.background.CRUST
  },

  scrollbar: {
    color: 'rgb(152 151 149)'
  },

  dragAndDrop: {
    border: p.overlay.OVERLAY2, // Using the same gray as focusBorder from input
    borderStyle: '2px solid',
    hoverBg: 'rgba(139, 139, 139, 0.05)', // Matching the border color with reduced opacity
    transition: 'all 0.1s ease'
  },

  infoTip: {
    bg: 'white',
    border: p.background.SURFACE1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },

  statusBar: {
    border: '#E9E9E9',
    color: 'rgb(100, 100, 100)'
  },
  console: {
    bg: '#f8f9fa',
    headerBg: '#f8f9fa',
    contentBg: '#ffffff',
    border: '#dee2e6',
    titleColor: '#212529',
    countColor: '#6c757d',
    buttonColor: '#495057',
    buttonHoverBg: '#e9ecef',
    buttonHoverColor: '#212529',
    messageColor: '#212529',
    timestampColor: '#6c757d',
    emptyColor: '#6c757d',
    logHoverBg: 'rgba(0, 0, 0, 0.03)',
    resizeHandleHover: '#0d6efd',
    resizeHandleActive: '#0d6efd',
    dropdownBg: '#ffffff',
    dropdownHeaderBg: '#f8f9fa',
    optionHoverBg: '#f8f9fa',
    optionLabelColor: '#212529',
    optionCountColor: '#6c757d',
    checkboxColor: p.primary.SOLID,
    scrollbarTrack: '#f8f9fa',
    scrollbarThumb: '#ced4da',
    scrollbarThumbHover: '#adb5bd'
  },

  grpc: {
    tabNav: {
      container: {
        bg: '#f5f5f5'
      },
      button: {
        active: {
          bg: '#ffffff',
          color: '#000000'
        },
        inactive: {
          bg: 'transparent',
          color: '#525252'
        }
      }
    },
    importPaths: {
      header: {
        text: '#838383',
        button: {
          color: '#838383',
          hoverColor: '#343434'
        }
      },
      error: {
        bg: 'transparent',
        text: '#B91C1C',
        link: {
          color: '#B91C1C',
          hoverColor: '#dc2626'
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: 'rgba(0, 0, 0, 0.05)',
        text: '#343434',
        icon: '#838383',
        checkbox: {
          color: '#343434'
        },
        invalid: {
          opacity: 0.6,
          text: '#B91C1C'
        }
      },
      empty: {
        text: '#838383'
      },
      button: {
        bg: '#e2e6ea',
        color: '#212529',
        border: '#dae0e5',
        hoverBorder: '#696969'
      }
    },
    protoFiles: {
      header: {
        text: '#838383',
        button: {
          color: '#838383',
          hoverColor: '#343434'
        }
      },
      error: {
        bg: 'transparent',
        text: '#B91C1C',
        link: {
          color: '#B91C1C',
          hoverColor: '#dc2626'
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: 'rgba(0, 0, 0, 0.05)',
        selected: {
          bg: 'rgba(217, 119, 6, 0.2)',
          border: '#d97706'
        },
        text: '#343434',
        secondaryText: '#838383',
        icon: '#838383',
        invalid: {
          opacity: 0.6,
          text: '#B91C1C'
        }
      },
      empty: {
        text: '#838383'
      },
      button: {
        bg: '#e2e6ea',
        color: '#212529',
        border: '#dae0e5',
        hoverBorder: '#696969'
      }
    }
  },
  deprecationWarning: {
    bg: 'rgba(217, 31, 17, 0.1)',
    border: 'rgba(217, 31, 17, 0.1)',
    icon: '#D91F11',
    text: p.text.BASE
  },

  examples: {
    buttonBg: '#D977061A',
    buttonColor: '#D97706',
    buttonText: '#fff',
    buttonIconColor: '#000',
    border: p.border.BORDER0,
    urlBar: {
      border: p.border.BORDER0,
      bg: '#F5F5F5'
    },
    table: {
      thead: {
        bg: '#f8f9fa',
        color: '#212529'
      }
    },
    checkbox: {
      color: '#fff'
    }
  },

  app: {
    collection: {
      toolbar: {
        environmentSelector: {
          bg: p.utility.WHITE,
          border: p.border.BORDER1,
          icon: p.primary.TEXT,
          text: p.text.BASE,
          caret: p.overlay.OVERLAY1,
          separator: p.border.BORDER1,
          hoverBg: p.utility.WHITE,
          hoverBorder: p.border.BORDER2,

          noEnvironment: {
            text: p.text.SUBTEXT1,
            bg: p.utility.WHITE,
            border: p.border.BORDER2,
            hoverBg: p.utility.WHITE,
            hoverBorder: p.overlay.OVERLAY1
          }
        },
        sandboxMode: {
          safeMode: {
            bg: 'rgba(4, 120, 87, 0.12)',
            color: p.hues.GREEN
          },
          developerMode: {
            bg: 'rgba(204, 145, 73, 0.15)',
            color: p.hues.YELLOW
          }
        }
      }
    }
  }
} as Theme;


const localStorageKey = 'SWAM2_Extensions';
let events = $({});

function wrapHandler(handler) {
  const wrapper = function () {
    let args = Array.from(arguments);
    args.shift();

    try {
      return handler.apply(null, args);
    } catch (e) {
      console.error(e);
    }
  };

  handler.guid = handler.guid || $.guid++;
  wrapper.guid = handler.guid;
  return wrapper;
}

function getLocalExtensionData() {
  try {
    let data = JSON.parse(localStorage.getItem(localStorageKey));
    return data.extensions || {}
  } catch (e) {
    return {}
  }
}

const SWAM = {
  events: {
    extensionsLoaded: 'extensionsLoaded',
    themeLoad: 'themeLoad',
    themeLoaded: 'themeLoaded',
    gameLoaded: 'gameLoaded',
    gameRunning: 'gameRunning',
    gamePrep: 'gamePrep',
    gameWipe: 'gameWipe',
    spectate: 'spectate',
    packetReceived: 'packet',

    playerAdded: 'playerAdded',
    playerDestroyed: 'playerDestroyed',
    playerReteamed: 'playerReteamed',
    playerRespawned: 'playerRespawned',
    playerImpacted: 'playerImpacted',
    playerKilled: 'playerKilled',
    playerUpgraded: 'playerUpgraded',
    playerPowerUp: 'playerPowerUp',
    playerStealth: 'playerStealth',
    playerChangedType: 'playerChangedType',
    playerChangedFlag: 'playerChangedFlag',
    playerSay: 'playerSay',

    mobAdded: 'mobAdded',
    mobDespawned: 'mobDespawned',
    mobDestroyed: 'mobDestroyed',

    serverMessageReceived: 'serverMessageReceived',
    scoreboardUpdate: 'scoreboardUpdate',
    detailedScoreUpdate: 'detailedScoreUpdate',
    chatLineAdded: 'chatLineAdded',
    rendererResized: 'rendererResized',
    keydown: 'keydown',
    keyup: 'keyup',
    minimapClick: 'minimap_click',
    canvasClick: 'canvas_click',
    canvasMousedown: 'canvas_mousedown',

    CTF_MatchStarted: 'CTF_MatchStarted',
    CTF_MatchEnded: 'CTF_MatchEnded',
    CTF_Flag: 'CTF_Flag',
    CTF_FlagEvent: 'CTF_FlagEvent',
    BTR_MatchEnded: 'BTR_MatchEnded',
  },
  extensions: {},
  themes: {},
  theme: null,

  // Event handling, this bit of code directly mimics StarMash's event handling
  // code in order to remain compatible.
  on(event, handler) {
    events.on(event, wrapHandler(handler));
  },
  one(event, handler) {
    events.one(event, wrapHandler(handler));
  },
  off(event, handler) {
    events.off(event, wrapHandler(handler));
  },
  trigger(event, arg) {
    events.trigger(event, arg)
  },

  // Methods for registering extensions
  registerExtension(extension) {
    extension = $.extend({
      id: '',
      name: '',
      description: '',
      author: 'Anonymous',
      version: '0.0',
      dependencies: [],
      themes: [],
      settingsProvider: null,
      url: ''
    }, extension);

    if (extension.id == '')
      throw "Invalid extension. 'id' field not defined.";
    if (extension.name == '')
      throw "Invalid extension. 'name' field not defined.";

    let themes = []
    try {
      // TODO: Extension settings

      for (const theme of extension.themes) {
        console.log(theme);
        if (!theme.themeName)
          throw "Invalid theme: 'themeName' field not defined.";

        SWAM.themes[theme.themeName] = theme
        themes.push(theme)
      }

      SWAM.extensions[extension.id] = {
        url: extension.url,
        enabled: false,
        info: {
          id: extension.id,
          name: extension.name,
          description: extension.description,
          author: extension.author,
          version: extension.version
        }
      };
    } catch (e) {
      delete SWAM.extensions[extension.id];
      for (let theme of themes)
        delete SWAM.themes[theme.themeName];

      console.error("An error occurred while attempting to load a theme: ", e);
      throw "An error occurred while attempting to load a theme: " + e;
    }

  },

  async loadSavedExtensions() {
    let extensionData = getLocalExtensionData();
    let extFutures = []

    for (const extid in extensionData) {
      const url = extensionData[extid];
      if (!url)
        continue;

      extFutures.push(new Promise(function (resolve, reject) {
        $.getScript(url).then(resolve, reject);
      }));
    }

    await Promise.allSettled(extFutures)
  },

  loadThemes() {
    const chosenTheme = "Realistic Sprites";

    if (this.themes[chosenTheme]) {
      this.theme = new this.themes[chosenTheme]();
      this.themeName = chosenTheme;

      this.trigger(this.events.themeLoad);
    }
  },

  // Settings
  SettingsSection: class SettingsSection {
    constructor() { }

    addSeparator(options) { }
    addButton(label, options) { }
    addBoolean(property, label, options) { }
    addString(property, label, options) { }
    addSliderField(property, label, options) { }
  },

  SettingsProvider: class SettingsProvider {
    constructor(defaultValues, onApply) { }

    addSection(title) {
      return new SWAM.SettingsSection();
    }
  },
};

window.SettingsProvider = SWAM.SettingsProvider;

// Some event handlers needed to tie everything together
function handleKeydown(evt) {
  SWAM.trigger(SWAM.events.keyup, evt);
}
function handleKeyup(evt) {
  SWAM.trigger(SWAM.events.keyup, evt)
}
function handleCanvasClick(evt) {
  SWAM.trigger(SWAM.events.canvasClick, evt);
}
function handleCanvasMousedown(evt) {
  SWAM.trigger(SWAM.events.canvasMousedown, evt);
}

SWAM.on(SWAM.events.gamePrep, function () {
  $(window).on('keyup', handleKeyup);
  $(window).on('keydown', handleKeydown);
  $('canvas').on('click', handleCanvasClick);
  $('canvas').on('mousedown', handleCanvasMousedown);
});

SWAM.on(SWAM.events.gameWipe, function () {
  $(window).off('keyup', handleKeyup);
  $(window).off('keydown', handleKeydown);
  $('canvas').off('click', handleCanvasClick);
  $('canvas').off('mousedown', handleCanvasMousedown);
});

// Actual setup and initialization of the server code
$(async function () {
  await SWAM.loadSavedExtensions();
  SWAM.trigger(SWAM.events.extensionsLoaded);
  SWAM.loadThemes();
  SWAM.trigger(SWAM.events.gameLoaded);

  SWAM.setupAirmashGame();
  SWAM.trigger(SWAM.events.gameRunning);
});

window.SWAM = SWAM;
export default SWAM;

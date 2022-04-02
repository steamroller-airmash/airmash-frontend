
window.SWAM = {
  events: {
    extensionsLoaded: 'extensionsLoaded',
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
}

!function () {
  const localStorageKey = 'SWAM2_Extensions';
  let events = $({});

  // Event handling, this bit of code directly mimics StarMash's event handling
  // code in order to remain compatible.
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

  SWAM.on = function (event, handler) {
    events.on(event, wrapHandler(handler));
  }

  SWAM.one = function (event, handler) {
    events.one(event, wrapHandler(handler));
  }

  SWAM.off = function (event, handler) {
    events.off(event, handler);
  }

  SWAM.trigger = events.trigger.bind(events);

  // Methods for registering extensions
  SWAM.registerExtension = function (extension) {
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
      // TODO: Themes and extension settings

      SWAM.extensions[extension.id] = {
        url: extension.url,
        enabled: false,
        info: {
          id: e.id,
          name: e.name,
          description: e.description,
          author: e.author,
          version: e.version
        }
      };
    } catch (e) {
      delete SWAM.extensions[extension.id];
      for (let theme of themes)
        delete SWAM.themes[theme.id];

      throw "An error occurred while attempting to load a theme: " + e;
    }
  }

  function getLocalExtensionData() {
    try {
      let data = JSON.parse(localStorage.getItem(localStorageKey));
      return data.extensions || {}
    } catch (e) {
      return {}
    }
  }

  SWAM.loadSavedExtensions = async function () {
    let extensionData = getLocalExtensionData();
    let extFutures = []

    for (const extid in extensionData) {
      const url = extensionData[extid];

      extFutures.push(new Promise(function (resolve, reject) {
        $.getScript(url).then(resolve, reject);
      }));
    }

    await Promise.allSettled(extFutures)
  };

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

  // Settings
  SWAM.SettingsSection = class SettingsSection {
    constructor() {}

    addSeparator(options) {}
    addButton(label, options) {}
    addBoolean(property, label, options) {}
    addString(property, label, options) {}
    addSliderField(property, label, options) {}
  };

  SWAM.SettingsProvider = class SettingsProvider {
    constructor(defaultValues, onApply) {}

    addSection(title) {
      return new SWAM.SettingsSection();
    }
  };

  window.SettingsProvider = SWAM.SettingsProvider;

  // Actual setup and initialization of the server code
  $(async function() {
    await SWAM.loadSavedExtensions();
    SWAM.trigger(SWAM.events.extensionsLoaded);
    SWAM.trigger(SWAM.events.gameLoaded);

    SWAM.setupAirmashGame();
    SWAM.trigger(SWAM.events.gameRunning);
  });
}();

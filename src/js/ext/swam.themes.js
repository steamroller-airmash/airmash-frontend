"use strict";

const SWAM_version = '2.620092701';

class BaseTheme {
  constructor() {
    this.settingsProvider = null
  }
  loadGameModules() {
    loadGraphics_Default(), loadSounds_Default()
  }
  start() { }
  injectTextures() { }
  injectSounds() { }
}
window.HyperSpace = function () {
  this.sprite = null;
  let e = PIXI.Texture.fromImage("hyperspace");
  this.sprite = new PIXI.Sprite(e)
};

window.HyperSpace.prototype = {
  sprite: null,
  initialize: function () {
    let e = PIXI.Texture.fromImage("hyperspace");
    this.sprite = new PIXI.Sprite(e)
  },
  show: function () {
    function e() {
      for (name in t) "game" != name && (t[name].visible = t[name].prevVisible, delete t[name].prevVisible);
      game.graphics.layers.game.removeChild(s.sprite), s.sprite.filters = null, Graphics.renderBackground()
    }
    let s = this,
      t = game.graphics.layers;
    (function () {
      for (name in t) "game" != name && (t[name].prevVisible = t[name].visible, t[name].visible = !1);
      s.sprite.width = game.screenX, s.sprite.height = game.screenY, game.graphics.layers.game.addChild(s.sprite)
    })();
    let a = new PIXI.filters.ZoomBlurFilter(2, {
      x: game.halfScreenX,
      y: game.halfScreenY
    }, 0),
      r = new PIXI.filters.AdjustmentFilter({
        gamma: 2,
        brightness: 2,
        alpha: 1
      }),
      i = function () {
        a.strength -= .03, 1 < r.gamma && (r.gamma -= .02, r.brightness -= .02), 0 < a.strength ? setTimeout(function () {
          i()
        }, 10) : (a.strength = 0, e())
      };
    this.sprite.filters = [a, r], i()
  }
};

function StarMash_2() {
  SWAM.replaceCSS(getFilePath("style.css"));
  let e = new SettingsProvider({
    nebulas: {
      blue: !0,
      green: !0,
      red: !0
    },
    asteroidLayers: 3,
    decorations: {
      stellar: !0,
      planets: !0,
      moons: !0,
      ships: !0
    }
  }, function (e) {
    let s = e;
    if (game.graphics.layers.map.children[0].alpha = .8, game.graphics.layers.map.children[0].visible = s.nebulas.blue, game.graphics.layers.map.children[2].alpha = .8, game.graphics.layers.map.children[2].visible = s.nebulas.green, game.graphics.layers.map.children[4].alpha = .8, game.graphics.layers.map.children[4].visible = s.nebulas.red, SWAM.planet && (SWAM.planet.visible = s.decorations.planets), SWAM.ShipContainer && (SWAM.ShipContainer.visible = s.decorations.ships), SWAM.asteroids1 && SWAM.asteroids2 && SWAM.asteroids3) {
      var t = [SWAM.asteroids1, SWAM.asteroids2, SWAM.asteroids3];
      for (let e = 0; 3 > e; e++) t[e].visible = e < s.asteroidLayers
    }
    Graphics.renderBackground()
  });
  e.root = "", e.title = "Mod Settings";
  let s = e.addSection("Background");
  s.addButton("Generate New Background", {
    click: function () {
      SWAM.RandomizeBackground()
    }
  }), s.addBoolean("nebulas.blue", "Blue nebulas"), s.addBoolean("nebulas.green", "Green nebulas"), s.addBoolean("nebulas.red", "Red nebulas"), s = e.addSection("Asteroid field"), s.addValuesField("asteroidLayers", "Visible layers", {
    0: 0,
    1: 1,
    2: 2,
    3: 3
  }), s = e.addSection("Decorative objects"), s.addBoolean("decorations.stellar", "Distant stellar objects"), s.addBoolean("decorations.planets", "Planets"), s.addBoolean("decorations.moons", "Moons"), s.addBoolean("decorations.ships", "Ships"), this.settingsProvider = e
}
StarMash_2.themeName = "StarMash v.2";
StarMash_2.author = "Bombita";
StarMash_2.version = SWAM_version;

StarMash_2.prototype.start = function () {
  function e() {
    let s = $("#regenerateBackground");
    if (0 == s.length) {
      var t = getTemplate("#regenerateBackground");
      s = $(t), $("body").append(s);
      let e = $("#btnRegenerate", s);
      e.click(function () {
        SWAM.RandomizeBackground()
      })
    }
    s.slideDown(), e.timer && clearInterval(e.timer);
    let a = $(".timerIndicator", s);
    e.width = 100, a.css("width", "100%"), e.timer = setInterval(function () {
      e.width--, a.animate({
        width: e.width + "%"
      }, 90), 0 == e.width && (clearInterval(e.timer), delete e.timer, s.slideUp())
    }, 100)
  }

  function s() {
    function e(e) {
      for (let s = 0; 3 > s; s++) a[s].visible = e
    }

    function s(e) {
      for (let s = 0; 3 > s; s++) a[s].renderable = e
    }
    let t = game.graphics.layers.map,
      a = [t.children[1], t.children[3], t.children[5]];
    t.visible = !1,
      function () {
        for (let e = 0; 3 > e; e++) {
          t.children[2 * e].mask = null;
          let s = Tools.randInt(0, a.length - 1);
          t.children[2 * e].mask = a[s], SWAM.debug && console.log(`${t.children[2 * e].layerName}: ${a[s].layerName}`)
        }
        s(!0)
      }(),
      function () {
        e(!0);
        let s = config.mapWidth * game.scale - game.screenX / game.scale,
          a = config.mapHeight * game.scale - game.screenY / game.scale;
        for (let e = 0; 3 > e; e++) t.children[2 * e + 1].position.set(Tools.randInt(-s, 0), Tools.randInt(-a, 0));
        Graphics.renderBackground(), e(!1)
      }(), t.visible = !0;
    let r = 1 == Tools.randInt(0, 1);
    SWAM.MoveBackgroundTiles = r, s(!1), e(r), SWAM.debug && console.log("movable nebulas: " + r)
  }

  function t() {
    for (let a in m) {
      let r = m[a];
      r.scale = r.scale || 1;
      let i = Graphics.renderer,
        o = PIXI.Texture.fromImage(a),
        n = null;
      for (let l in r.useMask && (n = PIXI.Texture.fromImage(a + "_Mask")), r.items) {
        let a = r.items[l],
          p = new PIXI.Texture(o, new PIXI.Rectangle(a[0] * r.scale, a[1] * r.scale, a[2] * r.scale, a[3] * r.scale)),
          d = new PIXI.Sprite(p);
        d.scale.set(r.resultScale, r.resultScale);
        var e = null;
        if (r.useMask) {
          var s = r.maskScale || 1,
            t = new PIXI.Texture(n, new PIXI.Rectangle(a[0] * r.scale / s, a[1] * r.scale / s, a[2] * r.scale / s, a[3] * r.scale / s)),
            e = new PIXI.Sprite(t);
          e.scale.set(s, s), d.addChild(e), d.filters = [new PIXI.SpriteMaskFilter(e)], e.position.set(-a[0] * r.scale, -a[1] * r.scale)
        }
        let h = PIXI.RenderTexture.create(d.width, d.height);
        i.render(d, h, !0), SWAM.Textures[l] = h
      }
    }
  }

  function a(e, s) {
    let t = SWAM.Textures[e],
      a = new PIXI.Sprite(t);
    return "undefined" == typeof s && (s = {}), a.distanceFactor = s.distanceFactor ? s.distanceFactor : [1, 1], a.basePosition = s.basePosition ? s.basePosition : [0, 0], s.position && a.position.set(s.position[0], s.position[1]), s.anchor && a.anchor.set(s.anchor[0], s.anchor[1]), s.pivot && a.pivot.set(s.pivot[0], s.pivot[1]), s.scale && (Array.isArray(s.scale) ? a.scale.set(s.scale[0], s.scale[1]) : a.scale.set(s.scale)), s.rotation && (a.rotation = s.rotation), s.alpha && (a.alpha = s.alpha), s.blend && (a.blendMode = PIXI.BLEND_MODES[s.blend]), s.tint && (a.tint = s.tint), s.mask && (a.mask = s.mask), s.visible && (a.visible = s.visible), s.container && s.container.addChild(a), a
  }

  function r(e, s) {
    "undefined" == typeof s && (s = {});
    let t = a(e, s);
    return t.distanceFactor = s.distanceFactor ? s.distanceFactor : [1, 1], t.basePosition = s.basePosition ? s.basePosition : [0, 0], t.update = function () {
      let e = Graphics.getCamera(),
        s = e.x + (t.basePosition[0] - e.x) / t.distanceFactor[0],
        a = e.y + (t.basePosition[1] - e.y) / t.distanceFactor[1];
      t.position.set(s, a)
    }, t
  }

  function i() {
    function e(e) {
      e = e || {}, e.count = e.count || 12, e.x = e.x || [-14e3, -1e4], e.y = e.y || [-1e3, 1e3], e.radius = e.radius || [5e3, 13e3], e.baseDistanceFactor = e.baseDistanceFactor || 8, e.textures = e.textures || m.ImperialShips.items;
      var s = e.count,
        t = [];
      for (let s in e.textures) t.push(s);
      let o = 2 * Math.PI / s;
      for (let l = 0, i = 0; l < s; l++, i += o) {
        let s = Tools.randInt(e.radius[0], e.radius[1]),
          a = Tools.randInt(e.x[0], e.x[1]),
          o = Tools.randInt(e.y[0], e.y[1]),
          l = n(a, o, s, i);
        a = l.x, o = l.y;
        let p = Tools.rand(.2, .85),
          d = .5 * (1 / (p / .85)) + .5,
          h = t[Tools.randInt(0, t.length - 1)],
          c = r(h, {
            distanceFactor: [e.baseDistanceFactor * d, e.baseDistanceFactor * d],
            scale: [p, p],
            basePosition: [a, o],
            position: [a, o],
            anchor: [.5, .5]
          });
        c.textureName = h, c.angleUsed = i, SWAM.Ships.push(c)
      }
    }
    var s = SWAM.ShipContainer;
    null == s ? (s = new PIXI.Container, s.scale.set(game.scale, game.scale), game.graphics.layers.map.addChildAt(s, l()), SWAM.ShipContainer = s) : (s.removeChildren(), SWAM.Ships = []), e({
      count: 12,
      x: [-17e3, -13e3]
    }), e({
      count: 16,
      x: [13e3, 17e3],
      radius: [5e3, 1e4],
      textures: m.RebelShips.items
    }), SWAM.Ships.sort(function (e, s) {
      return s.distanceFactor[0] - e.distanceFactor[0]
    });
    for (let e of SWAM.Ships) s.addChild(e)
  }

  function o() {
    let e = Graphics.getCamera(),
      s = e.x - game.halfScreenX / game.scale,
      t = e.y - game.halfScreenY / game.scale;
    return {
      x: s,
      y: t
    }
  }

  function n(e, s, t, r) {
    let a = t * Math.cos(r) + e,
      i = t * Math.sin(r) + s;
    return {
      x: a,
      y: i
    }
  }

  function l() {
    let e = game.graphics.layers.map,
      s = game.graphics.layers.doodads,
      t = 0;
    for (var a = 0; a < e.children.length; a++) e.children[a] == s && (t = a);
    return t
  }

  function p(e, s, t) {
    var a = Graphics.renderer.width,
      r = Graphics.renderer.height;
    let i = Textures.tile(e, a, r);
    return i.layerName = s, game.graphics.layers.map.addChildAt(i, l()), i.tileScale.set(t, t), i
  }

  function d(e = -1) {
    function s() {
      let e = h(Graphics.renderer, t[a]);
      e.layerName = "planet", e.scaleModifier = Tools.rand(.1, .65), e.scale.set(.5 * e.scaleModifier, .5 * e.scaleModifier);
      let s = 4 * e.scaleModifier;
      e.basePosition = [Tools.randInt(-25e3, 7e4), Tools.randInt(-2e4 * s, 4e4 * s)], e.distanceFactor = [30, 30], SWAM.debug && (console.log("planet: " + t[a]), console.log("planet scale: " + e.scale.x.toFixed(2) + "    modifier: " + e.scaleModifier.toFixed(2)), console.log("planet pos: " + e.basePosition[0] + ", " + e.basePosition[1])), e.update = function (s, t) {
        let a = (s + e.basePosition[0] * game.scale) / e.distanceFactor[0],
          r = (t + e.basePosition[1] * game.scale) / e.distanceFactor[1];
        e.position.set(a, r)
      }, null != SWAM.planet && game.graphics.layers.map.removeChild(SWAM.planet), SWAM.planet = e, game.graphics.layers.map.addChildAt(SWAM.planet, 6);
      let r = o();
      e.update(-r.x * game.scale, -r.y * game.scale), SWAM.loadSettings()
    }
    let t = [];
    for (let s in u) t.push(s);
    let a = Tools.randInt(0, t.length - 1);
    0 <= e && e < t.length && (a = e);
    let r = new PIXI.loaders.Loader;
    r.add(t[a], u[t[a]].texture), r.add(t[a] + "_Mask", u[t[a]].mask), r.load(s)
  }

  function h(e, s) {
    var t = PIXI.Texture.fromImage(s),
      a = new PIXI.Sprite(t),
      r = PIXI.Sprite.fromImage(s + "_Mask");
    r.scale.set(1, 1);
    let i = PIXI.RenderTexture.create(2 * a.width, 2 * a.height),
      o = new PIXI.Sprite(i);
    return a.addChild(r), a.filters = [new PIXI.SpriteMaskFilter(r)], a.scale.set(2, 2), a.position.set(0, 0), e.render(a, i), o.update = c, o
  }

  function c() {
    var e = SWAM.planet;
    let s = Graphics.getCamera(),
      t = game.halfScreenX / game.scale,
      a = game.halfScreenY / game.scale,
      r = s.x - t + 16384,
      i = game.screenX - e.width,
      o = config.mapWidth - game.screenX / game.scale,
      n = s.y + 8192,
      l = 0;
    if (5e3 > n) l = game.screenY;
    else {
      let s = config.mapHeight - a - 5e3;
      l = game.screenY - e.height * (n - 5e3) / s
    }
    e.position.set(r * i / o, l)
  }
  config.overdraw = 0, config.overdrawOptimize = !0, game.graphics.layers.shadows.visible = !1, game.graphics.layers.smoke.visible = !1, StarMash_2.addGraphicsSetButton(), SWAM.ShipContainer = null, SWAM.Ships = [], SWAM.Planets = [], SWAM.Moons = [], SWAM.Stellar = [], SWAM.Textures = {};
  let m = {
    ImperialShips: {
      scale: 1,
      resultScale: .5,
      useMask: !0,
      maskScale: 2,
      items: {
        ISD_01: [0, 0, 1700, 583],
        ISD_02: [0, 2017, 1250, 803],
        ISD_03: [1701, 0, 1414, 741],
        ISD_04: [0, 1288, 1418, 728],
        ISD_05: [1419, 1566, 1109, 738],
        ISD_06: [1251, 2305, 913, 523],
        ISD_07: [1463, 742, 1409, 575],
        ISD_08: [0, 584, 1462, 703],
        Dread_01: [0, 2821, 925, 294],
        Dread_02: [2545, 1318, 657, 505],
        Dread_03: [1419, 1318, 1125, 247],
        Dread_04: [926, 2829, 711, 348]
      }
    },
    RebelShips: {
      scale: .5,
      resultScale: 1,
      useMask: !0,
      maskScale: 2,
      items: {
        CR90_1: [0, 2013, 591, 293],
        CR90_2: [0, 2307, 553, 180],
        CR90_3: [2911, 1381, 604, 214],
        CR90_4: [2038, 2005, 417, 407],
        CR90_5: [554, 2307, 402, 237],
        GR75_1: [592, 2013, 508, 264],
        GR75_2: [2467, 492, 738, 207],
        GR75_3: [2911, 1596, 601, 248],
        Liberty_1: [0, 1680, 1115, 332],
        Liberty_2: [1694, 0, 960, 464],
        Liberty_3: [1553, 465, 913, 537],
        M80_1: [0, 1369, 1515, 310],
        M80_2: [0, 462, 1552, 394],
        MonCalamari_1: [0, 0, 1693, 461],
        MonCalamari_2: [0, 857, 1547, 511],
        NebulonB1_1: [1548, 1003, 813, 433],
        NebulonB1_2: [1617, 1970, 420, 578],
        NebulonB1_3: [2655, 0, 794, 491],
        NebulonB1_4: [2296, 1437, 614, 567],
        NebulonB1_5: [1516, 1437, 779, 532],
        NebulonB2_1: [1116, 1970, 500, 660],
        NebulonC_1: [2467, 700, 680, 680]
      }
    }
  },
    u = {};
  for (let e, s = 2; 12 >= s; s++) e = ("0" + s).slice(-2), u["Planet" + e] = {
    texture: getFilePath("themes/StarMash_2/planets/planet" + e + ".jpg"),
    mask: getFilePath("themes/StarMash_2/planets/planet" + e + "-mask.jpg")
  };
  let g = new PIXI.loaders.Loader;
  g.add("hyperspace", getFilePath("themes/StarMash_2/hyperspace.jpg")), g.add("ImperialShips", getFilePath("themes/StarMash_2/ships/ships1.jpg")), g.add("ImperialShips_Mask", getFilePath("themes/StarMash_2/ships/ships1-mask-50.jpg")), g.add("RebelShips", getFilePath("themes/StarMash_2/ships/RebelShips1.jpg")), g.add("RebelShips_Mask", getFilePath("themes/StarMash_2/ships/RebelShips-mask.jpg")), g.load(() => {
    t(), SWAM.RandomizeBackground(), SWAM.asteroids3 = p("asteroids1", "asteroids3", game.scale / 3), SWAM.asteroids2 = p("asteroids2", "asteroids2", game.scale), SWAM.asteroids1 = p("asteroids1", "asteroids1", game.scale), SWAM.hyperSpace = new HyperSpace, SWAM.loadSettings(), Graphics.setCamera(0, 0)
  }), SWAM.RandomizeBackground = function (t = -1) {
    e(), s(), d(t), i()
  }, SWAM.debug && (SWAM.ShowRegenerateButton = e), SWAM.MoveBackgroundTiles = !0, SWAM.debug && (SWAM.createShips = i), SWAM.BackgroundFactor = 100, SWAM.resizeLayers = function (e, s) {
    let t = e / game.scale,
      a = s / game.scale;
    SWAM.planet, SWAM.ShipContainer && SWAM.ShipContainer.scale.set(game.scale, game.scale), SWAM.asteroids1 && (SWAM.asteroids1.width = e, SWAM.asteroids1.height = s), SWAM.asteroids2 && (SWAM.asteroids2.width = e, SWAM.asteroids2.height = s), SWAM.asteroids3 && (SWAM.asteroids3.width = e, SWAM.asteroids3.height = s)
  }, SWAM.doUpdates = !0, SWAM.updateLayers = function (e, s) {
    if (SWAM.doUpdates && SWAM.Settings && (SWAM.Settings.themes.StarMash_2.decorations.planets && this.planet && this.planet.update(e, s), 0 < SWAM.Settings.themes.StarMash_2.asteroidLayers && this.updateAsteroids(e, s), SWAM.Settings.themes.StarMash_2.decorations.ships && SWAM.ShipContainer && (SWAM.ShipContainer.position.set(e, s), SWAM.Ships)))
      for (let t in SWAM.Ships) SWAM.Ships[t].update(e, s)
  }, SWAM.updateAsteroids = function (e, s) {
    SWAM.asteroids1 && SWAM.asteroids1.tilePosition.set(e / 2, s / 2), SWAM.asteroids2 && SWAM.asteroids2.tilePosition.set(e / 4, s / 4), SWAM.asteroids3 && SWAM.asteroids3.tilePosition.set(e / 6, s / 6)
  }, SWAM.on("playerAdded", StarMash_2.overridePlayerMethods), SWAM.on("mobAdded", StarMash_2.mobAdded), SWAM.on("scoreboardUpdate", StarMash_2.onScoreboardUpdate), SWAM.on("aircraftSelected", StarMash_2.aircraftSelected)
};
StarMash_2.addGraphicsSetButton = function () {
  const e = ["url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAC/VBMVEUAAAD////////////////////////+/v4LCwv///8ODg7//////////////////////////////v59fHz///////////////8VFRX5+fn//v7//v7///////8SEhL////////////++vr///8bGxsUFBQbGxsuLi7///////////8gICA0NDRcXFxAQED////////SCQkxMTEmJiZBQUFiYmKwsLDa2trOzs7q6uqlpaX////////9/f3////KCwsuLi47OjpUVFRQUFDhV1eBgYFsbGzupqa8vLzS0tLk5OTw8PDl5eX////////////79fXskpLxCgrbCQnOFxfZGRncFBT0GxsqKiraJyf1NzcgICBGRkbjQEDUPT3VVlZDQ0PYZWWHh4fqjo6hBQVHR0f09PTBCgryvb3R0dH43d31xcX+5uY5OTn////uAwPDERG6Cgq/FxfVDw/aIiJPT0/eTEzJHBw5OTncdHR0dHSCgoLULS3WPT1RUVGvAgJ0dHS+vr7ExMTyycn7h4fTLy/sJCT75+fOVFRra2vmenqgoKCampr55ub88fH///+Tk5PY2NioqKjpenrGxsbzwMDQQUH4+PjvWlr209Pr6+v86urs7OzEDAzlDQ3mICDOS0vXKirha2v2YWEzMzODg4PiRESTk5NcWlqhoaHBAgKmpqbreXnPFRXxsbGDg4OzDg5qamrsb2/ehYXuvLzLHh61tbX67e3oVFTmRkZUVFTgVVX2zMy8Gxv6mJjzt7ewsLBpaWn30ND8sLDyra323991dXXtoaHtQkLdYGD////0r6+Ghob////xp6d8fHz56OhVVVXuVFT0w8PafX30zs7toqLrOzvKysrvtbXrnZ3hd3fa2tr1qqq7u7vorKz2trbbaGjtwcHwwcH71dXdfHz12Njzk5P85eUHBwcJCQncAADfAQHIAADtAADqAADmAADRAADiAADWAQHZAADMAADFAADDAQHAAQHxAADKAADOAQG6AADkAADTAQHFcXUqAAAA6XRSTlMAAgUJDzASwP4e/VozIUgYOl4s3VNAPDb6wGRQQiT7Pg1NHBX49/XockpF8u/m11Um/PLy7eHQx8PBiYFubGf58+/o5uXc3NLKycXDt5CHencx/Pv49/f29PHu7Ovq6eXi4drX08zCsKqmpZeOjCn++fj39vTp6Ojk3dzb2tbU09LNzMnJw8O8vLKwo52amZaVlJCNioeHenFwbWVi+/r16OPg3Nzb2NfW09PSz87Nzc3My8jGxsTDwsLAvr29vLu3trOxsa+sqaalo6KhoJqak5GMiIeDgX54eHh2cG9ubGZlYltPTkJCOwDD0BUAAARNSURBVDjLZZRldBNBFIXTrCfZjbunSZqkCVBKgQrFpS20FHd3d3d3d3d3d3d3d99NGwhV2sJhdgsFDu/fzPnOvfe8N294f1VICASHEiQhhiF+CO+/CuGKD6EEIlGqEBIFFFd/I3w+BEF8Pkyo9Y/HP9CrSRic2JsiDCAWGEVhGLaJFPeH5a++W1xkg7krC/Qb40OwmCBTU20EYp0/PC8r2GK+HiFsqakgHcoas0IgiUz0esF7GUKV61Q+PSv441wchfT4+HCRSIaUCIVCWDOURJRP9y/4oDYs7TqxJYAGTOy61KD+tGjCnRdClREFUnwLIaKeDBz/1mB4M2ng4Or1siKqt218+JVS9e7SrshpQgkJ83mQGHEvHlZ+rt7gude7oFfLeln1q9TPrDvXYKa6ygVh8xQiMcSDSxh0R/OHL7aqVC8n9cnNKZ8XEZHR4NBziTqmhtaHjyjnMcI8sVp4o29wis6DIJRrb6+c9Lz8YN1ttSmkO16yaiXcMVUoEvOMVO0NGX0v6swlSLV0RuucbJC8ygydpLsGZxh7I1OxJUqShwivNsjo10knIUKNVMq+5dnpeRE7Yq3dffKSDNOsdEnHHLeMpyq3x5/Zr1O8xGYRq3VdWgCo8Zlyt33RmFzAVNJWxScrRDxPSvM0f/2TLqUNQmXC6azfgC435VptmTYavGJiDUExoYRnTV6Z5q/bNtZqhNEeiluDc7PTq3TrHF22akUBY6qGlQ1vKjXzFLVWfE3zV+kCQhEioJSbk31ZGjtKQ9MMw1TGaoY5pEpe8Vpfvqf5G1RPFqrUbtf5VQW5HWXW2q1oDiqlrTlIIDUA6PMXINX8WHK8Lm7m2D4FHW2I+3+oDqD8mc3HXp955WDLgo4IohTGVjP9Y6dPbviZNcxovKZ62xa9j+v0emlK5+gxci/+JzgV26Qna5iZEVGvfG67TbMXLpy9O1KOdWBbUCpxNNcCpWttzwBnGMxPb0ebvKc6e020JiqJbWZ/7VDmNGimWneiTiDwmTUMtmNAkhoJApBa4BtaOBYNO5Yeim5NvgUCrOFIwND2MtGNaFA4N+AKhQMmzHHj6nxjDUcyrJA3CWuG01xVkFdiNNxTQWWsFKC2V2QAJeiPYVECDokq3cHHFD46CyGJP9vwW2ACNrqyhmFwr3x9RaBkKlUaw4qeLx8tQbnGNdwSVQZLqlrKXmjk8A5JxBKH4OG/FiEECpXpU6aEMa0OaLHoNpHACrfLy2BYjcp002tCM7dSYKfEiLV4zDrGOapsknazTyOotFHboezOcDpsltDMLSe7nRabUaJ/dsTBOKO2JiRE2scklK4WTpvaP1KoAAOEOApCSREljGnvxBlnBQHeKJxmHMVmSd1qYyHzmyJkKuuymAvtw5xOuzOy2OSYZXozQqBFDKCAZSiJqCiFND7O5YqLlxZ3mxGjGP798RSJwWJSJpIoPRTlMahEMvKvT/En4U+imSkuVtwAAAAASUVORK5CYII=')", "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAACi1BMVEUAAAD///8LCwv///////8ODg4QEBD////7+/sWFhb///////////8NDQ3///82Njb///////////////////////8ZGRn///////////////////////////8UFBQUFBQmJiZhYWH///////////////////////8cHBwaGhouLi4xMTFHR0dpaWl7e3v///8fHx8fHx8uLi5ubm5+fn7BwcHS0tLv7+/4+Pj///////////////////////////8gICAgICBXV1dkZGSAgICCgoLb29vo6Ojx8fGmpqb///////////////////8YGBgoKCgzMzM/Pz8zMzMqKipLS0tTU1NRUVFbW1tDQ0N5eXkxMTGEhISKioq9vb3Y2NhOTk7l5eXl5eX09PT9/f3///////////////////////8SEhIVFRUrKysiIiI7OztDQ0MkJCRPT091dXVjY2NqamqpqalHR0e0tLS6urrMzMxISEjh4eG+vr7z8/P19fXOzs52dnadnZ2vr6////8aGhpdXV05OTkwMDAqKipOTk5cXFxFRUWSkpI6OjpVVVWfn5+lpaVwcHA/Pz+tra2qqqqvr6+BgYFZWVloaGhnZ2fs7OzOzs7S0tJVVVXt7e3a2tqwsLDR0dHPz89+fn7R0dGKioq6urqWlpba2tqurq6oqKj+/v7AwMD////k5OTe3t74+Pjc3Nz////4+Pj////r6+v19fXq6urw8PD///////8jIyM7Ozs7OztxcXF0dHRbW1tPT094eHjFxcWxsbG1tbW8vLzIyMhoaGhra2tra2ufn5+hoaGYmJicnJzMzMzS0tKSkpLDw8PIyMjKysrPz88HBwcKCgrXv00AAAAA13RSTlMAv/4DAf39IcD6Qgk9/grwPzstJBYS9F5aU0hGHQ/7+PXkV086MRgH+Pjz8uvi3Tf49Ojg3MzIw8BnXDQyLyoU8u3n49zbxsPCilVSUEoN+fTv7evr6ujo5ePd3dvZzcfGxbd+eXNiXyYOAvr19PDv7e3p393Z0dDPzsrKxcXCwL6skoNM8eXk5OPg3tvX1tXU09PT0dHQzs7Nx8PDwL+8uLitp6ajoJWUkpGQhYOBgX12b25ubW1lY18jH/Xh4Nva1tXQy8XEwsC2tbKkop6cmZeVi4l4dpOI3Z0AAAP8SURBVDjLdVRnVxNREN23cVt6JwkhhSRAAoTQkSBGIDE0QVREBRQ79t4Vxd5777333nvvdefnuG+DkuM5vi/75Z6Zu3MLEXs9JLIkPVNaopEmWiyJUk2wlElJkkl6EHFvQmo/PdNLYzEn9Lw5Zsz1nuPMFrnnnr5fKoZ1j7GWalbcXb5sYY7RXmccOHfZ8jsuudZqwMO6MEoDU5JoqhyxEvi6egXpCABpnNtZbMm611vZhZIoe+uyXNcOTeLt67cuWODw5hfMmZ0N9hG/qjXj9THUBJlB5zZXDoNJ294UsjvLbXTTFjZ6cHc2rDmTLB/fWyYRlqUmMe6qzrX8kJcdaH+Lg+Z5OtC8CLGv18H0Uya5zpDag5D0s2ZVncsB53BU2Nzg5cXnbfC3oUWPyemfTW6mXULI9FrXlUeQyaL8Ro7nwZc7U6UAsGXMQ8hPrflhLkmREe2Muuc+yCjMz1XhGeQMFjlpHgDSM+cXrYLNNxJ1SYS+V/XpbMhoxhD8VEvQIIUwEcMqyoD7mFySQtzX3N6j8KWBsIHCoLThfX0ggCgbCZA2md5wS80QpYkXQ4GdgwEcQ5003je/AH+oMn86QMaO9LrztVrC4zoBziKngsxEbGYdT/c/eqy/jeea9gu0oZENw7vqIJFVNQLmRAeR1NDIEtTyYPOXUaPP7nX42aJIC0dObWtVbEp2E3LTMNtiVMGBQjU0v+/xUWOra8aNPnl4QXgqDXQuOhDqU6wm1MV9pixF5RSAQGTWhbFSTy918aVtnPiDg9HIAfYEKSFNMA48gspIDOIHXK7xWK3aFVeH8CJoGjtyNfUfUO2/oPh15PrYOtOl2RP/rMsR1mHidpE4mT6zFROvcWHiL/wqUiQ+RSCOT0DOWYJPMDyKNjqefsUnqM9jOyLNHNnQ1krhE3hqTkA5Kx4T5XrFYw4QjuksRHkUzCgKw1tzEMuSHdhVBlCflzkR0+2SpSmMZZmXbseyMKLAAQDgaIgJPBkLreCwwD5RYMEqZmyVChUAYPVVUTaD5MXn8zcC9wFbpZ2RCqYbhE2HUdQMhJyiZyaXzxNM9wybLmbfh9i+rYM5ALJ/XniqMImetgsJ1HO+C/ZVikFIFoIwK4IKKxrSYos41cxFqO0JGfpk0jBJEiFSBsad3JkDQ14Vob4tDkrg7M2LILR4Hd8nFqkJceE0Pl8aZbc02ejGjWzHwd0hfu03HE6lBFcBjrkbxxyMs7YWFOCY75gd4icu/Nkd81hhBC2myoUrSQj4aLI+mwf79jMJtVk6XBh/q8dg1cpx9cwdaEzzGqdvf195x6XW3jco4wtKLDF5d4lV1co9upT2WInF91gKUxrsqkN5UBtfh78BLbSeZWMjzYgAAAAASUVORK5CYII=')", "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAADAFBMVEUAAAD////////////////////////////////////++/v////////////////////////////////////////////////////////////////////vAwP////////////////////////////////////////////////////zBATICgr////////////////////dBATFBATqAwPRCgrqDAzXDw/oHR36iIj64OD////95OT//////////////////f3////////jBQXXBgbBBQXNEhLFERHdFBT0GBjbGBjUFBTaJCT1JCTTPT32QEDhQEDqSkrbSUnYUlL0bW3wp6f4s7Pvubn//////Pz////yo6P////////////TAgLSBwfnBgbzCQntCQm6CAjxDQ3cCAjvGBjQHBzAHBy7EBDgKCjwODjuJSXtOjriVFTbWFjSV1f0T0/abm7zYmLjdnbfPT3mjo7nbW30sLDyycn66en75+f40NDpWVn8sLD31tb3xcX////4yMj////0oqL5x8f55eX88fH0wMD55ub+6+vwdHTzwMDfQkL////+8vLuq6v98vL209PvsbH88PDvwcHoh4f539/ohYXvoKDMGxvVKSnRLCzqJCT1MzPyNDTFJSXOQkLrFRXgTEzOS0voDg7oQEDlW1vXKirMEhLXYmLYZGTha2vqGxvTMzPUQkLsh4fuLy/UJyfulpbqoaHrqqrXODj6enrreXn2oKDwu7vehYXehYXVMzPuvLzLHh7oVFTmRkb519fQLCzpICDPWVn6mJjzt7f3goLNT0/4o6P0cnLkdHT32tr5wcH239/toaHtQkLtwcH0r6/jfn7uVFT80dH0w8PafX33np7NODj++/v0zs7hd3fvXl784ODuVlb99fX85ubbaGj71dXIAADLAADCAADpAAC6AADfAADQAADkAADaAADXAAC/AADFAADmAAC3AAC1AADcAADrAAC8AADwAADtAADhAADNAADUAADuAADSAADyAABVO9ozAAAA5nRSTlMAAhAIBB4xBjoSGgxkSTdDNVJPHGE8LywlCnJM/lhVRz4rIRaIXUAoIxT++pCNg3wi/v7++/r59sihlI9ubGpbUUYY/v39+fn49/f39PPt6+vp6ebX0a+ql3t3dWdZJv79/fz8/Pr69/b29u/u7uvm5ePi39/d3dfRzMnEvLu6sa6ppKGfnZybmZmWjYyHhICAfHdwaWJeSD4yMPby8fHv7uzr6ejo6Ofk4+Pi4eDf3dzZ2dbU09DQz8/OzcnIx8bGwsLBv769vLu7u7e3trW1r6mmpaKOjIqIh4aEg4N2dXNuaGdlT3CF9PkAAARHSURBVDjLZZRldNpQGIZDQkIIJLhDcVtXmUu9c3d3d3d3d3d3d3d3d/cChQLtWlrWdtsNbO3O2ffv3vOc93mTe+6F/hkGA4GNIgNqhBEmA/pvGKFhImxUilskUgMbUKH5F2GyEARhsWCUL1x0flEyZYDBCuwwizCAcGA2G+bAIkzw7kD+rpcRfBEc3iryMhGYQGNXryJQqWreQYejw/B5QgwlVq2ORQm2IkwxQBM99vXNCj2mTWwRmebwdGieQGLWFfM/YTKDXcGkGRZswCzvL85fSfGWzRo7EEBbx07/wuOv/HDtOY9vsyMMIOOgGNlm99XlPN7y25uGHa/uKNvsUJ/LSy2Sb4+3z1VRsTCLASGpUnLJkchnQh7vVe/0Gk16OuoMqO3tPpenI9vs3/I6mS/iMCC4PY87Pv/EEpVEsvR6L3/pSEfZjr6al9rgVMqy8a7DH1UyOwsiqKRpdTz3PqdgUq3yXA1nmiPfU/XUYlIq05mnlStzl6tDFZCcXDy8oPwjrq59LGWeuceZCZoPmMnFDbG4eVa/QL8XAj0MYUlPa/vqtuDiqF1OxlyIBFDHUQuEVjvBN0/vH+hyi0ulQpKEkaV8dSe1xQlOKsWdWB9AaycmgpWRL57UN6gerOShUEqrHaW8tW8qLSIFLNPM3gt8jSuZpWwFgSc8WB9U14tW2SBhdAV3Tvejb1VyGNYLZg8B0MAZ7aRs2EbGnC4XzOscJbBCgqhyP9zenZVAKRGWNGOI35nZpJKYj6KUuNJQVzCvREmNHooo2SnDnVOzmSlJQpHKh9tynZn177dWURJN9KgKNFRZIwNQmawMt7fhOFOiOL7y6N7pfmfkmZZKcdvocY2yQlA7GuriyvqR4204emrLyWMGZafn+p2Nx0xuOfVKoyoZrgCAgC7Z1CPgAsKqdfcdG7G5a/Z3QJWuP6LZsD6l3AAqLFEywgqRCzaqXbSwoGz1GtXSvwPK7yxdvU55n9edkRUorGUSyiGLcqg6SAt9P/PTnH6ayvXTZxOG1A1itAaIz73RrZAWen0eR5ozNz07G0QBqMCb8yPLpW4aLyEgqyBuQ15hICT0ODKdubQQRHl++mioR3MzZodQXXzFznmFf4WZQBiKyqehjDKDF5JyDsSWRcxp8CsvSH8hENK1QCvnn1IVmnMpAoEUIrzthHq/wrUKAEULgY8u5a7StBUph5kQC26vVVas9W+tcBTwlWoUp8GMCANcO6NMGHOyFhAW1wpHVW04RYyjHCZ9gRUEJmhVsZ4a1ApTQEhHlW08hWuxgRsVego4IkyonNCgW5mivwWiqq0ZGSfWydk0E6YIWQp3TsW+5TpVoWulla7WtdegFq01uI2NFD8rCqMcFyTE3Wnav0LN8uV7rmty9slCsRZDQ64iCoFFeolQHB9jioqKMkW3Tmyn5cuNnD9McRhbZOXrtEJBhCBZxcOlttTiR/E3AYEOqmgNZcgAAAAASUVORK5CYII=')"];
  game.chosenGraphicsSet = -1;
  let s = $("<div class=\"\" style=\"position: relative; width: 44px; height: 44px; cursor: pointer; background-color: rgba(0, 0, 0, 0.3); background-repeat: no-repeat; background-position: center; display: none;\" id=\"graphicsSet\" cgs= \"-1\" title= \"Switch style between Imperial / Rebel / Random\" ></div > ").css("background-image", "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAC/VBMVEUAAAD////////////////////////+/v4LCwv///8ODg7//////////////////////////////v59fHz///////////////8VFRX5+fn//v7//v7///////8SEhL////////////++vr///8bGxsUFBQbGxsuLi7///////////8gICA0NDRcXFxAQED////////SCQkxMTEmJiZBQUFiYmKwsLDa2trOzs7q6uqlpaX////////9/f3////KCwsuLi47OjpUVFRQUFDhV1eBgYFsbGzupqa8vLzS0tLk5OTw8PDl5eX////////////79fXskpLxCgrbCQnOFxfZGRncFBT0GxsqKiraJyf1NzcgICBGRkbjQEDUPT3VVlZDQ0PYZWWHh4fqjo6hBQVHR0f09PTBCgryvb3R0dH43d31xcX+5uY5OTn////uAwPDERG6Cgq/FxfVDw/aIiJPT0/eTEzJHBw5OTncdHR0dHSCgoLULS3WPT1RUVGvAgJ0dHS+vr7ExMTyycn7h4fTLy/sJCT75+fOVFRra2vmenqgoKCampr55ub88fH///+Tk5PY2NioqKjpenrGxsbzwMDQQUH4+PjvWlr209Pr6+v86urs7OzEDAzlDQ3mICDOS0vXKirha2v2YWEzMzODg4PiRESTk5NcWlqhoaHBAgKmpqbreXnPFRXxsbGDg4OzDg5qamrsb2/ehYXuvLzLHh61tbX67e3oVFTmRkZUVFTgVVX2zMy8Gxv6mJjzt7ewsLBpaWn30ND8sLDyra323991dXXtoaHtQkLdYGD////0r6+Ghob////xp6d8fHz56OhVVVXuVFT0w8PafX30zs7toqLrOzvKysrvtbXrnZ3hd3fa2tr1qqq7u7vorKz2trbbaGjtwcHwwcH71dXdfHz12Njzk5P85eUHBwcJCQncAADfAQHIAADtAADqAADmAADRAADiAADWAQHZAADMAADFAADDAQHAAQHxAADKAADOAQG6AADkAADTAQHFcXUqAAAA6XRSTlMAAgUJDzASwP4e/VozIUgYOl4s3VNAPDb6wGRQQiT7Pg1NHBX49/XockpF8u/m11Um/PLy7eHQx8PBiYFubGf58+/o5uXc3NLKycXDt5CHencx/Pv49/f29PHu7Ovq6eXi4drX08zCsKqmpZeOjCn++fj39vTp6Ojk3dzb2tbU09LNzMnJw8O8vLKwo52amZaVlJCNioeHenFwbWVi+/r16OPg3Nzb2NfW09PSz87Nzc3My8jGxsTDwsLAvr29vLu3trOxsa+sqaalo6KhoJqak5GMiIeDgX54eHh2cG9ubGZlYltPTkJCOwDD0BUAAARNSURBVDjLZZRldBNBFIXTrCfZjbunSZqkCVBKgQrFpS20FHd3d3d3d3d3d3d3d99NGwhV2sJhdgsFDu/fzPnOvfe8N294f1VICASHEiQhhiF+CO+/CuGKD6EEIlGqEBIFFFd/I3w+BEF8Pkyo9Y/HP9CrSRic2JsiDCAWGEVhGLaJFPeH5a++W1xkg7krC/Qb40OwmCBTU20EYp0/PC8r2GK+HiFsqakgHcoas0IgiUz0esF7GUKV61Q+PSv441wchfT4+HCRSIaUCIVCWDOURJRP9y/4oDYs7TqxJYAGTOy61KD+tGjCnRdClREFUnwLIaKeDBz/1mB4M2ng4Or1siKqt218+JVS9e7SrshpQgkJ83mQGHEvHlZ+rt7gude7oFfLeln1q9TPrDvXYKa6ygVh8xQiMcSDSxh0R/OHL7aqVC8n9cnNKZ8XEZHR4NBziTqmhtaHjyjnMcI8sVp4o29wis6DIJRrb6+c9Lz8YN1ttSmkO16yaiXcMVUoEvOMVO0NGX0v6swlSLV0RuucbJC8ygydpLsGZxh7I1OxJUqShwivNsjo10knIUKNVMq+5dnpeRE7Yq3dffKSDNOsdEnHHLeMpyq3x5/Zr1O8xGYRq3VdWgCo8Zlyt33RmFzAVNJWxScrRDxPSvM0f/2TLqUNQmXC6azfgC435VptmTYavGJiDUExoYRnTV6Z5q/bNtZqhNEeiluDc7PTq3TrHF22akUBY6qGlQ1vKjXzFLVWfE3zV+kCQhEioJSbk31ZGjtKQ9MMw1TGaoY5pEpe8Vpfvqf5G1RPFqrUbtf5VQW5HWXW2q1oDiqlrTlIIDUA6PMXINX8WHK8Lm7m2D4FHW2I+3+oDqD8mc3HXp955WDLgo4IohTGVjP9Y6dPbviZNcxovKZ62xa9j+v0emlK5+gxci/+JzgV26Qna5iZEVGvfG67TbMXLpy9O1KOdWBbUCpxNNcCpWttzwBnGMxPb0ebvKc6e020JiqJbWZ/7VDmNGimWneiTiDwmTUMtmNAkhoJApBa4BtaOBYNO5Yeim5NvgUCrOFIwND2MtGNaFA4N+AKhQMmzHHj6nxjDUcyrJA3CWuG01xVkFdiNNxTQWWsFKC2V2QAJeiPYVECDokq3cHHFD46CyGJP9vwW2ACNrqyhmFwr3x9RaBkKlUaw4qeLx8tQbnGNdwSVQZLqlrKXmjk8A5JxBKH4OG/FiEECpXpU6aEMa0OaLHoNpHACrfLy2BYjcp002tCM7dSYKfEiLV4zDrGOapsknazTyOotFHboezOcDpsltDMLSe7nRabUaJ/dsTBOKO2JiRE2scklK4WTpvaP1KoAAOEOApCSREljGnvxBlnBQHeKJxmHMVmSd1qYyHzmyJkKuuymAvtw5xOuzOy2OSYZXozQqBFDKCAZSiJqCiFND7O5YqLlxZ3mxGjGP798RSJwWJSJpIoPRTlMahEMvKvT/En4U+imSkuVtwAAAAASUVORK5CYII=')").click(function () {
    if (2 == game.gameType) return;
    let t = parseInt($(s).attr("cgs"));
    t++, 2 == t && (t = -1), $(s).attr("cgs", t), game.chosenGraphicsSet = t, $(s).css("background-image", e[t + 1]);
    let a = Players.getMe();
    null != a && (a.destroy(!1), a.setupGraphics(!0), a.visibilityUpdate(!0));
    UI.aircraftSelected(a.type)
  });
  $("#sidebar").prepend(s)
};
StarMash_2.aircraftSelected = function () {
  for (var e = 0 == game.myGraphicsSet ? "teamImperial" : "teamRebel", s = 1; 5 >= s; s++) $("#selectaircraft-" + s).removeClass("teamImperial").removeClass("teamRebel").addClass(e);
  StarMash_2.updateShipNames()
};
StarMash_2.updateShipNames = function () {
  let e = {
    1: ["X-Wing"],
    2: ["B-Wing"],
    3: ["A-Wing"],
    4: ["Y-Wing"],
    5: ["Scout ship"],
    101: ["Speed"],
    102: ["Deflector Shields"],
    103: ["Energy Regen"],
    104: ["Laser Speed"]
  },
    s = {
      1: ["Tie Fighter"],
      2: ["Tie Bomber"],
      3: ["Tie Interceptor"],
      4: ["Tie Advanced"],
      5: ["Tie Phantom"],
      101: ["Speed"],
      102: ["Deflector Shields"],
      103: ["Energy Regen"],
      104: ["Laser Speed"]
    };
  for (var t in game.tooltipValues) game.tooltipValues[t][0] = 0 == game.myGraphicsSet ? s[t][0] : e[t][0]
};
StarMash_2.mobAdded = function (e, s, t) {
  let a = Mobs.get(e.id),
    r = -1 < $.inArray(a.type, [1, 2, 3, 5, 6, 7]);
  if (r) {
    if (t) {
      var i = Players.get(t);
      if (0 == i.graphicsSet);
      else {
        var o = new PIXI.filters.ColorMatrixFilter;
        o.hue(-110), a.sprites.sprite.filters = [o]
      }
    } else if (0 == game.myGraphicsSet) {
      var o = new PIXI.filters.ColorMatrixFilter;
      o.hue(-110), a.sprites.sprite.filters = [o]
    }
    a.sprites.thruster.alpha = 0, a.sprites.thrusterGlow.alpha = 1, a.sprites.smokeGlow.alpha = 0, 2 == a.type ? a.sprites.sprite.scale.set(.3, .4) : 3 == a.type && a.sprites.sprite.scale.set(.56, .4)
  }
}
StarMash_2.onScoreboardUpdate = function () {
  let e = SWAM.getLeaders();
  forEachPlayer(s => {
    let t = "",
      a = "",
      r = s.sprites.sprite;
    1 == s.type && (0 == s.graphicsSet ? (a = Textures.get("raptor"), t = Textures.get("sith_Infiltrator")) : (a = Textures.get("raptor_2"), t = Textures.get("black_Xwing")), e[s.id] ? r.texture != t && (r.texture = t) : r.texture != a && (r.texture = a))
  })
};
StarMash_2.overridePlayerMethods = function (e) {
  e.setGraphicsSet = function () {
    this.graphicsSet = 2 == game.gameType ? this.team - 1 : this.id == game.myID && -1 != game.chosenGraphicsSet ? game.chosenGraphicsSet : Tools.randInt(0, 1), this.id == game.myID && (game.myGraphicsSet = this.graphicsSet)
  }, e.setupThrusterColor = function () {
    var e = new PIXI.filters.ColorMatrixFilter,
      s = new PIXI.filters.ColorMatrixFilter;
    0 == this.graphicsSet ? e.hue(-20) : (s.saturate(1, !0), e.hue(165)), this.sprites.thruster && (this.sprites.thruster.filters = [s, e]), this.sprites.thruster1 && (this.sprites.thruster1.filters = [s, e]), this.sprites.thruster2 && (this.sprites.thruster2.filters = [s, e])
  }, e.setupGraphics = function (s) {
    this.setGraphicsSet();
    var e = 0 == this.graphicsSet ? "" : "_2",
      a = null;
    switch (this.me() && (a = {
      layer: "aircraftme"
    }), this.sprites.powerup = Textures.init("powerupShield", {
      visible: !1,
      alpha: .75
    }), this.sprites.powerupCircle = Textures.init("powerupCircle", {
      visible: !1,
      alpha: .75
    }), this.type) {
      case 1:
        this.state.baseScale = .25, this.state.nameplateDist = 60, this.sprites.sprite = Textures.init("shipRaptor" + e, a), this.sprites.shadow = Textures.init("shipRaptorShadow" + e, {
          scale: this.state.baseScale * (2.4 / config.shadowScaling)
        }), this.sprites.thruster = Textures.init("shipRaptorThruster" + e), this.sprites.thrusterGlow = Textures.init("thrusterGlowSmall"), this.sprites.thrusterShadow = Textures.init("thrusterShadow");
        break;
      case 2:
        this.state.baseScale = .35, this.state.nameplateDist = 60, this.sprites.sprite = Textures.init("shipSpirit" + e, a), this.sprites.shadow = Textures.init("shipSpiritShadow" + e, {
          scale: this.state.baseScale * (2.4 / config.shadowScaling)
        }), this.sprites.thruster1 = Textures.init("shipRaptorThruster" + e), this.sprites.thruster2 = Textures.init("shipRaptorThruster" + e), this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall"), this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall"), this.sprites.thruster1Shadow = Textures.init("thrusterShadow"), this.sprites.thruster2Shadow = Textures.init("thrusterShadow");
        break;
      case 3:
        this.state.baseScale = .25, this.state.nameplateDist = 60, this.sprites.sprite = Textures.init("shipComanche" + e, a), this.sprites.rotor = Textures.init("shipComancheRotor" + e, a), this.sprites.shadow = Textures.init("shipComancheShadow" + e, {
          scale: this.state.baseScale * (2.4 / config.shadowScaling)
        }), this.sprites.rotorShadow = Textures.init("shipComancheRotorShadow" + e, {
          scale: 2 * this.state.baseScale * (2.4 / config.shadowScaling)
        });
        break;
      case 4:
        this.state.baseScale = .28, this.state.nameplateDist = 60, this.sprites.sprite = Textures.init("shipTornado" + e, a), this.sprites.shadow = Textures.init("shipTornadoShadow" + e, {
          scale: this.state.baseScale * (2.4 / config.shadowScaling)
        }), this.sprites.thruster1 = Textures.init("shipRaptorThruster" + e), this.sprites.thruster2 = Textures.init("shipRaptorThruster" + e), this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall"), this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall"), this.sprites.thruster1Shadow = Textures.init("thrusterShadow"), this.sprites.thruster2Shadow = Textures.init("thrusterShadow");
        break;
      case 5:
        this.state.baseScale = .28, this.state.nameplateDist = 60, this.sprites.sprite = Textures.init("shipProwler" + e, a), this.sprites.shadow = Textures.init("shipProwlerShadow" + e, {
          scale: this.state.baseScale * (2.4 / config.shadowScaling)
        }), this.sprites.thruster1 = Textures.init("shipRaptorThruster" + e), this.sprites.thruster2 = Textures.init("shipRaptorThruster" + e), this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall"), this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall"), this.sprites.thruster1Shadow = Textures.init("thrusterShadow"), this.sprites.thruster2Shadow = Textures.init("thrusterShadow");
    }
    if ("function" == typeof window.Glow && Glow(this), this.setupThrusterColor(), (this.reel || s || (this.setupNameplate(), this.setupChatBubbles(), null != this.level && this.setupLevelPlate()), config.debug.collisions)) {
      this.col = new PIXI.Graphics;
      for (var r of config.ships[this.type].collisions) this.col.beginFill(16777215, .2), this.col.drawCircle(r[0], r[1], r[2]), this.col.endFill();
      game.graphics.layers.explosions.addChild(this.col)
    }
  }, e.reteam = function (s) {
    var e = this.team;
    this.team = s, this.sprites.name.style = new PIXI.TextStyle(this.nameplateTextStyle()), UI.changeMinimapTeam(this.id, this.team), e != this.team && (this.destroy(!1), this.setupGraphics(!0), this.visibilityUpdate(!0))
  }, e.updateGraphics = function () {
    var e = Tools.oscillator(.025, 1e3, this.randomness) * this.scale,
      t = 1.5 * this.state.thrustLevel,
      n = this.rot,
      r = Graphics.shadowCoords(this.pos);
    if (Graphics.transform(this.sprites.sprite, this.pos.x, this.pos.y, n, e * this.state.baseScale, e * this.state.baseScale), Graphics.transform(this.sprites.shadow, r.x, r.y, n, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale), this.powerupActive) {
      var i = .35 * (0 == this.state.powerupFadeState ? 2 * (1 - this.state.powerupFade) + 1 : 1 - this.state.powerupFade) * Tools.oscillator(.075, 100, this.randomness),
        o = .75 * (0 == this.state.powerupFadeState ? Tools.clamp(2 * this.state.powerupFade, 0, 1) : Tools.clamp(1 - 1.3 * this.state.powerupFade, 0, 1)) * this.alpha;
      Graphics.transform(this.sprites.powerup, this.pos.x, this.pos.y - 80, 0, i, i, o), Graphics.transform(this.sprites.powerupCircle, this.pos.x, this.pos.y - 80, this.state.powerupAngle, 1.35 * i, 1.35 * i, o)
    }
    var s = Tools.oscillator(.1, .5, this.randomness),
      p = .01 > Math.abs(this.state.thrustLevel) ? 0 : this.state.thrustLevel / 2 + (0 < this.state.thrustLevel ? .5 : -.5),
      l = Tools.clamp(2 * Math.abs(this.state.thrustLevel) - .1, 0, 1);
    if (0 == this.graphicsSet) switch (this.type) {
      case 1:
        Graphics.transform(this.sprites.thruster, this.pos.x + Math.sin(-n) * (5 * e), this.pos.y + Math.cos(-n) * (5 * e), n + (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .5 * s * p * this.scale, l), this.sprites.thruster.alpha = .05, Graphics.transform(this.sprites.thrusterGlow, this.pos.x + Math.sin(-n - .5 * this.state.thrustDir) * (40 * e), this.pos.y + Math.cos(-n - .5 * this.state.thrustDir) * (40 * e), null, 1.5 * t * this.scale, 1 * t * this.scale, .3 * this.state.thrustLevel);
        break;
      case 2:
        0 > this.state.thrustLevel && (s *= .7), Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-n - .5) * (15 * e), this.pos.y + Math.cos(-n - .5) * (15 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .4 * s * p * this.scale, .6 * s * p * this.scale, l), Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.5 - n) * (15 * e), this.pos.y + Math.cos(.5 - n) * (15 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .4 * s * p * this.scale, .6 * s * p * this.scale, l), Graphics.transform(this.sprites.thruster1Shadow, r.x + Math.sin(-n - .5) * (10 * e) / config.shadowScaling, r.y + Math.cos(-n - .5) * (10 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .5 * s * p * this.scale * (4 / config.shadowScaling), .6 * s * p * this.scale * (4 / config.shadowScaling), l / 2.5), Graphics.transform(this.sprites.thruster2Shadow, r.x + Math.sin(.5 - n) * (10 * e) / config.shadowScaling, r.y + Math.cos(.5 - n) * (10 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .5 * s * p * this.scale * (4 / config.shadowScaling), .6 * s * p * this.scale * (4 / config.shadowScaling), l / 2.5), Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-n - .3) * (50 * e), this.pos.y + Math.cos(-n - .3) * (50 * e), null, 2.5 * this.scale, 1.5 * this.scale, .3 * this.state.thrustLevel), Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.3 - n) * (50 * e), this.pos.y + Math.cos(.3 - n) * (50 * e), null, 2.5 * this.scale, 1.5 * this.scale, .3 * this.state.thrustLevel);
        break;
      case 3:
        Graphics.transform(this.sprites.rotor, this.pos.x, this.pos.y, this.state.thrustDir, 2 * (e * this.state.baseScale), 2 * (e * this.state.baseScale), .8), Graphics.transform(this.sprites.rotorShadow, r.x, r.y, this.state.thrustDir, 2 * (this.state.baseScale * (2.4 / config.shadowScaling) * this.scale), 2 * (this.state.baseScale * (2.4 / config.shadowScaling) * this.scale));
        break;
      case 4:
        0 > this.state.thrustLevel && (s *= .7), Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-n - .25) * (5 * e), this.pos.y + Math.cos(-n - .25) * (5 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .5 * s * p * this.scale, l), Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.25 - n) * (5 * e), this.pos.y + Math.cos(.25 - n) * (5 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .5 * s * p * this.scale, l), Graphics.transform(this.sprites.thruster1Shadow, r.x + Math.sin(-n - .15) * (28 * e) / config.shadowScaling, r.y + Math.cos(-n - .15) * (28 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale * (4 / config.shadowScaling), .5 * s * p * this.scale * (4 / config.shadowScaling), l / 2.5), Graphics.transform(this.sprites.thruster2Shadow, r.x + Math.sin(.15 - n) * (28 * e) / config.shadowScaling, r.y + Math.cos(.15 - n) * (28 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale * (4 / config.shadowScaling), .5 * s * p * this.scale * (4 / config.shadowScaling), l / 2.5), Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-n - .2) * (45 * e), this.pos.y + Math.cos(-n - .2) * (45 * e), null, 2.5 * this.scale, 1.5 * this.scale, .25 * this.state.thrustLevel), Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.2 - n) * (45 * e), this.pos.y + Math.cos(.2 - n) * (45 * e), null, 2.5 * this.scale, 1.5 * this.scale, .25 * this.state.thrustLevel);
        break;
      case 5:
        0 > this.state.thrustLevel && (s *= .7), Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-n - .35) * (20 * e), this.pos.y + Math.cos(-n - .35) * (20 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .4 * s * p * this.scale, l * this.alpha), Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.35 - n) * (20 * e), this.pos.y + Math.cos(.35 - n) * (20 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .4 * s * p * this.scale, l * this.alpha), Graphics.transform(this.sprites.thruster1Shadow, r.x + Math.sin(-n - .35) * (20 * e) / config.shadowScaling, r.y + Math.cos(-n - .35) * (20 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .4 * s * p * this.scale * (4 / config.shadowScaling), .4 * s * p * this.scale * (4 / config.shadowScaling), l * this.alpha / 2.5), Graphics.transform(this.sprites.thruster2Shadow, r.x + Math.sin(.35 - n) * (20 * e) / config.shadowScaling, r.y + Math.cos(.35 - n) * (20 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .4 * s * p * this.scale * (4 / config.shadowScaling), .4 * s * p * this.scale * (4 / config.shadowScaling), l * this.alpha / 2.5), Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-n - .2 - 0 * this.state.thrustDir) * (35 * e), this.pos.y + Math.cos(-n - .2 - 0 * this.state.thrustDir) * (35 * e), null, 2.5 * this.scale, 1.5 * this.scale, .2 * this.state.thrustLevel * this.alpha), Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.2 - n - 0 * this.state.thrustDir) * (35 * e), this.pos.y + Math.cos(.2 - n - 0 * this.state.thrustDir) * (35 * e), null, 2.5 * this.scale, 1.5 * this.scale, .2 * this.state.thrustLevel * this.alpha);
    } else switch (this.type) {
      case 1:
        Graphics.transform(this.sprites.thruster, this.pos.x + Math.sin(-n) * (20 * e), this.pos.y + Math.cos(-n) * (20 * e), n + (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .5 * s * p * this.scale, l), Graphics.transform(this.sprites.thrusterShadow, r.x + Math.sin(-n) * (20 * e) / config.shadowScaling, r.y + Math.cos(-n) * (20 * e) / config.shadowScaling, n + (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .4 * s * p * this.scale * (4 / config.shadowScaling), .5 * s * p * this.scale * (4 / config.shadowScaling), l / 2.5), Graphics.transform(this.sprites.thrusterGlow, this.pos.x + Math.sin(-n - .5 * this.state.thrustDir) * (40 * e), this.pos.y + Math.cos(-n - .5 * this.state.thrustDir) * (40 * e), null, 1.5 * t * this.scale, 1 * t * this.scale, .3 * this.state.thrustLevel), this.sprites.thruster.scale.x = this.sprites.thruster.scale.y = .25;
        break;
      case 2:
        0 > this.state.thrustLevel && (s *= .7), Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.8 - n) * (50 * e), this.pos.y + Math.cos(.8 - n) * (50 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .4 * s * p * this.scale, .6 * s * p * this.scale, l), Graphics.transform(this.sprites.thruster2Shadow, r.x + Math.sin(.5 - n) * (32 * e) / config.shadowScaling, r.y + Math.cos(.5 - n) * (32 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .5 * s * p * this.scale * (4 / config.shadowScaling), .6 * s * p * this.scale * (4 / config.shadowScaling), l / 2.5), Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.3 - n) * (50 * e), this.pos.y + Math.cos(.3 - n) * (50 * e), null, 2.5 * this.scale, 1.5 * this.scale, .3 * this.state.thrustLevel), this.sprites.thruster1.visible = !1, this.sprites.thruster1Glow.visible = !1, this.sprites.thruster1Shadow.visible = !1;
        break;
      case 3:
        Graphics.transform(this.sprites.rotor, this.pos.x, this.pos.y, this.state.thrustDir, 2 * (e * this.state.baseScale), 2 * (e * this.state.baseScale), .8), Graphics.transform(this.sprites.rotorShadow, r.x, r.y, this.state.thrustDir, 2 * (this.state.baseScale * (2.4 / config.shadowScaling) * this.scale), 2 * (this.state.baseScale * (2.4 / config.shadowScaling) * this.scale));
        break;
      case 4:
        0 > this.state.thrustLevel && (s *= .7), Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-n - 1) * (20 * e), this.pos.y + Math.cos(-n - 1) * (20 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .5 * s * p * this.scale, l), Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(1 - n) * (20 * e), this.pos.y + Math.cos(1 - n) * (20 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .5 * s * p * this.scale, l), Graphics.transform(this.sprites.thruster1Shadow, r.x + Math.sin(-n - .15) * (28 * e) / config.shadowScaling, r.y + Math.cos(-n - .15) * (28 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale * (4 / config.shadowScaling), .5 * s * p * this.scale * (4 / config.shadowScaling), l / 2.5), Graphics.transform(this.sprites.thruster2Shadow, r.x + Math.sin(.15 - n) * (28 * e) / config.shadowScaling, r.y + Math.cos(.15 - n) * (28 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale * (4 / config.shadowScaling), .5 * s * p * this.scale * (4 / config.shadowScaling), l / 2.5), Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-n - .2) * (45 * e), this.pos.y + Math.cos(-n - .2) * (45 * e), null, 2.5 * this.scale, 1.5 * this.scale, .25 * this.state.thrustLevel), Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.2 - n) * (45 * e), this.pos.y + Math.cos(.2 - n) * (45 * e), null, 2.5 * this.scale, 1.5 * this.scale, .25 * this.state.thrustLevel), this.sprites.thruster1.scale.x = this.sprites.thruster1.scale.y = .35, this.sprites.thruster2.scale.x = this.sprites.thruster2.scale.y = .35;
        break;
      case 5:
        0 > this.state.thrustLevel && (s *= .7), Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-n - .3) * (20 * e), this.pos.y + Math.cos(-n - .35) * (20 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .4 * s * p * this.scale, l * this.alpha), Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.3 - n) * (20 * e), this.pos.y + Math.cos(.35 - n) * (20 * e), n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .3 * s * p * this.scale, .4 * s * p * this.scale, l * this.alpha), Graphics.transform(this.sprites.thruster1Shadow, r.x + Math.sin(-n - .35) * (20 * e) / config.shadowScaling, r.y + Math.cos(-n - .35) * (20 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .4 * s * p * this.scale * (4 / config.shadowScaling), .4 * s * p * this.scale * (4 / config.shadowScaling), l * this.alpha / 2.5), Graphics.transform(this.sprites.thruster2Shadow, r.x + Math.sin(.35 - n) * (20 * e) / config.shadowScaling, r.y + Math.cos(.35 - n) * (20 * e) / config.shadowScaling, n + .5 * (0 < this.state.thrustLevel ? this.state.thrustDir : 0), .4 * s * p * this.scale * (4 / config.shadowScaling), .4 * s * p * this.scale * (4 / config.shadowScaling), l * this.alpha / 2.5), Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-n - .2 - 0 * this.state.thrustDir) * (35 * e), this.pos.y + Math.cos(-n - .2 - 0 * this.state.thrustDir) * (35 * e), null, 2.5 * this.scale, 1.5 * this.scale, .2 * this.state.thrustLevel * this.alpha), Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.2 - n - 0 * this.state.thrustDir) * (35 * e), this.pos.y + Math.cos(.2 - n - 0 * this.state.thrustDir) * (35 * e), null, 2.5 * this.scale, 1.5 * this.scale, .2 * this.state.thrustLevel * this.alpha);
    }
    this.updateNameplate(), this.state.bubble && this.updateBubble(), config.debug.collisions && this.col && (this.col.position.set(this.pos.x, this.pos.y), this.col.rotation = this.rot)
  }, e.resetGraphics = function () {
    try {
      this.destroy(!1), this.setupGraphics(!0), this.visibilityUpdate(!0)
    } catch (s) { }
  }, e.resetGraphics(), e.me() && UI.aircraftSelected(e.type)
};
StarMash_2.prototype.injectTextures = function (e, s, t, a) {
  for (let o in e)
    if (!e[o].startsWith("http")) {
      var r = e[o];
      r = r.replace("assets/", ""), -1 < r.indexOf("?") && (r = r.substr(0, r.indexOf("?"))), e[o] = getFilePath("themes/StarMash_2/" + r)
    } var o = {
      map_forest_mask: getFilePath("themes/StarMash_2/map_forest_mask.jpg"),
      asteroids1: getFilePath("themes/StarMash_2/asteroids/asteroids1.png"),
      asteroids2: getFilePath("themes/StarMash_2/asteroids/asteroids2.png"),
      asteroids3: getFilePath("themes/StarMash_2/asteroids/asteroids3.png")
    };
  for (let r in o) e[r] = o[r];
  var n = {
    ui_minimap_1: ["gui", [500, 596, 16, 16]],
    ui_minimap_2: ["gui", [516, 596, 16, 16]],
    ui_minimap_3: ["gui", [532, 596, 16, 16]],
    ui_minimap_target: ["gui", [580, 596, 16, 16]],
    spirit_2: ["aircraft", [4, 260, 512, 256]],
    tornado_2: ["aircraft", [524, 260, 256, 256]],
    raptor_2: ["aircraft", [788, 260, 256, 256]],
    prowler_2: ["aircraft", [1052, 260, 256, 256]],
    comanche_2: ["aircraft", [1316, 260, 128, 256]],
    sith_Infiltrator: ["aircraft", [1540, 4, 256, 256]],
    black_Xwing: ["aircraft", [1540, 260, 256, 256]],
    spirit_shadow_2: ["shadows", [4, 200, 256, 128]],
    tornado_shadow_2: ["shadows", [268, 200, 128, 128]],
    raptor_shadow_2: ["shadows", [540, 200, 128, 128]],
    prowler_shadow_2: ["shadows", [676, 200, 128, 128]],
    comanche_shadow_2: ["shadows", [812, 200, 64, 128]]
  };
  for (let r in n) s[r] = n[r];
  var l = {
    minimap1: {
      texture: "ui_minimap_1",
      layer: "ui2",
      anchor: [.5, .5],
      alpha: 1,
      scale: .8
    },
    minimap2: {
      texture: "ui_minimap_2",
      layer: "ui2",
      anchor: [.5, .5],
      alpha: 1,
      scale: .8
    },
    minimap3: {
      texture: "ui_minimap_3",
      layer: "ui2",
      anchor: [.5, .5],
      alpha: 1,
      scale: .8
    },
    minimapTarget: {
      texture: "ui_minimap_target",
      layer: "ui3",
      anchor: [.5, .5],
      alpha: 1,
      scale: .5
    },
    shipRaptor_2: {
      texture: "raptor_2",
      layer: "aircraft",
      anchor: [.5, .6]
    },
    shipRaptorShadow_2: {
      texture: "raptor_shadow_2",
      layer: "shadows",
      anchor: [.5, .57]
    },
    shipRaptorThruster_2: {
      texture: "afterburner",
      layer: "thrusters",
      anchor: [.5, .1],
      scale: [.25, .25]
    },
    shipSpirit_2: {
      texture: "spirit_2",
      layer: "aircraft",
      anchor: [.5, .5]
    },
    shipSpiritShadow_2: {
      texture: "spirit_shadow_2",
      layer: "shadows",
      anchor: [.5, .5]
    },
    shipSpiritThruster_2: {
      texture: "afterburner",
      layer: "thrusters",
      anchor: [.5, .1],
      scale: [.25, .25]
    },
    shipComanche_2: {
      texture: "comanche_2",
      layer: "aircraft",
      anchor: [.5, .4]
    },
    shipComancheShadow_2: {
      texture: "comanche_shadow_2",
      layer: "shadows",
      anchor: [.5, .43]
    },
    shipComancheRotor_2: {
      texture: "comanche_rotor",
      layer: "aircraft",
      anchor: [.5, .5],
      scale: [.25, .25]
    },
    shipComancheRotorShadow_2: {
      texture: "comanche_rotor_shadow",
      layer: "shadows",
      anchor: [.5, .5]
    },
    shipTornado_2: {
      texture: "tornado_2",
      layer: "aircraft",
      anchor: [.5, .65]
    },
    shipTornadoShadow_2: {
      texture: "tornado_shadow_2",
      layer: "shadows",
      anchor: [.5, .605]
    },
    shipProwler_2: {
      texture: "prowler_2",
      layer: "aircraft",
      anchor: [.5, .5]
    },
    shipProwlerShadow_2: {
      texture: "prowler_shadow_2",
      layer: "shadows",
      anchor: [.5, .5]
    }
  };
  for (let r in l) a[r] = l[r];
  a.missile.scale = [.3, .3], a.missileFat.scale = [.2, .3], a.missileSmall.scale = [20, 20]
};
StarMash_2.prototype.loadGameModules = function () {
  loadGraphics_SWAM(), loadSounds_SWAM()
};

function StarMash_1() {
  SWAM.replaceCSS(getFilePath("style.css"));
  let e = new SettingsProvider({
    nebulas: {
      blue: !0,
      green: !0,
      red: !0
    }
  }, function (e) {
    let s = e;
    game.graphics.layers.map.children[0].alpha = .8, game.graphics.layers.map.children[0].visible = s.nebulas.blue, game.graphics.layers.map.children[2].alpha = .8, game.graphics.layers.map.children[2].visible = s.nebulas.green, game.graphics.layers.map.children[4].alpha = .8, game.graphics.layers.map.children[4].visible = s.nebulas.red, Graphics.renderBackground()
  });
  e.root = "", e.title = "Mod Settings";
  let s = e.addSection("General");
  s.addBoolean("nebulas.blue", "Blue nebulas"), s.addBoolean("nebulas.green", "Green nebulas"), s.addBoolean("nebulas.red", "Red nebulas"), this.settingsProvider = e
}
StarMash_1.themeName = "StarMash v.1, no Parallax", StarMash_1.author = "Bombita", StarMash_1.version = SWAM_version, StarMash_1.prototype.start = function () {
  SWAM.BackgroundFactor = 1, SWAM.MoveBackgroundTiles = !0, config.overdraw = 256, config.overdrawOptimize = !0, game.graphics.layers.shadows.visible = !1, game.graphics.layers.smoke.visible = !1, StarMash_2.addGraphicsSetButton(), SWAM.on("playerAdded", StarMash_2.overridePlayerMethods), SWAM.on("mobAdded", StarMash_2.mobAdded), SWAM.on("scoreboardUpdate", StarMash_2.onScoreboardUpdate), SWAM.on("aircraftSelected", StarMash_2.aircraftSelected), SWAM.Theme.settingsProvider.apply(SWAM.Settings)
};
StarMash_1.prototype.injectTextures = StarMash_2.prototype.injectTextures, StarMash_1.prototype.loadGameModules = StarMash_2.prototype.loadGameModules;

class VanillaTheme {
  constructor() {
    let e = this;
    this.teamColors = {
      0: {
        player: 16777215,
        mob: 16777215
      },
      1: {
        player: 10539263,
        mob: 5592575
      },
      2: {
        player: 16756912,
        mob: 16733525
      }
    };
    let s = new SettingsProvider({
      map: {
        sea: !0,
        forest: !0,
        sand: !0,
        rock: !0,
        polygons: !0
      },
      layers: {
        shadows: !0,
        smoke: !0,
        useSnow: !1
      },
      gameplay: {
        colorMissiles: !0,
        colorPlayers: !0
      }
    }, function (s) {
      e.settings = s;
      let t = s,
        a = game.graphics.layers.sea,
        r = a.children[1],
        i = game.graphics.layers.map,
        o = i.children[0],
        n = i.children[1],
        l = i.children[3],
        p = i.children[6];
      if (t && t.map) {
        function e() {
          p = i.children[6], t.map.polygons ? (p.visible = !0, i.mask = p) : (i.mask = null, p.visible = !1)
        }
        if (r.visible = t.map.sea, o.visible = t.map.forest, a.visible = !t.map.forest || t.map.polygons, n.visible = t.map.sand, l.visible = t.map.rock, p) e();
        else {
          let s = setInterval(function () {
            game.graphics.layers.map.children[6] && (clearInterval(s), e())
          }, 200)
        }
      }
      t && t.layers && (game.graphics.layers.shadows.visible = t.layers.shadows, game.graphics.layers.smoke.visible = t.layers.smoke, Particles.missileSmoke = t.layers.smoke && Particles._missileSmoke ? Particles._missileSmoke : function () { }), forEachPlayer(s => {
        e.tintPlayer(s)
      })
    });
    s.root = "", s.title = "Mod Settings";
    let t = s.addSection("Background");
    t.addBoolean("map.sea", "Sea depth"), t.addBoolean("map.forest", "Forest"), t.addBoolean("map.sand", "Sand"), t.addBoolean("map.rock", "Rocks"), t.addBoolean("map.polygons", "Continents"), t.addBoolean("layers.shadows", "Shadows"), t.addBoolean("layers.smoke", "Missile's Smoke"), t.addBoolean("layers.useSnow", "Use Snow " + "(changes will require a reload to take effect).".fontcolor("#AA2222")), t = s.addSection("Gameplay"), t.addBoolean("gameplay.colorMissiles", "Use team colors for missiles."), t.addBoolean("gameplay.colorPlayers", "Use team colors for players."), this.settingsProvider = s
  }
  start() {
    config.overdraw = 256, config.overdrawOptimize = !0, Particles._missileSmoke = Particles.missileSmoke;
    var s = this;
    SWAM.on("playerAdded", function (t) {
      "function" == typeof window.Glow && Glow(t), s.tintPlayer(t);
      let a = t.setupGraphics;
      t.setupGraphics = function (r) {
        a.call(t, r), "function" == typeof window.Glow && Glow(t), s.tintPlayer(t)
      };
      let r = t.reteam;
      t.reteam = function (e) {
        r.call(t, e), s.tintPlayer(t)
      }
    }), SWAM.on("mobAdded", this.tintMob.bind(this)), SWAM.on("mobsRepeled", (e, s) => {
      if (this.settings.gameplay.colorMissiles && game.gameType == SWAM.GAME_TYPE.CTF)
        for (let t of s) {
          let s = e.team;
          t.sprites.sprite.tint = t.sprites.thruster.tint = this.teamColors[s].mob
        }
    }), SWAM.Theme.settingsProvider.apply(SWAM.Settings)
  }
  tintPlayer(e) {
    e.sprites.sprite.tint = this.settings && this.settings.gameplay.colorPlayers ? game.gameType == SWAM.GAME_TYPE.CTF ? this.teamColors[e.team].player : this.teamColors[0].player : this.teamColors[0].player
  }
  tintMob(e, s, t) {
    if (!this.settings.gameplay.colorMissiles) return;
    let a = Mobs.get(e.id),
      r = [1, 2, 3, 5, 6, 7].includes(a.type);
    if (r) {
      if (game.gameType == SWAM.GAME_TYPE.CTF) {
        let e = 0;
        e = t ? Players.get(t).team : 1 == Players.getMe().team ? 2 : 1, a.sprites.sprite.tint = a.sprites.thruster.tint = this.teamColors[e].mob
      } else a.sprites.sprite.tint = this.teamColors[0].mob;
      this.setMobScale(a)
    }
  }
  setMobScale(e) {
    e.sprites.smokeGlow.alpha = 0, 2 == e.type ? e.sprites.sprite.scale.set(.3, .4) : 3 == e.type ? e.sprites.sprite.scale.set(.56, .4) : e.sprites.sprite.scale.set(.3, .3)
  }
  injectTextures() { }
  injectSounds() { }
  loadGameModules() {
    loadGraphics_Default(), loadSounds_Default()
  }
}
VanillaTheme.themeName = "Vanilla Theme";
VanillaTheme.author = "Bombita";
VanillaTheme.version = SWAM_version;

class StPatricksDay2018 extends VanillaTheme {
  constructor() {
    super(), $("#logon").css("backgroundColor", "rgba(6, 51, 16, 0.75)")
  }
  injectTextures(e) {
    const s = ["map_forest.jpg", "map_rock.jpg", "map_sand.jpg", "map_sea.jpg", "aircraft.png"];
    for (let t in e) {
      let a = getFileName(e[t]);
      s.includes(a) && (e[t] = getFilePath("themes/StPatricksDay2018/" + a))
    }
  }
}
StPatricksDay2018.themeName = "St. Patrick's Day 2018 Theme";
StPatricksDay2018.description = "A lucky theme for AirMash!!";
StPatricksDay2018.author = "Bombita";

class PixelArt_8Bits extends VanillaTheme {
  constructor() {
    function e(e) {
      let s = Math.round(30 * e / 2500) + "px";
      let t = Math.round(25 * e / 2500) + "px";
      config.playerNameSize = s;
      config.playerLevelSize = t;
      game.state != Network.STATE.PLAYING || forEachPlayer(e => {
        e.sprites.name.style.fontSize = s, e.sprites.level && (e.sprites.level.style.fontSize = t)
      })
    }
    super();
    for (let e = 0; e < config.walls.length; e++)
      config.doodads[e][4] = 0;

    $("body").append(`<style>
        @font-face {
            font-family: ModernDOS8x14;
            src: url("${getFilePath("themes/PixelArt_8bits/ModernDOS8x14.ttf")}");
        }
        #logon #playername
        {
            font-family: ModernDOS8x14;
        }
        body {
            font-smooth: never;
            -webkit-font-smoothing : none;
            background: black url("https://image.ibb.co/eFeUhd/Main_Screen.jpg") no-repeat fixed center;
            background-size: contain;
            font-family: ModernDOS8x14;
            font-size: 14px;
            position: fixed;
            width: 100%;
            height: 100%;
            margin: 0px;
        }
        #scoreboard, #chatbox {
            font-size: 14px;
            font-weight: normal;
        }
        #scoreboard .line .nick,
        #scoredetailed .item div,
        #logon div
        {
            font-weight: normal !important;
        }
        #logon .logo {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjAAAABmAgMAAACo10M/AAAADFBMVEUAAADfJVnCsADb29tHegPaAAAAAXRSTlMAQObYZgAAA7tJREFUaN7tmk1u4zAMhTkDeOONr6ZFdT9tutHpfAON+B+FSYtZzCBM/WDLFCWHH/qsyC0Kly5duvR/1R+oAewarHOwt9WpAsBx6IDKky5KYfDx8jD7ExgJArDXfAZT7liywsx6ERBhKFCYZfpWsAj3KwAlvAMrTF3RLPfyMFQuJjXfFcZpFKY8gfHyPPRjYPYmBajZrF34TL8qZIXp8CXMHmd1KVoDjF7eG6Zr9BRms8YptOcwJTdMFzXdHgLMQnrjTV2e3LeD2cMG2aD5uM9qBqNrO6xpvTqM75UJYdqyQVIUYeyNonltidS3ZzBqXzoY6N/CcGbn2YrwDGa7gak0kBFmb9w4jDP4UJdghSm+mI3Buw4DNSWM+hRh9h5gdoUh1RVG6zoMx26jvbJngIEuZqww5Ak7E2xyGA0cZqNCBuOIK2MKGPHJYSSIMDq3GUM1GG0qtxB8Sggj1doDGIr7uh34RklFAwxQCMGnjDC8ZrvB+PapF3/RAIVZtRlBCWWVNCGM+vQ1jKsvn2wdoZBL9CkjjPnkMEzGI49hatVSHwsMxwWiTwlh1CeGcWv0Gn/xd5gZE4yWVLAAA1VGUCULDPv0DYyTM8xsAgxBBBjdJv0VomaBWTZDq+1f/7cwXWHsb2YKQ70ptiv6xDCUyAOztwBjX/8Ow0lwGAoFRrq1ajp+7WWB+d1FbofVbaCKMFOfhVdqgHGVO5/eBGZebtXxUBmMrmGFCcZUlVqXBmat+D1MD9XQDoHBIw6vqbQwvrR7oMSxvtxQGcFhYNH2o2B6gOFP1ciFmfeB2R2mUZflMG3xqdJZVpjKgsd4aWGawMi2KaKYYSauiypWhynUZ2Fc3wZmVlphFNFhoLd7GFCY29fwLcDw3DQwfZU9teIQsLqlmj3Un7r3cTNVln/J4LiuKuyiTUgD02CFabcwTTL3MGAwUo/FnXuWNDCXLl36hxpwABwntufsDTglMWBqxhhwOMbM4hBOFekkyuEE0TmPec7ZiWFAah8HEUUY//wvYcZ5et4m5YMZAw8mGLNlmBPcJp0yuMoxg3nOCcc48TxweFAEQwpzfsi9B6bTwcAx75T2RA4M6TOIEXXiMWFoHBB4TkHNlu/GC8jtU4gGfsyhjDADa9j9UxiCPcAofaRxnOkdZqAJzDQM5qS7HeYYGWHkB803swOzcRgINkkFPri4VHWYxaZ5ZoQZY4HherYdUM6XNpwIQ8FhS1tt8qU9KKn3ntPIjDB/p5PPA15BrwQz7BXiBfRSMJd+ov4AV20RpyAHVjkAAAAASUVORK5CYII=');
        }
        #logosmall {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANAAAAAqCAMAAAD1cyU5AAACZ1BMVEUAAADCsADfJVnfJFnfJVnfJVnCsADfJVnCsADCsADCsADfJVnCsADCsADfJVnfJVnCsADCsADCsADfJVnfJVnfJVnfJVnfJVnJO0b////fJVnCsAD////fJVnfJVnCsADCsAD////fJVnfJVnfJVnfJVnCsAD////fJVn////fJVn////////CsADCsAA8CxUjBwz///8EAgLlM0/CsADCsADCsADCsADCsADfJVnfJVnCsADfJVnCsAD///84CRTfJVkoCA7fJVn8NFXfJVnfJVnfJVnfJVnCsADCsADfJVn///9BQ0fCsADfJVnfJVkVAwfCsAARDQ/fJVkPBwnCsAADAwPyMFPBtADgIVve3+Lm5+f////CxMnfJVnHI0a2Iz62ucTCKELfJVnfJVnKM0iho6ulHznfJVmmpqZXER/CsABACxY1BxA5Oj8vMTU1CxHCsADfJVkgDA7CsAAHAQLfJVnCsAD29/vCsADmJlDgKU7BxtXgIlvjME/TI0rd4uzn6OjeM069H0LV2OLhKk/CsADR0tXfJVnRMkzCsACsIDzGx8/fJVmXm6uZGjXCsAC2sbTfJVm+v7+XHjS3LD7CsADfJVmvKjqdJDaalJeoKzyanqiKHTCUlZaaGjZnEyTfJVmNjY11FimCgoaLITBqESZ6e4BrbnTfJVlkGCE5CxRfX148PUBaFh4xCBFJERlMTU/CsADfJVlLS0vCsADCsADfJVkXDhHfJVnCsADfJVkAAADRZy8FBgbCsAD////fJVn/M1v/K1v/O1n8L1ffJE3n6/jj6O7/QmT/LWL/H1L2JUiMbQi6AAAAv3RSTlMA8O/7UPA/8lP0/EGc9tX2hPoUlwj47ckCu5yaIv317fjdiVoVEPLMjWYcEZmQi2lBMwvy3865sqemoJWDgXdjPxkM/uC/sq6soJCIbE9NSDUtLCQkDwX++fj17+7s5OLh39za19XU08++jYduaGRcVFRMTEo/MCH+/v38+vr69vX18O/t7ezn5+Tk4d/f3dvY19HQz8vHxcXFwr69vLu6ubixp6CfnpuZlYB4d3d2cGxnZ19RSTk4MiEgGxYTE3iuilAAAAYRSURBVGje7ZgHUxNBFID3Ts8zgZgQSYiYxIhJRJAIESmh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');
        }
        </style>`), SWAM.on("playerAdded", function (e) {
      e.sprites.name.style.fontFamily = "ModernDOS8x14", e._nameplateTextStyle = e.nameplateTextStyle, e.nameplateTextStyle = function () {
        let e = this._nameplateTextStyle();
        return e.fontFamily = "ModernDOS8x14", e
      }
    }), SWAM.on("gameRunning", function () {
      $("canvas").hide(), Graphics.ticker && Graphics.ticker.stop(), SWAM.resizeMap = function (s) {
        config.scalingFactor = s, Graphics.resizeRenderer(window.innerWidth, window.innerHeight), e(s)
      }
    }), SWAM.on("gamePrep", function () {
      $("body").css({
        background: "black url(\"https://image.ibb.co/gK5Gsd/world_background2.jpg\") no-repeat fixed center",
        "background-size": "auto"
      }), $("canvas").show(), Graphics.ticker && Graphics.ticker.start()
    })
  }
  injectTextures(e) {
    const s = ["map_forest.jpg", "map_rock.jpg", "map_sand.jpg", "map_sea.jpg", "aircraft.png", "items.png", "gui.png", "particles.png", "mountains.png", "flagsbig.png"];
    for (let t in e) {
      let a = getFileName(e[t]);
      s.includes(a) && (e[t] = getFilePath("themes/PixelArt_8bits/" + a))
    }
  }
}
PixelArt_8Bits.themeName = "PixelArt 8-Bits";
PixelArt_8Bits.description = "With love from the 80's, celebrating 6 months of Airmash!";
PixelArt_8Bits.author = "Bombita";

class Russia2018WC extends VanillaTheme {
  constructor() {
    super();
    let e = $.getJSON;
    $.getJSON = function (s) {
      return "assets/map.json" === s ? void ($.getJSON = e) : e.apply(null, arguments)
    };
    const s = ["https://image.ibb.co/dzvO0J/2018_FIFA_World_Cup_Background_Wallpapers_33995.jpg", "https://image.ibb.co/mkui0J/2018_FIFA_World_Cup_HQ_Background_Wallpaper_34006.jpg", "https://image.ibb.co/cKQLVJ/2018_FIFA_World_Cup_Best_HD_Wallpaper_33996.jpg", "https://image.ibb.co/etF6LJ/shutterstock_466076552_1.jpg", "https://image.ibb.co/kUit0J/FIFA_World_Cup_2018_Players_Wallpaper1.jpg"];
    let t = Math.floor(Math.random() * s.length),
      a = s[t];
    $("body").css({
      background: `black url("${a}") no-repeat fixed center`
    }), $("body").append(`<style>
        #logon .logo { background-image: url('https://image.ibb.co/etyFVJ/logo.png'); }
        #logon { background: url('https://image.ibb.co/kCrU9d/logon2.jpg') no-repeat center;/* opacity: 0.9;*/}

        </style>`)
  }
  injectTextures(e) {
    changeTextureFiles(e, {
      "map_forest.jpg": "https://image.ibb.co/chTbpd/map_forest.jpg",
      "map_rock.jpg": "https://image.ibb.co/jyJ47y/map_rock.jpg",
      "map_sand.jpg": "https://image.ibb.co/endbBd/map_sand.jpg",
      "map_rock_mask.jpg": "https://image.ibb.co/g7DnHJ/map_rock_mask.jpg",
      "map_sand_mask.jpg": "https://image.ibb.co/cDCWny/map_sand_mask.jpg",
      "items.png": "https://image.ibb.co/hOmeWd/items.png",
      "mountains.png": "https://image.ibb.co/mpL6LJ/mountains.png"
    }, "themes/Russia2018WC/")
  }
  setMobScale(e) {
    super.setMobScale(e), e.sprites.thruster.alpha = 0
  }
}
Russia2018WC.themeName = "World Cup Russia 2018", Russia2018WC.description = "Vamos Argentina!", Russia2018WC.author = "Bombita";
class RealisticSprites extends VanillaTheme {
  constructor() {
    super()
  }
  injectTextures(e) {
    changeTextureFiles(e, {
      "map_sea.jpg": "https://image.ibb.co/c5MWKd/map_sea.jpg",
      "map_forest.jpg": "https://image.ibb.co/db9ked/map_forest.jpg",
      "map_rock.jpg": "https://image.ibb.co/bXBnsy/map_rock.jpg",
      "map_sand.jpg": "https://image.ibb.co/nADBKd/map_sand.jpg",
      "aircraft.png": "https://image.ibb.co/k3uJzd/aircraft.png",
      "shadows.png": "https://image.ibb.co/nc75ed/shadows.png",
      "items.png": "https://image.ibb.co/k8JNQJ/items.png",
      "mountains.png": "https://image.ibb.co/neRyzd/mountains.png"
    }, "themes/RealisticSprites/")
  }
}
RealisticSprites.themeName = "Realistic Sprites", RealisticSprites.description = "More detailed/realistic graphics!", RealisticSprites.author = "Bombita";
class HellMash extends VanillaTheme {
  constructor() {
    function e() {
      this.audio.happyHalloween();
      let e = $("<div id='hellmashPrankMessage' class='modalDialog' style='display: none; font-size: 20px; padding: 20px; text-align: center;'>\uD83D\uDE08 Congratulations!<br><br> You are now free to go... or stay here if you dare!<br><br>\uD83D\uDD25MUAHAHAHAHA!\uD83D\uDD25<br><br>This 'surprise' can be reactivated in the Settings Window.<br><br>Please, DO NOT warn the other players. <br><br><div style='font-size: 30px; color: #FF6600'> \uD83C\uDF83 Happy Halloween!</div></div>");
      $("body").append(e), e.fadeIn(500), setTimeout(() => {
        e.remove()
      }, 15e3)
    }
    super(), this.teamColors = {
      0: {
        player: 16777215,
        mob: 16724736
      },
      1: {
        player: 52479,
        mob: 5592575
      },
      2: {
        player: 16768256,
        mob: 16733525
      }
    }, this.changeBackgrounds(), $.extend(this.settingsProvider.getDefault(), {
      other: {
        bgAnimation: !0,
        ambientSound: !0,
        repeatPrank: !1
      }
    });
    let s = this.settingsProvider.addSection("Ambient");
    s.addBoolean("other.bgAnimation", "Use animated background."), s.addBoolean("other.ambientSound", "Play background sound."), s.addBoolean("other.repeatPrank", "Repeat the little surprise \uD83D\uDC7B."), SWAM.on("settingsApplied", () => {
      let e = SWAM.getThemeSettings();
      e.other.bgAnimation ? this.startBackgroundAnimation() : this.stopBackgroundAnimation(), (e.other.repeatPrank || !e.other.pranked) && (SWAM.off("playerKilled", r), SWAM.on("playerKilled", r)), this.audio.ambient(e.other.ambientSound)
    }), this.audio = new function () {
      let e = null;
      var s = new Howl({
        src: [getFilePath("themes/HellMash/themesounds.mp3")],
        volume: 0,
        sprite: {
          onescream: [0, 1320],
          scream: [0, 2640],
          mourn1: [2700, 1620],
          mourn2: [4400, 1510],
          mourn3: [6e3, 1665],
          mourn4: [7700, 1532],
          ambient: [9500, 22371, !0],
          happyHalloween: [32500, 7533]
        }
      });
      this.ambient = function (t) {
        if (!t) e && s.stop(e), e = null;
        else if (!e) {
          s.volume();
          e = this.play("ambient", 0), s.fade(0, .1, 1e3, e)
        }
      }, this.happyHalloween = function () {
        this.play("happyHalloween", .5)
      }, this.mourn = function () {
        let e = "mourn" + Tools.randInt(1, 4);
        console.log(e), this.play(e, .012)
      }, this.play = function (e, t, a) {
        if (config.settings.sound) {
          let r = s.play(e);
          return t && s.volume(t, r), a && s.loop(a, r), r
        }
      }
    };
    let t = $(`<div style="
        background: black url(${getFilePath("themes/HellMash/prank.jpg")});
        width: 100%; height: 100%; position: absolute; top: 0; background-position: center; background-size: cover; display: none;"></div>`);
    $("body").append(t);
    let a = this,
      r = function (s) {
        if (s.id == game.myID) {
          $("body").append(t), t.fadeIn(200), a.audio.play("scream", 1), setTimeout(() => t.remove(), 3e3);
          let s = SWAM.getThemeSettings();
          s.other.repeatPrank || SWAM.off("playerKilled", r), s.other.pranked || setTimeout(e.bind(a), 3e3), s.other.pranked = !0, SWAM.saveSettings()
        }
      };
    SWAM.on("playerImpacted", this.audio.mourn.bind(this.audio))
  }
  changeBackgrounds(e, s) {
    this.backgrounds = this.backgrounds || [getFilePath("themes/HellMash/bg1.jpg")];
    let t = Math.floor(Math.random() * this.backgrounds.length),
      a = this.backgrounds[t] || getFilePath("themes/HellMash/bg1.jpg");
    $("body").append(`<style type="text/css">
        body { background: black url('${a}') no-repeat fixed center }` + (s ? `#logon { background: url('${s}') no-repeat center;}` : "") + "</style>")
  }
  injectTextures(e) {
    changeTextureFiles(e, {
      "map_sea.jpg": null,
      "map_forest.jpg": null,
      "map_rock.jpg": null,
      "map_sand.jpg": null,
      "aircraft.png": null,
      "shadows.png": null,
      "items.png": null,
      "mountains.png": null
    }, "themes/HellMash/")
  }
  start() {
    super.start()
  }
  startBackgroundAnimation() {
    let e = new PIXI.filters.AdjustmentFilter;
    game.graphics.layers.game.children[0].filters = [e];
    const s = 2 * Math.PI / 5000;
    let t = () => {
      let t = .1 * Math.sin(game.time * s);
      e.gamma = t + 1, e.brightness = t + 1.05
    };
    this.stopBackgroundAnimation = function () {
      Graphics.ticker.remove(t), game.graphics.layers.game.children[0].filters = null
    }, Graphics.ticker.add(t)
  }
  stopBackgroundAnimation() { }
}
HellMash.themeName = "Halloween 2018 \uD83D\uDD25 HellMash", HellMash.description = "Happy Halloween!", HellMash.author = "Bombita";
class Halloween2018 extends HellMash {
  injectTextures(e, s, t, a, r) {
    super.injectTextures(e, s, t, a, r);
    changeTextureFiles(e, {
      "map_sea.jpg": null,
      "map_forest.jpg": null,
      "items.png": null
    }, "themes/Halloween2018/")
  }
}
Halloween2018.themeName = "Halloween 2018 \uD83C\uDF83 Limbo", Halloween2018.description = "Happy Halloween!", Halloween2018.author = "Bombita";
class Christmas2017Theme extends VanillaTheme {
  constructor() {
    super(), Christmas2017Theme.setImages()
  }
  injectTextures(e) {
    changeTextureFiles(e, {
      "map_sea.jpg": null,
      "map_forest.jpg": null,
      "map_rock.jpg": null,
      "map_sand.jpg": null,
      "aircraft.png": null,
      "shadows.png": null,
      "items.png": null,
      "mountains.png": null,
      "particles.png": null
    }, "https://raw.githubusercontent.com/Molesmalo/AirMashChristmasMod/master/assets/")
  }
  static setImages() {
    $("body").append(`<style>
        #logon .logo {
            background-image: url('data:image/png;base64,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');
        }
        #logon { background: url('${getFilePath("themes/Christmas2018/logon.png")}') no-repeat center;}
        </style>`)
  }
  static addSnow(e) {
    if ([VanillaTheme, RealisticSprites, StPatricksDay2018, PixelArt_8Bits, Russia2018WC, Halloween2018].includes(SWAM.getThemeFunction())) {
      changeTextureFiles(e, {
        "map_rock.jpg": null,
        "map_rock_mask.jpg": null
      }, "themes/Christmas2018/"), SWAM.one("gameRunning", () => {
        game.graphics.layers.doodads.children.forEach(e => {
          e.filters = -2e3 > e.position.y ? [new PIXI.filters.AdjustmentFilter({
            gamma: 1.7,
            saturation: .3,
            contrast: 1.6,
            brightness: 1.4,
            red: 1,
            green: 1,
            blue: 1,
            alpha: 1
          })] : null
        })
      }), SWAM.getThemeFunction() == Christmas2017Theme && Christmas2017Theme.setImages(), Christmas2017Theme.SnowWeather()
    }
  }
  static loadSnow(e) {
    let s = null;
    try {
      s = SWAM.getThemeSettings()
    } catch (s) { }
    s && s.layers && s.layers.useSnow && (console.log("Let it snow!"), Christmas2017Theme.addSnow(e))
  }
}
Christmas2017Theme.SnowWeather = function () {
  function e() {
    var e = [];
    a += .002, 1e6 < a && (a = 0), t.x = Math.cos(a) * 1, t.y = Math.sin(a) * 1;
    for (var s = 0; s < r.length; s++) r[s].update(), r[s].exists() ? e.push(r[s]) : r[s].destroy();
    r = e
  }

  function s() {
    let e = new Date,
      s = 60 * (new Date().getMinutes() % 2) + new Date().getSeconds(),
      a = Math.sin((Math.PI + 1) / 120 * s),
      i = Graphics.getCamera(),
      n = parseInt(Math.abs(i.y / -1e3)) * a;
    for (let e = 0; e < n; e++) {
      var l = new Vector(Tools.rand(i.x - game.halfScreenX / game.scale, i.x + game.halfScreenX / game.scale), Tools.rand(i.y - game.halfScreenY / game.scale, i.y + game.halfScreenY / game.scale));
      if (-2e3 < l.y) continue;
      let e = new o(l);
      e.vel = t, e.size = Tools.randInt(4, 8), e.shrink = .05 * Math.random() + .93, e.flick = !0, r.push(e)
    }
  }
  let t = {
    x: 0,
    y: 0
  },
    a = 0,
    r = [],
    i = null;
  class o {
    constructor(e) {
      this.pos = {
        x: e ? e.x : 0,
        y: e ? e.y : 0
      }, this.vel = t, this.shrink = .97, this.size = 1, this.createSprite(), this.birth = Date.now()
    }
    createSprite() {
      this.sprite = new PIXI.Sprite(o.texture), this.sprite.anchor.set(.5, .5), this.sprite.rotation = Tools.rand(0, 2 * Math.PI), i.addChild(this.sprite)
    }
    destroy() {
      i.removeChild(this.sprite), this.sprite.destroy()
    }
    update() {
      this.pos.x += this.vel.x / game.scale, this.pos.y += this.vel.y / game.scale, this.size *= this.shrink, this.sprite.position.set(this.pos.x, this.pos.y);
      this.flick ? Math.random() * this.size : this.size;
      this.sprite.scale.set(this.size / 10 / game.scale), this.sprite.visible = Graphics.inScreen(this.pos, 128), this.sprite.rotation += .01
    }
    exists() {
      let e = 5e3 < Date.now() - this.birth;
      return e || .2 <= this.size
    }
  }
  o.texture = PIXI.Texture.fromImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAMAAAC7m5rvAAAAsVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+3mHKcAAAAO3RSTlMAewVhDLCV2vbXyNM7N+oScf5ACSQXp4N4dWdKzMR+T0fQwG1Z37urjF4x8OS0Uywbt6CRIESvmqSHKbnwhZIAAAPwSURBVEjHtZbZ0qIwEIUDKISwKyKryioqCCKu7/9gk8iwOM6v5VTNubAIh49OJ91B8KOmGwr8g0YU+y0yOZQNtjXEL7DaSB8YvUjob8It/WKKMRE54LOmo/ZKYaspdRyxxqv3qjDvs/MiK3X8bTuepeZf160kU0NlO6YppOZV2vnbg4Mjln9mKrkm9tZRd6M45Bma9ckKI0Crgv6yCJwFlPTY39hocthnRhmYildDoudsbxBfc/tgdWWDlnrhbDGRuuFJi/vVF71tyL1QtbpXyGZdWLWvrSxm+xkjlTvhfYlUZYAplgARVSwF4dotydiIkdL6c453thSCgjl9DjiLDDlDGt/Ocs+bgbFp57jbebJ8jWbgL6KLhaDBy/3x/lsVVlRTJHoFtdjcgp9VIJmTDfyElEfW7eTWZDNlX3MV8FY2dI9HOZcYTzHT+hpKBzmdy4H5FiLvrgRLuck7iqaOINRks1QF1q3F931HmweHo8BsWZJ+q6MRbQlMZRaaP33LScnyhLn2UKAtTlz6pWLZf9b+/WlZp/MckHgEa6jZJX0CFOmxYVXGDPtBDBzCNYeCyU2A49+HWdjZurnY835fbuWC1NSKs3B3A0zh8HJYdvbK55fdPNUsLx7xmWB3iEbEFm7qRcUUdqNkFzBK04RZOFyaGSsf9eV4h+wmUcIFGT9p7RDBtaNf5LS11XxMdA5kDfLJedzqjDTo9cNxwkFt99vPVSAxRBvb2EGYGeqGabRhDA2eu9FGNWIId1e7uSOBdlXcVZdEs+0x6wqLxsYpQ5LyyuX3wy328B70SYiYogTHSic84aS8S5m246DtLN2QFwoY9P8NU5xITuUT5ugFPzivcLlW9YM6X+unI8W9Y2rSVMkKc5LnDP167YFXzVgWEKrBcDxqOj+Dj3I80SRUgxHOEtHkE6WkBq5esK8euUnnJTgJx/T6CZt4a2EV+RlicZtOFxzn71coQNJ7arSAwpHnNmCPdDO950ua4YULz1/eYycIZXeP97AwQivduyNSCgjC+OfsaHHua5qw+v2tSML17dgYjqdBdy7Sr0xt57v4YmgB3XXA3D2c2opA8vmS7ca2/gTpAUxUnabiNdvdqg5Z0DekgOvzriYwmA1XQidJzF37uhmcmPGiG+yRw8/Jg8XzTAnFFytPH3zfuG1/fCbi5MGBV0oC1gEMsMEnt2QXoOFeKPFh9t83KLO9HSbgb5x0FQEQ81NfLv5FQOJgWOOfNY7/qgiN+kZYh9fbuLPu6w34Sfv54A2Sedt6UTdnhgGfpa8XNDlevSn4RqE7Iv12P6jfUNvEbtqU8csvsMKiG6y07///Ty8RLTk/m78APIdgUO0YRyAAAAAASUVORK5CYII="), SWAM.one("gameRunning", () => {
    i = new PIXI.Container, console.log("objects len: ", game.graphics.layers.objects.children.length), game.graphics.layers.objects.addChild(i), PIXI.ticker.shared.add(e), setInterval(s, 100)
  })
}, $.extend(Christmas2017Theme, {
  themeName: "Christmas 2017 Theme",
  description: "A christmassy theme for StarMash!!",
  author: "Bombita"
});

function getFileName(e) {
  return e = e.substring(e.lastIndexOf("/") + 1), -1 < e.indexOf("?") && (e = e.substr(0, e.indexOf("?"))), e
}

function changeTextureFiles(e, s, t) {
  for (let a in t = t || "", e) {
    let r = getFileName(e[a]);
    "undefined" != typeof s[r] && (!SWAM.debug && s[r] ? e[a] = s[r] : e[a] = t.startsWith("http") ? t + r : getFilePath(t + r))
  }
}
window.BaseTheme = BaseTheme;
window.VanillaTheme = VanillaTheme;

SWAM.registerExtension({
  name: "StarMash Themes",
  id: "StarMashThemes",
  author: "Bombita",
  version: SWAM_version,
  themes: [VanillaTheme, RealisticSprites, StarMash_1, StarMash_2, StPatricksDay2018, PixelArt_8Bits, Russia2018WC, HellMash, Halloween2018, Christmas2017Theme],
  dependencies: []
});

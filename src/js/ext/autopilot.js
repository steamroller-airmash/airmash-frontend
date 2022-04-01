// SWAM autopilot code, copied from minimized starmash js.

function getFilePath(e) {
  return 'https://molesmalo.github.io/StarWarsMod4AirMash/assets/' + e + '?' + SWAM_version
}

window.AutoPilot = {
  Matrix: [
    []
  ],
  WALKABLE: 0,
  BLOCKED: 1,
  keystate: {
    UP: !1,
    DOWN: !1,
    LEFT: !1,
    RIGHT: !1,
    SPECIAL: !1
  },
  zero: {
    x: 0,
    y: 0
  },
  topLeft: {
    x: - 16352,
    y: - 8160
  },
  greenland: {
    x: - 5284,
    y: - 7092
  },
  Load: function () {
    $.getScript(getFilePath('pathfinding-browser.min.js'), function (e, t, n) {
      for (var r = window.config.walls, i = new Array(164), o = 0; o < 164; o++) {
        i[o] = new Array(328);
        for (var s = 0; s < 328; s++) i[o][s] = AutoPilot.WALKABLE
      }
      for (var a of r) for (var l = AutoPilot.getGraphBoundingBox(a[0], a[1], a[2]), o = l.p1.y; o <= l.p2.y; o++) for (var s = l.p1.x; s <= l.p2.x; s++) try {
        i[o][s] = AutoPilot.BLOCKED
      } catch (e) {
      }
      AutoPilot.Matrix = i
    })
  },
  angleTo: function (e, t) {
    var n = Math.atan2(- e.x + t.x, e.y - t.y);
    return n < 0 && (n += 2 * Math.PI),
      n
  },
  angleToNeg: function (e, t) {
    return Math.atan2(- e.x + t.x, e.y - t.y)
  },
  mapCoordX: function (e, t) {
    return t |= 0,
      Math.floor((e + 16384 + t) / 100)
  },
  mapCoordY: function (e, t) {
    return t |= 0,
      Math.floor((e + 8192 + t) / 100)
  },
  getGraphBoundingBox: function (e, t, n) {
    return {
      p1: {
        x: this.mapCoordX(e, - n),
        y: this.mapCoordY(t, - n)
      },
      p2: {
        x: this.mapCoordX(e, n),
        y: this.mapCoordY(t, n)
      }
    }
  },
  log: function (e) {
    AutoPilot.logMoves && console.log(e)
  },
  right: function () {
    1 != this.keystate.RIGHT && (this.log('right'), Network.sendKey('RIGHT', !0), this.keystate.RIGHT = !0)
  },
  left: function () {
    1 != this.keystate.LEFT && (this.log('left'), Network.sendKey('LEFT', !0), this.keystate.LEFT = !0)
  },
  noSteer: function () {
    0 == this.keystate.RIGHT && 0 == this.keystate.LEFT || (this.log('nosteer'), this.keystate.RIGHT && (Network.sendKey('RIGHT', !1), this.keystate.RIGHT = !1), this.keystate.LEFT && (Network.sendKey('LEFT', !1), this.keystate.LEFT = !1))
  },
  forward: function () {
    1 != this.keystate.UP && (this.log('up'), Network.sendKey('UP', !0), this.keystate.UP = !0)
  },
  backwards: function () {
    1 != this.keystate.DOWN && (this.log('down'), Network.sendKey('DOWN', !0), this.keystate.DOWN = !0)
  },
  boost: function (e) {
    this.keystate.SPECIAL != e && (this.log('special'), Network.sendKey('SPECIAL', e), this.keystate.SPECIAL = e)
  },
  stop: function () {
    0 == this.keystate.UP && 0 == this.keystate.DOWN || (this.log('stop'), this.keystate.DOWN && (Network.sendKey('DOWN', !1), this.keystate.DOWN = !1), this.keystate.UP && (Network.sendKey('UP', !1), this.keystate.UP = !1))
  },
  fullStop: function () {
    this.log('fullstop'),
      this.noSteer(),
      this.stop()
  },
  tg: function () {
    this.moveTo(this.greenland.x, this.greenland.y)
  },
  tgs: function () {
    this.NavigateTo(this.greenland.x, this.greenland.y)
  },
  NavigateTo: function (e, t) {
    var n = Players.getMe(),
      r = this.mapCoordX(n.pos.x),
      i = this.mapCoordY(n.pos.y),
      o = this.mapCoordX(e),
      s = this.mapCoordY(t);
    AutoPilot.path = this.SearchPath(r, i, o, s),
      AutoPilot.path ? (AutoPilot.debug && (AutoPilot.erasePath(), AutoPilot.drawPath()), AutoPilot.exit = !1, this.currentNode = 0, $('#AutoPilotAlert').show(), this.moveNext()) : UI.addChatMessage('Autopilot: Invalid destination.')
  },
  erasePath: function () {
    game.graphics.layers.objects.removeChild(this.drawnPath)
  },
  drawnPath: null,
  drawPath: function () {
    for (var e = AutoPilot.path, t = new PIXI.Graphics, n = 0; n < e.length; n++) {
      var r = e[n][0],
        i = e[n][1];
      t.beginFill(65280, 0.2),
        t.drawRect(100 * r - 16384, 100 * i - 8192, 100, 100),
        t.endFill()
    }
    this.drawnPath = t,
      game.graphics.layers.objects.addChild(t)
  },
  Test: function () {
    if (window.res = this.SearchPath(111, 11, 161, 46), !0 === AutoPilot.debug) {
      for (var e = new Array(100), t = 0; t < 100; t++) {
        e[t] = new Array(100);
        for (var n = 0; n < 100; n++) e[t][n] = apMatrix[t][n + 100]
      }
      window.matrixSample = e
    }
  },
  cancel: function () {
    AutoPilot.exit = !0,
      AutoPilot.fullStop(),
      $('#AutoPilotAlert').hide()
  },
  currentNode: 0,
  moveNext1: function () {
    var e = AutoPilot.path[this.currentNode].y,
      t = AutoPilot.path[this.currentNode].x;
    this.moveTo(100 * e - 16384 + 50, 100 * t - 8192 + 50, !0)
  },
  moveNext: function () {
    var e = AutoPilot.path[this.currentNode][0],
      t = AutoPilot.path[this.currentNode][1];
    this.moveTo(100 * e - 16384 + 50, 100 * t - 8192 + 50, !0)
  },
  prevX: 0,
  prevY: 0,
  rotating: !1,
  rotateTo: function (e, t, n = 250, r) {
    var i = e - t.rot;
    i > Math.PI && (i -= 2 * Math.PI),
      i < - Math.PI && (i += 2 * Math.PI);
    let o = Math.round(Math.abs(i) / (60 * config.ships[t.type].turnFactor) * 1000),
      s = i > 0 ? AutoPilot.right : AutoPilot.left;
    i <= 0 ? AutoPilot.right : AutoPilot.left;
    AutoPilot.rotating = !0,
      s.call(AutoPilot),
      setTimeout(function () {
        AutoPilot.noSteer(),
          setTimeout(() => {
            AutoPilot.rotating = !1,
              r && r()
          }, n)
      }, o)
  },
  moveTo: function (e, t, n) {
    AutoPilot.debug && console.log(this.currentNode),
      n |= !1,
      AutoPilot.exit = !1;
    var r = Players.getMe();
    this.prevX = r.pos.x,
      this.prevY = r.pos.y,
      function i() {
        if (!AutoPilot.exit) if (r = Players.getMe(), Math.abs(AutoPilot.prevX - r.pos.x) > 300 || Math.abs(AutoPilot.prevY - r.pos.y) > 300) AutoPilot.cancel();
        else if (AutoPilot.prevX = r.pos.x, AutoPilot.prevY = r.pos.y, 0 != r.pos.x && 0 != r.pos.y) {
          var o = AutoPilot.angleTo(r.pos, {
            x: e,
            y: t
          }),
            s = Tools.distance(r.pos.x, r.pos.y, e, t),
            a = !0,
            l = o - r.rot;
          if (Math.abs(l) > 0.3) Math.abs(l) > 0.75 && AutoPilot.fullStop(),
            AutoPilot.rotateTo(o, r);
          else {
            if (AutoPilot.noSteer(), AutoPilot.forward(), a = s < 200, AutoPilot.currentNode < AutoPilot.path.length - 1) {
              var u = 100 * AutoPilot.path[AutoPilot.currentNode + 1].y - 16384 + 50,
                c = 100 * AutoPilot.path[AutoPilot.currentNode + 1].x - 8192 + 50;
              o = AutoPilot.angleTo(r.pos, {
                x: e,
                y: t
              });
              var h = AutoPilot.angleTo({
                x: e,
                y: t
              }, {
                x: u,
                y: c
              });
              a = Math.abs(h - o) >= 0.3
            }
            a ? setTimeout(function () {
              AutoPilot.stop()
            }, 50) : 1 == r.type && r.energy > 0.8 && s > 500 && (AutoPilot.boost(!0), setTimeout(() => AutoPilot.boost(!1), 1500))
          }
          !AutoPilot.exit && s > 100 ? setTimeout(i, 100) : !AutoPilot.exit && n && AutoPilot.currentNode < AutoPilot.path.length - 1 ? (AutoPilot.currentNode++, AutoPilot.moveNext()) : AutoPilot.fullStop()
        } else AutoPilot.cancel()
      }()
  },
  SearchPath: function (e, t, n, r) {
    let i,
      o,
      s = new PF.Grid(AutoPilot.Matrix),
      a = new PF.AStarFinder({
        allowDiagonal: !0,
        dontCrossCorners: !0
      });
    try {
      i = a.findPath(e, t, n, r, s),
        o = PF.Util.smoothenPath(s, i)
    } catch (e) {
      console.log('error pf: ', i, o)
    }
    return o
  },
  mimicTarget: 0,
  checkMimic: function (e) {
    if (3 == e.which && e.altKey) {
      let t = SWAM.getClosestPlayer(e.offsetX, e.offsetY);
      if (t.id == game.myID) AutoPilot.mimicTarget = 0,
        Network.sendSay('Mimicking stopped'),
        Network.sendKey('UP', !1),
        Network.sendKey('DOWN', !1);
      else if (Network.sendSay('Mimicking ' + t.name + ' ...'), AutoPilot.mimicTarget = t.id, AutoPilot.aligned = !1, AutoPilot.mimicPaused = !0, !AutoPilot.aligned) return void AutoPilot.mimicRotation(!0)
    }
  },
  mimic_keydown_handler: function (e) {
    if (this.mimicTarget != game.myID) {
      if ('-' == e.key && (this.reverseMimic = !this.reverseMimic, this.reverseMimic ? Network.sendSay('reverse') : Network.sendSay('normal')), 45 != e.keyCode && 188 != e.keyCode || this.mimicRotation(!1), 36 == e.keyCode || 190 == e.keyCode) if (AutoPilot.mimicPaused = !AutoPilot.mimicPaused, AutoPilot.mimicPaused) {
        let e = Players.getMe();
        e.keystate.UP && Network.sendKey('UP', !1),
          e.keystate.DOWN && Network.sendKey('DOWN', !1),
          e.keystate.LEFT && Network.sendKey('LEFT', !1),
          e.keystate.RIGHT && Network.sendKey('RIGHT', !1),
          Network.sendSay('paused')
      } else Network.sendSay('resumed');
      e.stopImmediatePropagation(),
        e.preventDefault()
    }
  },
  lastState: {
    boost: !1,
    stealthed: !1,
    strafe: !1,
    flagspeed: !1,
    keystate: {
    }
  },
  aligned: !1,
  reverseMimic: !1,
  mimicRotation: function (e) {
    if (this.mimicTarget == game.myID) return;
    let t = Players.getMe(),
      n = Players.get(this.mimicTarget),
      r = t.rot - n.rot;
    if (!this.rotating && Math.abs(r) > 0.05) {
      console.log(`rotating... delta: ${r}   me.rot: ${t.rot}   player.rot: ${n.rot}`);
      let i = AutoPilot.reverseMimic ? Math.PI : 0;
      AutoPilot.rotateTo(n.rot + i, t, 250, function () {
        AutoPilot.aligned = !0,
          e && (AutoPilot.mimicPaused = !1)
      })
    }
  },
  mimicStealth: function (e) {
    e.id != game.myID && e.id == AutoPilot.mimicTarget && (AutoPilot.mimicPaused || (e.state != this.lastState.stealthed && (Network.sendKey('SPECIAL', !0), setTimeout(() => {
      Network.sendKey('SPECIAL', !1)
    }, 250)), this.lastState.stealthed = e.state))
  },
  mimicUpdate: function (e, t) {
    let n = {
      keystate: {
      }
    };
    if (t.id != game.myID && t.id == AutoPilot.mimicTarget && !AutoPilot.mimicPaused) {
      if (null == t.keystate) return e == Network.SERVERPACKET.PLAYER_FIRE ? (Network.sendKey('FIRE', !0), void setTimeout(function () {
        Network.sendKey('FIRE', !1)
      }, 100)) : void (e == Network.SERVERPACKET.EVENT_BOOST && AutoPilot.lastState.boost != t.boost && (Network.sendKey('SPECIAL', t.boost), AutoPilot.lastState.boost = t.boost));
      Tools.decodeKeystate(n, t.keystate);
      var r = {
      };
      r[Network.SERVERPACKET.PLAYER_UPDATE] = 'update',
        r[Network.SERVERPACKET.PLAYER_FIRE] = 'fire',
        r[Network.SERVERPACKET.EVENT_BOOST] = 'boost',
        r[Network.SERVERPACKET.EVENT_BOUNCE] = 'bounce',
        function () {
          3 != Players.getMe().type && (n.strafe = !1);
          let e = n.strafe;
          e != AutoPilot.lastState.strafe && Network.sendKey('SPECIAL', e)
        }(),
        null != t.keystate && (console.log('event: ' + e[e]), i('UP', n.keystate), i('DOWN', n.keystate), i('LEFT', n.keystate), i('RIGHT', n.keystate)),
        AutoPilot.lastkeys = $.extend(AutoPilot.lastState, n)
    }
    function i(e, t) {
      let n = e;
      AutoPilot.reverseMimic && ('UP' == e ? n = 'DOWN' : 'DOWN' == e && (n = 'UP')),
        AutoPilot.lastState.keystate[e] != t[e] && (console.log('sending key: ' + n + ' - ' + t[e]), Network.sendKey(n, t[e]))
    }
  },
  debug: !1,
  logMoves: !1
}

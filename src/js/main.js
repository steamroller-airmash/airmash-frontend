"use strict";

import './ext';

import './Constants';
import { game, config } from './Game'
import Games from './Games';
import Graphics from './Graphics';
import Input from './Input';
import Mobs from './Mobs';
import Network from './Network';
import Particles from './Particles';
import Players from './Players';
import Sound from './Sound';
import Textures from './Textures';
import Tools from './Tools';
import UI from './UI';

$.extend(window, {
  game,
  config,
  Games,
  Graphics,
  Input,
  Mobs,
  Network,
  Particles,
  Players,
  Sound,
  Textures,
  Tools,
  UI,
});

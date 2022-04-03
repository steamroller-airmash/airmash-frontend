"use strict";

import './Constants';
import { game, config } from './Game'
import Games from './Games';
import Graphics from './Graphics';
import Input from './Input';
import Mobs from './Mobs';
import Network from './Network';
import './Particles';
import './Players';
import './Sound';
import './Textures';
import './Tools';
import './UI';

$.extend(window, {
  game,
  config,
  Games,
  Graphics,
  Input,
  Mobs,
  Network,
});

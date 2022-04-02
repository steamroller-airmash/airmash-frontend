import SWAM from "./SWAM";

var enabled = false;

SWAM.on(SWAM.events.keydown, function (evt) {
  var bind = Input.getBind(evt.keyCode);

  console.log(evt.key, bind);

  if (bind == "UP" || bind == "DOWN") {
    enabled = false;
  } else if (evt.key == "5") {
    enabled = !enabled;
    if (enabled) {
      Network.sendKey("UP", true);
    } else {
      Network.sendKey("UP", false);
    }
  }
});

SWAM.on(SWAM.events.gameWipe, function () {
  enabled = false;
});

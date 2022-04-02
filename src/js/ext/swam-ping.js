
import SWAM from './SWAM'

SWAM.on(SWAM.events.chatLineAdded, (msg, text, type) => {
  if (text.toUpperCase() !== "-SWAM-PING")
    return;
  if (type !== 0)
    return;
  if (msg.id === Players.getMe().id)
    return;

  Network.sendWhisper(msg.id, `-SWAM-PONG SM-ng Vanilla Theme`);
});

SWAM.on(SWAM.events.gameLoaded, () => {
  const UI_addChatLine = UI.addChatLine;

  UI.addChatLine = function(msg, text, type) {
    // Filter out our own -SWAM-PONG responses
    if (type === 1 && text.startsWith("-SWAM-PONG"))
      return;

    return UI_addChatLine(msg, text, type);
  }
});

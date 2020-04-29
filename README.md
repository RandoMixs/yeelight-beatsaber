# BeatSync

Sync your Yeelight Lamps with Beat Saber using  Node.JS

## Installation

You can start the node like any other script
```node
node index.js
```

## Tips

If you don't want to put a name on your lamp just comment the if
```javascript
// if(light.name == "BeatLight") {
  i++;
  console.log('\x1b[33m', '[Yeelight]', '\x1b[37m', i + ' lampada encontrada (' + light.name + ')');    
  light.set_music(1, add, 8271)
// }    
```

## Requirements

* [Beat Saber HTTP Status (Mod)](https://github.com/opl-/beatsaber-http-status)
* [WS (npm)](https://www.npmjs.com/package/ws)
* [Telnet (npm)](https://www.npmjs.com/package/telnet)
* [Yeelight2 (npm)](https://www.npmjs.com/package/yeelight2)

* 2 Yeelight Lamps (u can change the code to work with one)

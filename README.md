# BeatSync

Sync your Yeelight Lamps with Beat Saber using  Node.JS

## Installation

First you need to install the libraries
```node
npm i
```

And now you can start the script like any other script on Node.JS
```node
node index.js
```

* I recommend changing the name of the lamps that will be used to "BeatLight" to not synchronize all the lamps in the house xD

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
* 2 Yeelight Lamps (u can change the code to work with one)

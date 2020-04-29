// Servidor (Responsavel por enviar os comandos para lampada no modo musica)
var telnet = require('telnet')

var sockets = [];

var t = 0;
console.log('\x1b[36m', '[TCP]', '\x1b[37m', 'Servidor criado');
telnet.createServer(function (client) {
    t++;
    console.log('\x1b[36m', '[TCP]', '\x1b[37m', t + ' lampada conectada ao servidor');
    sockets.push(client);
}).listen(8271)

// Recebe comandos do jogo
var WSCLIENT = require('ws-reconnect');

var ws = new WSCLIENT("localhost:6557/socket", {
    retryCount: 0, // Tenta a reconexão ∞ vezes
    reconnectInterval: 5 // Tenta reconectar a cada 5s
});

console.log('\x1b[31m', '[WebSocket]', '\x1b[37m', 'Tentando conexão com o Beat Saber...');
ws.start();

var a1, a2, b1, b2, playing = false;
ws.on("message",function(data){
    try {
        if(sockets.length == 0) return;

        var data = JSON.parse(data);
        if(data['event'] == "noteCut" && playing == true) {
            if(data['noteCut']['noteType'] == "NoteA") { // Vermelho
                if(a2 == true) return;
                sockets[0].write('{"id":1,"method":"start_cf","params":[2, 1, "150, 1, 16711680, 100, 50, 1, 16711680, 10"]}\r\n');
                a2 = true;
                clearTimeout(a2);
                a1 = setTimeout(function () {
                    a2 = false;
                }, 50);
            } else if(data['noteCut']['noteType'] == "NoteB") { // Azul
                if(b2 == true) return;
                sockets[1].write('{"id":1,"method":"start_cf","params":[2, 1, "150, 1, 255, 100, 50, 1, 255, 10"]}\r\n');
                b2 = true;
                clearTimeout(b2);
                b1 = setTimeout(function () {
                    b2 = false;
                }, 50);
            } else if(data['noteCut']['noteType'] == "Bomb") { // Bomba
                sockets[0].write('{"id":1,"method":"start_cf","params":[2, 1, "150, 1, 16711680, 100, 50, 1, 16711680, 10"]}\r\n');
                sockets[1].write('{"id":1,"method":"start_cf","params":[2, 1, "150, 1, 16711680, 100, 50, 1, 255, 10"]}\r\n');
            }
        }

        if(data['event'] == "songStart") {
            playing = true;
            sockets[0].write('{"id":1,"method":"start_cf","params":[2, 1, "500, 1, 16711680, 10"]}\r\n');
            sockets[1].write('{"id":1,"method":"start_cf","params":[2, 1, "500, 1, 255, 10"]}\r\n');
            return;
        }

        if(data['event'] == "finished") {
            playing = false;
            sockets.forEach(function each(client) {
                client.write('{"id":1,"method":"start_cf","params":[0, 1, "1000, 2, 7000, 50"]}\r\n');
            });
            return;
        }

        if(data['event'] == "pause") {
            playing = false;
            sockets.forEach(function each(client) {
                client.write('{"id":1,"method":"start_cf","params":[0, 1, "1000, 2, 7000, 50"]}\r\n');
            });
            return;
        }

        if(data['event'] == "resume") {
            playing = true;
            sockets[0].write('{"id":1,"method":"start_cf","params":[2, 1, "500, 1, 16711680, 10"]}\r\n');
            sockets[1].write('{"id":1,"method":"start_cf","params":[2, 1, "500, 1, 255, 10"]}\r\n');
            return;
        }

        if(data['event'] == "failed") {
            playing = false;
            sockets.forEach(function each(client) {
                client.write('{"id":1,"method":"start_cf","params":[2, 1, "500, 1, 16711680, 80"]}\r\n');
            });
            return;
        }

        if(data['event'] == "menu") {
            playing = false;
            sockets.forEach(function each(client) {
                client.write('{"id":1,"method":"start_cf","params":[0, 1, "1000, 2, 7000, 50"]}\r\n');
            });
            return;
        }
    } catch(e) {
        console.log(e);
    }
});

ws.on("reconnect",function(){
    console.log('\x1b[31m', '[WebSocket]', '\x1b[37m', 'Reconectando...'); // Caso a conexão caia ou ele não consiga conectar vai mostrar a mensagem de reconectando
});
ws.on("connect",function(){
    console.log('\x1b[31m', '[WebSocket]', '\x1b[37m', 'Conectado'); // Conectado
    setTimeout(function () {
        if(sockets.length == 0) return;
        sockets.forEach(function each(client) {
            client.write('{"id":1,"method":"start_cf","params":[0, 1, "1000, 2, 7000, 50"]}\r\n');
        });
    }, 500);
});
ws.on("destroyed",function(){
    console.log('\x1b[31m', '[WebSocket]', '\x1b[37m', 'Perda de conexão total'); // Caso ele não consiga reconectar e dessista de vez de tentar reconectar ele vai exibir isto.
});

// Yeelight
const Yeelight = require('yeelight2');

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	var i = 0;
	console.log('\x1b[33m', '[Yeelight]', '\x1b[37m', 'As lampadas irão se conectar ao seu computador atravês do IP ' + add);
	console.log('\x1b[33m', '[Yeelight]', '\x1b[37m', 'Procurando as lampadas...');
	Yeelight.discover(function(light){
		if(light.name == "BeatLight") {
			i++;
			console.log('\x1b[33m', '[Yeelight]', '\x1b[37m', i + ' lampada encontrada (' + light.name + ')');    
			light.set_music(1, add, 8271)
		}
	});
});
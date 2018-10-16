var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    console.log("dir:" + __dirname);
    res.sendFile(__dirname + '/index.html');
});
//所有注册用户的socket集合（socketMap）
var sm = {};
io.on('connection', function (socket) {
    socket.on('chat-reg', function (data) {
        console.log("chat-reg:" + JSON.stringify(data));
        //注册 ：data 格式：{user:"alisa"}
        //消息 ：data 格式：{user:"alisa",msg:"@someone hello!!!"}
        //格式说明：msg内容以@符号开头，以空格分隔用户名和消息体的说明是私聊
        sm[data.user] = socket;
        socket.emit('chat-reg', { code: 200, msg: "reg success" });
    });
    socket.on('chat-data', function (data) {

        console.log("chat-data:" + JSON.stringify(data));
        if (data.msg[0] == '@') {//以@符号开头，说明这句消息是私聊
            //将消息显示在自己的聊天记录上
            socket.emit('chat-data', data);
            //查找第一个空格的位置
            var i = data.msg.indexOf(' ');
            //得到用户名
            var u = data.msg.substring(1, i);
            //得到消息体
            var m = data.msg.substring(i, data.msg.length);
            if (typeof sm[u] != 'undefined') {
                //在socket集合中得到目标用户的socket，并且发送消息事件
                sm[u].emit('chat-data', { user: data.user, msg: "[private]" + m });
            }
        } else {
            //不是以@开头的消息发送给所有连接的用户
            io.sockets.emit('chat-data', data);
        }
    });
});
//监听在3000端口
http.listen(3000, function () {
    console.log('listening on:3000');
});
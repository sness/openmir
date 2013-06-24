var socket = io.connect('http://localhost:3000');

// socket.on('news', function (data) {
//     console.log(data);
//     socket.emit('my other event', { my: 'data' });
// });



// socket.on('data1', function (data) {
//     console.log(data);
//     socket.emit('my other event', { my: 'data' });
// });

var yindata = 'recording/1/yin';

socket.emit('getdata', { data: yindata} );

socket.on(yindata, function (data) {
    console.log(data);
});




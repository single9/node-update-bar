const platform = require('os').platform();
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const spawn = require('child_process').spawn;

// 檢測作業系統是否為 Windows
const isWin = (platform === 'win32') ? true : false;
// HTTP 伺服器設定
const HTTP_PORT = 3000;
const HOSTNAME = 'localhost';

// 將 html 推至客戶端
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Socket.io 連線成功
io.on('connection', (socket) => {
  // 接收到 update 事件
  socket.on('update',  () => {
    // 執行 update.sh
    var update = spawn(__dirname + '/update.sh', [], {shell: isWin});
    // 接收 update.sh 回傳值
    update.stdout.on('data', (data) => {
      // 將資料轉成 string
      var str = `${data}`;
      // 將接收的資料以 JSON 方式頗析
      var progress = JSON.parse(str);
      // 將資料傳至網頁端
      socket.emit('progress', progress);
    });
  });
});

// 啟動伺服器
server.listen(HTTP_PORT, HOSTNAME, () => {
  console.log('Server started. http://%s:%s', HOSTNAME, HTTP_PORT);
});
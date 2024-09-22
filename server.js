const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: '*'
}));

// Serve the Socket.IO client library from the CDN
app.get('/socket.io/socket.io.js', (req, res) => {
  res.redirect('https://cdn.socket.io/4.0.0/socket.io.min.js');
});

// Serve your HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const generateRandomStockData = () => {
  const stocks = ['SUZLON', 'AMAZON', 'GNRL', 'BSE', 'RattanPower', 'Airtel', 'Bajaj Housing', 'NPCC', 'Cochin Shipyard'];
  return stocks.map((stock) => {
    return {
      symbol: stock,
      price: (Math.random() * (850 - 500) + 500).toFixed(2),
      change: (Math.random() * 20 - 10).toFixed(2),
      timestamp: new Date().toISOString(),
    };
  });
};

io.on('connection', (socket) => {
  console.log('A client connected via WebSocket');
  const stockInterval = setInterval(() => {
    const stockData = generateRandomStockData();
    socket.emit('stockData', stockData);
  }, 1000);

  socket.on('disconnect', () => {
    console.log('A client disconnected');
    clearInterval(stockInterval);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

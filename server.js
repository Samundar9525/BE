const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import cors
const path = require('path');

// Initialize Express and the server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // Allow requests from Angular app
    methods: ["GET", "POST"]
  }
});

// Enable CORS middleware
app.use(cors({
  origin: 'http://localhost:4200' // Allow the Angular frontend
}));

// Serve the HTML file from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Serve the index.html from the same location as index.js
});

// Stock data generator
const generateRandomStockData = () => {
  const stocks = ['SUZLON', 'AMAZON', 'GNRL', 'BSE', 'RattanPower','Airtel','Bajaj Housing','NPCC','Cochin Shipyard'];
  return stocks.map((stock) => {
    return {
      symbol: stock,
      price: (Math.random() * (850 - 500) + 500).toFixed(2), // Random price between 800 and 850
      change: (Math.random() * 20 - 10).toFixed(2), // Random change between -10 and +10
      timestamp: new Date().toISOString(),
    };
  });
};

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A client connected via WebSocket');

  // Send stock data every 2 seconds to this client
  const stockInterval = setInterval(() => {
    const stockData = generateRandomStockData();
    socket.emit('stockData', stockData); // Emit data to the specific client
  }, 1000);

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    clearInterval(stockInterval); // Stop sending data when the client disconnects
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// for deployment

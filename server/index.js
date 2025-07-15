// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://yappie-eta.vercel.app"],

    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "https://yappie-eta.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Basic route
app.get('/', (req, res) => {
  res.send('Yappie API is running');
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

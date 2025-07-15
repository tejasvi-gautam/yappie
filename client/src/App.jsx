import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

const socket = io('http://localhost:5000'); // Your backend URL

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, { text: data.message, from: 'other' }]);
    });

    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    if (message.trim() === '') return;

    socket.emit('send_message', { message });
    setMessages((prev) => [...prev, { text: message, from: 'me' }]);
    setMessage('');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom mt={4}>
        Yappie Chat
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 2, height: '400px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              textAlign: msg.from === 'me' ? 'right' : 'left',
              mb: 1,
            }}
          >
            <Box
              sx={{
                display: 'inline-block',
                bgcolor: msg.from === 'me' ? 'primary.main' : 'grey.300',
                color: msg.from === 'me' ? 'white' : 'black',
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              {msg.text}
            </Box>
          </Box>
        ))}
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default App;


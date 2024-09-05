const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Node.js' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
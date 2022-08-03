const express = require('express');

const app = express();
app.use(express.static('./dist', { index: false }));

app.get('*', async (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(8081, () => console.log('Server started 8081'));

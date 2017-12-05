const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

//const publicPath = path.join(__dirname, '../public');
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
    console.log(`Server available on port ${PORT}. Press ^C to exit.`);
});

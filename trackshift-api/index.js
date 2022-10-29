const mongoose = require("mongoose");
const express = require("express");
const config = require("config");
const users = require("./routes/users");
const auth = require("./routes/auth");
const cors = require("cors");
const app = express();

if (!config.get('jwtPrivateKey')) {
  throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/trackshift")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use(cors());
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Listening on port ${port}...`));

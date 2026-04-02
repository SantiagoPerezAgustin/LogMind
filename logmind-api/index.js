require("dotenv").config();

const { createApp } = require("./src/app");
const config = require("./src/config/config");

const app = createApp();
app.listen(config.port, () => {
  console.log(`Servidor en http://localhost:${config.port}`);
});

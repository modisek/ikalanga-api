const express = require("express");
const route = require("./routes/route.js");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);
app.use("/api/v1/", route);
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

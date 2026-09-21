import "./lib/forceIPv4.js"; // must be the very first import
// ...rest of your existing imports
import app from "./app.js";
import { config } from "./config/index.js";
app.listen(config.port, () => {
  console.log(`Server started at port${config.port}`);
});

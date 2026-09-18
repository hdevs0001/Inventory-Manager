import app from "./app.js";
import { config } from "./config/index.js";
app.listen(config.port, () => {
    console.log(`Server started at port${config.port}`);
});
//# sourceMappingURL=server.js.map
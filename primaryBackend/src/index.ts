import express from "express";
import { userRouter } from "./router/user.js";
import cors from "cors";
import { zapRouter } from "./router/zap.js";
import { triggerRouter } from "./router/trigger.js";
import { actionRouter } from "./router/action.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("api/v1/user" , userRouter);
app.use("api/v1/zap" , zapRouter);
app.use("api/v1.trigger" , triggerRouter);
app.use("api/v1/action" , actionRouter);

const port = 8000;
app.listen(port , ()=>{
    console.log(`app listening to port ${port}`);
});

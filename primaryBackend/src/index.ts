import express from "express";
import { userRouter } from "./router/user.js";

const app = express();

app.use("api/v1/user" , userRouter);
app.use("api/v1/zap" , zapRouter);

const port = 8000;
app.listen(port , ()=>{
    console.log(`app listening to port ${port}`);
});

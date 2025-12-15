import express from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log("reached here")
    // store a new trigger in a db
    await client.$transaction(async tx => {
        console.log("reached here 2");
        const run = await client.zapRun.create({
            data: {
                zapId: zapId,
                metadata:body
            }
        });
        console.log("reached here 3")
        await client.zapRunOutbox.create({
            data:{
                zapRunId:run.id
            }
        })
        res.json({
            message:"webhook recieved"
        })

    })


    //push it in a queue (kafka/redis)
    // kafkaPublisher.publish({
    //     zapId
    // })


});
app.listen(3002 , ()=>{
    console.log("server running on port 3002")
})

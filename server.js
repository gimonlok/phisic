import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const CRYPTOBOT_TOKEN = "427000:AASN0EvqMeav3laO99cVALzVGc5mbfKV4A9";
const API_URL = "https://pay.crypt.bot/api/";

let users = {}; // временное хранилище (потом заменить БД)

app.post("/create-invoice", async (req,res)=>{
    const {user_id} = req.body;

    try{
        const response = await axios.post(
            API_URL + "createInvoice",
            {
                asset: "USDT",
                amount: 5,
                description: "Gradient Studio PRO",
                hidden_message: "PRO activated",
                paid_btn_name: "openBot"
            },
            {
                headers:{
                    "Crypto-Pay-API-Token": CRYPTOBOT_TOKEN
                }
            }
        );

        res.json({
            invoice_url: response.data.result.pay_url
        });

    }catch(e){
        res.status(500).send("Error creating invoice");
    }
});

app.post("/webhook", (req,res)=>{
    const update = req.body;

    if(update.payload && update.status === "paid"){
        const userId = update.payload;
        users[userId] = {pro:true};
    }

    res.sendStatus(200);
});

app.listen(3000, ()=>console.log("Server running"));

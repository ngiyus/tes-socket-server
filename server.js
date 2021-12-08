const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const { Server } = require('socket.io');
const firebase = require("./aws-layers/usecase/firebase");
const accountTransaction = require("./aws-layers/usecase/impl_account_transaction");
const app = express();
const server = http.createServer(app)
const io = new Server(server);
const redis = require('socket.io-redis');


app.use(morgan("dev"));
app.use(cors());

app.get("/health-check", (req, res) => {
    res.status(200).send();
});



io.adapter(redis("redis://:HtnDcePSC1RdZHZfRyrBIOpg7ZXM8mYA@redis-11474.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:11474"));



io.on("connection", async (client) => {
    let currentMarket;
    const connectionFirebaseAuth = {};

    try {
        connectionFirebaseAuth[client.id] = await firebase.validate(
            client.handshake.query.auth);
        client.join(connectionFirebaseAuth[client.id])
        console.log("USERID : " + connectionFirebaseAuth[client.id] + " CONNECTED")

    } catch (error) {
        client.emit("authResponse", {
            "type": "AUTH",
            "status": "ERROR",
            "message": "TOKEN EXPIRED"
        });

        console.log("ERROR CONNECT")
        return client.disconnect(true);

    }

    client.on("transaction", async (data) => {
        let {
            amount,
            dealId,
            type,
            demo,
        } = data;

        try {

            let transaction =
                await accountTransaction.createAccountTransaction(
                    client.handshake.query.auth, dealId, amount, type, demo);


          console.log("TES45",transaction)
            client.emit("transactionResponse", {
                "type": "TRANSACTION",
                "status": "OK",
                "data": transaction,
            })
        } catch (error) {
            client.emit("transactionResponse", {
                "type": "TRANSACTION",
                "status": "ERROR",
                "message": error,
            })
        }
    });

    client.on("subscription", (data) => {
        console.log("SUBSCRIPTION EVENT")
        if (currentMarket !== null) {
            client.leave(currentMarket)
        }
        currentMarket = data.pair;
        client.join(data.pair);
    });


});

let port = process.env.PORT || 80;
server.listen(port, () => {
    console.log(`Running in port ${port}`);
})
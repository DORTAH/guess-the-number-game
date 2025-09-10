import { error } from "console";
import net from 'net'
import { json } from "stream/consumers";
import getRandomNumber from "./lib/randomNumber.js";

function createServer(filePath) {

    const server = net.createServer(connection => {
        console.log(`${connection.remoteAddress} conected`)

        connection.on('data', (data) => {
            const clientMessage = JSON.parse(data.toString())
            // console.log(JSON.parse(data.toString()))
            // console.log(clientMessage.range)
            if (clientMessage.range) {
                const [minNumber, maxNumber] = clientMessage.range.split('-').map(Number)
                if (!Number.isFinite(minNumber) || !Number.isFinite(maxNumber)) {
                    throw new Error("Incorrect data")
                }
                const answerMessage = {answer: getRandomNumber(minNumber, maxNumber)}
                connection.write(JSON.stringify(answerMessage))
            }
        // connection.write(JSON.stringify(answerMessage))
        })
         
        connection.on('close', () => {
        console.log(`${connection.remoteAddress} disconected`)
         })
    })

    server.on('error', (error) => {
        console.error(error)
    })
    console.log(`Готов к игре...`)

    return server;

}

createServer().listen(3000);
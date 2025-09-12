import net from 'net'
import getRandomNumber from "./lib/randomNumber.js";

function createServer(filePath) {

    const server = net.createServer(connection => {
        console.log(`${connection.remoteAddress} conected`)

        const state = {
            minNumber: null,
            maxNumber: null,
            LastGuess: null,
        }

        connection.on('data', (data) => {
            const clientMessage = JSON.parse(data.toString())
            console.log(clientMessage)

            // console.log(JSON.parse(data.toString()))
            // console.log(clientMessage.range)

            if (clientMessage.range) {
                const [minNumber, maxNumber] = clientMessage.range.split('-').map(Number)

                state.minNumber = minNumber
                state.maxNumber = maxNumber

                if (!Number.isFinite(minNumber) || !Number.isFinite(maxNumber)) {
                    throw new Error("Incorrect data")
                }

                state.LastGuess = getRandomNumber(minNumber, maxNumber)

                const answerMessage = {answer: state.LastGuess}
                connection.write(JSON.stringify(answerMessage))
            } else if (clientMessage.hint) {
                if (clientMessage.hint === 'more') {
                    state.LastGuess = getRandomNumber(state.LastGuess + 1, state.maxNumber)
                    // connection.write(JSON.stringify(answerMessage))
                    const answerMessage = {answer: state.LastGuess}
                    connection.write(JSON.stringify(answerMessage))
                } else {
                    state.LastGuess = getRandomNumber(state.minNumber, state.LastGuess- 1)
                    const answerMessage = {answer: state.LastGuess}
                    connection.write(JSON.stringify(answerMessage))
                }
            }
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
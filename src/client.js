import net from 'net'
import getRandomNumber from './lib/randomNumber.js'

const [minNumber, maxNumber] = process.argv.slice(2).map(Number)

if (!Number.isFinite(minNumber) || !Number.isFinite(maxNumber)) {
    throw new Error("Limits must be defined")
}

const guessedNumber = getRandomNumber(minNumber, maxNumber)

const client = net.createConnection({ port:3000 })

client.on('connect', () => {
    const NumberMessige = {range: `${minNumber}-${maxNumber}`}
    client.write(JSON.stringify(NumberMessige))
})

// client.on('data', (data) => {
//     const currentTime = new Date().toLocaleTimeString('ru-RU')
//     console.log(data.toString() + currentTime)
// })

//
client.on('error', (err) => {
    console.error('Connection error:', err.message)
})

client.on('data', (data) => {
    const {answer} = JSON.parse(data.toString())
    console.log(answer)
    if (answer === guessedNumber) {
        client.write(`You win number is ${guessedNumber}`)
        client.destroy()
    } else {
        const hint = answer < guessedNumber ? 'more' : 'less'
        const hintMessage = {hint}
        client.write(JSON.stringify(hintMessage))
    }
})
import net from 'net'
import getRandomNumber from './lib/randomNumber.js'

const [minNumber, maxNumber] = process.argv.slice(2).map(Number)

if (!Number.isFinite(minNumber) || !Number.isFinite(maxNumber)) {
    throw new Error("Limits must be defined")
}

const randomNumber = getRandomNumber(minNumber, maxNumber)

const client = net.createConnection({ port:3000 })

client.on('connect', () => {
    const NumberMessige = {range: `${minNumber}-${maxNumber}`}
    client.write(JSON.stringify(NumberMessige))
})

client.on('data', (data) => {
    const currentTime = new Date().toLocaleTimeString('ru-RU')
    console.log(data.toString() + currentTime)
})

//
client.on('error', (err) => {
    console.error('Connection error:', err.message)
})
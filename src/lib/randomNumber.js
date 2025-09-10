export default function getRandomNumber(minNumber, maxNumber) {
    const randomNumber = Math.round(Math.random() * (maxNumber - minNumber) + minNumber)
    return Math.round(randomNumber)
}
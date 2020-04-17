module.exports = class RandomDie {
    constructor(numSides) {
        this.numSides = numSides || 6
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides)
    }

    roll({ numRolls }) {
        const output = []

        for (let i = 0; i < numRolls; i++) {
            output.push(this.rollOnce())
        }

        return output
    }
}
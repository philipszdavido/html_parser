const _uniq = require("lodash.uniq")

const fruits = [
    "mango",
    "orange",
    "tangerine",
    "mango",
    "orange"
]

const uniqueFruits = _uniq(fruits)

console.log(fruits)
console.log(uniqueFruits);
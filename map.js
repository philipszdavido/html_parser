// let us see how to transfrom
// objects in an array using map

const fruits = [
    {
        name: "mango"
    },
    {
        name: "orange"
    },
    {
        name: "tangerine"
    }
]

// let's use map to transfrom this array
// of fruit objects into the fruit names.

const fruitNames = fruits.map(
    (fruit) => {
        // we know that the 'fruit' is an object
        // so we access the 'name' property and return it.

        const fruitName = fruit.name
        return fruitName;
    }
)

console.log(fruits)
console.log(fruitNames)
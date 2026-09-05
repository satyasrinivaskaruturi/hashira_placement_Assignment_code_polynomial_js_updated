const fs = require("fs");

// Read JSON file
let fileName = process.argv[2] || "testcase.json";
let data = JSON.parse(fs.readFileSync(fileName, "utf8"));


// Get n and k
let n = data.keys.n;
let k = data.keys.k;

console.log("n =", n);
console.log("k =", k);


// Convert value from its base to decimal
function convertToDecimal(value, base) {

    let result = 0n;

    for (let digit of value.toLowerCase()) {

        let number;

        if (digit >= "0" && digit <= "9") {
            number = BigInt(digit);
        } else {
            number = BigInt(digit.charCodeAt(0) - 87);
        }

        result = result * BigInt(base) + number;
    }

    return result;
}


// Read the points
let points = [];

for (let key in data) {

    if (key == "keys") {
        continue;
    }

    let x = BigInt(key);
    let base = Number(data[key].base);
    let value = data[key].value;

    let y = convertToDecimal(value, base);

    points.push([x, y]);
}


// Use only k points
points = points.slice(0, k);

console.log("\nPoints:");

for (let point of points) {
    console.log(
        "(" + point[0].toString() +
        ", " + point[1].toString() + ")"
    );
}


// Find GCD
function gcd(a, b) {

    if (a < 0n) {
        a = -a;
    }

    if (b < 0n) {
        b = -b;
    }

    while (b != 0n) {
        let temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}


// Add two fractions
function addFractions(a, b) {

    let numerator =
        a[0] * b[1] +
        b[0] * a[1];

    let denominator =
        a[1] * b[1];

    let g = gcd(numerator, denominator);

    return [
        numerator / g,
        denominator / g
    ];
}


// Find c = f(0)
let c = [0n, 1n];

for (let i = 0; i < k; i++) {

    let xi = points[i][0];
    let yi = points[i][1];

    // Start with y value
    let term = [yi, 1n];


    // Calculate the Lagrange term
    for (let j = 0; j < k; j++) {

        if (i == j) {
            continue;
        }

        let xj = points[j][0];

        // (-xj) / (xi - xj)
        let numerator = -xj;
        let denominator = xi - xj;

        term = [
            term[0] * numerator,
            term[1] * denominator
        ];
    }


// Add this term to c
console.log("Term =", term[0].toString(), "/", term[1].toString());
c = addFractions(c, term);
console.log("Current c =", c[0].toString(), "/", c[1].toString());
}


// Print final answer
console.log("\n----------------");
console.log("c =", c[0].toString());
console.log("----------------");// Make denominator positive
if (c[1] < 0n) {
    c[0] = -c[0];
    c[1] = -c[1];
}

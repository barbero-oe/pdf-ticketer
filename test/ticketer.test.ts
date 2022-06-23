import { resize, Size } from "../src/ticketer"

const wider: Size = { width: 100, height: 50 }
const taller: Size = { width: 50, height: 100 }
const square: Size = { width: 10, height: 10 }
const anotherWider: Size = { width: 50, height: 10 }

const cases = [
    [square, square, square],
    [wider, square, { width: 10, height: 5 }],
    [taller, square, { width: 5, height: 10 }],
    [square, wider, { width: 50, height: 50 }],
    [taller, wider, { width: 25, height: 50 }],
    [anotherWider, wider, { width: 100, height: 20 }],
    [square, taller, { width: 50, height: 50 }],
]

test.each(cases)("resize(%s, %s) == %s", (a, b, expected) => {
    expect(resize(a, b)).toEqual(expected)
})
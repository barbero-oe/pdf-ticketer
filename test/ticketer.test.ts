import { createTickets } from "../src/model/action"
import { resize, Size } from "../src/ticketer"

class MockPdf {
  constructor(private readonly elements: any[]) {}
  addText(text: string) {
    this.elements.push(text)
  }
}

let elements: any[] = []
jest.mock("../src/model/pdf", () => ({
  __esModule: true,
  default: function () {
    elements = []
    return new MockPdf(elements)
  },
}))

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

test("f", () => {
  createTickets(
    "/mock/path/file.pdf",
    { columns: 1, rows: 1 },
    // { type: "image", path: "./assets/rifa-01.png", x: 5, y: 5 },
    { type: "counter", x: 10, y: 10 }
  )
  expect(elements).toContain("text")
})

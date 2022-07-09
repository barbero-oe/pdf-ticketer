import { createTickets } from "../src/model/action"
import { resize, Size, TicketPage } from "../src/model/ticketer"
import MockPdf from "./MockPdf"
import { Position, Text } from "../src/model/types"

let mockPdf: MockPdf

jest.mock("../src/model/pdf", () => ({
  __esModule: true,
  default: function () {
    mockPdf = new MockPdf()
    return mockPdf
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

test("add text a single time", () => {
  createTickets(
    "/mock/path/file.pdf",
    1,
    { columns: 2, rows: 2 },
    { type: "text", x: 10, y: 10, value: "value" }
  )
  const texts = mockPdf.elements.filter((el) => (el as Text).value === "value")
  expect(texts.length).toEqual(1)
})

test("add text multiple times", () => {
  createTickets(
    "/mock/path/file.pdf",
    4,
    { columns: 2, rows: 2 },
    { type: "text", x: 10, y: 10, value: "value" }
  )
  const texts = mockPdf.elements.filter((el) => (el as Text).value === "value")
  expect(texts.length).toEqual(4)
})

test("prints text in multple places", () => {
  createTickets(
    "/mock/path/file.pdf",
    4,
    { columns: 2, rows: 2 },
    { type: "text", x: 10, y: 10, value: "value" }
  )
  const texts = mockPdf.elements.filter((el) => (el as Text).value === "value")
  console.table(mockPdf.elements)
  expect(texts.length).toEqual(4)
})

const offsets = [
  [0, { x: 0, y: 0 }],
  [1, { x: 5, y: 0 }],
  [2, { x: 0, y: 5 }],
  [3, { x: 5, y: 5 }],
  [4, { x: 0, y: 0 }],
  [5, { x: 5, y: 0 }],
  [6, { x: 0, y: 5 }],
  [7, { x: 5, y: 5 }],
]

test.each(offsets)(
  "offset(%s) == %s",
  (ticketNumber: number, expected: Position) => {
    const page = new TicketPage(10, 10, 2, 2)

    const actual = page.calculateOffset(ticketNumber)

    expect(actual).toEqual(expected)
  }
)

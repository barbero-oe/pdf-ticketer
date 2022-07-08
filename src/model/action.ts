import Pdf from "./pdf"

export interface Page {
  columns: number
  rows: number
}

export interface Position {
  x: number
  y: number
}

export interface Image extends Position {
  type: "image"
  path: string
}

export interface Counter extends Position {
  type: "counter"
}

type Element = Image | Counter

export function createTickets(
  output: string,
  page: Page,
  ...elements: Element[]
) {
  const pdf = new Pdf(output)
  pdf.addText("text")
}

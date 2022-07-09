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

export interface Text extends Position {
  type: "text"
  value: string
}

export interface Counter extends Position {
  type: "counter"
}

type Element = Image | Text | Counter

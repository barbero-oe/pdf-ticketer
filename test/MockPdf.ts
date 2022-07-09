import { Size } from "../src/model/ticketer"
import { Position, TicketElement } from "../src/model/types"

export default class MockPdf {
  readonly elements: TicketElement[] = []

  add(element: TicketElement) {
    this.elements.push(element)
  }

  pageSize(): Size {
    return { width: 10, height: 10 }
  }
}

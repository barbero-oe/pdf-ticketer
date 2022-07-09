import Pdf from "./pdf"
import { Ticketer } from "./ticketer"
import { Page, TicketElement } from "./types"

export function createTickets(
  output: string,
  quantity: number,
  page: Page,
  ...elements: TicketElement[]
) {
  const pdf = new Pdf(output)
  const ticketer = new Ticketer(page, pdf)
  ticketer.print(quantity, elements)
}

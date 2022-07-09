import Pdf from "./pdf"
import { Ticketer, TicketPage } from "./ticketer"
import { Page, TicketElement } from "./types"

export function createTickets(
  output: string,
  quantity: number,
  page: Page,
  ...elements: TicketElement[]
) {
  const pdf = new Pdf(output)
  const { width, height } = pdf.pageSize()
  const ticketPage = new TicketPage(width, height, page.rows, page.columns)
  const ticketer = new Ticketer(ticketPage, pdf)
  ticketer.print(quantity, elements)
}

import { Size } from "./ticketer"
import { jsPDF } from "jspdf"
import { Position, TicketElement } from "./types"

export default class Pdf {
  private readonly pdf: jsPDF
  private readonly PIXEL_RATIO = 72 / 96

  constructor(private readonly path: string) {
    this.pdf = new jsPDF({
      unit: "px",
      compress: true,
      hotfixes: ["px_scaling"],
    })
  }

  add(element: TicketElement) {}

  pageSize(): Size {
    const info = this.pdf.getCurrentPageInfo()
    const box = info.pageContext.mediaBox
    const width = Math.abs(box.topRightX - box.bottomLeftX) / this.PIXEL_RATIO
    const height = Math.abs(box.topRightY - box.bottomLeftY) / this.PIXEL_RATIO
    return { width, height }
  }
}

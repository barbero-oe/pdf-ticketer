import { jsPDF } from "jspdf"
import { promises as fs } from "fs"

const TICKET_PATH = "test/assets/rifa-01.png"
const PDF_PATH = "out/tickets.pdf"
const MARGIN = 5
const ROWS = 5
const COLUMNS = 1
const NUMBERS = 1
const PAGES = 2


export interface Size {
    width: number
    height: number
}

export interface Image extends Size {
    fileType: string
    bytes: Buffer
}

export default async function main() {
    const pdf = new jsPDF({ unit: 'px', compress: true, hotfixes: ['px_scaling'] })

    const ticket = await loadImage(TICKET_PATH, pdf)
    const page = pageSize(pdf)
    const cell = cellSize(page, ROWS, COLUMNS)
    const box = ticketBox(cell, MARGIN)
    const ticketSize = resizeForContainer(ticket, box)

    for (let page = 1; page <= PAGES; page++) {
        for (let row = 0; row < ROWS; row++) {
            for (let column = 0; column < COLUMNS; column++) {
                addImage(pdf, ticket, ticketSize, row, column, MARGIN)
            }
        }
        if (page != PAGES) pdf.addPage()
    }
    pdf.save(PDF_PATH)
}

function addImage(pdf: jsPDF, image: Image, box: Size, row: number, column: number, margin: number) {
    const x = margin + column * (margin + box.width)
    const y = margin + row * (margin + box.height)
    pdf.addImage(
        image.bytes, image.fileType,
        x, y,
        box.width, box.height,
        'ticket', 'SLOW')
}

function cellSize(page: Size, rows: number, columns: number): Size {
    return {
        width: page.width / columns,
        height: page.height / rows
    }
}

function ticketBox(box: Size, margin: number): Size {
    return {
        width: box.width - margin * 2,
        height: box.height - margin * 2
    }
}

function pageSize(doc: jsPDF): Size {
    const info = doc.getCurrentPageInfo()
    const pixelRatio = 72 / 96
    const box = info.pageContext.mediaBox
    const width = Math.abs(box.topRightX - box.bottomLeftX) / pixelRatio
    const height = Math.abs(box.topRightY - box.bottomLeftY) / pixelRatio
    return { width, height }
}

export function resizeForContainer(original: Size, container: Size): Size {
    const originalRatio = original.height / original.width
    const containerRatio = container.height / container.width
    if (containerRatio >= originalRatio) {
        const width = container.width
        return { width, height: width * originalRatio }
    } else {
        const height = container.height
        return { height, width: height / originalRatio }
    }
}

async function loadImage(path: string, pdf: jsPDF): Promise<Image> {
    const bytes = await fs.readFile(path)
    const { width, height, fileType } = pdf.getImageProperties(bytes)
    return { bytes, width, height, fileType }
}

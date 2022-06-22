/**
 * Constants
 */
const TICKET_PATH = "test/assets/rifa-01.png"
const PDF_PATH = "out/tickets.pdf"
const ROWS = 1
const COLUMNS = 1
const NUMBERS = 1

/**
 * Program
 */
const { jsPDF } = require("jspdf")
const fs = require("fs").promises;

(main)()

async function main() {
    const pdf = new jsPDF({ unit: 'px', compress: true, hotfixes: ['px_scaling'] })

    const ticket = await loadImage(TICKET_PATH, pdf)


    const { width, height } = resize(ticket, pageSize(pdf))
    pdf.addImage(ticket.bytes,
        format = ticket.fileType,
        x = 0, y = 0,
        w = width,
        h = height,
        alias = 'ticket',
        compression = 'SLOW')
    pdf.save(PDF_PATH)
}

function pageSize(doc) {
    const info = doc.getCurrentPageInfo()
    const pixelRatio = 72 / 96
    const box = info.pageContext.mediaBox
    const width = Math.abs(box.topRightX - box.bottomLeftX) / pixelRatio
    const height = Math.abs(box.topRightY - box.bottomLeftY) / pixelRatio
    return { width, height }
}

function resize(image, size) {
    const ratio = image.height / image.width
    const width = size.width
    const height = size.width * ratio
    return { width, height }
}

async function loadImage(path, pdf) {
    const bytes = await fs.readFile(path)
    const { width, height, fileType } = pdf.getImageProperties(bytes)
    return { bytes, width, height, fileType }
}

import { jsPDF } from "jspdf"
import { promises as fs } from "fs"
import path from "path"

const TICKET_PATH = "test/assets/rifa-01.png"
const PDF_PATH = "out/tickets.pdf"
const MARGIN = 5
const ROWS = 5
const COLUMNS = 1
const NUMBERS = 20


export interface Size {
    width: number
    height: number
}

export interface Image extends Size {
    name: string
    fileType: string
    bytes: Buffer
}

export default async function main() {
    const pdf = new jsPDF({ unit: 'px', compress: true, hotfixes: ['px_scaling'] })

    await addFont(pdf, './test/assets/fonts/VastShadow-regular.ttf', 'VastShadow', 'normal')

    const ticket = await loadImage(TICKET_PATH, pdf)
    const page = pageSize(pdf)
    const cell = cellSize(page, ROWS, COLUMNS)
    const box = ticketBox(cell, MARGIN)
    const resizedTicket = resizeForContainer(ticket, box)
    console.log('Image resized %s', logImage(resizedTicket))

    const pages = NUMBERS / (COLUMNS * ROWS)
    pdf.setFont('VastShadow', 'normal')
    for (let page = 1; page <= pages; page++) {
        for (let row = 0; row < ROWS; row++) {
            for (let column = 0; column < COLUMNS; column++) {
                addImage(pdf, resizedTicket, box, row, column, MARGIN)
                addText(pdf, "asdf", 50, 50, box, row, column, MARGIN)
            }
        }
        if (page != pages) pdf.addPage()
    }
    pdf.save(PDF_PATH)
}

async function addFont(pdf: jsPDF, fontPath: string, fontName: string, style: string) {
    const abspath = path.resolve(fontPath)
    console.log('Loading font [%s]', abspath)
    const font = await fs.readFile(abspath)
    const ext = path.extname(abspath)
    const id = `${fontName}-${style}${ext}`
    pdf.addFileToVFS(id, font.toString('base64'));
    pdf.addFont(id, fontName, style);
    console.log('Font added [%s]', id)
}

function addText(pdf: jsPDF, text: string, coordX: number, coordY: number, box: Size, row: number, column: number, margin: number) {
    const x = margin + coordX + column * (margin + box.width)
    const y = margin + coordY + row * (margin + box.height)
    pdf.text(text, x, y, { align: 'center', angle: 0 })
}

function addImage(pdf: jsPDF, image: Image, box: Size, row: number, column: number, margin: number) {
    const x = margin + column * (margin + box.width)
    const y = margin + row * (margin + box.height)
    pdf.addImage(
        image.bytes, image.fileType,
        x, y,
        image.width, image.height,
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

export function resizeForContainer(image: Image, container: Size): Image {
    return {...image, ...resize(image, container)}
}

export function resize(original: Size, container: Size): Size {
    const imageRatio = original.height / original.width
    const containerRatio = container.height / container.width
    if (containerRatio >= imageRatio) {
        const width = container.width
        return { width, height: width * imageRatio }
    } else {
        const height = container.height
        return { height, width: height / imageRatio }
    }
}

async function loadImage(imagePath: string, pdf: jsPDF): Promise<Image> {
    const abspath = path.resolve(imagePath)
    console.log('Loading image [%s]', abspath)
    const bytes = await fs.readFile(abspath)
    const { width, height, fileType } = pdf.getImageProperties(bytes)
    const name = path.basename(abspath)
    const ratio = height / width
    const image = { bytes, width, height, fileType, name, ratio }
    console.log('Image loaded %s', logImage(image))
    return image
}

function logImage(image: Image): string {
    return logObject(image, 'name', 'fileType', 'height', 'width', 'ratio')
}

function logObject(obj: any, ...keys: string[]): string {
    return keys.map(key => `${key}=[${obj[key]}]`).join(" ")
}
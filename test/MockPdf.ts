export default class MockPdf {
  readonly elements: string[] = []

  addText(text: string) {
    this.elements.push(text)
  }
}

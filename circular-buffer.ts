export class BufferOverflowError extends Error {}
export class BufferEmptyError extends Error {}

export default class CircularBuffer<T> {
  bufferSize: number
  buffer: (T | undefined)[]
  readPosition: number
  writePosition: number

  constructor(bufferSize: number) {
    this.bufferSize = bufferSize
    this.buffer = new Array(this.bufferSize)
    this.readPosition = 0
    this.writePosition = 0
  }

  read(): T | undefined {
    if (this.bufferIsEmpty()) throw new BufferEmptyError

    const value = this.buffer.splice(this.readPosition, 1, undefined)[0]
    this.readPosition = this.nextReadPosition()
    return value
  }

  write(value: T): void {
    if (this.bufferIsFull()) throw new BufferOverflowError

    this.buffer[this.writePosition] = value
    this.writePosition = this.nextWritePosition()
  }

  forceWrite(value: T): void {
    if (this.bufferIsFull()) {
      this.buffer[this.readPosition] = value
      this.readPosition = this.nextReadPosition()
    } else {
      this.write(value)
    }
  }

  clear(): void {
    this.buffer = new Array(this.bufferSize)
    this.readPosition = 0
    this.writePosition = 0
  }

  private bufferIsEmpty(): boolean {
    return this.buffer.every((bufferValue) => typeof bufferValue === "undefined")
  }

  private bufferIsFull(): boolean {
    return this.buffer.filter((bufferValue) => typeof bufferValue !== "undefined").length === this.bufferSize
  }

  private nextReadPosition(): number {
    if (this.readPosition === (this.bufferSize - 1)) return 0

    return this.readPosition + 1
  }

  private nextWritePosition(): number {
    if (this.writePosition === (this.bufferSize - 1)) return 0

    return this.writePosition + 1
  }
}


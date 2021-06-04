export class BufferOverflowError extends Error {}
export class BufferEmptyError extends Error {}

export default class CircularBuffer<T> {
  bufferSize: number
  buffer: (T | undefined)[]
  readPosition = 0
  writePosition = 0

  constructor(bufferSize: number) {
    this.bufferSize = bufferSize
    this.buffer = this.createInitialBuffer()
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
    this.buffer = this.createInitialBuffer()
    this.readPosition = 0
    this.writePosition = 0
  }

  private createInitialBuffer(): T[] {
    return new Array(this.bufferSize)
  }

  private bufferIsEmpty(): boolean {
    return this.buffer.every((bufferValue) => typeof bufferValue === "undefined")
  }

  private bufferIsFull(): boolean {
    return this.buffer.filter((bufferValue) => typeof bufferValue !== "undefined").length === this.bufferSize
  }

  private nextReadPosition(): number {
    return this.readPosition === (this.bufferSize - 1) ? 0 : this.readPosition + 1
  }

  private nextWritePosition(): number {
    return this.writePosition === (this.bufferSize - 1) ? 0 : this.writePosition + 1
  }
}


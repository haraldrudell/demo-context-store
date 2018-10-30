/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules --no-warnings src/terminalCursor
import {
  clearLine, // https://nodejs.org/api/readline.html#readline_readline_clearline_stream_dir
  clearScreenDown, // https://nodejs.org/api/readline.html#readline_readline_clearscreendown_stream
  cursorTo, // https://nodejs.org/api/readline.html#readline_readline_cursorto_stream_x_y
  moveCursor, // https://nodejs.org/api/readline.html#readline_readline_movecursor_stream_dx_dy
} from 'readline'

/*
from 'readline':
clearLine(stream, dir)
clearScreenDown(stream)
cursorTo(stream, x, y)
moveCursor(stream, dx, dy)

tty.WriteStream:
writeStream.clearLine(dir)
writeStream.clearScreenDown()
writeStream.columns
writeStream.cursorTo(x, y)
writeStream.getColorDepth([env]) // => color depth in bits: 1, 4, 8, 24
writeStream.getWindowSize() => [numColumns, numRows]
writeStream.isTTY
writeStream.moveCursor(dx, dy)
writeStream.rows
*/

Promise.resolve().then(() => new TTY().run({stream: process.stdout}).catch(TTY.errorHandler))

class TTY {
  constructor() {
    TTY.dir = { // Node.js v10.12.0: no static properties
      LEFT_OF_CURSOR: -1,
      RIGHT_OF_CURSOR: 1,
      ENTIRE_LINE: 0,
    }
  }

  async run({stream}) {
    if (!stream.isTTY) throw new Error('TTY: stream not TTY') // eg. redirect to file
    this.stream = stream

    this.testClearLine()
    //this.testCursorTo()
    this.testMoveCursor()
    this.testClearScreenDown()
    this.testWriteBottomLine()
  }

  testClearLine() {
    const {dir} = TTY
    const {stream} = this

    // caret is between characters. Deletes everything to the right of it
    stream.write('test clearLine(): Next line should be a single x in the leftmost position\n')
    stream.write('abc\rx')
    clearLine(stream, dir.RIGHT_OF_CURSOR)
    stream.write('\n')
  }

  testCursorTo() { // 0, 0 is upper left
    const {stream} = this

    // move cursor to (2, 2) and print text
    cursorTo(stream, 2, 2)
    console.log('ORIGO')
  }

  testMoveCursor() { // stream, dx, dy
    const {stream} = this

    // prints ABC, goes up two lines above 3 characters from left, prints DEF
    // goes down 3 lines (ie. scrolls 1 line)
    // prints END on the line below ABC followed by a newline
    stream.write('ABC')
    moveCursor(stream, 0, -2)
    stream.write('DEF\n\n\nEND\n')
    moveCursor(stream, 0, 2) // does not movbe beyond the screen: stops at the edge
    stream.write('DNE\n')
  }

  testClearScreenDown() {
    const {stream} = this

    stream.write('Q\nW\nE')
    moveCursor(stream, -1, -1) // dx dy: caret left of W
    clearScreenDown(stream) // clears all W and down. Q remains
    moveCursor(stream, 0, 30) // caret left of where E used to be
  }

  testWriteBottomLine() {
    const {stream} = this
    const {rows, columns} = stream
    stream.cursorTo(0, rows - 1) // cursor at bottom left
    stream.write(`${'X'.repeat(columns)}\r`) // thius prints X the entire bottom row but does not scroll the display
  }

  static errorHandler(e) {
    console.error(e)
    process.exit(1)
  }
}
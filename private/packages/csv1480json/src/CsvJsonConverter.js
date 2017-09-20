/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Pipeline from './Pipeline'

// getField result
const FIELD_EOF = 1 // end of file
const FIELD_NONE = 2 // data for complete field not seen yet
const FIELD_RECORD = 3 // got a complete record

const separators = Array.from(',\r\n')

export default class CsvJsonConverter extends Pipeline {
  constructor(o) {
    super(o || false)
    const {useHeader} = o || false
    this.useHeader = !!useHeader
    this.csv = ''
    this.recordNo = 1
  }

  addData = string => this.csv += string

  getOutput(isEnd) {
    if (isEnd) this.isEnd = true
    if (this.useHeader && !this.headers) if (!this.getHeader()) return
    let output = ''
    for (let record; record = this.getRecord(); output += record + '\n') ;
    return output || undefined
  }

  getRecord() {
    const fields = this.getFieldList()
    if (fields) { // got a record
      const count = fields.length
      const {fieldCount, recordNo, useHeader, headers} = this
      if (!fieldCount) this.fieldCount = count
      else if (count !== fieldCount) throw new Error(`Record ${recordNo} bad field count: ${count} expected ${fieldCount}`)
      this.recordNo++
      return `{${fields.map((v, index) => `${useHeader ? headers[index] : index + 1}: ${JSON.stringify(v)}`).join(', ')}}`
    } else return false
  }

  getHeader() {
    const list = this.getFieldList()
    if (list) {
      this.headers = list.map(v => JSON.stringify(v))
      this.fieldCount = list.length
    }
  }

  getFieldList() { // array of string or false
    let fields = this.fields || (this.fields = [])
    let field
    while (this.isField(field = this.getField())) fields.push(field)
    if (field === FIELD_RECORD) {
      this.fields = null
      return fields
    } else return false // need to wait for more data or end of file
  }

  getField() { // string or FIELD_*
    const {isEnd, recordNo} = this
    const fields = this.fields.length
    let {csv} = this
    let csvCh = csv[0]

    if (csvCh === '\r' || csvCh === '\n') { // skip the end of line terminating a previous record
      if (csv.length < 2 && !isEnd) return FIELD_NONE // must have two characters to find \r\n
      const chs = csv.substring(0, 2) === '\r\n' ? 2 : 1
      this.csv = csv = csv.substring(chs)
      return FIELD_RECORD // we have a complete record
    }

    if (!csv && isEnd) return fields ? FIELD_RECORD : FIELD_EOF // end of file: submit record or end of file

    const m = `Record ${recordNo} field ${fields + 1}`

    if (fields)
      if (csvCh === ',') csvCh = (this.csv = csv = csv.substring(1))[0]
      else throw new Error(`${m} missing field-separating comma`)

    if (csvCh === '"') { // double-quoted field
      let quoteSearchIndex = this.quoteSearchIndex || 1 // where to start looking
      for (;;) {
        let index = csv.indexOf('"', quoteSearchIndex)
        if (!~index) // no end-quote yet
          if (!isEnd) {
            this.quoteSearchIndex = quoteSearchIndex
            return FIELD_NONE // no matching quote in data thus far
          } else throw new Error(`${m} unmatched double quote`)
        if (index - quoteSearchIndex < 2 || csv[index - 1] !== '\\') { // found unescaped ending double quote
          this.quoteSearchIndex = 0
          this.csv = csv.substring(index + 1)
          return csv.substring(1, index)
        }
        quoteSearchIndex = index + 1 // skip escaped double quote
      }
    }

    // it is an unquoted field
    const index = separators.map(ch => csv.indexOf(ch)).reduce((r, sepIndex) => !~sepIndex ? r : !~r ? sepIndex : Math.min(r, sepIndex))
    if (!~index) // none of the separators appeared
      if (isEnd) {
        this.csv = ''
        return csv // field is rest of line
      } else return FIELD_NONE // need more data
    this.csv = csv.substring(index)
    return csv.substring(0, index)
  }

  isField = s => typeof s === 'string'
}

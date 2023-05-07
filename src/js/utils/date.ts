// This utility provides reusable date methods

export class DateUtil{
    static formatDate(date:Date) {
        // returns date formatted as yyyy-mm-dd
        const year = date.getFullYear().toString()
        let month = (date.getMonth() + 1).toString()
        month = +month > 9 ? month : '0'+ month
        let day = date.getDate().toString()
        day = +day > 9 ? day : '0' + day
        return `${year}-${month}-${day}`
    }
}

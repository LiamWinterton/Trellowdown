export class dateHelper {
    static daysBetween(date) {
        return Math.floor((date - +new Date()) / 86400000)
    }
}
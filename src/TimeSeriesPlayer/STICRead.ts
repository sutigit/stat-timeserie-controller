export default class STICRead {
    currentYear: number;
    overallTimeProgress: number;
    yearTimeProgress: number;
    
    constructor() {
        this.currentYear = 1987;
        this.overallTimeProgress = 0;
        this.yearTimeProgress = 0;
    }

    readData() {
        const data = {
            currentYear: this.currentYear,
            overallTimeProgress: this.overallTimeProgress,
            yearTimeProgress: this.yearTimeProgress
        }
        return data;
    }
}
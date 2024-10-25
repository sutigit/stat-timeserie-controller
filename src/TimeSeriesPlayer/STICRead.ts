export default class STICRead {

    // THIS CLASS REPRESENTS SINGLE SOURCE OF TRUTH
    
    // Time management
    minYear: number;
    maxYear: number;
    numOfYears: number;

    // Year management
    currentYear: number;
    targetYear: number;

    // Mesh management
    yearCells: { 
        yearLabel: string,
        meshId: string,
        meshIndex: number,
    }[];
    
    constructor(minYear: number, maxYear: number) {
        this.minYear = minYear;
        this.maxYear = maxYear;
        this.currentYear = minYear;
        this.targetYear = maxYear;
        this.numOfYears = this.maxYear - this.minYear;
        
        this.yearCells = [];
    }

    getAllData() {
        return Object.fromEntries(
            Object.keys(this).map((key) => [key, this[key as keyof this]])
        );
    }

    getData<K extends keyof STICRead>(name: K): STICRead[K] {
        return this[name];
    }

    setYearCells(yearCells: { yearLabel: string, meshId: string, meshIndex: number }[]) {
        this.yearCells = yearCells;
    }

    appendYearCells(yearLabel: string, meshId: string, meshIndex: number) {
        this.yearCells.push({ yearLabel, meshId, meshIndex });
    }
}
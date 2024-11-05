export default class Data {

    // THIS CLASS REPRESENTS SINGLE SOURCE OF TRUTH
    // Container properties
    element: HTMLDivElement;
    elementWidth: number;
    elementHeight: number;
    elementBounds: DOMRect;

    // Time management
    minYear: number;
    maxYear: number;
    numOfYears: number;

    // Year management
    currentYear: number;
    targetYear: number;
    
    constructor(element: HTMLDivElement, minYear: number, maxYear: number) {
        this.element = element;
        this.elementWidth = element.offsetWidth;
        this.elementHeight = element.offsetHeight;
        this.elementBounds = element.getBoundingClientRect();
        this.minYear = minYear;
        this.maxYear = maxYear;
        this.currentYear = minYear;
        this.targetYear = maxYear;
        this.numOfYears = this.maxYear - this.minYear;        
    }

    getAllData() {
        return Object.fromEntries(
            Object.keys(this).map((key) => [key, this[key as keyof this]])
        );
    }

    getData<K extends keyof Data>(name: K): Data[K] {
        return this[name];
    }
}
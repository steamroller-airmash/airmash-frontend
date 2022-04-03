export default class Vector {
    /**
     * @param {number} x
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * @param {number} e 
     */
    add(e) {
        this.x += e,
        this.y += e
    }

    /**
     * @param {number} e 
     */
    divide(e) {
        this.x /= e,
        this.y /= e
    }

    /**
     * @param {number} e 
     */
    multiply(e) {
        this.x *= e,
        this.y *= e
    }

    /**
     * @param {number} e 
     */
    limit(e) {
        this.divide(this.length()),
        this.multiply(e)
    }

    clone() {
        return new Vector(this.x,this.y)
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    angle() {
        return Math.atan2(this.y, this.x) - Math.PI / 2
    }

    /**
     * @param {number} e 
     */
    ceil(e) {
        this.x > e && (this.x = e),
        this.y > e && (this.y = e)
    }

    /**
     * @param {number} e 
     */
    floor(e) {
        this.x < e && (this.x = e),
        this.y < e && (this.y = e)
    }

    /**
     * @param {number} e 
     */
    both(e) {
        this.x = e,
        this.y = e
    }

    static zero() {
        return new Vector(0,0)
    }

    /**
     * @param {number} e
     * @returns {Vector}
     */
    static diag(e) {
        return new Vector(e,e)
    }

    /**
     * @param {number} angle
     * @param {number} length
     * @returns {Vector}
     */
    static create(angle, length) {
        return new Vector(Math.sin(angle) * length, -Math.cos(angle) * length)
    }

    /**
     * @param {Vector} offset
     * @param {number} angle
     * @param {number} length
     * @returns {Vector}
     */
    static createOff(offset, angle, length) {
        return new Vector(offset.x + Math.sin(angle) * length,offset.y - Math.cos(angle) * length)
    }
}

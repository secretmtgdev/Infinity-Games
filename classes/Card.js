export default class Card {
    // Would love to use '#' for privacy but only chrome and opera support this 
    // on the desktop platform
    constructor(name, productId, groupId, imgSrc) {
        this.name = name;
        this.productId = productId;
        this.groupId = groupId;
        this.imgSrc = imgSrc;
    }

    ///////////////
    /// GETTERS ///
    ///////////////
    get name() { return this.name; }
    get productId() { return this.productId; }
    get groupId() { return this.groupId; }
    get imgSrc() { return this.imgSrc; }
    
    ///////////////
    /// SETTERS ///
    ///////////////
    set name(newName) { this.name = newName; }
    set productId(newId) { this.productId = newId; }
    set groupId(newId) { this.groupId = newId; }
    set imgSrc(newSrc) { this.imgSrc = newSrc; }
}
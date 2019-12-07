import Card from '../classes/Card.js';
export default class CardService {
    constructor() {
        this.offset = 0;
        this.type = '';
        this.json = {};
        this.authToken = '';
    }

    /**
     * @method setAuth
     * @description Grabs the appropriate authorization for the current application
     * @param {string} gameType
     * @param {function} cb The callback handler 
     */
    async setAuth(gameType, cb) {
        this.type = gameType;
        let request = new XMLHttpRequest();
        let source = this.json[gameType];
        if(this.type === 'Blizzard') {
            // request the key
            request.open('POST', source['endpoints']['auth'], true);
            let username = source['client_id'], password = source['client_secret']; 
    
            // Oauth 2 expects the header to be this
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
            request.onreadystatechange = function() {
                if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    cb(request.responseText);
                }
            }
    
            request.setRequestHeader('Authorization', `Basic ${btoa(`${username}:${password}`)}`); 
            request.send('grant_type=client_credentials');       
        }
    }
    

    /**
     * @method queryCards
     * @description Makes the rest call to grab the cards
     * @param {Number} cardsToGet
     * @return {Array<Card>} The cards that were retrieved from the GET request
     */
    getCards(cardsToGet) {
        let data = new Array();
        let request = new XMLHttpRequest();
        request.withCredentials = true;
        request.addEventListener('readystatechange', () => {
            if(this.readyState === this.DONE && this.responseText && this.responseText.results) {
                for(const result of this.responseText.results) {
                    data.push(new Card(result.name, result.productId, result.groupId, result.imageUrl));
                }
            }
        });
        request.open("GET", `http://api.tcgplayer.com/v1.32.0/catalog/products?offset=${this.offset}&limit=${cardsToGet}`);
        this.offset += cardsToGet;
    }

    /**
     * @method loadJSON 
     * @description Loads the local config.json file
     * @method {function} The callback function to handle the get request
     */
    loadJson(cb) {
        let request = new XMLHttpRequest();
        request.overrideMimeType('application/json');
        request.open('GET', './config.json');
        request.onreadystatechange = function() {
            if(request.readyState === 4 && request.status === 200) {
                cb(request.responseText);
            }
        }
        request.send(null);
    }
}
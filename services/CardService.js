import Card from '../classes/Card.js';
export default class CardService {
    constructor() {
        this.offset = 0;
        this.type = '';
        this.json = null;
        this.scope = null;
        this.authToken = '';
        this.currentCards = [];

        // get around CORs issue with TCGPlayer api
        this.proxyurl = "https://cors-anywhere.herokuapp.com/";
    }

    /**
     * @method setAuth
     * @description Grabs the appropriate authorization for the current application
     * @param {string} gameType
     * @param {function} cb The callback handler 
     */
    async setAuth(gameType, cb) {
        this.type = gameType;
        if(this.json && this.json[gameType]) this.scope = this.json[gameType];
        let request = new XMLHttpRequest();

        // request the key
        request.open('POST', this.proxyurl + this.scope['endpoints']['auth'], true);
        let username = this.scope['credentials']['client_id'], password = this.scope['credentials']['client_secret']; 
    
        // Oauth 2 expects the header to be this
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                cb(request.responseText);
            }
        }
        if(this.type === 'Blizzard')request.setRequestHeader('Authorization', `Basic ${btoa(`${username}:${password}`)}`); 
        let body = `grant_type=client_credentials${this.type === 'TCGPlayer' ? `&client_id=${username}&client_secret=${password}`: ''}`;
        request.send(body);       
    }
    

    /**
     * @method queryCards
     * @description Makes the rest call to grab the cards
     * @param {Number} cardsToGet
     * @param {String} type The type of tcg
     * @param {cb} The callback handler 
     * @return {Array<Card>} The cards that were retrieved from the GET request
     */
    getCards(cardsToGet) {
        
    }

    /**
     * @method createQuery 
     * @description Helper method to generate a query based off of set properties
     * @param {String} property 
     * @return The constructed query string
     */
    createQuery(property, queryCount) {
        let endpoint = this.scope['endpoints']['cards'];
        let obj = this.scope['query_param_defaults'];
        for(let prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                endpoint += `${prop}=${obj[prop]}&`;
            }
        }
        return `${endpoint}access_token=${this.authToken}`;
    }

    /**
     * @method loadJSON 
     * @description Loads the local config.json file
     * @method {function} The callback function to handle the get request
     */
    async loadJson() {
        let request = new XMLHttpRequest();
        request.overrideMimeType('application/json');
        request.open('GET', './config.json');
        request.onreadystatechange = function() {
            if(request.readyState === 4 && request.status === 200) {
                this.json = JSON.parse(request.responseText)['api'];
            }
        }.bind(this);
        request.send(null);
    }

    getGroups() {
        this.restCall("GET", "groups");
    }

    async getProducts() {
        let handler = response => {
            let tmpJSON = JSON.parse(response.responseText);
            for(let card in tempJSON['results']) {
                this.currentCards.push(new Card(card.name, card.productId, card.groupId, card.imageUrl));
            }
        }
        await this.restCall("GET", "products", handler, "categoryId=1");
        this.showCaseCards();
    }

    /**
     * @method restCall
     * @description Little helper for generic rest calls 
     * @param {String} method REST method 
     * @param {String} endpoint The endpoint to hit
     * @param {Function} cb The callback handler
     * @param  {...any} query Any sort of parameters that may be needed for the query
     */
    async restCall(method, endpoint, cb, ...query) {
        var data = JSON.stringify(false);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                cb(this.responseText);
            }
        });

        let queries=query.join("&");

        let url = `${this.proxyurl}${this.scope['base']}${this.scope['endpoints'][endpoint]}${query.length>0?`?${queries}`:''}`
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization', `Bearer ${this.authToken}`);
        xhr.send(data);
    }

    showCaseCards() {
        let row;
        for(let i = 0; i < this.currentCards.length; i++) {
            // create section
            if(i%4===0 || (i===this.currentCards.length - 1 && i%4!==0)) {
                if(row)cardDisplay.appendChild(row);
                row = Document.createElement('div');
                row.className = 'flex-container-row';
            }
            let card = Document.createElement('div');
            div.className = 'card';
            row.appendChild(card);
        }
    }
}

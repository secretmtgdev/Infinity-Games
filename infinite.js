import Card from './classes/Card.js';
import CardService from './services/CardService.js';

let cardService = new CardService();


if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setUp);
} else {
    setUp();
}

async function setUp() {
    await cardService.loadJson();
    document.querySelector('#mtg').addEventListener('click', () => {
        cardService.setAuth('TCGPlayer', response => {
            cardService.authToken = JSON.parse(response)['access_token'];
            cardService.getProducts();
        });
    });

    document.querySelector('#hearthstone').addEventListener('click', () => {
        cardService.setAuth('Blizzard', response => {
            cardService.authToken = JSON.parse(response)["access_token"];
            cardService.getCards(16);
        });
    });
}

/**
 * @method queryCards
 * @param {Number} count The number of games to query 
 * @return {Array<Card>} The list of game objects to retur
 */
function queryCards(){
    cardService.getCards(isMobile ? 4 : 16);
}


/**
 * Taken from MDN @https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
 */
function isMobile() {
    var hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) { 
        hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0; 
    } else {
        var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
        if (mQ && mQ.media === "(pointer:coarse)") {
            hasTouchScreen = !!mQ.matches;
        } else if ('orientation' in window) {
            hasTouchScreen = true; // deprecated, but good fallback
        } else {
            // Only as a last resort, fall back to user agent sniffing
            var UA = navigator.userAgent;
            hasTouchScreen = (
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
            );
        }
    }
    return hasTouchScreen;
}
import { config } from './config'
import { TrelloCard } from './Trello/TrelloCard'
import { TrelloBoard } from './Trello/TrelloBoard'

const axios = require('axios')

export class Trellowdown {
    /**
     * Authorize a trello user, and start this partay!
     * @returns {Promise} A promise, with the bool of whether the user is authorized or not.
     */
    run() {
        Trello.authorize({
            type: 'popup',
            name: 'Trellowdown',
            scope: {
                read: 'true',
                write: 'true'
            },
            expiration: 'never',
            success: this.authSuccess,
            error: this.authFailure
        })
    }

    /**
     * Returns an Array of Cards from the Trello API that the user is a member of
     * @returns {Object[]}
     */
    static getUserCards() {
        return new Promise(resolve => {
            Trello.get(`members/me/cards`).then(data => {
                resolve(data)
            })
        })
    }

    static getUserBoards() {
        return new Promise(resolve => {
            Trello.get(`members/me/boards`).then(data => {
                resolve(data)
            })
        })
    }

    /**
     * Get the current users ID
     * @returns {number} The user's ID
     */
    static getUserID() {
        return new Promise(resolve => {
            Trello.get(`members/me`).then(data => {
                resolve(data.id)
            })
        })
    }

    /**
     * Takes an Array of boards, and returns the front end HTML to display
     * @param {Object[]} boards 
     * @returns {string} HTML to be outputted
     */
    static generateHTML(boards) {
        let html = '<div class="trellowdown">'

        boards.forEach(board => {
            let id = (board.id !== null) ? board.id : "none"
            let classes = ["board"]

            if(id == "none") {
                classes.push("break")
            }

            html += `<div class="${classes.join(' ')}" id="${id}">`
                if(id == 'none') html += `<div class="container">`

                html += `<a href="${board.url}" target="_blank"><h2>${board.name}</h2></a>`
                html += '<div class="content">'

                    board.cards.forEach(card => html += TrelloCard.generateCardHTML(card))

                html += '</div>'

                if(id == 'none') html += `</div>`
            html += '</div>'
        })

        html += '</div>'

        return html
    }

    /**
     * Function to run when trello has successfully authorized the user
     */
    authSuccess() {
        const userCards = Trellowdown.getUserCards()
        const userID = Trellowdown.getUserID()
        const OllyID = "5452114aee1bdab3526e47e1"
        
        // Get all the users cards and the user ID, then
        Promise.all([userCards, userID]).then(data => {
            const myID = data[1]
            const OllyID = "5452114aee1bdab3526e47e1"
        
            const addEvents = () => {
                TrelloCard.handleCardEvents(myID)
            }
        
            let cards = data[0]
        
            // Remove any unarchived cards and make sure all cards have user attached
            cards = TrelloCard.filterByClosed(cards)
            cards = TrelloCard.filterByUserID(cards, myID)
            cards = TrelloCard.filterByBoardBlacklist(cards)
        
            // Setup the structure to be used in the App
            let ids = TrelloCard.extractIdsFromCards(cards)
            let emptyBoards = TrelloBoard.generateStructure(ids)
        
            // Add in the cards to each board
            let boards = TrelloBoard.addCards(emptyBoards, cards)
            let finishedBoards = TrelloBoard.addBoardNames(boards)
        
            // Once the list of boards is finished, sort and display mother flipper!
            finishedBoards.then(boards => {
                let sorted = TrelloBoard.sortBoards(boards)
                jQuery("#app").html(Trellowdown.generateHTML(sorted))

                // Add some click events to buttons and such
                addEvents()
            })
        })
    }

    /**
     * Function to run when trello has unsuccessfully authorized the user
     */
    authFailure() {
        throw new Error("Failed auth")
    }
}
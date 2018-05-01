import { config } from './config'
import { TrelloCard } from './Trello/TrelloCard'
import { TrelloBoard } from './Trello/TrelloBoard'
import { QuickAdd } from './Trello/QuickAdd'

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
     * Clears the local storage cache in order to get newly added cards / boards
     */
    static clearCache() {
        localStorage.removeItem("td_organisation_members")
        localStorage.removeItem("td_user_cards")

        location.reload()
    }

    /**
     * Takes an Array of boards, and returns the front end HTML to display
     * @param {Object[]} boards 
     * @returns {string} HTML to be outputted
     */
    static generateHTML(boards) {
        let html = this.generateMenuHTML(boards)

        html += '<div class="trellowdown">'

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

                    board.cards.forEach(card => html += TrelloCard.generateCardHTML(card, board))

                html += '</div>'

                if(id == 'none') html += `</div>`
            html += '</div>'
        })

        html += '</div>'

        return html
    }

    static generateMenuHTML(boards) {
        let html = ""

        html += `<div class="trellowdown-menu">`

            boards.forEach(board => {
                html += `<div class="menu-item">`

                if(board.id == null) {
                    html += `<a href="#none">${board.name}</a>`
                } else {
                    html += `<a href="#${board.id}">${board.name}</a>`
                }
                
                html += `</div>`
            })

        html += `</div>`

        return html
    }

    /**
     * Handle buttons with data-event="clear-cache"
     */
    static handleCacheButtons() {
        const cacheButtons = jQuery(`.button[data-event="clear-cache"]`)

        cacheButtons.on('click', event => {
            event.preventDefault()
            this.clearCache()
        })
    }

    static handleLogoutButton() {
        const logoutButton = jQuery(".button[data-event='logout']")
        
        logoutButton.on('click', event => {
            event.preventDefault()
            localStorage.removeItem('trello_token')

            this.clearCache()
        })
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
                Trellowdown.handleCacheButtons()
                Trellowdown.handleLogoutButton()
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

                // Send boards over to QuickAdd to get that started
                QuickAdd.setup(sorted)

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
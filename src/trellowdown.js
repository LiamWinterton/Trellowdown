import { config } from './config'
import { TrelloCard } from './Trello/TrelloCard'
import { TrelloBoard } from './Trello/TrelloBoard'

const axios = require('axios')

export class Trellowdown {
    /**
     * Authorize a trello user, and get the result in a Promise
     * @returns {Promise} A promise, with the bool of whether the user is authorized or not.
     */
    auth() {
        return new Promise(resolve => {
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

            resolve(Trello.authorized)
        })
    }

    /**
     * Function to run when trello has successfully authorized the user
     */
    authSuccess() {
        
    }

    /**
     * Function to run when trello has unsuccessfully authorized the user
     */
    authFailure() {
        throw new Error("Failed auth")
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
            let boardTimestamp = board.id.substring(0, 8)
            let boardDate = new Date(1000 * parseInt(boardTimestamp, 16));

            html += `<div class="board" id="${board.id}" data-date="${boardDate.getTime()}">`
                html += `<h2>${board.name}</h2>`
                html += '<div class="content">'

                    board.cards.forEach(card => html += TrelloCard.generateCardHTML(card))

                html += '</div>'
            html += '</div>'
        })

        html += '</div>'

        return html
    }
}
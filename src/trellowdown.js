import { config } from './config'

const axios = require('axios')

export class Trellowdown {
    constructor() {
        this.userID = null
    }

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

    authSuccess() {
        
    }

    authFailure() {
        throw new Error("Failed auth")
    }

    static getUserCards() {
        return new Promise(resolve => {
            Trello.get(`members/me/cards`).then(data => {
                resolve(data)
            })
        })
    }

    static getUserID() {
        return new Promise(resolve => {
            Trello.get(`members/me`).then(data => {
                resolve(data.id)
            })
        })
    }

    static generateHTML(boards) {
        let html = '<div class="trellowdown">'

        boards.forEach(board => {
            let boardTimestamp = board.id.substring(0,8)
            let boardDate = new Date(1000*parseInt(boardTimestamp, 16));

            html += '<div class="board" id="' + board.id + '" data-date="' + boardDate.getTime() + '">'
                html += '<h2>' + board.name + '</h2>'

                html += '<div class="content">'

                    board.cards.forEach(card => {

                        let cardTimestamp = card.id.substring(0,8)
                        let cardDate = new Date(1000*parseInt(cardTimestamp, 16));

                        html += '<div class="card" id="' + card.id + '" data-date="' + cardDate.getTime() + '">'
                            html += '<h3><a href="' + card.url + '" target="_blank">' + card.name + '</a></h3>'
                            html += '<div class="more-info">'
                                html += '<ul>'
                                    html += '<li>Created: ' + cardDate + '</li>'
                                html += '</ul>'
                            html += '</div>'
                        html += '</div>'
                    })

                html += '</div>'

            html += '</div>'
        })

        html += '</div>'

        return html
    }
}
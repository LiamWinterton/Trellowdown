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
            html += '<div class="board">'
                html += '<h2>' + board.name + '</h2>'
            html += '</div>'
        })

        html += '</div>'

        return html
    }
}
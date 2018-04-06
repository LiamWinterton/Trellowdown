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
}
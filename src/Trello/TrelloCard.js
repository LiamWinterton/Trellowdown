export class TrelloCard {
    /**
     * Filters a list of boards by whether the board is closed or not
     * @param {Object[]} cardsArray 
     * @returns {Object[]} An Array of Boards that aren't closed
     */
    static filterByClosed(cardsArray) {
        return cardsArray.filter(card => (card.closed) ? false : true)
    }

    /**
     * Filters a list of cards by whether the user is a member or not
     * @param {Object[]} cardsArray Array of cards
     * @param {number} id Current User
     * @returns {Object[]} An Array of cards that the user is a member of
     */
    static filterByUserID(cardsArray, id) {
        return cardsArray.filter(card => (card.idMembers.includes(id)))
    }

    /**
     * Filters a list of cards by whether the board is part of a blacklist
     * @param {Object[]} cardsArray Array of cards
     * @returns {Object[]} An Array of cards that are not in blacklisted boards
     */
    static filterByBoardBlacklist(cardsArray) {
        return cardsArray.filter(card => this.isCardBlacklisted(card))
    }

    /**
     * Checks to see if a card is part of a blacklisted board
     * @param {Object} card The card to check
     * @returns {boolean} True = The card is not blacklisted; False = The card is blacklisted
     */
    static isCardBlacklisted(card) {
        const blacklist = ["565ffdd1db3eb0a207da2941"]
        return blacklist.indexOf(card.idBoard)
    }

    /**
     * Returns an Array of unique Board ID's from an Array of card Objects
     * @param {Object[]} cardsArray
     * @returns {string[]} An Array of unique Board ID's
     */
    static extractIdsFromCards(cardsArray) {
        return [...new Set(cardsArray.map(card => card.idBoard))]
    }

    /**
     * Returns an Array of unique List ID's from an Array of card Objects
     * @param {Object[]} cardsArray
     * @returns {string[]} an Array of unique List ID's
     */
    static extractListIdsFromCards(cardsArray) {
        return [...new Set(cardsArray.map(card => card.idList))]
    }

    /**
     * Removes the HTML element of a card
     * @param {number} cardID ID of the card
     */
    static removeCard(cardID) {
        jQuery(`#${cardID}`).remove()
    }

    /**
     * Posts a comment to a Trello card, and wipes that comments value.
     * @param {number} cardID CardID
     * @param {string} comment Comment to be posted
     */
    static postComment(cardID, comment) {
        return Trello.post(`cards/${cardID}/actions/comments`, { text: comment }).then(() => {
            jQuery(`.card#${cardID} textarea`).val('');
        })
    }

    /**
     * Removes user from a card
     * @param {number} userID ID of the current user
     * @param {number} cardID ID of the card
     */
    static removeFromCard(userID, cardID) {
        const removeURL = `cards/${cardID}/idMembers/${userID}`

        jQuery(`#${cardID}`).css({ opacity: 0.7 })

        Trello.delete(removeURL, { idMember: userID }).then(() => this.removeCard(cardID))
    }

    /**
     * Adds superuser to the card
     * @param {number} cardID ID of the card
     */
    static addOllyToCard(cardID) {
        const addURL = `cards/${cardID}/idMembers`
        const OllyID = "5452114aee1bdab3526e47e1"

        return Trello.post(addURL, { value: OllyID })
    }

    /**
     * Removes yourself from a card via the API, and adds the superuser
     * @param {number} userID The current user ID
     */
    static handleCardEvents(userID) {
        // Button click
        jQuery("#app .trellowdown .board .card").each((index, card) => {
            const flagButton = jQuery(card).find('.actions .button')

            jQuery(flagButton).on('click', event => {
                const cardID = jQuery(card).attr('id')
                const comment = jQuery(card).find('textarea').val()

                if(comment !== '') {
                    this.addOllyToCard(cardID)
                        .then(this.postComment(cardID, comment))
                        .then(this.removeFromCard(userID, cardID))
                } else {
                    this.addOllyToCard(cardID)
                        .then(this.removeFromCard(userID, cardID))
                }
            })
        })
    }

    /**
     * Generates the HTML for a given card.
     * @param {Object} card {Object} - The Card object
     * @returns {string} A div.card containing all the relevent card information
     */
    static generateCardHTML(card) {
        let cardTimestamp = card.id.substring(0, 8)
        let cardDate = new Date(1000 * parseInt(cardTimestamp, 16));
        let readable = `${cardDate.getDate()}/${cardDate.getMonth() + 1}/${cardDate.getFullYear()}`
        let html = ''

        html += `<div class="card" id="${card.id}" data-date="${cardDate.getTime()}">`
            html += `<h3><a href="${card.url}" target="_blank">${card.name}</a></h3>`

            html += '<div class="more-info">'
                html += '<ul>'
                    html += `<li>Created: ${readable}</li>`
                    if(card.due !== null) {
                        html += `<li>${Date(card.due)}</li>`
                    }
                html += '</ul>'
            html += '</div>'

            html += '<div class="buttons">'
                html += '<div class="actions">'
                    html += '<div class="comment">'
                        html += '<textarea name="comment" style="resize: none;"></textarea>'
                    html += '</div>'
                    html += `<a class="button button-secondary">Notify El Número Uno</a>`
                html += '</div>'
            html += '</div>'

        html += '</div>'

        return html
    }
}
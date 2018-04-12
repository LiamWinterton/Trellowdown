export class TrelloCard {
    static filterByClosed(cardsArray) {
        return cardsArray.filter(card => (card.closed) ? false : true)
    }

    static filterByUserID(cardsArray, id) {
        return cardsArray.filter(card => (card.idMembers.includes(id)))
    }

    static extractIdsFromCards(cardsArray) {
        return [...new Set(cardsArray.map(card => card.idBoard))]
    }

    static extractListIdsFromCards(cardsArray) {
        return [...new Set(cardsArray.map(card => card.idList))]
    }

    static filterByListName(cardsArray, name) {
        return new Promise(resolve => {
            let listIds = this.extractListIdsFromCards(cardsArray)
            let lists = []
            let badIds = []

            listIds.forEach(id => {
                Trello.get(`list/${id}`).then(data => {
                    lists.push(data)
                })
            })

            lists.forEach(list => {
                if(list.name == "Done") {
                    badIds.push(list.id)
                }
            })

            console.log(lists)
            console.log(badIds)

            // resolve(newCards)
        })
    }

    static removeCard(cardID) {
        jQuery(`#${cardID}`).remove()
    }

    static removeFromCard(userID, cardID) {
        const removeURL = `cards/${cardID}/idMembers/${userID}`

        jQuery(`#${cardID}`).css({ opacity: 0.7 })

        Trello.delete(removeURL, { idMember: userID }).then(() => this.removeCard(cardID))
    }

    static addOllyToCard(cardID) {
        const addURL = `cards/${cardID}/idMembers`
        const OllyID = "5452114aee1bdab3526e47e1"

        return Trello.post(addURL, { value: OllyID })
    }

    /**
     * Removes you from the card, and adds Olly.
     */
    static handleCardFlag(userID) {
        jQuery("#app .trellowdown .board .card").each((index, card) => {
            const flagButton = jQuery(card).find('.buttons .flag-as-done')

            jQuery(flagButton).on('click', event => {
                const cardID = jQuery(card).attr('id')

                event.preventDefault()
                this.addOllyToCard(cardID)
                .then(this.removeFromCard(userID, cardID))
            })
        })
    }

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
                    // html += `<li>Members: ${card.idMembers}</li>`
                html += '</ul>'
            html += '</div>'
            
            html += '<div class="buttons">'
                html += `<a class="button button-secondary flag-as-done">Flag as done</a>`
            html += '</div>'

        html += '</div>'

        return html
    }
}
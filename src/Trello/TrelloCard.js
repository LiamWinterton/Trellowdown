export class TrelloCard {
    static filterByClosed(cardsArray) {
        return cardsArray.filter(card => (card.closed) ? false : true)
    }

    static filterByUserID(cardsArray, id) {
        return cardsArray.filter(card => (card.idMembers.includes(id)))
    }

    static organizeCardsByBoard(cardsArray) {
        let boards = []

        cardsArray.map(card => {
            // If Board has not been used yet
            if(!boards.hasOwnProperty(card.idBoard)) {
                boards[card.idBoard] = {}
                boards[card.idBoard].lists = []
            }

            // If List has not been used yet
            if(!boards[card.idBoard].lists.includes(card.idList)) {
                boards[card.idBoard].lists[card.idList] = []
            }
            
            // If its been initizialised, just push the card
            boards[card.idBoard].lists[card.idList].push(card)
        })

        return boards
    }
}
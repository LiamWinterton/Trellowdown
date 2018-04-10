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
}
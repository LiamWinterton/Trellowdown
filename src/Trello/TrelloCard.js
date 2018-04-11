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
}
export class TrelloBoard {
    static generateStructure(ids) {
        let boards = []

        ids.forEach(id => {
            boards.push({
                id: id,
                lists: [],
                cards: []
            })
        })

        return boards
    }

    static addBoardNames(boards) {
        return new Promise(resolve => {
            let newBoards = [ ...boards ]

            const added = newBoards.map(board => {
                return Trello.get(`boards/${board.id}`).then(data => {
                    board.name = data.name
                    board.url = data.url
                })
            })

            Promise.all(added).then(() => {
                resolve(newBoards)
            })
        })
    }

    static addCards(emptyBoards, cards) {
        let newBoards = [ ...emptyBoards ]

        // Loop over each board
        newBoards.forEach(board => {
            // Add each relevant card to the board
            let matches = cards.filter(card => card.idBoard == board.id)

            matches.forEach(card => {
                board.cards.push(card)
            })
            
            // And add each list id to the board also
            let listIds = [...new Set(matches.map(card => card.idList))]

            listIds.map(id => {
                board.lists.push(id)
            })
        })

        return newBoards
    }

    static sortBoards(boards) {
        let newBoards = [ ...boards ]

        newBoards.sort((a, b) => {
            const aName = a.name.toUpperCase()
            const bName = b.name.toUpperCase()

            return (aName > bName) ? 1 : -1
        })

        return newBoards
    }
}
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

            newBoards.forEach(board => {
                Trello.get(`boards/${board.id}`).then(data => {
                    board.name = data.name
                })
            })

            resolve(newBoards)
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
}
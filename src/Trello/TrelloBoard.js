export class TrelloBoard {
    static generateStructure(ids) {
        let boards = [
            {
                id: null,
                lists: [],
                cards: [],
                name: "Urgent"
            }
        ]

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
                if(board.id !== null) {
                    return Trello.get(`boards/${board.id}`).then(data => {
                        board.name = data.name
                        board.url = data.url
                    })
                }
            })

            Promise.all(added).then(() => {
                resolve(newBoards)
            })
        })
    }

    static addCards(emptyBoards, cards) {
        let newBoards = [ ...emptyBoards ]
        console.log(newBoards)

        // Loop over each board
        newBoards.forEach(board => {
            // Add each relevant card to the board
            let matches = cards.filter(card => card.idBoard == board.id)

            // Sort matched cards by date and puuuuuuuuuuuush
            matches = matches.sort((a, b) => {
                let aCardTimestamp = a.id.substring(0, 8)
                let aCardDate = new Date(1000 * parseInt(aCardTimestamp, 16));
                let aTime = aCardDate.getTime()
                
                let bCardTimestamp = b.id.substring(0, 8)
                let bCardDate = new Date(1000 * parseInt(bCardTimestamp, 16));
                let bTime = bCardDate.getTime()
    
                aTime - bTime
            })

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
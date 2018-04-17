export class TrelloBoard {
    static generateStructure(ids) {
        let boards = [
            {
                id: null,
                lists: [],
                cards: [],
                name: "Priority"
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
        let priorityCards = []

        // Loop over each board
        newBoards.forEach(board => {
            let matches = cards.filter(card => (card.idBoard == board.id))
            let priorityMatches = matches.filter(card => (card.due !== null && card.dueComplete == false))

            priorityMatches.forEach(card => {
                priorityCards.push(card)
            })

            // Then do the same for non priority cards
            let normalMatches = matches.filter(card => (card.due == null))

            // Sort matched cards by date created
            normalMatches = normalMatches.sort((a, b) => {
                let aCardTimestamp = a.id.substring(0, 8)
                let aCardDate = new Date(1000 * parseInt(aCardTimestamp, 16));
                let aTime = aCardDate.getTime()
                
                let bCardTimestamp = b.id.substring(0, 8)
                let bCardDate = new Date(1000 * parseInt(bCardTimestamp, 16));
                let bTime = bCardDate.getTime()
    
                return aTime - bTime
            })

            normalMatches.forEach(card => {
                board.cards.push(card)
            })
            
            // And add each list id to the board also
            let listIds = [...new Set(normalMatches.map(card => card.idList))]

            listIds.map(id => {
                board.lists.push(id)
            })
        })

        // Sort priorityMatches by due date
        priorityCards = priorityCards.sort((a, b) => {
            let aTime = Date.parse(a.due)
            let bTime = Date.parse(b.due)

            return aTime - bTime
        })

        priorityCards.forEach(card => {
            newBoards[0].cards.push(card)
        })
        
        return newBoards
    }

    static sortBoards(boards) {
        let newBoards = [ ...boards ]

        // Remove boards with no cards
        newBoards = newBoards.filter(board => (board.cards.length !== 0))

        // Take out the priority board before sorting
        let priorityBoard = newBoards.splice(0, 1)

        newBoards.sort((a, b) => {
            const aName = a.name.toUpperCase()
            const bName = b.name.toUpperCase()

            return (aName > bName) ? 1 : -1
        })

        // Add priority back in, but at the beginning
        newBoards.unshift(priorityBoard[0])

        return newBoards
    }
}
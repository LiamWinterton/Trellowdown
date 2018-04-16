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
        let urgentCards = []

        // Loop over each board
        newBoards.forEach(board => {
            let matches = cards.filter(card => (card.idBoard == board.id))
            let urgentMatches = matches.filter(card => (card.due !== null && card.dueComplete == false))

            urgentMatches.forEach(card => {
                urgentCards.push(card)
            })

            // Then do the same for non urgent cards
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

        // Sort urgentMatches by due date
        urgentCards = urgentCards.sort((a, b) => {
            let aTime = Date.parse(a.due)
            let bTime = Date.parse(b.due)

            return aTime - bTime
        })

        urgentCards.forEach(card => {
            newBoards[0].cards.push(card)
        })
        
        return newBoards
    }

    static sortBoards(boards) {
        let newBoards = [ ...boards ]

        // Remove boards with no cards
        newBoards = newBoards.filter(board => (board.cards.length !== 0))

        // Take out the Urgent board before sorting
        let urgentBoard = newBoards.splice(0, 1)

        newBoards.sort((a, b) => {
            const aName = a.name.toUpperCase()
            const bName = b.name.toUpperCase()

            return (aName > bName) ? 1 : -1
        })

        // Add urgent back in, but at the beginning
        newBoards.unshift(urgentBoard[0])

        return newBoards
    }
}
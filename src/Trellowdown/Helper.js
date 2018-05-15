import Api from './API'

export default class TrellowdownHelper {
    static addCards(emptyBoards, cards) {
        let newBoards = [ ...emptyBoards ]
        let priorityCards = []

        // Loop over each board
        newBoards.forEach(board => {
            let matches = cards.filter(card => (card.idBoard === board.id))
            let priorityMatches = matches.filter(card => (card.due !== null && card.dueComplete === false))

            priorityMatches.forEach(card => {
                priorityCards.push(card)
            })

            // Then do the same for non priority cards
            let normalMatches = matches.filter(card => (card.due === null))

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

            listIds.map(id => board.lists.push(id))
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

    static async addBoardNames(boards) {
        return new Promise(resolve => {
            let newBoards = [ ...boards ]
            // eslint-disable-next-line
            const added = newBoards.map(board => {
                if(board.id !== null) {
                    return Api.getBoard(board.id).then(data => {
                        board.name = data.name
                        board.url = data.url
                    })
                } else {
                    board.cards.map(card => {
                        return Api.getBoard(card.idBoard).then(data => {
                            card.boardName = data.name
                        })
                    })
                }
            })

            Promise.all(added).then(() => {
                resolve(newBoards)
            })
        })
    }

    static sortBoards(boards) {
        // Remove boards with no cards
        boards = boards.filter(board => (board.cards.length !== 0))

        // Take out the priority board before sorting
        let priorityBoard = boards.splice(0, 1)

        boards.sort((a, b) => {
            const aName = a.name.toUpperCase()
            const bName = b.name.toUpperCase()

            return (aName > bName) ? 1 : -1
        })

        // Add priority back in, but at the beginning
        boards.unshift(priorityBoard[0])

        return boards
    }
}
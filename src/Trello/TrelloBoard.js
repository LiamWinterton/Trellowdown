export class TrelloBoard {
    /**
     * Generates the initial boards Object that the project uses as a foundation
     * @param {number[]} ids 
     */
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

    /**
     * Adds
     * @param {number} memberID ID of the user
     * @param {number} boardID ID of the board
     * @param {string} userType Default: admin
     */
    static addToBoard(memberID, boardID, userType="admin") {
        return Trello.put(`boards/${boardID}/members/${memberID}`, { type: userType })
    }

    /**
     * Takes an array of boards, and adds the name of that board
     * @param {Object[]} boards 
     */
    static addBoardNames(boards) {
        return new Promise(resolve => {
            let newBoards = [ ...boards ]

            const added = newBoards.map(board => {
                if(board.id !== null) {
                    return Trello.get(`boards/${board.id}`).then(data => {
                        board.name = data.name
                        board.url = data.url
                    })
                } else {
                    board.cards.map(card => {
                        return Trello.get(`boards/${card.idBoard}`).then(data => {
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

    /**
     * Takes empty Boards structure and adds cards in to the appropriate board array.
     * @param {Object[]} emptyBoards 
     * @param {Object[]} cards 
     */
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

    /**
     * Sorts the boards based on board name (excludes priority board)
     * @param {Objects[]} boards 
     */
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

    /**
     * Determines whether a user is a member of a board
     * @param {number} memberID 
     * @param {number} boardID
     * @returns {boolean}
     */
    static isMemberOnBoard(memberID, boardID) {
        return new Promise((resolve, reject) => {
            const getBoardMembers = Trello.get(`boards/${boardID}/members`)

            getBoardMembers.then(memArray => {
                const member = memArray.find(member => member.id == memberID)

                if(member) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            })
        })
    }
}
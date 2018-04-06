export class TrelloBoard {
    static filterBoardsByRelevance(boardsArray) {
        return new Promise(resolve => {
            // Loop over each board
            let ids = Object.keys(boardsArray)
    
            ids.map(id => {
                Trello.get(`board/${id}`).then(data => {
                    resolve(data)
                })
            })
        })
    }
}
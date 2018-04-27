export class TrelloList {
    // GET methods
    /**
     * Get the List object of a specified List
     * @param {string} listID
     * @returns {Promise} Promise containing the List Object
     */
    static getList(listID) {
        return Trello.get(`lists/${listID}`)
    }

    /**
     * Gets all List objects from a given board
     * @param {string} boardID ID of the board to retrieve the lists from
     * @returns {Promise} Promise containing an array of List Objects
     */
    static getListsFromBoard(boardID) {
        return Trello.get(`boards/${boardID}/lists`)
    }

    // POST methods
    /**
     * Adds a list to a board
     * @param {string} boardID 
     * @param {string} listName 
     * @param {string} listPosition
     * @returns {Promise} Promise containing the new List Object
     */
    static addListToBoard(boardID, listName, listPosition="top") {
        return Trello.post(`boards/${boardID}/lists`, { name: listName, pos: listPosition })
    }
}
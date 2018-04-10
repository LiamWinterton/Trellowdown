// Imports
import "./css/stylesheet.sass"
import { Trellowdown } from './trellowdown'
import { TrelloCard } from './Trello/TrelloCard'
import { TrelloBoard } from './Trello/TrelloBoard'

jQuery(document).ready(function() {

// Base code
const trellowdown = new Trellowdown()

    trellowdown.auth().then(isAuthed => {
        if(isAuthed) {
            const userCards = Trellowdown.getUserCards()
            const userID = Trellowdown.getUserID()

            // Get all the users cards and the user ID, then
            Promise.all([userCards, userID]).then(data => {
                let cards = data[0]
                let id = data[1]
                let boards = []

                // Remove any unarchived cards and make sure all cards have user attached
                cards = TrelloCard.filterByClosed(cards)
                cards = TrelloCard.filterByUserID(cards, id)

                // Setup the structure to be used in the App
                let ids = TrelloCard.extractIdsFromCards(cards)
                let emptyBoards = TrelloBoard.generateStructure(ids)

                // Add in the cards to each board
                boards = TrelloBoard.addCards(emptyBoards, cards)
                let finishedBoards = TrelloBoard.addBoardNames(boards)

                finishedBoards.then(boards => {
                    jQuery("#app").html(Trellowdown.generateHTML(boards))
                })
            })
        }
    })

})
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
            const OllyID = "5452114aee1bdab3526e47e1"

            // Get all the users cards and the user ID, then
            Promise.all([userCards, userID]).then(data => {
                const id = data[1]
                const OllyID = "5452114aee1bdab3526e47e1"

                const addEvents = () => {
                    TrelloCard.handleCardFlag(id)
                }

                let cards = data[0]

                // Remove any unarchived cards and make sure all cards have user attached
                cards = TrelloCard.filterByClosed(cards)
                cards = TrelloCard.filterByUserID(cards, id)
                cards = TrelloCard.filterByBoardBlacklist(cards)

                // Setup the structure to be used in the App
                let ids = TrelloCard.extractIdsFromCards(cards)
                let emptyBoards = TrelloBoard.generateStructure(ids)

                // Add in the cards to each board
                let boards = TrelloBoard.addCards(emptyBoards, cards)
                let finishedBoards = TrelloBoard.addBoardNames(boards)

                // Once the list of boards is finished, sort and display mother flipper!
                finishedBoards.then(boards => {
                    let sorted = TrelloBoard.sortBoards(boards)
                    jQuery("#app").html(Trellowdown.generateHTML(sorted))
                    
                    // Add some click events to buttons and such
                    addEvents()
                })
            })
        }
    })

})
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

        const printCards = cards => {
            
            cards.map(card => {
                jQuery("#root").append(card.name + "<br />")
            })
        }

        // Get all the users cards and the user ID, then
        Promise.all([userCards, userID]).then(data => {
            let cards = data[0]
            let id = data[1]

            // Remove any unarchived cards and make sure all cards have user attached
            cards = TrelloCard.filterByClosed(cards)
            cards = TrelloCard.filterByUserID(cards, id)

            printCards(cards)
    
            // Setup the structure to be used in the App
            let boards = TrelloCard.organizeCardsByBoard(cards)
            boards = TrelloBoard.filterBoardsByRelevance(boards)

            
        })
    }
})

})
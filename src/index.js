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

        const printBoards = cards => {
            jQuery("#root").html(cards[0].name)
        }

        // Get all the users cards and the user ID, then
        Promise.all([userCards, userID]).then(data => {
            let cards = data[0]
            let id = data[1]

            // Remove any unarchived cards and make sure all cards have user attached
            cards = TrelloCard.filterByClosed(cards)
            cards = TrelloCard.filterByUserID(cards, id)

            // printBoards(cards)
    
            // Setup the structure to be used in the App
            let boards = TrelloCard.organizeCardsByBoard(cards)
            TrelloBoard.filterBoardsByRelevance(boards).then(boards => {
                console.log(boards)
            })
        })
    }
})

})
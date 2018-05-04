// Imports
import "./css/stylesheet.sass"
import { Trellowdown } from './trellowdown'
import { TrelloCard } from './Trello/TrelloCard'
import { TrelloBoard } from './Trello/TrelloBoard'

jQuery(document).ready(function() {
    // Base code
    const trellowdown = new Trellowdown()

    trellowdown.run()

    // Add JS for menu toggle
    jQuery("#menu-toggle").on('click', event => {
        jQuery(".menu-container").toggleClass("active");
        jQuery("#menu-toggle").toggleClass("active")
        jQuery("#menu-toggle .burger").toggleClass("is-active")
    })
})
import { TrelloOrganisation } from './TrelloOrganisation'
import { TrelloBoard } from './TrelloBoard'
import { TrelloList } from './TrelloList'
import { TrelloCard } from './TrelloCard'

export class QuickAdd {
    static setup(boards) {
        // Add boards and lists to selects
        this.handleSelects(boards)

        // Add Members icons to organisation
        // TrelloOrganisation.getCurrentOrganisation()
        //     .then(id => TrelloOrganisation.getMembers(id))
        //     .then(members => {
        //         console.log(members)
        //     })
    }

    static handleSelects(boards) {
        const boardSelect = this.getBoardSelect()
        const listSelect = this.getListSelect()
        const addButton = jQuery(`header #quick-add .buttons .button`)

        // Add board options into select
        boards.forEach(board => {
            if(board.name !== "Priority") {
                boardSelect.append(`<option value="${board.id}">${board.name}</option>`)
            }
        })

        // Remove Priority board as it doesn't exist and will cause errors
        jQuery(`header #quick-add select option[value="0"]`).remove()

        // On board select change, get lists for board
        boardSelect.on('change', () => {
            this.onBoardSelectChange()
        })

        // On button click, add card for board/list using title / description
        addButton.on('click', event => {
            event.preventDefault()
            this.handleButtonClick()
        })

        this.onBoardSelectChange()
        this.clearInputs()
    }

    static handleButtonClick() {
        const boardID = this.getSelectedBoardID()
        const listID = this.getSelectedListID()

        TrelloCard.createCard({
            name: this.getCardTitle(),
            desc: this.getCardDescription(),
            pos: "top",
            idList: this.getSelectedListID(),
        }).then(() => {
            this.clearInputs()
        })
    }

    static onBoardSelectChange() {
        const boardID = this.getSelectedBoardID()

        const lists = TrelloList.getListsFromBoard(boardID)
            .then(lists => {
                // First wipe current options
                this.getListSelect().html('')

                // Then add in the lists
                lists.forEach(list => {
                    const listSelect = this.getListSelect()
                    listSelect.append(`<option value="${list.id}">${list.name}</option>`)
                })
            })
    }

    static getCardTitle() {
        return jQuery(`header #quick-add input[name="title"]`).val()
    }

    static getCardDescription() {
        return jQuery(`header #quick-add input[name="description"]`).val()
    }

    static getBoardSelect() {
        return jQuery(`header #quick-add select[name='trello-boards']`)
    }

    static getListSelect() {
        return jQuery(`header #quick-add select[name='trello-lists']`)
    }

    static getSelectedBoardID() {
        return this.getBoardSelect().val()
    }
    
    static getSelectedListID() {
        return this.getListSelect().val()
    }

    static clearInputs() {
        jQuery("header #quick-add input[type='text']").each((index, input) => {
            jQuery(input).val("")
        })
    }
}
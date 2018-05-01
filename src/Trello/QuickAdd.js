import { Trellowdown } from '../trellowdown'
import { TrelloOrganisation } from './TrelloOrganisation'
import { TrelloBoard } from './TrelloBoard'
import { TrelloList } from './TrelloList'
import { TrelloCard } from './TrelloCard'

export class QuickAdd {
    static setup(boards) {
        // Add boards and lists to selects
        this.handleSelects(boards)

        // Add Members icons to organisation
        TrelloOrganisation.getCurrentOrganisation()
            .then(id => TrelloOrganisation.getMembers(id))
            .then(members => {
                const membersHTML = this.generateMembersHTML(members)
                jQuery("header #quick-add .members").append(membersHTML)
            })
    }

    static handleSelects(boards) {
        const boardSelect = this.getBoardSelect()
        const listSelect = this.getListSelect()
        const addButton = jQuery(`header #quick-add .buttons .button[data-event="add"]`)
        const cacheButton = jQuery(`header #quick-add .buttons .button[data-event="clear-cache"]`)

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

        cacheButton.on('click', event => {
            event.preventDefault()
            Trellowdown.clearCache()
        })

        this.onBoardSelectChange()
        this.clearInputs()
    }

    static handleButtonClick() {
        const boardID = this.getSelectedBoardID()
        const listID = this.getSelectedListID()

        const card = {
            name: this.getCardTitle(),
            desc: this.getCardDescription(),
            pos: "top",
            idList: this.getSelectedListID(),
        }

        if(jQuery("input[name=selected-member]:checked", "#quick-add").val()) {
            card.idMembers = jQuery("input[name=selected-member]:checked", "#quick-add").val()
        }

        TrelloCard.createCard(card).then(() => {
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

    static generateMembersHTML(members) {
        let html = ""

        html += `<div class="member-icons">`

            members.forEach(member => {
                html += `<label>`
                    html += `<input type="radio" name="selected-member" value="${member.id}" class="member-icon" />`
                    
                    if(member.avatarHash !== null && member.avatarHash !== "") {
                        html += `<img src="${member.avatarUrl}/30.png" />`
                    } else {
                        html += `<span>${member.initials}</span>`
                    }

                html += `</label>`
            })

        html += `</div>`

        return html
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
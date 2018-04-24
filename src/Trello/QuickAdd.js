import { TrelloOrganisation } from './TrelloOrganisation'
import { TrelloList } from './TrelloList'

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
        const selector = "header #quick-add"
        const boardSelect = jQuery(`${selector} select[name='trello-boards']`)
        const listSelect = jQuery(`${selector} select[name='trello-lists']`)

        boards.forEach(board => {
            if(board.name !== "Priority") {
                boardSelect.append(`<option value="${board.id}">${board.name}</option>`)
            }
        })

        jQuery(`${selector} select option[value="0"]`).remove()

        jQuery(boardSelect).change(this.onBoardSelectChange())
    }

    static handleButton() {

    }

    static onBoardSelectChange() {
        const selector = "header #quick-add"
        const boardSelect = jQuery(`${selector} select[name='trello-boards']`)
        const boardID = boardSelect.val()

        const lists = TrelloList.getListsFromBoard(boardID)
            .then(lists => {
                console.log(lists)

                lists.forEach(list => {
                    const listSelect = jQuery(`${selector} select[name='trello-lists']`)
                    listSelect.append(`<option value="${list.id}">${list.name}</option>`)
                })
            })
    }
}
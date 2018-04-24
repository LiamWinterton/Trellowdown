import { TrelloOrganisation } from './TrelloOrganisation'

export class QuickAdd {
    static setup() {
        // Add boards and lists to selects

        // Add Members icons to organisation
        TrelloOrganisation.getCurrentOrganisation()
            .then(id => TrelloOrganisation.getMembers(id))
            .then(members => {
                console.log(members)
            })
    }

    static handleSelects(boards) {
        const boardSelect = jQuery("header #quick-add select[name='trello-boards']")
        const listSelect = jQuery("header #quick-add select[name='trello-lists']")
    }

    static handleButton() {

    }
}
export class TrelloMember {
    static getMembersInOrganisation(organisationID) {
        return Trello.get(`organizations/${organisationID}/members`)
    }
}
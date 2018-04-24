export class TrelloOrganisation {
    static getCurrentOrganisation() {
        return new Promise((resolve, reject) => {
            Trello.get(`members/me`)
                .then(me => resolve(me.idOrganizations[0]))
        })
    }

    static getMembers(organisationID) {
        return Trello.get(`organization/${organisationID}/members`)
    }
}
import { TrelloMember } from './TrelloMember'

export class TrelloOrganisation {
    static getCurrentOrganisation() {
        return new Promise((resolve, reject) => {
            Trello.get(`members/me`).then(me => {
                resolve(me.idOrganizations[0])
            })
        })
    }

    static getRealMembers(members) {
        return new Promise(resolve => {
            const newMembers = []

            const added = members.map(member => {
                return TrelloMember.getMember(member.id).then(member => {
                    newMembers.push(member)
                })
            })

            Promise.all(added).then(() => {
                resolve(newMembers)
            })
        })
    }

    static getMembers(organisationID) {
        return new Promise((resolve, reject) => {
            if(localStorage.getItem('td_organisation_members')) {
                resolve(JSON.parse(localStorage.getItem('td_organisation_members')))
            } else {
                const members = Trello.get(`organizations/${organisationID}/members`)

                members.then(members => {
                    this.getRealMembers(members).then(members => {
                        localStorage.setItem('td_organisation_members', JSON.stringify(members))
                        resolve(members)
                    })
                })
            }
        })
    }
}
export class TrelloMember {
    static getMember(id) {
        return new Promise(resolve => {
            Trello.get(`members/${id}`).then(member => {
                resolve(member)
            })
        })
    }
}
export class TrelloMember {
    static getMember(id) {
        return new Promise(resolve => {
            Trello.get(`members/${id}`).then(member => {
                resolve(member)
            })
        })
    }

    static generateMembersHTML(members, name="selected-member") {
        let html = ""

        html += `<div class="member-icons">`

            members.forEach(member => {
                html += `<label>`
                    html += `<input type="radio" name="${name}" value="${member.id}" class="member-icon" />`
                    
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
}
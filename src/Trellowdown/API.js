// import axios from "axios";
const Trello = window.Trello

class TrelloApi {
    // Organization

    static getCurrentOrganization() {
        return new Promise((resolve, reject) => {
            Trello.get(`members/me`).then(me => {
                resolve(me.idOrganizations[0])
            })
        })
    }

    static getOrganizationMembers(organizationID) {
        return new Promise((resolve, reject) => {
            if(localStorage.getItem('td_organization_members')) {
                resolve(JSON.parse(localStorage.getItem('td_organization_members')))
            } else {
                const members = Trello.get(`organizations/${organizationID}/members`)

                members.then(members => {
                    this.getRealMembers(members).then(members => {
                        localStorage.setItem('td_organization_members', JSON.stringify(members))
                        resolve(members)
                    })
                })
            }
        })
    }

        // Members

        static getMember(id) {
            return new Promise(resolve => {
                Trello.get(`members/${id}`).then(member => {
                    resolve(member)
                })
            })
        }

        static getRealMembers(members) {
            return new Promise(resolve => {
                const newMembers = []
    
                const added = members.map(member => {
                    return this.getMember(member.id).then(member => {
                        newMembers.push(member)
                    })
                })
    
                Promise.all(added).then(() => {
                    resolve(newMembers)
                })
            })
        }
    
        static addMemberToCard(memberID, cardID, boardID) {
            return new Promise(resolve => {
                const ready = new Promise(async resolve => {
                    const isOnBoard = await this.isMemberOnboard(memberID, boardID)
    
                    if(!isOnBoard) {
                        // If not on board, add to board first.
                        resolve(this.addMemberToBoard(memberID, boardID))
                    } else {
                        resolve()
                    }
                })
                
                ready.then(() => {
                    resolve(Trello.post(`cards/${cardID}/idMembers`, { value: memberID }))
                })
            })
        }
    
        static removeMemberFromCard(memberID, cardID) {
            return new Promise(resolve => {
                return Trello.delete(`cards/${cardID}/idMembers/${memberID}`, { idMember: memberID })
            })
        }
    
        static isMemberOnboard(memberID, boardID) {
            return new Promise(async resolve => {
                const members = await this.getBoardMembers(boardID)
                const found = members.find(member => member.id === memberID)
    
                if(found) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            })
        }
    
        static addMemberToBoard(memberID, boardID, userType = "normal") {
            return new Promise(resolve => {
                Trello.put(`boards/${boardID}/members/${memberID}`, { type: userType })
            })
        }

    // User

    static getUserID() {
        return new Promise(resolve => {
            Trello.get(`members/me`).then(data => {
                resolve(data.id)
            })
        })
    }

    static getUserCards(id = false) {
        return new Promise(resolve => {
            if(id) {
                Trello.get(`members/${id}/cards`).then(data => {
                    resolve(data)
                })
            } else {
                Trello.get(`members/me/cards`).then(data => {
                    resolve(data)
                })
            }
        })
    }

    // Boards

    static getBoard(id) {
        return new Promise(resolve => {
            Trello.get(`boards/${id}`).then(data => {
                resolve(data)
            })
        })
    }

    static getBoardMembers(id) {
        return new Promise(resolve => {
            Trello.get(`boards/${id}/members`).then(data => {
                resolve(data)
            })
        })
    }

    // Lists

    static getListsFromBoard(boardID) {
        return new Promise(resolve => {
            Trello.get(`boards/${boardID}/lists`).then(data => {
                resolve(data)
            })
        })
    }

    // Cards

    static createCard(card) {
        return new Promise(resolve => {
            Trello.post(`cards`, card).then(response => {
                if(card.idMember) {
                    resolve(this.addMemberToCard(card.idMembers, response.id, response.idBoard))
                } else {
                    resolve(true)
                }
            })
        })
    }

    // Comments

    static addCommentToCard(cardID, comment) {
        return new Promise(resolve => {
            if(comment !== "") {
                Trello.post(`cards/${cardID}/actions/comments`, { text: comment }).then(() => {
                    resolve(true)
                })
            } else {
                resolve(true)
            }
        })
    }
}

export default TrelloApi;
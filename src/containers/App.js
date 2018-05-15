import React, { Component, Fragment } from 'react'
import Header from "../components/header";
import Footer from "../components/footer"

import Api from '../Trellowdown/API'
import TrellowdownHelper from '../Trellowdown/Helper'
import Trellowdown from './Trellowdown';

import "../assets/sass/stylesheet.sass"

const Trello = window.Trello

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedInUser: null,
            userID: null,
            superUserID: "563383f6fcf3466124297d87",
            selectedMember: null,
            members: null,
            options: [
                {
                    name: "Navigation",
                    options: [
                        {
                            name: "Show Navigation Menu",
                            slug: "td_navigation_toggle",
                            type: "checkbox",
                            value: this.getOption("td_navigation_toggle"),
                            default: false,
                            protected: false
                        }
                    ]
                },
                {
                    name: "Quick Add",
                    options: [
                        {
                            name: "Show Quick Add Menu",
                            slug: "td_quick_add_toggle",
                            type: "checkbox",
                            value: this.getOption("td_quick_add_toggle"),
                            default: true,
                            protected: false
                        }
                    ]
                }
            ]
        }

        this.handleNotifyButton = this.handleNotifyButton.bind(this)
        this.removeCardFromState = this.removeCardFromState.bind(this)
        this.handleOptionChange = this.handleOptionChange.bind(this)
        this.handleUserChange = this.handleUserChange.bind(this)
        App.setup = App.setup.bind(this)
    }

    render() {
        return (
            <Fragment>
                <Header
                    boards={this.state.boards}
                    members={this.state.members}
                    isSuperUser={this.state.superUserID === this.state.loggedInUser}
                    options={this.state.options}
                    showQuickAdd={this.getOption("td_quick_add_toggle")}
                    showNavigationMenu={this.getOption("td_navigation_toggle")}
                    handleOptionChange={this.handleOptionChange}
                    handleUserChange={this.handleUserChange}
                />
                <Trellowdown
                    boards={this.state.boards}
                    id={this.state.userID}
                    notifyButtonClick={this.handleNotifyButton}
                />
                <Footer />
            </Fragment>
        )
    }

    setOption(slug, value) {
        localStorage.setItem(slug, value)
    }

    getOption(slug) {
        if(localStorage.getItem(slug) !== null) {
            return localStorage.getItem(slug)
        } else {
            return null
        }
    }

    handleOptionChange(optionName, optionValue) {
        let options = [ ...this.state.options ]

        options.forEach(group => {
            // Loop over each option group
            group.options.forEach(option => {
                // Loop over that groups options until we find the option we're looking for
                if(option.slug === optionName) {
                    // Set its new value
                    option.value = optionValue
                }
            })
        })

        this.setOption(optionName, optionValue)
        this.setState({ options })
    }

    handleUserChange(userID) {
        this.setState({ selectedMember: userID })
        App.setup()
    }

    componentDidMount() {
        Trello.authorize({
            type: 'popup',
            name: 'Trellowdown',
            scope: {
                read: 'true',
                write: 'true'
            },
            expiration: 'never',
            success: this.authSuccess.bind(this),
            error: this.authFailure.bind(this)
        })
    }

    static async setup() {
        let userCards
        let userID = await Api.getUserID()
        let loggedInUser = await Api.getUserID()

        const isSuperUser = (loggedInUser === this.state.superUserID) ? true : false
        const selectedMember = this.state.selectedMember

        // If superuser is current user
        if(isSuperUser && selectedMember !== null) {
            userCards = await Api.getUserCards(selectedMember)
            userID = selectedMember.value
        } else {
            userCards = await Api.getUserCards()
        }

        // Remove any archived cards, uneeded cards and make sure all cards have selected user attached
        userCards = userCards.filter(card => (card.closed) ? false : true)
        userCards = userCards.filter(card => ["565ffdd1db3eb0a207da2941"].indexOf(card.idBoard))

        // Extract out all the board ids and then generate the initial boards array
        let boardIds = [...new Set(userCards.map(card => card.idBoard))]
        let emptyBoards = [
            {
                id: null,
                lists: [],
                cards: [],
                name: "Priority"
            }
        ]

        boardIds.map(id => {
            emptyBoards.push({
                id,
                lists: [],
                cards: []
            })
            
            return false
        })

        let boards

        boards = TrellowdownHelper.addCards(emptyBoards, userCards)
        boards = await TrellowdownHelper.addBoardNames(boards)
        boards = TrellowdownHelper.sortBoards(boards)

        // Get Organization members
        const organization = await Api.getCurrentOrganization()
        const members = await Api.getOrganizationMembers(organization)

        this.setState({ boards, userID, members, loggedInUser })
    }

    async handleNotifyButton(cardID, boardID, comment = false) {
        Api.addMemberToCard(this.state.superUserID, cardID, boardID)
            .then(Api.addCommentToCard(cardID, comment))
            .then(Api.removeMemberFromCard(this.state.userID, cardID))
            .then(this.removeCardFromState(cardID, boardID))
    }

    removeCardFromState(cardID) {
        let boards = [ ...this.state.boards ]

        // Loop over boards
        boards.forEach(board => {
            board.cards.map((card, index) => {
                if(card.id === cardID) {
                    board.cards.splice(index, 1)
                }

                return true
            })
        })

        this.setState({ boards })
    }

    authSuccess() {
        App.setup()
    }

    authFailure() {
        
    }
}

export default App
import React, { Component } from 'react';
import Api from '../Trellowdown/API'
import Members from './members'

class QuickAdd extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            selectedBoard: 0,
            selectedList: 0,
            title: "",
            description: "",
            members: [],
            selectedMember: ""
        }

        this.handleBoardsChange = this.handleBoardsChange.bind(this)
        this.handleListsChange = this.handleListsChange.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleMemberChange = this.handleMemberChange.bind(this)
    }

    async componentWillReceiveProps(nextProps) {
        // Only get boards once
        if(nextProps.boards && this.state.data.length === 0) {
            const filtered = nextProps.boards.filter(board => board.id !== null)
            const boards = filtered.map(async board => {
                if(board.id !== null) {
                    const boardLists = await Api.getListsFromBoard(board.id)

                    return {
                        name: board.name,
                        value: board.id,
                        lists: boardLists
                    }
                }
            })

            Promise.all(boards).then(boards => {
                this.setState({ data: boards })
                this.setState({ selectedBoard: boards[0].value })
                this.setState({ selectedList: boards[0].lists[0].id })
            })
        }
    }

    handleBoardsChange(event) {
        const boardID = event.target.value
        this.setState({ selectedBoard: boardID })

        // When changing board, also change the selected list to the first list of the new board
        const newBoard = this.state.data.find(board => {
            return boardID === board.value
        })

        this.setState({ selectedList: newBoard.lists[0].id })
    }

    handleListsChange(event) {
        this.setState({ selectedList: event.target.value })
    }

    handleTitleChange(event) {
        this.setState({ title: event.target.value })
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value })        
    }

    handleMemberChange(event) {
        this.setState({ selectedMember: event.target.value })
    }

    handleButtonClick() {
        // If we don't have an empty title
        if(this.state.title !== "") {
            const card = {
                name: this.state.title,
                desc: this.state.description,
                pos: "top",
                idList: this.state.selectedList
            }

            if(this.state.selectedMember !== "") {
                card.idMembers = this.state.selectedMember
            }

            Api.createCard(card).then(() => {
                this.setState({ title: "", description: "" })
            })
        }
    }

    getListOptions(lists) {
        return lists.map(list => <option value={list.id} key={list.id}>{list.name}</option>)
    }

    render() {
        if(this.props.showQuickAdd !== "false") {
            const defaultOption = <option value="0">Loading...</option>
            const members = (this.props.members) ? <Members members={this.props.members} name="quick-add-members" handleMemberChange={this.handleMemberChange} /> : false
    
            let boardOptions
            let listOptions
    
            // If we have got boards
            if(this.state.data.length !== 0) {
                // Loop over all boards and return options for each
                boardOptions = this.state.data.map(board => {
                    return <option value={board.value} key={board.value}>{board.name}</option>
                })
    
                let listsToUse
                
                if(this.state.selectedBoard) {
                    // Set the list options for the selected board
                    const board = this.state.data.find(board => {
                        return board.value === this.state.selectedBoard
                    })
    
                    listsToUse = board.lists
                } else {
                    // Set the list options for the initial load by using the first boards lists
                    listsToUse = this.state.data[0].lists
                }
                    
                listOptions = this.getListOptions(listsToUse)
    
            } else {
                boardOptions = defaultOption
                listOptions = defaultOption
            }
    
            return (
                <div id="quick-add">
                    <div className="inputs">
                        <div className="row">
                            <select name="trello-boards" id="trello-boards" value={this.selectedBoard} onChange={this.handleBoardsChange}>
                                {boardOptions}
                            </select>
                            <select name="trello-lists" id="trello-lists" value={this.selectedList} onChange={this.handleListsChange}>
                                {listOptions}
                            </select>
                        </div>
                        <div className="row">
                            <input type="text" onChange={this.handleTitleChange} value={this.state.title} placeholder="Title" />
                            <input type="text" onChange={this.handleDescriptionChange} value={this.state.description} placeholder="Description" />
                        </div>
                    </div>
    
                    <div className="members">{members}</div>
    
                    <div className="buttons">
                        <a className="button button-secondary" onClick={this.handleButtonClick}>Add</a>
                    </div>
                </div>
            )
        } else {
            return false
        }
    }
}

export default QuickAdd;
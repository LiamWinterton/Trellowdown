import React from 'react';

const Members = props => {
    return (
        <div className="member-icons">
            {props.members.map(member => {
                const hasImage = member.avatarHash !== null && member.avatarHash !== "" 
    
                return (
                    <label key={member.id}>
                        <input type="radio" name={props.name} value={member.id} className="member-icon" onChange={props.handleMemberChange} />
    
                        {hasImage ? (
                            <img src={member.avatarUrl + "/30.png"} alt={member.name} />
                        ) : (
                            <span>{member.initials}</span>
                        )}
    
                    </label>
                )
            })}
        </div>
    )
}

export default Members
import "./SearchResultsList.css";
import React, { useState } from "react";

interface SearchResultsListProps {
  results: string[]; // Define the type of the dataName prop as an array of strings
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
    const [friends, setFriends] = useState<{ [key: string]: boolean }>({});

    const toggleFriendStatus = (name: string) => {
        const updatedFriends = {
            ...friends,
            [name]: !friends[name]
        };
        setFriends(updatedFriends);
        alert(`${name} has been ${friends[name] ? 'removed from' : 'added to'} your friends.`);
    };

    return (
        <div className="search-results">
            {results && results.length > 0 ? (
                <ul>
                    {results.map((name, index) => (
                        <li key={index} className="result-item">
                            <span className="result-item-name">{name}</span>
                            <button 
                                className={`friend-button ${friends[name] ? 'remove-friend' : 'add-friend'}`}
                                onClick={() => toggleFriendStatus(name)}
                            >
                                {friends[name] ? 'Remove Friend' : 'Add Friend'}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <></>
            )}
        </div>
    );
};

export default SearchResultsList;

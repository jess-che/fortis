import "./SearchResultsList.css";
import React, { useState } from "react";

interface SearchResultsListProps {
  results: string[]; // Define the type of the dataName prop as an array of strings
}

// const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
//   const handleAddFriend = (name: string) => {
//       alert(`${name} has been added as a friend.`);
//       // Here, you can also add logic to actually add the friend in your system
//   };

//   const handleRemoveFriend = (name: string) => {
//       alert(`${name} has been removed as a friend.`);
//       // Similarly, you can add logic to remove the friend
//   };

//   return (
//     <div className="search-results">
//         {results && results.length > 0 ? (
//             <ul>
//                 {results.map((name, index) => (
//                     <li key={index} className="result-item">
//                         <span className="result-item-name">{name}</span>
//                         <button 
//                             className="friend-button add-friend"
//                             onClick={() => handleAddFriend(name)}
//                         >
//                             Add Friend
//                         </button>
//                         <button 
//                             className="friend-button remove-friend"
//                             onClick={() => handleRemoveFriend(name)}
//                         >
//                             Remove
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         ) : (
//             <></>
//         )}
//     </div>
// );
// };


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

// PROGRESS REPORT
// OK SO WHEN YOU CLICK ON ADD FRIEND, THE PERSON'S NAME IS SHOWING UP
// AND UID IS EXTRACTED FROM COOKIES 
// BUT SINCE PERSON_NAME IS NOT UNIQUE, I DON'T KNOW HOW TO STORE THE FRIEND REQUEST IN THE DATABASE


import React, { useState, useEffect } from "react";
import "./SearchResultsList.css";
import { useUser } from '@auth0/nextjs-auth0/client';
import { setCookie, getCookie } from 'cookies-next';


interface SearchResultsListProps {
  results: string[]; // Assuming this is an array of user IDs
  currentUser: string; // Add the current user's ID as a prop
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results, currentUser }) => {
    const [friends, setFriends] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        // Initialize the friends state based on the current status of friend requests
        // This might involve fetching data from the server
    }, [results]);

    const handleFriendRequest = async (userId: string, isFriend: boolean) => {
        const endpoint = isFriend ? '/api/friends/deleteFriendRequest' : '/api/friends/sendFriendRequest';
        const method = isFriend ? 'DELETE' : 'POST';
        const currentUser = '' + getCookie('uid');

        try {
            console.log(currentUser);
            console.log(userId);
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // Include any auth headers if necessary
                },
                body: JSON.stringify({ sender: currentUser, receiver: userId })
            });

            if (response.ok) {
                setFriends({ ...friends, [userId]: !isFriend });
            } else {
                // Handle errors (e.g., show a notification to the user)
                console.log("There is an error at this point. 1")
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
            // Handle errors (e.g., show a notification to the user)
        }
    };

    return (
        <div className="search-results">
            {results && results.length > 0 ? (
                <ul>
                    {results.map((userId, index) => (
                        <li key={index} className="result-item">
                            <span className="result-item-name">{userId}</span>
                            <button 
                                className={`friend-button ${friends[userId] ? 'remove-friend' : 'add-friend'}`}
                                onClick={() => handleFriendRequest(userId, friends[userId])}
                            >
                                {friends[userId] ? 'Remove Friend' : 'Add Friend'}
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

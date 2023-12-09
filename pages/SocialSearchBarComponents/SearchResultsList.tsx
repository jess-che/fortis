import React, { useState, useEffect } from "react";
import "./SearchResultsList.css";
import { getCookie } from 'cookies-next';



interface SearchResultsListProps {
    results: string[]; // Assuming this is an array of user IDs
    // currentUser: string; // Add the current user's ID as a prop
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
    const [friends, setFriends] = useState<{ [key: string]: boolean }>({});


    useEffect(() => {
        // Initialize the friends state based on the current status of friend requests
        // This might involve fetching data from the server
    }, [results]);

    const handleFriendRequest = async (userId: string, isFriend: boolean) => {
        const currentUser = getCookie('uid');
        // let receiverUid = "4188925c-e00e-43f2-b930-074f83783925";
        let receiverUid;

        try {
            // console.log(userId); this works
            const response = await fetch('/api/friends/getUIDfromName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include any auth headers if necessary
                },
                body: JSON.stringify({ name: userId }),
            });

            if (response.ok) {
                const data = await response.json();
                receiverUid = data.uid;
                // console.log("Receiver UID is ",receiverUid);
            } else {
                console.log(response);
                console.error('Response not OK when getting UID');
                // let receiverUid = "errorUid";
                // Handle errors (e.g., show a notification to the user)
            }
        } catch (error) {
            console.log('Error in getting uid from name', error);
        }
        //console.log("something");

        const endpoint = isFriend ? '/api/friends/deleteFriendRequest' : '/api/friends/sendFriendRequest';
        const method = 'POST';
        // console.log(isFriend);
        // console.log(endpoint);
        // console.log(method);
        try {
            // console.log("Current user is ",currentUser);
            // current user works so far
            // console.log("Receing user is ",receiverUid);
            // userId gives name 

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // Include any auth headers if necessary
                },
                body: JSON.stringify({ sender: currentUser, receiver: receiverUid })
            });
            console.log(response);

            if (response.ok) {
                // const data = await response;
                // console.log("data is ", data);
                setFriends({ ...friends, [userId]: !isFriend });
            } else {
                if (response.headers.get("content-type")?.includes("application/json")) {
                    const errorData = await response;
                    console.error('Error data:', errorData);
                    // Handle the JSON error data
                } else {
                    console.error('Friend request not found', response.statusText);
                    alert("Friend request not found");
                    // Handle non-JSON error
                }
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
            // Handle errors (e.g., show a notification to the user)
        }
        window.location.reload();
    };

    return (
        <div className="search-results">
            {results && results.length > 0 ? (
                <ul>
                    {results.map((userId, index) => (
                        <li key={index} className="result-item">
                            <span className="result-item-name">{userId}</span>
                            <button
                                className={`friend-button relative ${friends[userId] ? 'remove-friend' : 'add-friend'}`}
                                onClick={() => handleFriendRequest(userId, friends[userId])}
                            >
                                {friends[userId] ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                    </svg>

                                )}
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

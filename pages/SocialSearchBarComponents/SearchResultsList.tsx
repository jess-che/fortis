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
            console.log('Error in getting uid from name',error);
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

import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';

import SearchBar from "./SocialSearchBarComponents/SearchBar";
import SearchResultsList from "./SocialSearchBarComponents/SearchResultsList";
import styleform from './WorkoutBuddyMatcher.module.css';

import Modal from './modal'; // Make sure you have this component created
import WorkoutBuddyMatcher from './WorkoutBuddyMatcher'; // This is the separate form component
import styles from './WorkoutBuddy.module.css';
import { getCookie } from 'cookies-next';
import Styles from './social.module.css';
import '@/public/styles/matcher.css';

const searchBarStyle = {
    // backgroundColor: '#aaa',
    margin: 'auto',
    width: '40%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    minWidth: '200px',
};

interface Person {
    uid: string;
    name: string;
    location: string;
    workoutTypes: string;
    softPreferences: string;
    frequency: string;
    gymAvailability: string;
    // Add other fields as needed
}

interface FlexiblePerson {
    uid: string;
    name: string;
    age?: number | null;
    height?: number | null;
    weight?: number | null;
    gender?: string | null;
    unit?: string;
    privacy?: string;
    about?: string;
}

interface MatchedPersonDisplayProps {
    person: Person;
}

const MyDisplay: React.FC<MatchedPersonDisplayProps> = ({ person }) => {
    // Function to parse frequency and workout types to a more readable format
    const parseList = (listString: string) => {
        return listString.replace(/[{}"]/g, '').split(',').join(', ');
    };

    // Function to parse gym availability to a more readable format
    const parseGymAvailability = (availabilityString: string) => {
        const times = ["6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
        return availabilityString.replace(/[{}"]/g, '').split(',')
            .map((available, index) => available === 'true' ? times[index] : null)
            .filter(time => time !== null)
            .join(', ');
    };

    const [showMore, setShowMore] = useState<boolean>(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const MAX_ABOUT_LENGTH = 50;

    return (
        <div className="grid grid-cols-5 gap-1">
            <p className="col-span-1 font-bold">Location:</p>
            <p className="col-span-4">{person.location !== null ? person.location : 'Not specified'}</p>

            <p className="col-span-1 font-bold">Frequency:</p>
            <p className="col-span-4">{person.frequency !== null ? parseList(person.frequency) : 'Not specified'}</p>

            <p className="col-span-1 font-bold">Gym:</p>
            <p className="col-span-4">{person.gymAvailability !== null ? parseGymAvailability(person.gymAvailability) : 'Not specified'}</p>

            <p className="col-span-1 font-bold">Workout Types:</p>
            <p className="col-span-4">{person.workoutTypes !== null ? parseList(person.workoutTypes) : 'Not specified'}</p>

            <p className="col-span-1 font-bold">More Info:</p>
            <p className="col-span-4 overflow-x-auto">
                {showMore ? person.softPreferences : person.softPreferences?.slice(0, MAX_ABOUT_LENGTH) || 'Not specified'}
                {person.softPreferences && person.softPreferences.length > MAX_ABOUT_LENGTH && (
                    <button onClick={() => toggleShowMore()} className="text-[#2FABDD] hover:underline ml-2">
                        {showMore ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </p>
        </div>
    );
};

const MatchedPersonDisplay: React.FC<MatchedPersonDisplayProps> = ({ person }) => {
    // Function to parse frequency and workout types to a more readable format
    const parseList = (listString: string) => {
        return listString.replace(/[{}"]/g, '').split(',').join(', ');
    };

    // Function to parse gym availability to a more readable format
    const parseGymAvailability = (availabilityString: string) => {
        const times = ["6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
        return availabilityString.replace(/[{}"]/g, '').split(',')
            .map((available, index) => available === 'true' ? times[index] : null)
            .filter(time => time !== null)
            .join(', ');
    };

    const handleSendFriendRequest = async () => {
        const currentUser = getCookie('uid');
        let receiverUid;

        try {
            // Fetch the UID for the person to whom the friend request will be sent
            const response = await fetch('/api/friends/getUIDfromName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: person.name }), // Assuming `person.name` is used to fetch UID
            });

            if (response.ok) {
                const data = await response.json();
                receiverUid = data.uid;
            } else {
                console.error('Response not OK when getting UID');
                return; // Stop further execution if UID fetch fails
            }
        } catch (error) {
            console.error('Error in getting uid from name:', error);
            return; // Stop further execution if there's an error
        }

        try {
            // Send the friend request
            const friendRequestResponse = await fetch('/api/friends/sendFriendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender: currentUser, receiver: receiverUid })
            });

            if (friendRequestResponse.ok) {
                console.log(`Friend request sent to ${receiverUid}`);
            } else {
                console.error('Error sending friend request:', friendRequestResponse.statusText);
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
        }

        window.location.reload();
    };

    const [showMore, setShowMore] = useState<boolean>(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const MAX_ABOUT_LENGTH = 50;

    return (
        <div>
            <div className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-bold  gradient-text-pb ">{person.name || 'Not specified'}</h2>
                <button
                    onClick={handleSendFriendRequest}
                    className="bg-[#2FABDD] hover:bg-[#1A90C0] text-white font-bold py-1 px-2 rounded"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>

                </button>
            </div>



            <div className="grid grid-cols-5 gap-1 mb-5">
                <p className="col-span-1 font-bold">Location:</p>
                <p className="col-span-4">{person.location !== null ? person.location : 'Not specified'}</p>

                <p className="col-span-1 font-bold">Frequency:</p>
                <p className="col-span-4">{person.frequency !== null ? parseList(person.frequency) : 'Not specified'}</p>

                <p className="col-span-1 font-bold">Gym:</p>
                <p className="col-span-4">{person.gymAvailability !== null ? parseGymAvailability(person.gymAvailability) : 'Not specified'}</p>

                <p className="col-span-1 font-bold">Workout Types:</p>
                <p className="col-span-4">{person.workoutTypes !== null ? parseList(person.workoutTypes) : 'Not specified'}</p>

                <p className="col-span-1 font-bold">More Info:</p>
                <p className="col-span-4">
                    {showMore ? person.softPreferences : person.softPreferences?.slice(0, MAX_ABOUT_LENGTH) || 'Not specified'}
                    {person.softPreferences && person.softPreferences.length > MAX_ABOUT_LENGTH && (
                        <button onClick={() => toggleShowMore()} className="text-[#2FABDD] hover:underline ml-2">
                            {showMore ? 'Show Less' : 'Show More'}
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
};

interface FlexiblePersonListProps {
    people: FlexiblePerson[];
    onAcceptFriendRequest?: (receiver: any, sender: string) => void;
    onRejectFriendRequest?: (receiver: any, sender: string) => void;
}


const FlexiblePersonList: React.FC<FlexiblePersonListProps> = ({ people, onAcceptFriendRequest, onRejectFriendRequest }) => {
    const receiverUid = getCookie('uid');
    return (
        <ul className={styles.flexiblePersonList}>
            {people.map(person => (
                <li key={person.uid} className={styles.flexiblePersonItem}>
                    <p>Name: {person.name || 'Not specified'}</p>
                    <p>Age: {person.age !== null ? person.age : 'Not specified'}</p>
                    <p>Height: {person.height !== null ? `${person.height} cm` : 'Not specified'}</p>
                    <p>Weight: {person.weight !== null ? `${person.weight} kg` : 'Not specified'}</p>
                    <p>Gender: {person.gender || 'Not specified'}</p>
                    <p>Unit: {person.unit || 'Not specified'}</p>
                    <p>Privacy: {person.privacy || 'Not specified'}</p>
                    <p>About: {person.about || 'Not specified'}</p>
                    {onAcceptFriendRequest && (
                        <button onClick={() => onAcceptFriendRequest(receiverUid, person.uid)}>
                            Accept Friend Request
                        </button>
                    )}
                    {onRejectFriendRequest && (
                        <button onClick={() => onRejectFriendRequest(receiverUid, person.uid)}>
                            Reject Friend Request
                        </button>
                    )}

                </li>
            ))}
        </ul>
    );
};


const Matcher: React.FC = () => {
    const [showMatcherForm, setShowMatcherForm] = useState(false);
    const [matchedPersons, setMatchedPersons] = useState<Person[]>([]);
    const [myData, setMyData] = useState<Person[]>([]);

    const [friendsList, setFriendsList] = useState<FlexiblePerson[]>([]);
    const [pendingFriends, setPendingFriends] = useState<FlexiblePerson[]>([]);
    const [friendRequests, setFriendRequests] = useState<FlexiblePerson[]>([]);



    const friendslist = async (query: any) => {
        const response = await fetch('/api/friends/friendList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchQuery: getCookie('uid'),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save query');
        }

        const data = await response.json();
        console.log("Here are your friends: ", data.data);
        setFriendsList(data.data);
    };

    const friendsPending = async (query: any) => {
        const response = await fetch('/api/friends/friendPending', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchQuery: getCookie('uid'),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save query');
        }

        const data = await response.json();
        console.log("Pending friends :( ", data.data);
        setPendingFriends(data.data);
    };


    const friendLanding = async (query: any) => {
        const response = await fetch('/api/friends/friendLanding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchQuery: getCookie('uid'),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save query');
        }

        const data = await response.json();
        console.log("Here the people who have sent you a friend request: ", data.data);
        setFriendRequests(data.data);
    };


    const toggleMatcherForm = () => setShowMatcherForm(!showMatcherForm);

    useEffect(() => {
        getMatcher("monkey banana");
        getMyData("");
        friendslist("Monkey");
        friendLanding("Monkey");
        friendsPending("Monkey");
    }, []);

    const handleAcceptFriendRequest = async (receiver: any, sender: any) => {
        try {
            console.log(receiver, sender);
            const response = await fetch('/api/friends/acceptFriendRequest', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receiver, sender }),
            });

            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }

            // Optionally, update your state or UI based on the successful acceptance
            console.log(`Friend request from ${sender} to ${receiver} accepted`);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectFriendRequest = async (receiver: any, sender: any) => {
        try {
            const response = await fetch('/api/friends/deleteFriendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receiver, sender }),
            });

            if (!response.ok) {
                throw new Error('Failed to reject friend request');
            }

            // Optionally, update your state or UI based on the successful rejection
            console.log(`Friend request from ${sender} to ${receiver} rejected`);
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const getMatcher = async (query: any) => {
        const response = await fetch('/api/getMatcher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchQuery: String(getCookie('uid'))
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        console.log('API response:', data); // Log the full response
        if (data && data.data.rows) {
            setMatchedPersons(data.data.rows);
        } else {
            console.log('No rows in response'); // Log if no rows are found
        }
    };

    const getMyData = async (query: any) => {
        const response = await fetch('/api/getMatcherData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: getCookie('uid')
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        if (data && data.data.rows) {
            setMyData(data.data.rows);
            console.log(data.data.rows);
        } else {
            console.log('No rows in response'); // Log if no rows are found
        }
    };

    return (
        <DefLayout>
            <div className="flex w-screen h-[88vh] justify-center items-center">
                <div className={`flex flex-col column justify-center items-center w-[35vw] h-[80vh]`}>
                    <button onClick={toggleMatcherForm} className={`p-2 border-x rounded-lg border-opacity-60 gradient-text-gp text-opacity-75 text-4xl font-bold hover:gradient-text-pg duration-300 text-center `}>
                        Matcher Form
                    </button>

                    <div className="h-[2px] w-[3vw] my-[2vh] bg-white bg-opacity-50"></div>

                    {myData.length > 0 ? (
                        <div>
                            {myData.map(person => (
                                <MyDisplay person={person} />
                            ))}
                        </div>
                    ) : ""}

                </div>


                <div className="h-[50vh] w-[1px] mx-[2vw] bg-white bg-opacity-40"></div>

                <Modal show={showMatcherForm} onClose={toggleMatcherForm}>
                    <WorkoutBuddyMatcher />
                </Modal>

                <div className={`flex flex-col column justify-center items-center w-[50vw] h-[80vh] overflow-y-auto`}>
                    {matchedPersons.length > 0 ? (
                        <div className='w-[48vw] max-h-[78vh] items-center justify-center overflow-y-auto'>
                            {matchedPersons.map(person => (
                                <MatchedPersonDisplay key={person.uid} person={person} />
                            ))}
                        </div>
                    ) : (
                        <p>No matches found.</p>
                    )}
                </div>
            </div>

        </DefLayout>
    );
};

export default Matcher;



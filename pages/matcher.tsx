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
            <p className="col-span-4">
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

    const [showMore, setShowMore] = useState<boolean>(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const MAX_ABOUT_LENGTH = 50;

    return (
        <div className="grid grid-cols-5 gap-1 mb-5">
            <h2 className="text-2xl font-bold  gradient-text-pb col-span-5">{person.name || 'Not specified'}</h2>

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
                    <button onClick={toggleMatcherForm} className={`p-2 gradient-text-gp text-opacity-75 text-4xl font-bold hover:gradient-text-pg duration-300 text-center `}>
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
                        <div className='w-[48vw]'>
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



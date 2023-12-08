import React, { FC, useEffect, useState } from 'react';
import DefLayout from "@/components/def_layout";
import { setCookie, getCookie } from 'cookies-next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import '@/public/styles/discover.css';

interface Exercise {
    exerciseName: string;
    numberOfReps?: number;
    numberOfSets?: number;
    weight?: number;
    eid: number;
    aid: number;
    uid: string;
    time?: string;
    notes?: string;
}

const DiscoverPage2: React.FC = () => {
    const router = useRouter();

    const workouts = [
        { name: "Push", description: "A push workout targets your chest, shoulder, and triceps" },
        { name: "Pull", description: "A pull workout targets your back and biceps" },
        { name: "Legs", description: "A leg workout targets your quadriceps, hamstrings, and calves" },
        { name: "Core", description: "An abs workout targets your abdominal muscles, lower back, and obliques" },
        { name: "Cardio", description: "A cardio workout trains your aerobic metabolism and cardiovascular health" }
    ];

    type StringToArrayMappingType = {
        [key: string]: string[];
    };

    const [page, setPage] = useState(0);
    const pageSize = 20; // Number of workouts per page
    const [hasMore, setHasMore] = useState(true);

    type CategorySetCounts = {
        [category: string]: number;
    };

    function poundsToKilograms(pounds: any) {
        return Math.round(pounds * 0.453592);
    }

    // State to track the selected category for filtering
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const workout_muscle_map: StringToArrayMappingType = {
        "Push": ["Chest", "Shoulder", "Triceps"],
        "Pull": ["Back", "Biceps"],
        "Legs": ["Quadriceps", "Hamstrings", "Calves"],
        "Core": ["Abs", "Back", "Obliques"],
        "Cardio": ["Cardio"]
    }
    const muscleToWorkoutMap: { [muscle: string]: string } = {};
    Object.entries(workout_muscle_map).forEach(([workout, muscles]) => {
        muscles.forEach((muscle) => {
            muscleToWorkoutMap[muscle] = workout;
        });
    });
    const [activityData, setActivityData] = useState<any[]>([]);
    type MuscleGroupSetCounts = {
        [key: string]: number;
    };
    const ExcDatafromEID = async (query: any) => {
        try {
            const response = await fetch('/api/ExcDatafromEID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchQuery: query
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch exercise data');
            }
            const data = await response.json();
            // console.log("Exercise Data:", data); // Log to inspect the structure
            return data.data.rows[0];
        } catch (error) {
            console.error('Error fetching exercise data:', error);
            return null;
        }
    };
    // Filter and sort activities based on the selected category and set count
    const filteredAndSortedActivityData = selectedCategory
        ? activityData
            .filter(activity => activity.categorySetCounts[selectedCategory] > 5)
            .sort((a, b) => b.categorySetCounts[selectedCategory] - a.categorySetCounts[selectedCategory])
        : activityData;



    const fetchData = async (pageNumber: number) => {
        try {
            const pageSize = 20; // or another appropriate number

            console.log('Sending:', { page: pageNumber, size: pageSize });

            const response = await fetch('/api/TemplateActivities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ page: pageNumber, size: pageSize }),
            });


            if (!response.ok) {
                throw new Error('Failed to fetch activity data');
            }
            const activityJson = await response.json();

            // Check if there is more data to load
            if (activityJson.data.length < pageSize) {
                setHasMore(false);
            }

            console.log(activityJson)
            const activitiesWithCategorySetCounts = await Promise.all(activityJson.data.map(async (activity: any) => {
                const categorySetCounts: CategorySetCounts = {};

                const workoutResponse = await fetch('/api/TemplateWorkouts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // body: JSON.stringify({ eid })
                    body: JSON.stringify({
                        aid: activity.Aid,
                    }),
                });

                if (!workoutResponse.ok) {
                    throw new Error('Failed to retrieve history workouts');
                }
                const workoutJson = await workoutResponse.json();
                const workoutsWithExerciseData = await Promise.all(workoutJson.data.rows.map(async (workout: any) => {
                    const exerciseDataResponse = await ExcDatafromEID(workout.Eid);
                    const muscleGroups = exerciseDataResponse?.muscle_group?.split(',') || [];
                    muscleGroups.forEach((muscleGroup: string) => {
                        const trimmedMuscleGroup = muscleGroup.trim();
                        const category = muscleToWorkoutMap[trimmedMuscleGroup];
                        if (category) {
                            categorySetCounts[category] = (categorySetCounts[category] || 0) + parseInt(workout.Set, 10);
                        }
                    });
                    return {
                        ...workout,
                        exerciseData: exerciseDataResponse,
                    };
                }));
                return {
                    ...activity,
                    workouts: workoutsWithExerciseData,
                    categorySetCounts,
                };
            }));
            setActivityData(prevData => [...prevData, ...activitiesWithCategorySetCounts]);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData(0);
    }, []);

    const workoutRectangleStyle = {
        border: '1px solid rgba(204, 204, 204, 0.6)',
        padding: '.5rem',
        borderRadius: '10px',
    };

    const [results, setResults] = useState<string[]>([]);
    // const handleWorkoutClick = (workoutName: string) => {console.log(`You clicked ${workoutName}`);};

    const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
    const handleWorkoutClick = (workoutName: string) => {
        setSelectedWorkout(prevWorkout => {
            if (prevWorkout === workoutName) {
                return null; // if the workout is clicked again, unselect it
            } else {
                // console.log(workoutName);
                return workoutName; // otherwise, select the clicked workout
            }
        });
    };
    // Function to handle clicking a workout category button
    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(prevCategory => {
            // Toggle the category off if it's already selected, or set the new one
            return prevCategory === categoryName ? null : categoryName;
        });
    };
    // Filter activities based on the selected category and set count
    const filteredActivityData = selectedCategory
        ? activityData.filter(activity => activity.categorySetCounts[selectedCategory] > 5)
        : activityData;

    const addActivity = async () => {
        setCookie('log', 'true');       // sets cookie to show that user is logging workout

        try {
            const response = await fetch('/api/addActivity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: getCookie('uid'),
                }),
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            // Handle the response here
        } catch (error) {
            console.error('Failed to add activity:', error);
            // Handle errors here
        }
    };

    const fetchAid = async () => {
        const response = await fetch('/api/getAID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchQuery: getCookie('uid'),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch aid');
        }

        const data = await response.json();
        let transfAID: string | null = data.data.rows[0].Aid.toString();
        if (transfAID != null)
            localStorage.setItem('aidTransfer', transfAID);
        return parseInt(data.data.rows[0].Aid);
    };

    const handleTemplateClick = async (workoutData: any[]) => {
        if (getCookie('log') === 'false') {
            await addActivity();
        }

        const templateAid = await fetchAid();

        const exerciseArray: Exercise[] = workoutData.map((item) => {
            const isMetric = getCookie('units') === 'Metric';
            const convertedWeight = isMetric ? poundsToKilograms(item.Weight) : item.Weight;

            return {
                exerciseName: item.exerciseData.name,
                numberOfReps: item.Rep,
                numberOfSets: item.Set,
                weight: convertedWeight,
                eid: item.Eid,
                aid: templateAid,
                uid: item.Uid,
            };
        });

        console.log(exerciseArray);
        // Retrieve existing data from localStorage or initialize it as an empty array
        const existingDataString = localStorage.getItem('exercises');
        const existingData: Exercise[] = existingDataString
            ? JSON.parse(existingDataString)
            : [];

        // Append the new data to the existing data
        const combinedData = [...existingData, ...exerciseArray];

        // Save the combined data back to localStorage
        localStorage.setItem('exercises', JSON.stringify(combinedData));

        router.push('/log'); // Assuming '/log' is the path to Log2Page
    };

    const handleFavoriteClick = (aid: any) => {
        // Logic to handle the favorite button click
        // For example, updating the favorite count in the state or making an API call
        console.log('Favorite clicked for Aid:', aid);
        updateFavorites(aid);
        // Add your implementation here
    };

    const updateFavorites = async (aid: any) => {
        const response = await fetch('/api/updateFavorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Aid: aid
            }),
        });
        console.log("easy money");

        if (!response.ok) {
            throw new Error('Failed to save user');
        }
    };

    // Function to handle Load More button click
    const handleLoadMore = () => {
        if (hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchData(nextPage);
        }
    };

    return (
        <DefLayout>
            <div className="flex flex-row w-screen min-h-[90vh] justify-center items-center">
                <div className="flex flex-col column justify-center items-center w-[20vw] h-[90vh]">
                    <h2 className="mb-4 text-[4vw] font-bold displayheader gradient-text-bp text-center">Templates</h2>
                    <div className="h-[2px] w-[3vw] mb-[2vh] bg-white bg-opacity-50"></div>
                    <div className="w-[18vw]">
                        <div className="workout-list grid grid-cols-1 gap-2">
                            {workouts.map((workout) => {
                                const isSelected = workout.name === selectedCategory;
                                const itemStyle = isSelected
                                    ? { ...workoutRectangleStyle, background: "rgba(85, 187, 164, .60)" }
                                    : workoutRectangleStyle;

                                return (
                                    <div key={workout.name} className="" style={itemStyle} onClick={() => handleCategoryClick(workout.name)}>
                                        <div className="">
                                            <p className="text-xl font-bold">
                                                {workout.name}
                                            </p>
                                            <p className="text-xs">{workout.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="h-[80vh] w-[2px] mx-[1vw] bg-white bg-opacity-50"></div>

                <div className="flex flex-col column px-[1vw] w-[73vw] h-[80vh] items-center" style={{ overflowY: 'auto' }}>
                    <div className="w-[70vw]">
                        <ul className="">
                            {filteredAndSortedActivityData.map((activity: any, i: number) => (
                                <li key={i} className="border-b border-white p-5 border-opacity-50">
                                    <div className="">
                                        <div className="grid grid-cols-5 gap-2">
                                            <h2 className="text-2xl font-bold displayheader gradient-text-pg overflow-x-auto flex flex-row items-center col-span-1">{activity.Activity_name}</h2>

                                            <span className='flex flex-row items-center overflow-x-auto col-span-3 items-center justify-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#C32E67" className="w-6 h-6 mr-2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                </svg>

                                                <div className="mr-2">{activity.Favorite}</div>

                                                {Object.entries(activity.categorySetCounts).map(([category, count]) => (
                                                    <>
                                                        {/* Display the aggregated set counts by category */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#55BBA4" className="w-8 h-8 mr-2 pl-2 border-l">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                                                        </svg>

                                                        <div className='mr-2' key={category}>{category}: {Number(count)}</div>
                                                    </>
                                                ))}
                                            </span>

                                            <div className='col-span-1 flex flex-row items-center'>
                                                <button onClick={() => handleFavoriteClick(activity.Aid)} className="flex flex-row items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 opacity-80">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>

                                                    <p className="pl-2 pr-3 border-r text-white text-opacity-75 text-sm hover:gradient-text-gb duration-300 text-center">FAVORITE</p>
                                                </button>

                                                <button onClick={() => {
                                                    if (activity && activity.workouts) {
                                                        handleTemplateClick(activity.workouts);
                                                    } else {
                                                        console.log("No workout data to save");
                                                        // Optionally, you could display a notification or alert to the user here.
                                                    }
                                                }} className="template-button">
                                                    <p className="pl-3 text-white text-opacity-75 text-sm hover:gradient-text-bp duration-300 text-center">USE AS TEMPLATE</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="workout-list">
                                        {activity.workouts.map((workout: any, j: number) => (
                                            <li key={j} className="workout-item">
                                                <div className="text-lg text-left px-2 opacity-80">{workout.exerciseData.name}</div>
                                                <div className="grid grid-cols-3 gap-1 px-5 mb-2">
                                                    <div className="flex flex-row text-md text-left items-center opacity-70">
                                                        <Image
                                                            src="/animated/set.svg"
                                                            alt=""
                                                            width={40}
                                                            height={40}
                                                        />
                                                        <div className="ml-2">Sets: {workout.Set}</div>
                                                    </div>
                                                    <div className="flex flex-row text-md text-left items-center opacity-70">
                                                        <Image
                                                            src="/animated/rep.svg"
                                                            alt=""
                                                            width={40}
                                                            height={40}
                                                        />
                                                        <div className="ml-2">Reps: {workout.Rep}</div>
                                                    </div>
                                                    <div className="flex flex-row text-md text-left items-center opacity-70">
                                                        <Image
                                                            src="/animated/weight.svg"
                                                            alt=""
                                                            width={40}
                                                            height={40}
                                                        />
                                                        <div className="ml-2">Weight: {getCookie('units') === 'Metric' ? poundsToKilograms(workout.Weight) : workout.Weight}</div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>


                    </div>
                    {/* Load More Button */}
                    <div className="grid grid-cols-3 gap-2 w-[70vw]">
                        <h2 className=""></h2>

                        <div className='flex flex-row items-center justify-center'>
                            <button onClick={handleLoadMore} className="text-center hover:gradient-text-gb duration-300 p-2 mt-5 flex flex-row mb-4 border border-white rounded-md border-opacity-50 bg-white bg-opacity-10">
                                Load More
                            </button>
                        </div>

                        <div className="">

                        </div>
                    </div>

                </div>

            </div>
        </DefLayout >
    );
}

export default DiscoverPage2;
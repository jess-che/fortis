// import Image from 'next/image';
// import Link from 'next/link';
// import React, { FC, useEffect, useState } from 'react';
// import DefLayout from '@/components/def_layout';


// const HistoryPage: React.FC = () => {
//   const [activityData, setActivityData] = useState<any[]>([]); // Define state to store the activity data

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/api/HistoryActivities', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436",
//             //query
//           }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const data = await response.json();
//         console.log(data);

//         // Extract and set the data in state
//         setActivityData(data.data.rows);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const HistoryActivities = async (query: any) => {
//     let allResults: string[] = [];

//     const response = await fetch('/api/HistoryActivities', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436"
//         //query
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to save query');
//     }

//     const data = await response.json();
//     console.log(data);
//     const dataNames = data.data.rows.map((row: { name: any; }) => row.name);
//     allResults = [...allResults, ...dataNames];
//     console.log(allResults.length);
//     for (let i = 0; i < allResults.length; i++) {
//       console.log(data.data.rows[i].Activity_name, data.data.rows[i].Aid);
//     }
//   };

//     // USELESS STUFF, JUST CHECKING
//   const HistoryWorkouts = async (uid: any, aid: any) => {
//     let allResults: string[] = [];

//     const response = await fetch('/api/HistoryWorkouts', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         uid: "b24e24f4-86b8-4b83-8947-b2472a43b436", 
//         aid: aid
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to retrieve history');
//     }

//     const data = await response.json();
//     const dataNames = data.data.rows.map((row: { name: any; }) => row.name);
//     allResults = [...allResults, ...dataNames];
//     console.log(data);
//     console.log(allResults.length);
//     for (let i = 0; i < allResults.length; i++) {
//       console.log(data.data.rows[i].Aid, data.data.rows[i].Eid);
//     }
//     // setResults(allResults);
//   };

//   // const [results, setResults] = useState<string[]>([]);
//     // END OF USELESS STUFF, JUST CHECKING


// // WHen you click a button: 
// //   "   HistoryWorkouts(value);    "  <-   This needs to be called.

//   const result1 = HistoryActivities("");
//   const result2 = HistoryWorkouts("", 2);


//   return (
//     <DefLayout>
//       <div>
//         <h1>History Activities</h1>
//         <ul>
//           {activityData.map((row: any, i: number) => (
//             <li key={i}>
//               Activity Name: {row.Activity_name}, Aid: {row.Aid}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </DefLayout>
//   )
// }

// export default HistoryPage;


import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import DefLayout from '@/components/def_layout';

const HistoryPage: FC = () => {
  const [activityData, setActivityData] = useState<any[]>([]); // Define state to store the activity data
  const [workoutData, setWorkoutData] = useState<any[]>([]); // Define state to store the workout data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/HistoryActivities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436",
            //query
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);

        // Extract and set the activity data in state
        setActivityData(data.data.rows);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    fetchData();
  }, []);

  const HistoryWorkouts = async (aid: any) => {
    try {
      const response = await fetch('/api/HistoryWorkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: "b24e24f4-86b8-4b83-8947-b2472a43b436",
          aid: aid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve history workouts');
      }

      const data = await response.json();
      console.log(data);

      // Extract and set the workout data in state
      setWorkoutData(data.data.rows);
    } catch (error) {
      console.error('Error fetching workout data:', error);
    }
  };

  return (
    <DefLayout>
      <div>
        <h1>History Activities</h1>
        <ul>
          {activityData.map((row: any, i: number) => (
            <li key={i}>
              Activity Name: {row.Activity_name}, Aid: {row.Aid}
              <button onClick={() => HistoryWorkouts(row.Aid)}>Fetch Workouts</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Workout Data</h2>
        <ul>
          {workoutData.map((row: any, i: number) => (
            <li key={i}>
              Aid: {row.Aid}, Eid: {row.Eid}, Rep: {row.Rep}, Seq_num: {row.Seq_num}, Set: {row.Set}, Uid: {row.Uid}, Weight: {row.Weight}
            </li>
          ))}
        </ul>
      </div>
    </DefLayout>
  );
};

export default HistoryPage;




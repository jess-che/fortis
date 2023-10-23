import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC }  from 'react';
import DefLayout      from '@/components/def_layout';
import { useState } from "react";
import HistoryResultsList from "./HistoryResultsList";




  const HistoryActivities = async (query: any) => {
    const response = await fetch('/api/HistoryActivities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuery: "b24e24f4-86b8-4b83-8947-b2472a43b436"
        //query
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save query');
    }

    const data = await response.json();
    console.log(data);
  };

    // USELESS STUFF, JUST CHECKING
  const HistoryWorkouts = async (uid: any, aid: any) => {
    let allResults: string[] = [];
    const response = await fetch('/api/HistoryWorkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: "b24e24f4-86b8-4b83-8947-b2472a43b436", 
        aid: aid
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve history');
    }

    const data = await response.json();
    const dataNames = data.data.rows.map((row: { name: any; }) => row.name);
    allResults = [...allResults, ...dataNames];
    console.log(data);
    console.log(allResults);
    // setResults(allResults);
  };

  // const [results, setResults] = useState<string[]>([]);
    // END OF USELESS STUFF, JUST CHECKING


// WHen you click a button: 
//   "   HistoryWorkouts(value);    "  <-   This needs to be called.

  const result1 = HistoryActivities("");
  const result2 = HistoryWorkouts("", 2);

const HistoryPage: React.FC = () => {
  return (
    <DefLayout>
      history
      {/* {results && results.length > 0 && <HistoryResultsList results ={results} />} */}
    </DefLayout>
  )
}

export default HistoryPage;

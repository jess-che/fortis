import React, {useState, useEffect} from "react";
import SearchResultsList from "./SearchResultsList";
import "./SearchBar.css";


const SearchBar = () => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState<string[]>([]);

    const populatelist = async (query: any) => {
        const response = await fetch('/api/searchUserName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchQuery: query
            }),
        });
    
        if (!response.ok) {
            throw new Error('Failed to save query');
        }
    
        const data = await response.json();
        console.log("Here " + data);
        const dataName = data.data.rows.map((row: { name: any; }) => row.name);
        const dataEmail = data.data.rows.map((row: { uid: any; }) => row.uid);
        // setResults(dataName);
        setResults((prevResults: string[]) => [...prevResults, ...dataName]);
        console.log(dataEmail);
    };
    

    // const populatelist2 = async (query: any) => {
    //     const response = await fetch('/api/searchUserEmail', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             searchQuery: query
    //         }),
    //     });

    //     if (!response.ok) {
    //         throw new Error('Failed to save query');
    //     }

    //     const data = await response.json();
    //     const dataName = data.data.rows.map((row: { email: any; }) => row.email);
    //     setResults((prevResults: string[]) => [...prevResults, ...dataName]);
    //     // setResults(dataName);
    //     console.log(dataName);
    // };


    // so names load on start
    useEffect(() => {
        handleChange('');
    }, []);

    const handleChange = (value: React.SetStateAction<string>) => {
        setInput(value);
        if (value === "") {
            setResults([]);
        } else {
            populatelist(value);
            // populatelist2(value); // Uncomment if needed
        }
    };    

    return (
        <div className="search-container">
            <div className="input-wrapper">
                <input
                    placeholder="Type to search..."
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
            {results && results.length > 0 && <SearchResultsList results={results}/>}
        </div>
    );
};

export default SearchBar;


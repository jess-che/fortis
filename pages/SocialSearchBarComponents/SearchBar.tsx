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
        const dataName = data.data.rows.map((row: { name: any; }) => row.name);
        // setResults(dataName);
        setResults((prevResults: string[]) => [...prevResults, ...dataName]);
        console.log(dataName);
    };

    const populatelist2 = async (query: any) => {
        const response = await fetch('/api/searchUserEmail', {
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
        const dataName = data.data.rows.map((row: { email: any; }) => row.email);
        setResults((prevResults: string[]) => [...prevResults, ...dataName]);
        // setResults(dataName);
        console.log(dataName);
    };


    // so names load on start
    useEffect(() => {
        handleChange('');
    }, []);

    const handleChange = (value: React.SetStateAction<string>) => {
        setInput(value);
        setResults([]);

        populatelist(value);
        populatelist2(value);
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


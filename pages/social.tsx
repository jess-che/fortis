import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC }  from 'react';
import DefLayout      from '@/components/def_layout';

import SearchBar from "./SocialSearchBarComponents/SearchBar";
import SearchResultsList from "./SocialSearchBarComponents/SearchResultsList";


const searchBarStyle = {
  // backgroundColor: '#aaa',
  margin: 'auto',
  width: '40%',
  display: 'flex',
  flexDirection: 'column' as 'column',
  alignItems: 'center',
  minWidth: '200px',
};

const SocialPage: React.FC = () => {
  return (
    <DefLayout>
      <div className="social-page">
        <div className="search-bar-container" style={searchBarStyle}>
          <SearchBar />
        </div>

      </div>
    </DefLayout>
  );
}

export default SocialPage;

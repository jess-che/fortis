'use client'
import Image          from 'next/image';
import Link           from 'next/link';
import React, { FC }  from 'react';
import DefLayout      from '@/components/def_layout';
import { useUser } from '@auth0/nextjs-auth0/client';

const HomePage: React.FC = () => {
  const { user, error, isLoading } = useUser();

  if (!user) {
    return (
      <DefLayout>
        You are not logged in. Please login.
      </DefLayout>
    );
  }

  return (
    <DefLayout>
      Welcome, {user.name}. This is home page.
      Your email is {user.email}. 
    </DefLayout>
  );
}

export default HomePage;
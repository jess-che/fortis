import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import DefLayout from '@/components/def_layout';
import '@/public/styles/social.css';

const SocialPage2: React.FC = () => {

    return (
        <DefLayout>
            <div className="flex w-screen min-h-[90vh] justify-center items-center">
                <div className="flex flex-col column justify-center items-center w-[45vw] h-[89vh]">
                    <div className="flex flex-col column justify-center items-center h-[75vh]">
                        <h2 className="mb-4 text-[5vw] font-bold displayheader gradient-text-bp">Friends</h2>
                        <div className="text-sm mx-2 text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt eligendi possimus iure maiores tempora. Nesciunt alias repellat soluta minima ad vel explicabo nemo non autem mollitia? Iste, illo? Corporis, asperiores.</div>
                        <div className="relative mt-8">
                            <Link href="/friends">
                                <button className="startActivity rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#55BBA4]">
                                    Go to Friends
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="h-[80vh] w-[2px] mx-[1vw] bg-white bg-opacity-50"></div>
                <div className="flex flex-col column justify-center items-center w-[45vw] h-[89vh]">
                    <div className="flex flex-col column justify-center items-center h-[75vh]">
                        <h2 className="mb-4 text-[5vw] font-bold displayheader gradient-text-pg">Matcher</h2>
                        <div className="text-sm mx-2 text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt eligendi possimus iure maiores tempora. Nesciunt alias repellat soluta minima ad vel explicabo nemo non autem mollitia? Iste, illo? Corporis, asperiores.</div>
                        <div className="relative mt-8">
                            <Link href="/matcher">
                                <button className="discover rounded-md px-2 text-xl font-bold inset-0 text-center transition hover:bg-transparent border-2 border-[#2FABDD]">
                                    Go to Macher
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DefLayout>
    );
};

export default SocialPage2;



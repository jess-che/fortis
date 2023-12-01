import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState, useEffect } from 'react';
import DefLayout from '@/components/def_layout';
import './StreakGraphs.css';
import StreakGraph from './StreakGraph'; // Adjust the path as needed
import MuscleModel from './MuscleModel'; // Adjust the path as needed
import { useUser } from '@auth0/nextjs-auth0/client';
import { setCookie, getCookie } from 'cookies-next';



const ProfilePage: React.FC = () => {

  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(175); // in centimeters
  const [weight, setWeight] = useState(70); // in kilograms
  const [gender, setGender] = useState('Male');
  const [units, setUnits] = useState('Imperial');
  const [privacy, setPrivacy] = useState("Public");

  // Define state variables to track edit mode
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
  
        const response = await fetch('/api/getNamefromUID', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchQuery: getCookie('uid'),
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get UID from email');
        }
  
        const data = await response.json();
        const userdata = data.data.rows[0];
        setCookie('name', data.data.rows[0].name);
        
        setName(userdata.name);
        setAge(userdata.age);
        setHeight(userdata.height);
        setWeight(userdata.weight);
        setGender(userdata.gender);
        setUnits(userdata.unit);
        setPrivacy(userdata.privacy);


        return userdata;
      }
      catch (err){
        console.log('Error in GetUIDfromEmail:', err);
      }

      try {
        const response = await fetch('/api/getEmailfromUID', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchQuery: getCookie('uid'),
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get UID from email');
        }
  
        const data = await response.json();
        console.log(data.data.rows[0].email);
        setEmail(data.data.rows[0].email);
        return data.data.rows[0].email;
      }
      catch (err) {
        console.log('Error in GetUIDfromEmail:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getEmailfromUID', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchQuery: getCookie('uid'),
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get UID from email');
        }
  
        const data = await response.json();
        console.log(data.data.rows[0].email);
        setEmail(data.data.rows[0].email);
        return data.data.rows[0].email;
      }
      catch (err) {
        console.log('Error in GetUIDfromEmail:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <DefLayout>
      <div className="container">
        <div className="profile-container">
          <h1>Profile</h1>

          <div className="profile-info">
            <div>
              <strong>Name:</strong> {isEditing ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}  onBlur={() => setIsEditing(false)} />
              ) : (
                name
              )}
              {isEditing ? (
                <button className="edit-button" onClick={() => setIsEditing(false)}>Save</button>
              ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>
            <p><strong>Email:</strong> {email}</p>
            <div>
              <strong>Age:</strong> {isEditing ? (
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} onBlur={() => setIsEditing(false)} />
              ) : (
                age
              )}
              {isEditing ? (
                <button className="edit-button" onClick={() => setIsEditing(false)}>Save</button>
              ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>
            <div>
              <strong>Height:</strong> {isEditing ? (
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} onBlur={() => setIsEditing(false)} />
              ) : (
                height
              )} cm
              {isEditing ? (
                <button className="edit-button" onClick={() => setIsEditing(false)}>Save</button>
              ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>
            <div>
              <strong>Weight:</strong> {isEditing ? (
                <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} onBlur={() => setIsEditing(false)} />
              ) : (
                weight
              )} kg
              {isEditing ? (
                <button className="edit-button" onClick={() => setIsEditing(false)}>Save</button>
              ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>
            <div>
              <strong>Gender:</strong> {isEditing ? (
                <select value={gender} onChange={(e) => setGender(e.target.value)} onBlur={() => setIsEditing(false)}>
                  <option value="Man">Man</option>
                  <option value="Woman">Woman</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                gender
              )}
              {isEditing ? (
                <button className="edit-button" onClick={() => setIsEditing(false)}>Save</button>
              ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
              )}
            </div>
          </div>
        </div>

        <div className="preferences">
          <div>
            <strong>Unit of Measurement:</strong> {isEditing ? (
              <select value={units} onChange={(e) => setUnits(e.target.value)} onBlur={() => setIsEditing(false)}>
                <option value="Imperial">Imperial</option>
                <option value="Metric">Metric</option>
              </select>
            ) : (
              units
            )}
            {isEditing ? (
              <button className="edit-button" onClick={() => setIsEditing(false)}>Save</button>
            ) : (
              <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>

          <div>
            <strong>Privacy:</strong> {isEditing ? (
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} onBlur={() => setIsEditing(false)}>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            ) : (
              privacy
            )}
            {isEditing ? (
              <button className="edit-button" onClick={() => setIsEditing(false)}>Save</button>
            ) : (
              <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>

          <div>
            <button className="lightdarkmode">Light/Dark Mode</button>
          </div>

          <div>
            <button className="delete-account">Delete Account</button>
          </div>



        </div>
      </div>

    

      

      <style jsx>{`
        .container {
            display: flex;
            flex-direction: row;

        }
        .profile-container {
          width: 30vw;
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          color: black;
          margin-right: 10px;
        }

        .profile-info {
          margin-top: 20px;
        }

        p {
          margin: 8px 0;
        }

        .edit-button {
            border: 2px solid black;
            border-radius: 8px;
            margin-left: 15px;
        }

        .preferences {
            width: 30vw;
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            color: black;
          }

        .lightdarkmode {
            border: 2px solid black;
            border-radius: 8px;
            padding: 3px;
        }

        .delete-account {
            color: red;
            border: 2px solid red;
            border-radius: 8px;
            padding: 3px;
        }
      `}</style>
    </DefLayout>
  );
};

export default ProfilePage;
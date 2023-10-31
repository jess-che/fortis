import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import DefLayout from '@/components/def_layout';

const ProfilePage: React.FC = () => {
  // Define state variables to store user information
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(175); // in centimeters
  const [weight, setWeight] = useState(70); // in kilograms
  const [gender, setGender] = useState('Male');
  const [units, setUnits] = useState('Imperial');
  const [privacy, setPrivacy] = useState("Public");
  
  // Define state variables to track edit mode
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingUnits, setIsEditingUnits] = useState(false);
  const [isEditingPrivacy, setIsEditingPrivacy] = useState(false);

  // Function to save changes and exit edit mode when Enter is pressed
  const handleSaveOnEnter = (event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the Enter key from adding new lines in text fields
      event.currentTarget.blur(); // Remove focus from the input field
      // Trigger the save action based on the field being edited
      if (isEditingName) {
        setIsEditingName(false);
        // Save name changes here
      } else if (isEditingAge) {
        setIsEditingAge(false);
        // Save age changes here
      } else if (isEditingHeight) {
        setIsEditingHeight(false);
        // Save height changes here
      } else if (isEditingWeight) {
        setIsEditingWeight(false);
        // Save weight changes here
      } else if (isEditingGender) {
        setIsEditingGender(false);
        // Save gender changes here
      } else if (isEditingUnits) {
        setIsEditingUnits(false);
        // Save units changes here
      } else if (isEditingPrivacy) {
        setIsEditingPrivacy(false);
        // Save privacy changes here
      }
    }
  };

  return (
    <DefLayout>
    <div className="container">
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-info">
            <div>
                <strong>Name:</strong> {isEditingName ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingName(false)}/>
                ) : (
                name
                )} 
                {isEditingName ? (
                <button className="edit-button" onClick={() => setIsEditingName(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingName(true)}>Edit</button>
                )}
            </div>
            <p><strong>Email:</strong> {email}</p>
            <div>
                <strong>Age:</strong> {isEditingAge ? (
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingAge(false)}/>
                ) : (
                age
                )} 
                {isEditingAge ? (
                <button className="edit-button" onClick={() => setIsEditingAge(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingAge(true)}>Edit</button>
                )}
            </div>
            <div>
                <strong>Height:</strong> {isEditingHeight ? (
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingHeight(false)} />
                ) : (
                height
                )} cm
                {isEditingHeight ? (
                <button className="edit-button" onClick={() => setIsEditingHeight(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingHeight(true)}>Edit</button>
                )}
            </div>
            <div>
                <strong>Weight:</strong> {isEditingWeight ? (
                <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingWeight(false)}/>
                ) : (
                weight
                )} kg
                {isEditingWeight ? (
                <button className="edit-button" onClick={() => setIsEditingWeight(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingWeight(true)}>Edit</button>
                )}
            </div>
            <div>
                <strong>Gender:</strong> {isEditingGender ? (
                <select value={gender} onChange={(e) => setGender(e.target.value)} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingGender(false)}>
                    <option value="Man">Man</option>
                    <option value="Woman">Woman</option>
                    <option value="Other">Other</option>
                </select>
                ) : (
                gender
                )}
                {isEditingGender ? (
                <button className="edit-button" onClick={() => setIsEditingGender(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingGender(true)}>Edit</button>
                )}
            </div>
            </div>
        </div>

        <div className="preferences">
            <div>
                <strong>Unit of Measurement:</strong> {isEditingUnits ? (
                <select value={units} onChange={(e) => setUnits(e.target.value)} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingUnits(false)}>
                    <option value="Imperial">Imperial</option>
                    <option value="Metric">Metric</option>
                </select>
                ) : (
                units
                )}
                {isEditingUnits ? (
                <button className="edit-button" onClick={() => setIsEditingUnits(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingUnits(true)}>Edit</button>
                )}
            </div>

            <div>
                <strong>Privacy:</strong> {isEditingPrivacy ? (
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} onKeyDown={handleSaveOnEnter} onBlur={() => setIsEditingPrivacy(false)}>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>
                ) : (
                privacy
                )}
                {isEditingPrivacy ? (
                <button className="edit-button" onClick={() => setIsEditingPrivacy(false)}>Save</button>
                ) : (
                <button className="edit-button" onClick={() => setIsEditingPrivacy(true)}>Edit</button>
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
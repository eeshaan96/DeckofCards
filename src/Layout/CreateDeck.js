import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeck } from '../utils/api'; // Import the createDeck function
import './CreateDeck.css'; // Import the CSS file for styling
import Breadcrumb from './Breadcrumb'; // Import the Breadcrumb component

function CreateDeck() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null); // State to hold error messages
    const navigate = useNavigate();

    // Handle the submission of the form
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Create the deck object
        const deck = { name, description };

        try {
            // Call the createDeck function from the utils and get the newly created deck
            const newDeck = await createDeck(deck);
            // Navigate to the new deck's page
            navigate(`/decks/${newDeck.id}`);
        } catch (err) {
            // Handle errors (e.g., show an error message)
            setError(err.message);
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        navigate('/');
    };

    return (
        <>
            <Breadcrumb 
                items={[
                    { label: 'Home', path: '/' },
                    { label: 'Create Deck', path: '#' } // Current page, no link
                ]}
            />
            <div className="create-deck-container">
                <h1>Create Deck</h1>
                {error && <p className="error-message">Error: {error}</p>}
                <form onSubmit={handleSubmit} className="create-deck-form">
                    <div className="form-group">
                        <label htmlFor="deck-name">Name:</label>
                        <input
                            type='text'
                            id="deck-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="deck-description">Description:</label>
                        <textarea
                            id="deck-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="submit-button">Submit</button>
                        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateDeck;

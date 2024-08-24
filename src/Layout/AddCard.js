import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readDeck, createCard } from '../utils/api'; // Import the functions
import './AddCard.css'; // Import the CSS file for styling
import Breadcrumb from './Breadcrumb'; // Import the Breadcrumb component

function AddCard() {
    const { deckId } = useParams(); // Get deckId from route parameters
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null); // State to hold deck data
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [error, setError] = useState(null);

    // Fetch deck details
    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const data = await readDeck(deckId);
                setDeck(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDeck();
    }, [deckId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createCard(deckId, { front, back });
            navigate(`/decks/${deckId}`); // Navigate back to the deck page after creating the card
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        navigate(`/decks/${deckId}`); // Navigate back to the deck page if canceled
    };

    if (!deck) return <p>Loading...</p>; // Show loading state while fetching deck

    return (
        <>
            <Breadcrumb 
                items={[
                    { label: 'Home', path: '/' },
                    { label: deck.name, path: `/decks/${deckId}` },
                    { label: 'Add Card', path: '#' } // Current page, no link
                ]}
            />
            <div className="create-card-container">
                <h1>{deck.name} : Add New Card</h1>
                {error && <p>Error: {error}</p>}
                <form onSubmit={handleSubmit} className="create-card-form">
                    <div className="form-group">
                        <label htmlFor="card-front">Front:</label>
                        <textarea
                            id="card-front"
                            value={front}
                            onChange={(e) => setFront(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="card-back">Back:</label>
                        <textarea
                            id="card-back"
                            value={back}
                            onChange={(e) => setBack(e.target.value)}
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

export default AddCard;

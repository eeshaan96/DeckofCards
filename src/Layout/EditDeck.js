import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readDeck, updateDeck } from '../utils/api'; // Import the function to fetch and update deck data
import Breadcrumb from './Breadcrumb'; // Import the Breadcrumb component

function EditDeck() {
    const { deckId } = useParams(); // Get deckId from route parameters
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null); // State to hold the deck data
    const [error, setError] = useState(null); // State to hold any errors
    const [loading, setLoading] = useState(true); // State to handle loading state

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const data = await readDeck(deckId);
                setDeck(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
    }, [deckId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDeck(prevDeck => ({
            ...prevDeck,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await updateDeck(deck);
            navigate(`/decks/${deckId}`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        navigate(`/decks/${deckId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Breadcrumb 
                items={[
                    { label: 'Home', path: '/' },
                    { label: deck.name, path: `/decks/${deckId}` },
                    { label: 'Edit Deck', path: '#' } // Current page, no link
                ]}
            />
            <div className="edit-deck-container">
                <h1>Edit Deck</h1>
                {deck && (
                    <form onSubmit={handleSubmit} className="edit-deck-form">
                        <div className="form-group">
                            <label htmlFor="deck-name">Name:</label>
                            <textarea
                                id="deck-name"
                                name="name"
                                value={deck.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="deck-description">Description:</label>
                            <textarea
                                id="deck-description"
                                name="description"
                                value={deck.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="submit-button">Submit</button>
                            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

export default EditDeck;

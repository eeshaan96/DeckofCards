import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDecks, deleteDeck } from '../utils/api'; // Import the deleteDeck function
import './Home.css'; // Import the CSS file

function Home() {
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        listDecks(signal)
            .then(data => setDecks(data))
            .catch(err => setError(err));

        return () => controller.abort();
    }, []);

    // Handler functions for button actions
    const handleStudy = (deckId) => {
        console.log(`Study deck with id: ${deckId}`);
        navigate(`/decks/${deckId}/study`);
    };

    const handleDelete = async (deckId) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this deck? \n \nYou will not be able to revocer it");
        if (confirmDelete) {
            try {
                await deleteDeck(deckId);
                // Remove the deleted deck from the state
                setDecks(decks.filter(deck => deck.id !== deckId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleView = (deckId) => {
        console.log(`View deck with id: ${deckId}`);
        navigate(`/decks/${deckId}`);
    };

    const handleCreateDeck = () => {
        console.log("Create new deck");
        navigate('/decks/new'); // Redirect to the create deck page
    };

    return (
        <div className="Home">  
            {error && <p>Error loading decks: {error.message}</p>}
            <div>
                <button className="create-deck-button" onClick={handleCreateDeck}>
                    Create Deck
                </button>
                {decks.length === 0 ? (
                    <p>No decks available.</p>
                ) : (
                    <ul>
                        {decks.map(deck => (
                            <li key={deck.id}>
                                <div className="deck-header">
                                    <h3>{deck.name}</h3>
                                    <span className="card-count">{deck.cards.length} cards</span>
                                </div>
                                <p>{deck.description}</p>
                                <div className="button-group">
                                    <button onClick={() => handleView(deck.id)}>View</button>
                                    <button onClick={() => handleStudy(deck.id)}>Study</button>
                                </div>
                                <div className="red-button-container">
                                    <button className="button-red" onClick={() => handleDelete(deck.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Home;

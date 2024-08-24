import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readDeck, deleteCard } from '../utils/api'; // Import the function to delete a card
import './Deck.css';
import Breadcrumb from './Breadcrumb';

function Deck() {
    const { deckId } = useParams();
    const [deck, setDeck] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleStudyClick = () => {
        navigate(`/decks/${deckId}/study`);
    };

    const handleEditClick = () => {
        navigate(`/decks/${deckId}/edit`);
    };

    const handleAddCardClick = () => {
        navigate(`/decks/${deckId}/cards/new`);
    };

    const handleEditCardClick = (cardId) => {
        navigate(`/decks/${deckId}/cards/${cardId}/edit`);
    };

    const handleDeleteCardClick = async (cardId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this card? \nYou will not be able to recover it."
        );

        if (confirmDelete) {
            try {
                await deleteCard(cardId); // Call the API to delete the card
                setDeck((prevDeck) => ({
                    ...prevDeck,
                    cards: prevDeck.cards.filter(card => card.id !== cardId)
                })); // Remove the card from the state
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Breadcrumb 
                items={[
                    { label: 'Home', path: '/' },
                    { label: deck ? deck.name : 'Deck', path: `/decks/${deckId}` }
                ]}
            />
            <div className="deck-container">
                {deck ? (
                    <div>
                        <h1>{deck.name}</h1>
                        <p>{deck.description}</p>
                        <button onClick={handleStudyClick} className="study-button">
                            Study
                        </button>
                        <button onClick={handleEditClick} className="study-button">
                            Edit
                        </button>
                        <button onClick={handleAddCardClick} className="study-button">
                            Add Card
                        </button>
                        {deck.cards.length > 0 ? (
                            <div>
                                <h2>Cards</h2>
                                <ul className="card-list">
                                    {deck.cards.map(card => (
                                        <li key={card.id} className="card-item">
                                            <p>{card.id}</p>
                                            <p><strong>Front:</strong> {card.front}</p>
                                            <p><strong>Back:</strong> {card.back}</p>
                                            <div className="card-actions">
                                                <button 
                                                    onClick={() => handleEditCardClick(card.id)}
                                                    className="edit-card-button"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCardClick(card.id)}
                                                    className="delete-card-button"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No cards available in this deck.</p>
                        )}
                    </div>
                ) : (
                    <p>Deck not found.</p>
                )}
            </div>
        </>
    );
}

export default Deck;

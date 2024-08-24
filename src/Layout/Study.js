import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readDeck } from '../utils/api'; // Import the function to fetch deck data
import Breadcrumb from './Breadcrumb'; // Import the Breadcrumb component
import './Study.css'; // Import the CSS file

function Study() {
  const { deckId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    // Fetch the deck details when the component mounts
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

  const handleFlip = () => {
    setFlippedCardId(prevId => (prevId === deck.cards[currentCardIndex].id ? null : deck.cards[currentCardIndex].id));
  };

  const handleNext = () => {
    setFlippedCardId(null); // Reset flip state when moving to the next card
    setCurrentCardIndex(prevIndex => (prevIndex + 1) % deck.cards.length);
  };

  const handleAddCardClick = () => {
    navigate(`/decks/${deckId}/cards/new`); // Navigate to the AddCard page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (deck && deck.cards.length < 3) {
    return (
      <div className="study-container">
        <Breadcrumb 
          items={[
            { label: 'Home', path: '/' },
            { label: deck.name, path: `/decks/${deckId}` },
            { label: 'Study', path: '#' } // Current page, no link
          ]}
        />
        <p>Not enough cards to study. Please add more cards to this deck.</p>
        <button
          className="add-card-button"
          onClick={handleAddCardClick}
        >
          Add Card
        </button>
      </div>
    );
  }

  const currentCard = deck.cards[currentCardIndex];

  return (
    <div className="study-container">
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: deck.name, path: `/decks/${deckId}` },
          { label: 'Study', path: '#' } // Current page, no link
        ]}
      />
      <h1>Study: {deck.name}</h1>
      <div className="card">
        <p className="card-number">Card {currentCardIndex + 1} of {deck.cards.length}</p>
        <p className="card-content">
          {flippedCardId === currentCard.id ? currentCard.back : currentCard.front}
        </p>
        <div className="card-buttons">
          <button
            className="flip-button"
            onClick={handleFlip}
          >
            {flippedCardId === currentCard.id ? 'Show Front' : 'Flip'}
          </button>
          {flippedCardId === currentCard.id && (
            <button
              className="next-button"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Study;

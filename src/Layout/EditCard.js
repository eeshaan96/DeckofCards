import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readCard, readDeck, updateCard } from '../utils/api'; // Import the functions
import Breadcrumb from './Breadcrumb'; // Import the Breadcrumb component

function EditCard() {
  const { deckId, cardId } = useParams(); // Get deckId and cardId from route parameters
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [deck, setDeck] = useState(null);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [error, setError] = useState(null);

  // Fetch card and deck details when the component mounts
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const cardData = await readCard(cardId); // Fetch card data
        setCard(cardData);
        setFront(cardData.front);
        setBack(cardData.back);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchDeck = async () => {
      try {
        const deckData = await readDeck(deckId); // Fetch deck data
        setDeck(deckData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCard();
    fetchDeck();
  }, [cardId, deckId]);

  // Handle form submission to update the card
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Update the card with new data
      const updatedCard = {
        ...card,
        front: front,
        back: back
      };
      await updateCard(updatedCard); // Call updateCard function
      navigate(`/decks/${deckId}`); // Navigate back to the deck page after updating
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    navigate(`/decks/${deckId}`); // Navigate back to the deck page if canceled
  };

  if (!card || !deck) return <p>Loading...</p>; // Show loading state while fetching data

  return (
    <>
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: deck.name, path: `/decks/${deckId}` }, // Include deck name in breadcrumb
          { label: 'Edit Card', path: '#' } // Current page
        ]}
      />
      <div className="edit-card-container">
        <h1>Edit Card</h1>
        {error && <p>Error: {error}</p>}
        <form onSubmit={handleSubmit} className="edit-card-form">
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
            <button type="submit" className="submit-button">Save</button>
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditCard;

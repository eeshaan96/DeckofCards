import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home";
import Study from "./Study";
import Deck from "./Deck";
import CreateDeck from "./CreateDeck";
import EditDeck from "./EditDeck";
import AddCard from "./AddCard";
import EditCard from "./EditCard";

function Layout() {
  return (
    <>
      <Header />
      <div className="container">
        {/* TODO: Implement the screen starting here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks/new" element={<CreateDeck />} />
          <Route path="/decks/:deckId" element={<Deck />} ></Route>
          <Route path="/decks/:deckId/study" element={<Study />} ></Route>
          <Route path="/decks/:deckId/edit" element={<EditDeck />} ></Route>
          <Route path="/decks/:deckId/cards/new" element={<AddCard />} ></Route>
          <Route path="/decks/:deckId/cards/:cardId/edit" element={<EditCard />} ></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default Layout;

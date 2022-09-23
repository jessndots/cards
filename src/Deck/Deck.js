import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "../Card/Card"

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [autoDraw, setAutoDraw] = useState(false);
  const [card, setCard] = useState({image: ""});
  const timerRef = useRef(null);

  // get deck data on mount
  useEffect(() => {
    async function setup() {
      const resp = await axios.get(`${API_BASE_URL}/new/shuffle`)
      setDeck(resp.data)
    }
    setup();
  }, [setDeck]);

  // draw card every second when autoDraw is toggled
  useEffect(() => {
    async function getCard() {
      const { deck_id } = deck;
      const resp = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`)
      setCard(resp.data.cards[0]);
      if (resp.data.remaining === 0) {
        setAutoDraw(false);
        alert("No cards remaining!");
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000)
    }
    return () => {
      clearInterval(timerRef.current)
      timerRef.current = null;
    }
  }, [autoDraw, setAutoDraw, card, timerRef])

  const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto)
  }

  return (
    <div className="Deck">
      <button onClick={toggleAutoDraw}>{autoDraw ? `Stop` : `Start`} drawing!</button>
      <br/><br/>
      {card.image ? (
        <>
          <Card image={card.image} value={card.value} suit={card.suit} />
        </>
      ) : null}
    </div>
  )
}

export default Deck;
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function FrontPage() {
  return (
    <div>
      <p>quiz game woohoo! :D </p>
      <p>
        I will ask you 10 random game related questions and you will answer to
        your best ability!
      </p>
      <p>
        Each right answers grants you +1 point, and each wrong one -1 point!
      </p>
      <p> You can skip a question 3 times!</p>
      <p>Good luck!</p>
      <Link to="/quiz-app/game">
        <button>time to game!!</button>
      </Link>
    </div>
  );
}

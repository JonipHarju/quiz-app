import React, { useEffect, useState } from "react";
import uniqid from "uniqid";
import "../style.css";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  orderBy,
  limit,
  orderByValue,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQXbhEMgX1OBkpSoTUWzyFA3NNLiQQgEM",
  authDomain: "quiz-game-a5fca.firebaseapp.com",
  projectId: "quiz-game-a5fca",
  storageBucket: "quiz-game-a5fca.appspot.com",
  messagingSenderId: "564718468763",
  appId: "1:564718468763:web:4a94d0949a82d8a8b6503e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore();

const database = collection(firestore, "scoreboard");

const url =
  "https://opentdb.com/api.php?amount=1&category=15&difficulty=easy&type=multiple";

export default function Modal(props) {
  const [inputState, setInputState] = useState("");
  const [scoreboard, setScoreBoard] = useState([]);
  const [sentState, setSentState] = useState(false);
  const [buttonState, setButtonState] = useState(true);

  useEffect(() => {
    getScoreBoard();
  }, []);

  async function addScore(name) {
    const newScore = await addDoc(database, {
      name: `${name}`,
      score: `${props.score}`,
    });
  }

  async function getScoreBoard() {
    const response = await getDocs(database);

    const data = await Promise.all(response.docs.map((doc) => doc.data()));
    data.sort((a, b) => b.score - a.score);
    setScoreBoard(data);
  }

  if (!props.show) {
    return null;
  }
  return (
    <div className="modal">
      <div className="modalContent">
        <div className="modalHeader">
          <h4 className="modalTitle"> Your Score was :{props.score}</h4>
          <p> Save you'r score below to compare yourself with other players!</p>
        </div>
        <form>
          <input
            disabled={sentState}
            onChange={(e) => {
              setInputState(e.target.value);
            }}
            value={inputState}
          ></input>
          <button
            disabled={!buttonState || inputState === ""}
            onClick={(e) => {
              e.preventDefault();
              addScore(inputState);
              getScoreBoard();
              setInputState("");
              setSentState(true);
              setButtonState(false);
            }}
          >
            Save Score
          </button>
        </form>
        <div className="modalFooter">
          <button
            onClick={() => {
              props.onClose();
              setSentState(false);
              setButtonState(true);
            }}
            className="modalButton"
          >
            Play again!
          </button>
        </div>
        <ul className="scoreBoard">
          {scoreboard.map((key, index) => {
            if (index > 14) {
              return console.log("epic");
            }
            return (
              <li className="scoreBoardItem" key={uniqid()}>{`${index + 1}. ${
                key.name
              }: ${key.score}`}</li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

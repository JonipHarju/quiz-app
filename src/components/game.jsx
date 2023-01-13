import React, { useEffect, useState } from "react";
import "../style.css";
import shuffleArray from "./ShuffleArray";
import uniqid from "uniqid";
import failure from "../sounds/failure.mp3";
import correct from "../sounds/correct.mp3";

const url =
  "https://opentdb.com/api.php?amount=1&category=15&difficulty=easy&type=multiple";

export default function Game() {
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [score, setScore] = useState(0);
  const [skips, setSkips] = useState(3);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questionsAsked === 10) {
      alert(`Game ended! :O Your score was ${score}`);
      console.log("game end");
      // here logic to upload the score to firebase with the username
    }
  }, [questionsAsked]);

  function fetchQuestions() {
    //f fetching the question from the API
    fetch(url).then((response) => {
      response.json().then((response) => {
        // mapping trough the data
        response.results.map(() => {
          // setting the question into the state
          setQuestion(response.results[0].question.replace(/&quot;/g, '"'));
          // creating two arrays in which we put the wrong answers and the right answer
          const incorrectAnswers = response.results[0].incorrect_answers;
          const correctAnswer = [response.results[0].correct_answer];

          // combine the above arrays to form array with all the answers.
          const allAnswers = incorrectAnswers.concat(correctAnswer);

          setAnswers(shuffleArray(allAnswers));
          setCorrectAnswer(correctAnswer);
        });
      });
    });
  }

  function playCorrectAnswer() {
    new Audio(correct).play();
  }

  function playFailureAnswer() {
    new Audio(failure).play();
  }

  return (
    <div>
      <h1>Score:{score}</h1>
      <h2>Skips: {skips}</h2>
      <h3>{question}</h3>
      <ul>
        {/* render answers here */}
        {answers.map((value) => {
          return (
            // render answers as buttons inside list elements.
            <li key={uniqid()}>
              {/* attach onclick to the button that checks the answer */}
              <button
                onClick={(e) => {
                  // in case of right answer
                  if (e.target.outerText === correctAnswer[0]) {
                    playCorrectAnswer();
                    // increment score and questions asked by 1
                    setQuestionsAsked((previousState) => previousState + 1);
                    setScore((previousState) => previousState + 1);
                    // get new questions
                    fetchQuestions();

                    // in case of wrong answer
                  } else {
                    playFailureAnswer();
                    // increment questions asked and decrement score :)
                    setQuestionsAsked((previousState) => previousState + 1);
                    setScore((previousState) => previousState - 1);
                    // get new questions
                    fetchQuestions();
                  }
                }}
              >
                {value}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => {
          if (skips > 0) {
            fetchQuestions();
            setSkips((previousState) => previousState - 1);
          } else {
            alert("out of skips!!!");
          }
        }}
      >
        Skip
      </button>
      <p>{correctAnswer}</p>
      <p>questions asked:{questionsAsked}</p>
    </div>
  );
}

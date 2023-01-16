import React, { useEffect, useState } from "react";
import "../style.css";
import shuffleArray from "./ShuffleArray";
import uniqid from "uniqid";
import failure from "../sounds/failure.mp3";
import correct from "../sounds/correct.mp3";
import Modal from "./Modal";

const url =
  "https://opentdb.com/api.php?amount=1&category=15&difficulty=easy&type=multiple";

export default function Game() {
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [score, setScore] = useState(0);
  const [skips, setSkips] = useState(3);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questionsAsked === 10) {
      setShow(true);
    }
  }, [questionsAsked]);

  function fetchQuestions() {
    //f fetching the question from the API
    fetch(url).then((response) => {
      response.json().then((response) => {
        // mapping trough the data
        response.results.map(() => {
          // setting the question into the state
          setQuestion(
            response.results[0].question
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, `"`)
              .replace(/&#039;/g, "'")
              .replace(/&eacute;/g, "é")
              .replace(/&rsquo;/g, "´")
          );
          // creating two arrays in which we put the wrong answers and the right answer
          const incorrectAnswersRaw = response.results[0].incorrect_answers;

          // creating a version of the wrong answers with right symbols
          const incorrectAnswers = incorrectAnswersRaw.map((i) => {
            return i
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, `"`)
              .replace(/&#039;/g, "'")
              .replace(/&eacute;;/g, "é");
          });
          // array with correnct answer
          const correctAnswer = [
            response.results[0].correct_answer
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, `"`)
              .replace(/&#039;/g, "'")
              .replace(/&eacute;;/g, "é"),
          ];

          // combine wrong answers array with the right answer to create a single array
          const allAnswers = incorrectAnswers.concat(correctAnswer);
          // shuffle the combined array and make it the state.
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

  function resetGame() {
    setShow(false);
    setScore(0);
    setSkips(3);

    setQuestionsAsked(0);
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
      <p>questions asked:{questionsAsked}</p>
      <Modal onClose={resetGame} show={show} score={score} />
    </div>
  );
}

import React, { useState } from "react";
import "./style.css";
import shuffleArray from "./components/ShuffleArray";
import uniqid from "uniqid";

const url = "https://opentdb.com/api.php?amount=1&category=15&type=multiple";

export default function App() {
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [score, setScore] = useState(0);

  function fetchQuestions() {
    //f fetching the question from the API
    fetch(url).then((response) => {
      response.json().then((response) => {
        console.log(response);

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

          console.log("hei", incorrectAnswers, correctAnswer, allAnswers);
        });
      });
    });
  }

  return (
    <div>
      <button
        onClick={() => {
          fetchQuestions();
        }}
      >
        get question!
      </button>
      <h1>{question}</h1>
      <ul>
        {answers.map((value) => {
          return (
            <li key={uniqid()}>
              <button
                onClick={(e) => {
                  console.log(e, correctAnswer[0]);
                  if (e.target.outerText === correctAnswer[0]) {
                    alert("holy fuck boiii right answer");
                    setScore((previousState) => previousState + 1);
                    fetchQuestions();
                  } else {
                    alert("lolololo wrong answer hobo");
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
      <p>
        {correctAnswer} Score:{score}
      </p>
    </div>
  );
}
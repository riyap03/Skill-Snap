import { useState } from "react";
import axios from "axios";

export default function Test() {
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = [
    "Find the maximum element in an array",
    "Reverse an array",
    "Check if array is sorted",
    "Find duplicate element",
    "Rotate array by K steps",
  ];

  const startTest = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const answerQuestion = (correct) => {
    if (correct) setScore((prev) => prev + 1);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const finishTest = async () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/progress",
      {
        topic: "Arrays",
        score: score,
        totalQuestions: questions.length,
        timeTaken: timeTaken,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Test submitted! SkillSnap learned your pace.");
  };

  return (
    <div className="test-container">
      <div className="test-card">
        <h2>SkillSnap Diagnostic Test</h2>

        {!started && (
          <button className="start-btn" onClick={startTest}>
            Start Test
          </button>
        )}

        {started && !finished && (
          <>
            <div className="question">
              <p>
                Question {questionIndex + 1} of {questions.length}
              </p>
              <h3>{questions[questionIndex]}</h3>
            </div>

            <div className="answers">
              <button onClick={() => answerQuestion(true)}>
                I solved this
              </button>
              <button onClick={() => answerQuestion(false)}>
                I couldn't solve
              </button>
            </div>
          </>
        )}

        {finished && (
          <div className="result">
            <h3>Test Completed 🎉</h3>
            <p>
              Your Score: {score} / {questions.length}
            </p>
            <button className="submit-btn" onClick={finishTest}>
              Submit Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

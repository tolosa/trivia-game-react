// App.js
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function App() {
  // Game stages: "setup" (initial selection), "quiz" (questions), "result" (final score)
  const [stage, setStage] = useState("setup");
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  // State to track the user's selected answer for feedback purposes.
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Fetch trivia categories from the API on component mount
  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.trivia_categories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Start the quiz: build the API URL using chosen difficulty and category, fetch questions
  const startQuiz = () => {
    let apiUrl = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}`;
    if (category) {
      apiUrl += `&category=${category}`;
    }
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results);
        setCurrentQuestionIndex(0);
        setScore(0);
        // Reset any previously selected answer
        setSelectedAnswer(null);
        setStage("quiz");
      })
      .catch((err) => console.error("Error fetching questions:", err));
  };

  // Handle the user selecting an answer
  const handleAnswer = (answer) => {
    // Prevent multiple selections
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  // Move to the next question (or finish the quiz if it was the last question)
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setStage("result");
    }
  };

  // Restart the game (go back to setup screen)
  const restartQuiz = () => {
    setStage("setup");
  };

  // Helper to decode HTML entities (since the API returns HTML-encoded strings)
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Common Box style for centering content
  const centeredBoxProps = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  };

  // === Stage 1: Setup Screen ===
  if (stage === "setup") {
    return (
      <Container>
        <Box {...centeredBoxProps}>
          <Typography variant="h3" gutterBottom>
            Trivia Game
          </Typography>
          {/* Difficulty selection */}
          <FormControl sx={{ minWidth: 250, mb: 2 }}>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              value={difficulty}
              label="Difficulty"
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          {/* Category selection */}
          <FormControl sx={{ minWidth: 250, mb: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Start quiz button */}
          <Button
            variant="contained"
            onClick={startQuiz}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Quiz
          </Button>
        </Box>
      </Container>
    );
  }

  // === Stage 2: Quiz Screen ===
  if (stage === "quiz") {
    const currentQuestion = questions[currentQuestionIndex];

    // Combine the correct answer with the incorrect ones and then shuffle the array
    const answers = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer,
    ].sort(() => Math.random() - 0.5);

    return (
      <Container>
        <Box {...centeredBoxProps} textAlign="center">
          <Typography variant="h4" gutterBottom>
            {decodeHtml(currentQuestion.question)}
          </Typography>
          {answers.map((answer, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleAnswer(answer)}
              disabled={selectedAnswer !== null}
              sx={{ m: 1, px: 4, py: 1.5 }}
            >
              {decodeHtml(answer)}
            </Button>
          ))}

          {/* Show feedback if an answer has been selected */}
          {selectedAnswer !== null && (
            <>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {selectedAnswer === currentQuestion.correct_answer
                  ? "Correct!"
                  : `Incorrect! The correct answer was: ${decodeHtml(
                      currentQuestion.correct_answer
                    )}`}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                sx={{ mt: 2, px: 4, py: 1.5 }}
              >
                {currentQuestionIndex + 1 === questions.length
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            </>
          )}

          <Typography variant="h6" sx={{ mt: 2 }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
        </Box>
      </Container>
    );
  }

  // === Stage 3: Result Screen ===
  if (stage === "result") {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Container>
        <Box {...centeredBoxProps}>
          <Typography variant="h3" gutterBottom>
            Quiz Complete!
          </Typography>
          <Typography variant="h4" gutterBottom>
            Your Score: {percentage}%
          </Typography>
          <Button
            variant="contained"
            onClick={restartQuiz}
            sx={{ px: 4, py: 1.5 }}
          >
            Play Again
          </Button>
        </Box>
      </Container>
    );
  }

  return null;
}

export default App;

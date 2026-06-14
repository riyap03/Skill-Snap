export const ASSESSMENT_QUESTIONS = {
  frontend: [
    {
      id: "fe-1",
      question: "Which HTML element is used to define an internal style sheet?",
      options: [
        { text: "<script>", correct: false },
        { text: "<style>", correct: true },
        { text: "<css>", correct: false },
        { text: "<link>", correct: false },
      ],
    },
    {
      id: "fe-2",
      question: "In React, which hook is used to perform side effects in functional components?",
      options: [
        { text: "useState", correct: false },
        { text: "useContext", correct: false },
        { text: "useEffect", correct: true },
        { text: "useReducer", correct: false },
      ],
    },
    {
      id: "fe-3",
      question: "Which CSS property is used to create flexible layouts inside a container?",
      options: [
        { text: "display: block", correct: false },
        { text: "display: flex", correct: true },
        { text: "display: inline", correct: false },
        { text: "position: absolute", correct: false },
      ],
    },
    {
      id: "fe-4",
      question: "In JavaScript, which method converts a JSON string into a JavaScript object?",
      options: [
        { text: "JSON.stringify()", correct: false },
        { text: "JSON.parse()", correct: true },
        { text: "JSON.toObject()", correct: false },
        { text: "JSON.convert()", correct: false },
      ],
    },
    {
      id: "fe-5",
      question: "Which React feature allows you to pass data from parent to child components?",
      options: [
        { text: "State", correct: false },
        { text: "Context", correct: false },
        { text: "Props", correct: true },
        { text: "Hooks", correct: false },
      ],
    },
    {
      id: "fe-6",
      question: "Which HTTP status code represents a successful response?",
      options: [
        { text: "404", correct: false },
        { text: "500", correct: false },
        { text: "200", correct: true },
        { text: "301", correct: false },
      ],
    },
    {
      id: "fe-7",
      question: "In CSS, what does the z-index property control?",
      options: [
        { text: "Horizontal position", correct: false },
        { text: "Vertical position", correct: false },
        { text: "Stacking order of elements", correct: true },
        { text: "Font size", correct: false },
      ],
    },
  ],
  backend: [
    {
      id: "be-1",
      question: "Which HTTP method is typically used to update an existing resource?",
      options: [
        { text: "GET", correct: false },
        { text: "POST", correct: false },
        { text: "PUT", correct: true },
        { text: "DELETE", correct: false },
      ],
    },
    {
      id: "be-2",
      question: "In Node.js, which module is used to create a web server?",
      options: [
        { text: "fs", correct: false },
        { text: "http", correct: true },
        { text: "url", correct: false },
        { text: "path", correct: false },
      ],
    },
    {
      id: "be-3",
      question: "What does JWT stand for?",
      options: [
        { text: "Java Web Token", correct: false },
        { text: "JSON Web Token", correct: true },
        { text: "JavaScript Web Token", correct: false },
        { text: "Joint Web Token", correct: false },
      ],
    },
    {
      id: "be-4",
      question: "Which database is classified as a NoSQL database?",
      options: [
        { text: "PostgreSQL", correct: false },
        { text: "MySQL", correct: false },
        { text: "MongoDB", correct: true },
        { text: "SQLite", correct: false },
      ],
    },
    {
      id: "be-5",
      question: "What is the purpose of middleware in Express.js?",
      options: [
        { text: "To define routes only", correct: false },
        { text: "To execute code during request-response cycle", correct: true },
        { text: "To connect to the database", correct: false },
        { text: "To render HTML only", correct: false },
      ],
    },
    {
      id: "be-6",
      question: "Which HTTP status code indicates a server error?",
      options: [
        { text: "200", correct: false },
        { text: "400", correct: false },
        { text: "500", correct: true },
        { text: "301", correct: false },
      ],
    },
    {
      id: "be-7",
      question: "What does REST stand for?",
      options: [
        { text: "Remote Encoding Standard Transfer", correct: false },
        { text: "Representational State Transfer", correct: true },
        { text: "Reliable State Transfer", correct: false },
        { text: "Resource Execution Standard Technique", correct: false },
      ],
    },
  ],
  dsa: [
    {
      id: "dsa-1",
      question: "What is the time complexity of binary search?",
      options: [
        { text: "O(n)", correct: false },
        { text: "O(log n)", correct: true },
        { text: "O(n^2)", correct: false },
        { text: "O(1)", correct: false },
      ],
    },
    {
      id: "dsa-2",
      question: "Which data structure uses LIFO (Last In First Out)?",
      options: [
        { text: "Queue", correct: false },
        { text: "Stack", correct: true },
        { text: "Linked List", correct: false },
        { text: "Tree", correct: false },
      ],
    },
    {
      id: "dsa-3",
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: [
        { text: "Bubble Sort", correct: false },
        { text: "Merge Sort", correct: true },
        { text: "Selection Sort", correct: false },
        { text: "Insertion Sort", correct: false },
      ],
    },
    {
      id: "dsa-4",
      question: "In a binary tree, what is the maximum number of children a node can have?",
      options: [
        { text: "1", correct: false },
        { text: "2", correct: true },
        { text: "3", correct: false },
        { text: "4", correct: false },
      ],
    },
    {
      id: "dsa-5",
      question: "Which data structure is used for implementing recursion internally?",
      options: [
        { text: "Queue", correct: false },
        { text: "Stack", correct: true },
        { text: "Array", correct: false },
        { text: "Linked List", correct: false },
      ],
    },
    {
      id: "dsa-6",
      question: "What is the worst-case time complexity of QuickSort?",
      options: [
        { text: "O(n log n)", correct: false },
        { text: "O(n^2)", correct: true },
        { text: "O(log n)", correct: false },
        { text: "O(n)", correct: false },
      ],
    },
    {
      id: "dsa-7",
      question: "Which of the following is not a linear data structure?",
      options: [
        { text: "Array", correct: false },
        { text: "Tree", correct: true },
        { text: "Stack", correct: false },
        { text: "Queue", correct: false },
      ],
    },
  ],
  ai_ml: [
    {
      id: "ai-1",
      question: "Which type of learning uses labeled training data?",
      options: [
        { text: "Unsupervised Learning", correct: false },
        { text: "Reinforcement Learning", correct: false },
        { text: "Supervised Learning", correct: true },
        { text: "Self-supervised Learning", correct: false },
      ],
    },
    {
      id: "ai-2",
      question: "What is the purpose of a loss function in machine learning?",
      options: [
        { text: "To increase model accuracy", correct: false },
        { text: "To measure how far predictions are from actual values", correct: true },
        { text: "To add more features", correct: false },
        { text: "To normalize data", correct: false },
      ],
    },
    {
      id: "ai-3",
      question: "Which algorithm is commonly used for classification tasks?",
      options: [
        { text: "Linear Regression", correct: false },
        { text: "K-Means", correct: false },
        { text: "Logistic Regression", correct: true },
        { text: "PCA", correct: false },
      ],
    },
    {
      id: "ai-4",
      question: "What does overfitting mean in machine learning?",
      options: [
        { text: "Model performs well on training and test data", correct: false },
        { text: "Model is too simple", correct: false },
        { text: "Model performs well on training but poorly on new data", correct: true },
        { text: "Model has too few parameters", correct: false },
      ],
    },
    {
      id: "ai-5",
      question: "Which library is most commonly used for deep learning in Python?",
      options: [
        { text: "NumPy", correct: false },
        { text: "Pandas", correct: false },
        { text: "TensorFlow", correct: true },
        { text: "Matplotlib", correct: false },
      ],
    },
    {
      id: "ai-6",
      question: "What is the primary purpose of an activation function in a neural network?",
      options: [
        { text: "To reduce overfitting", correct: false },
        { text: "To introduce non-linearity", correct: true },
        { text: "To normalize input data", correct: false },
        { text: "To speed up training", correct: false },
      ],
    },
    {
      id: "ai-7",
      question: "Which technique is used to prevent overfitting?",
      options: [
        { text: "Data augmentation", correct: false },
        { text: "Dropout", correct: true },
        { text: "One-hot encoding", correct: false },
        { text: "Gradient descent", correct: false },
      ],
    },
  ],
};

export const SKILL_TEST_QUESTIONS = [
  {
    id: "skill-1",
    question: "What does the 'return' statement do in a function?",
    options: [
      { text: "Stops the loop", correct: false },
      { text: "Returns a value from a function", correct: true },
      { text: "Exits the program", correct: false },
      { text: "Prints to the console", correct: false },
    ],
    category: "programming-basics",
  },
  {
    id: "skill-2",
    question: "Which operator is used for strict equality comparison in JavaScript?",
    options: [
      { text: "==", correct: false },
      { text: "===", correct: true },
      { text: "=", correct: false },
      { text: "!==", correct: false },
    ],
    category: "programming-basics",
  },
  {
    id: "skill-3",
    question: "What is the purpose of a variable in programming?",
    options: [
      { text: "To store data values", correct: true },
      { text: "To execute code repeatedly", correct: false },
      { text: "To define a function", correct: false },
      { text: "To comment code", correct: false },
    ],
    category: "programming-basics",
  },
  {
    id: "skill-4",
    question: "In an array, what is an index?",
    options: [
      { text: "The value stored", correct: false },
      { text: "The position of an element", correct: true },
      { text: "The type of data", correct: false },
      { text: "The array name", correct: false },
    ],
    category: "data-structures",
  },
  {
    id: "skill-5",
    question: "Which data structure uses key-value pairs?",
    options: [
      { text: "Array", correct: false },
      { text: "Object / Dictionary", correct: true },
      { text: "Stack", correct: false },
      { text: "Queue", correct: false },
    ],
    category: "data-structures",
  },
  {
    id: "skill-6",
    question: "What is the output of the following code? console.log(2 + '2')",
    options: [
      { text: "4", correct: false },
      { text: "'22'", correct: true },
      { text: "NaN", correct: false },
      { text: "Error", correct: false },
    ],
    category: "programming-basics",
  },
  {
    id: "skill-7",
    question: "Which statement is used to handle errors in many programming languages?",
    options: [
      { text: "try-catch", correct: true },
      { text: "if-else", correct: false },
      { text: "switch", correct: false },
      { text: "for loop", correct: false },
    ],
    category: "programming-basics",
  },
  {
    id: "skill-8",
    question: "What does API stand for?",
    options: [
      { text: "Application Processing Interface", correct: false },
      { text: "Advanced Programming Integration", correct: false },
      { text: "Application Programming Interface", correct: true },
      { text: "Automated Program Instruction", correct: false },
    ],
    category: "web-basics",
  },
];

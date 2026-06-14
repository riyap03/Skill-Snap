export const CODING_CHALLENGES = [
  {
    id: "cc-1",
    title: "FizzBuzz",
    difficulty: "Beginner",
    prompt:
      "Write a program that prints numbers from 1 to 30. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', and for multiples of both print 'FizzBuzz'.",
    starterCode: "# Write your code here\n\n",
    constraints: [
      "Print each result on a new line",
      "Handle numbers from 1 to 30",
      "Order matters: FizzBuzz before Fizz and Buzz",
    ],
    expectedOutput:
      "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz",
    suggestedTime: 180,
    skills: ["JavaScript", "Python", "Loops", "Conditionals"],
  },
  {
    id: "cc-2",
    title: "Palindrome Checker",
    difficulty: "Beginner",
    prompt:
      "Write a function that checks if a given string is a palindrome (reads the same forwards and backwards). Ignore case and spaces. Test it with 'A man a plan a canal Panama'.",
    starterCode: "# Write your function here\n# Test with: 'A man a plan a canal Panama'\n\n",
    constraints: [
      "Ignore case and spaces",
      "Return True if palindrome, False otherwise",
      "Handle single character strings",
    ],
    expectedOutput: "True",
    suggestedTime: 120,
    skills: ["String Manipulation", "Functions", "JavaScript", "Python"],
  },
  {
    id: "cc-3",
    title: "Array Sum",
    difficulty: "Beginner",
    prompt:
      "Write a program that finds the sum of all numbers in an array. Test with the array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].",
    starterCode: "# Test array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n",
    constraints: [
      "Output should be a single number",
      "Handle empty arrays",
      "Handle negative numbers",
    ],
    expectedOutput: "55",
    suggestedTime: 90,
    skills: ["Arrays", "Loops", "JavaScript", "Python"],
  },
  {
    id: "cc-4",
    title: "Two Sum",
    difficulty: "Intermediate",
    prompt:
      "Given an array of integers and a target sum, find two numbers that add up to the target. Return their indices. Test with array [2, 7, 11, 15] and target 9.",
    starterCode: "# Array: [2, 7, 11, 15], Target: 9\n\n",
    constraints: [
      "Each input has exactly one solution",
      "You may not use the same element twice",
      "Return the two indices",
    ],
    expectedOutput: "0\n1",
    suggestedTime: 300,
    skills: ["Arrays", "Hash Maps", "Algorithms", "JavaScript", "Python"],
  },
  {
    id: "cc-5",
    title: "Factorial Calculator",
    difficulty: "Intermediate",
    prompt:
      "Write a program to calculate the factorial of a number. Test with input 5. Factorial of n is n * (n-1) * ... * 1.",
    starterCode: "# Calculate factorial of 5\n\n",
    constraints: [
      "Handle n = 0 (factorial is 1)",
      "Handle negative numbers appropriately",
      "Use recursion or iteration",
    ],
    expectedOutput: "120",
    suggestedTime: 150,
    skills: ["Recursion", "Loops", "Functions", "JavaScript", "Python"],
  },
  {
    id: "cc-6",
    title: "Reverse a String",
    difficulty: "Beginner",
    prompt:
      "Write a program that reverses a given string. Test with the string 'SkillSnap'.",
    starterCode: "# Reverse: 'SkillSnap'\n\n",
    constraints: [
      "Handle empty strings",
      "Preserve all characters including special chars",
      "Do not use built-in reverse function",
    ],
    expectedOutput: "paNlliKS",
    suggestedTime: 90,
    skills: ["String Manipulation", "JavaScript", "Python"],
  },
  {
    id: "cc-7",
    title: "Count Vowels",
    difficulty: "Beginner",
    prompt:
      "Write a program that counts the number of vowels in a given string. Test with 'SkillSnap Backend Assessment'.",
    starterCode: "# Count vowels in: 'SkillSnap Backend Assessment'\n\n",
    constraints: [
      "Consider a, e, i, o, u as vowels (case insensitive)",
      "Return just the count number",
      "Handle empty strings",
    ],
    expectedOutput: "8",
    suggestedTime: 90,
    skills: ["String Manipulation", "Loops", "JavaScript", "Python"],
  },
  {
    id: "cc-8",
    title: "Anagram Checker",
    difficulty: "Intermediate",
    prompt:
      "Write a program that checks if two strings are anagrams of each other. Test with 'listen' and 'silent'.",
    starterCode: "# Check: 'listen' and 'silent'\n\n",
    constraints: [
      "Ignore case and spaces",
      "Return True/False or equivalent",
      "Handle strings of different lengths",
    ],
    expectedOutput: "True",
    suggestedTime: 180,
    skills: ["String Manipulation", "Sorting", "JavaScript", "Python"],
  },
  {
    id: "cc-9",
    title: "Find Maximum",
    difficulty: "Beginner",
    prompt:
      "Write a program that finds the maximum number in an array without using built-in max functions. Test with [3, 7, 2, 9, 1, 5].",
    starterCode: "# Array: [3, 7, 2, 9, 1, 5]\n\n",
    constraints: [
      "Do not use Math.max or built-in max",
      "Handle single element arrays",
      "Handle negative numbers",
    ],
    expectedOutput: "9",
    suggestedTime: 90,
    skills: ["Arrays", "Loops", "JavaScript", "Python"],
  },
  {
    id: "cc-10",
    title: "Fibonacci Sequence",
    difficulty: "Intermediate",
    prompt:
      "Write a program that prints the first 10 numbers of the Fibonacci sequence (starting with 0, 1).",
    starterCode: "# Print first 10 Fibonacci numbers\n\n",
    constraints: [
      "Start with 0, 1",
      "Print each number on a new line",
      "Use iteration or recursion",
    ],
    expectedOutput: "0\n1\n1\n2\n3\n5\n8\n13\n21\n34",
    suggestedTime: 180,
    skills: ["Recursion", "Loops", "Sequence Generation", "JavaScript", "Python"],
  },
];

import { PrismaClient } from "@prisma/client";
import { 
  createQuestion, getQuestions, getQuestion, updateQuestion, deleteQuestion, validateQuestion 
} from "../questions.db.js";
import { beforeEach, afterAll, describe, test, expect } from '@jest/globals';

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.questions.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Questions Database Functions", () => {

  test("should validate a valid question", () => {
    const validQuestion = validateQuestion({
      categoryId: 1,
      question: "What is 2 + 2?",
      answer1: "3",
      answer2: "4",
      answer3: "5",
      answer4: "6",
      correct_answers: [false, true, false, false],
    });

    expect(validQuestion.success).toBe(true);
  });

  test("should reject an invalid question (question too short)", () => {
    const invalidQuestion = validateQuestion({
      categoryId: 1,
      question: "2+2?",
      answer1: "3",
      answer2: "4",
      answer3: "5",
      answer4: "6",
      correct_answers: [false, true, false, false],
    });

    expect(invalidQuestion.success).toBe(false);
  });

  test("should create a question", async () => {
    const newQuestion = await createQuestion({
      categoryId: 1,
      question: "What is 2 + 2?",
      answer1: "3",
      answer2: "4",
      answer3: "5",
      answer4: "6",
      correct_answers: [false, true, false, false],
    });

    expect(newQuestion).toHaveProperty("id");
    expect(newQuestion.question).toBe("What is 2 + 2?");
    expect(newQuestion.correct_answers).toEqual([false, true, false, false]);
  });

  test("should retrieve all questions", async () => {
    await createQuestion({
      categoryId: 1,
      question: "What is JavaScript?",
      answer1: "Programming Language",
      answer2: "Scripting Language",
      answer3: "Both",
      answer4: "Neither",
      correct_answers: [false, false, true, false],
    });

    const questions = await getQuestions();

    expect(questions.length).toBe(1);
    expect(questions[0].question).toBe("What is JavaScript?");
  });

  test("should retrieve a question by ID", async () => {
    const newQuestion = await createQuestion({
      categoryId: 1,
      question: "What is 2 + 3?",
      answer1: "4",
      answer2: "5",
      answer3: "6",
      answer4: "7",
      correct_answers: [false, true, false, false],
    });

    const question = await getQuestion(newQuestion.id);

    expect(question).not.toBeNull();
    expect(question?.question).toBe("What is 2 + 3?");
  });

  test("should update a question", async () => {
    const newQuestion = await createQuestion({
      categoryId: 1,
      question: "What is 10 + 5?",
      answer1: "14",
      answer2: "15",
      answer3: "16",
      answer4: "17",
      correct_answers: [false, true, false, false],
    });

    const updatedQuestion = await updateQuestion(newQuestion.id, { question: "What is 5 + 10?" });

    expect(updatedQuestion).not.toBeNull();
    expect(updatedQuestion?.question).toBe("What is 5 + 10?");
  });

  test("should delete a question", async () => {
    const newQuestion = await createQuestion({
      categoryId: 1,
      question: "What is the capital of France?",
      answer1: "London",
      answer2: "Paris",
      answer3: "Berlin",
      answer4: "Madrid",
      correct_answers: [false, true, false, false],
    });

    const deletedQuestion = await deleteQuestion(newQuestion.id);

    expect(deletedQuestion).not.toBeNull();
    const question = await getQuestion(newQuestion.id);
    expect(question).toBeNull();
  });

});

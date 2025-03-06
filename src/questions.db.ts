import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const QuestionSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer1: z.string(),
  answer2: z.string(),
  answer3: z.string(),
  answer4: z.string(),
  correct_answers: z.array(z.boolean()).length(4, 'Must have exactly 4 correct answers'),
});

const QuestionToCreateSchema = QuestionSchema.omit({ id: true });

type Question = z.infer<typeof QuestionSchema>;
type QuestionToCreate = z.infer<typeof QuestionToCreateSchema>;

const prisma = new PrismaClient();

export async function getQuestions(): Promise<Array<Question>> {
  const getQuestions = await prisma.questions.findMany();

  return getQuestions;
}

export async function getQuestion(id: number): Promise<Question | null> {
  const getQuestion = await prisma.questions.findUnique({ where: { id } });

  return getQuestion;
}

export function validateQuestion(questionToValidate: unknown) {
  const validateQuestion = QuestionToCreateSchema.safeParse(questionToValidate);

  return validateQuestion;
}

export async function createQuestion(questionToCreate: QuestionToCreate): Promise<Question> {
  const createQuestion = await prisma.questions.create({ data: questionToCreate });

  return createQuestion;
}

export async function updateQuestion(id: number, updates: Partial<QuestionToCreate>): Promise<Question | null> {
  try {
    const updateQuestion = await prisma.questions.update({
      where: { id },
      data: updates,
    });

    return updateQuestion;
  } catch (error) {
    console.error('Failed to update question:', error);
    return null;
  }
}

export async function deleteQuestion(id: number): Promise<Question | null> {
  try {
    const deleteQuestion = await prisma.questions.delete({ where: { id } });

    return deleteQuestion;
  } catch (error) {
    console.error('Failed to delete question:', error);
    return null;
  }
}

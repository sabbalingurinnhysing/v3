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
const prisma = new PrismaClient();
export async function getQuestions() {
    const getQuestions = await prisma.questions.findMany();
    return getQuestions;
}
export async function getQuestion(id) {
    const getQuestion = await prisma.questions.findUnique({ where: { id } });
    return getQuestion;
}
export function validateQuestion(questionToValidate) {
    const validateQuestion = QuestionToCreateSchema.safeParse(questionToValidate);
    return validateQuestion;
}
export async function createQuestion(questionToCreate) {
    const createQuestion = await prisma.questions.create({ data: questionToCreate });
    return createQuestion;
}
export async function updateQuestion(id, updates) {
    try {
        const updateQuestion = await prisma.questions.update({
            where: { id },
            data: updates,
        });
        return updateQuestion;
    }
    catch (error) {
        console.error('Failed to update question:', error);
        return null;
    }
}
export async function deleteQuestion(id) {
    try {
        const deleteQuestion = await prisma.questions.delete({ where: { id } });
        return deleteQuestion;
    }
    catch (error) {
        console.error('Failed to delete question:', error);
        return null;
    }
}

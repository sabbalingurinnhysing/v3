import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
const CategorySchema = z.object({
    id: z.number(),
    title: z
        .string()
        .min(3, 'title must be at least three letters')
        .max(1024, 'title must be at most 1024 letters'),
    slug: z.string(),
});
const CategoryToCreateSchema = z.object({
    title: z
        .string()
        .min(3, 'title must be at least three letters')
        .max(1024, 'title must be at most 1024 letters'),
});
const mockCategories = [
    {
        id: 1,
        slug: 'html',
        title: 'HTML',
    },
    {
        id: 2,
        slug: 'css',
        title: 'CSS',
    },
    {
        id: 3,
        slug: 'js',
        title: 'JavaScript',
    },
];
const prisma = new PrismaClient();
export async function getCategories() {
    const categories = await prisma.categories.findMany();
    console.log('categories :>> ', categories);
    return categories;
}
export function getCategory(slug) {
    const cat = mockCategories.find((c) => c.slug === slug);
    return cat ?? null;
}
export function validateCategory(categoryToValidate) {
    const result = CategoryToCreateSchema.safeParse(categoryToValidate);
    return result;
}
export async function createCategory(categoryToCreate) {
    const createdCategory = await prisma.categories.create({
        data: {
            title: categoryToCreate.title,
            slug: categoryToCreate.title.toLowerCase().replace(' ', '-'),
        },
    });
    return createdCategory;
}
export async function updateCategory(slug, updates) {
    try {
        const updatedCategory = await prisma.categories.update({
            where: { slug },
            data: {
                title: updates.title,
                slug: updates.title.toLowerCase().replace(' ', '-'),
            },
        });
        return updatedCategory;
    }
    catch (error) {
        console.error('Failed to update category:', error);
        return null;
    }
}
export async function deleteCategory(slug) {
    try {
        const deletedCategory = await prisma.categories.delete({
            where: { slug },
        });
        return deletedCategory;
    }
    catch (error) {
        console.error('Failed to delete category:', error);
        return null;
    }
}

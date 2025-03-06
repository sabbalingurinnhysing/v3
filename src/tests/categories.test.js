import { PrismaClient } from "@prisma/client";
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory, validateCategory } from '../categories.db.js';
import { beforeEach, afterAll, describe, test, expect } from '@jest/globals';
const prisma = new PrismaClient();
beforeEach(async () => {
    await prisma.categories.deleteMany();
});
afterAll(async () => {
    await prisma.$disconnect();
});
describe("Categories Database Functions", () => {
    test("should validate a valid category", () => {
        const validCategory = validateCategory({ title: "HTML" });
        expect(validCategory.success).toBe(true);
    });
    test("should reject an invalid category (title too short)", () => {
        const invalidCategory = validateCategory({ title: "H" });
        expect(invalidCategory.success).toBe(false);
    });
    test("should create a category", async () => {
        const newCategory = await createCategory({ title: "HTML" });
        expect(newCategory).toHaveProperty("id");
        expect(newCategory.title).toBe("HTML");
        expect(newCategory.slug).toBe("html");
    });
    test("should retrieve all categories", async () => {
        await createCategory({ title: "CSS" });
        const categories = await getCategories();
        expect(categories.length).toBe(1);
        expect(categories[0].title).toBe("CSS");
    });
    test("should retrieve a category by slug", async () => {
        await createCategory({ title: "JavaScript" });
        const category = getCategory("javascript");
        expect(category).not.toBeNull();
        expect(category?.title).toBe("JavaScript");
    });
    test("should update a category", async () => {
        await createCategory({ title: "Node.js" });
        const updatedCategory = await updateCategory("node-js", { title: "Updated Node.js" });
        expect(updatedCategory).not.toBeNull();
        expect(updatedCategory?.title).toBe("Updated Node.js");
    });
    test("should delete a category", async () => {
        await createCategory({ title: "React" });
        const deletedCategory = await deleteCategory("react");
        expect(deletedCategory).not.toBeNull();
        const category = getCategory("react");
        expect(category).toBeNull();
    });
});

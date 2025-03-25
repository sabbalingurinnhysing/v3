-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer1" TEXT NOT NULL,
    "answer2" TEXT NOT NULL,
    "answer3" TEXT NOT NULL,
    "answer4" TEXT NOT NULL,
    "correct_answers" BOOLEAN[],

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_title_key" ON "Categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_slug_key" ON "Categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Questions_question_key" ON "Questions"("question");

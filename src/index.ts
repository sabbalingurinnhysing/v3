import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createCategory, getCategories, getCategory, validateCategory, updateCategory, deleteCategory } from './categories.db.js'
import { getQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion, validateQuestion } from './questions.db.js';

const app = new Hono()

app.get('/', (c) => {

  const data =  {
    hello: 'hono'
  }

  return c.json(data)
})

app.get('/categories', async (c) => {
  const categories = await getCategories();
  return c.json(categories)
})

app.get('/categories/:slug', (c) => {
  const slug = c.req.param('slug')

  // Validate á hámarkslengd á slug

  const category = getCategory(slug)

  if (!category) {
    return c.json({ message: 'not found' }, 404)
  }

  return c.json(category);
})

app.post('/categories', async (c) => {
  let categoryToCreate: unknown;
  try {
    categoryToCreate = await c.req.json();
    console.log(categoryToCreate);
  } catch (e) {
    return c.json({ error: 'invalid json' }, 400)
  }

  const validCategory = validateCategory(categoryToCreate)

  if (!validCategory.success) {
    return c.json({ error: 'invalid data', errors: validCategory.error.flatten() }, 400)
  }

  const createdCategory = await createCategory(validCategory.data)

  return c.json(createdCategory, 201)
})

app.patch('/categories/:slug', async (c) => {
  const slug = c.req.param('slug');
  let categoryUpdates: unknown;

  try {
    categoryUpdates = await c.req.json();
    console.log('Received update data:', categoryUpdates);
  } catch (e) {
    return c.json({ error: 'Bad request' }, 400);
  }

  const validCategory = validateCategory(categoryUpdates);

  if (!validCategory.success) {
    console.log('Validation failed:', validCategory.error.flatten());
    return c.json({ error: 'Bad request', errors: validCategory.error.flatten() }, 400);
  }

  try {
    const updatedCategory = await updateCategory(slug, validCategory.data);

    if (!updatedCategory) {
      return c.json({ error: 'Not found' }, 404);
    }

    return c.json(updatedCategory, 200);
  } catch (e) {
    console.error('Error updating category:', e);
    return c.json({ error: 'Internal Error' }, 500);
  }
});

app.delete('/categories/:slug', async (c) => {
  const slug = c.req.param('slug');

  try {
    const deletedCategory = await deleteCategory(slug);

    if (!deletedCategory) {
      return c.json({ error: 'Not found' }, 404);
    }

    return c.json({ message: 'No content' }, 200);
  } catch (e) {
    console.error('Error deleting category:', e);
    return c.json({ error: 'Internal Error' }, 500);
  }
});

app.get('/questions', async (c) => {
  try {
    const questions = await getQuestions();
    return c.json(questions);
  } catch (e) {
    return c.json({ error: 'Internal Error' }, 500);
  }
});

app.get('/questions/:id', async (c) => {
  const id = Number(c.req.param('id'));

  try {
    const question = await getQuestion(id);
    if (!question) return c.json({ error: 'Not found' }, 404);
    return c.json(question);
  } catch (e) {
    return c.json({ error: 'Internal Error' }, 500);
  }
});

app.post('/questions', async (c) => {
  const data = await c.req.json();
  const validQuestion = validateQuestion(data);

  if (!validQuestion.success) {
    return c.json({ error: 'Bad request', errors: validQuestion.error.flatten() }, 400);
  }

  try {
    const newQuestion = await createQuestion(validQuestion.data);
    return c.json(newQuestion, 201);
  } catch (e) {
    return c.json({ error: 'Internal Error' }, 500);
  }
});

app.patch('/questions/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const data = await c.req.json();
  const validQuestion = validateQuestion(data);

  if (!validQuestion.success) {
    return c.json({ error: 'Bad request', errors: validQuestion.error.flatten() }, 400);
  }

  try {
    const updatedQuestion = await updateQuestion(id, validQuestion.data);
    if (!updatedQuestion) return c.json({ error: 'Not found' }, 404);
    return c.json(updatedQuestion);
  } catch (e) {
    return c.json({ error: 'Internal Error' }, 500);
  }
});

app.delete('/questions/:id', async (c) => {
  const id = Number(c.req.param('id'));

  try {
    const deleted = await deleteQuestion(id);
    if (!deleted) return c.json({ error: 'Not found' }, 404);
    return c.json({ message: 'No content' }, 200);
  } catch (e) {
    return c.json({ error: 'Internal Error' }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

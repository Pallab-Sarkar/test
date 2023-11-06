import request from 'supertest';
import app from '../index.js';


describe('CRUD API Test', () => {
  let bookId;

  // Test POST /tasks
  it('should create a new book', async () => {
    const response = await request(app)
      .post('/api/books/create')
      .send({ title: 'New title', author: 'pallab', summary: 'test1' });

    expect(response.body.title).toBe('New title');
    expect(response.body.author).toBe('pallab');
    expect(response.body.summary).toBe('test1');
    bookId = response.body._id;
  });

  // Test GET /tasks
  it('should get all tasks', async () => {
    const response = await request(app).get('/api/books/getAll')

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  // Test PUT /api/books/:id
  it('should update a book', async () => {
    const updatedTask = { title: 'Updated title' };
    const response = await request(app)
      .put(`/api/books/${bookId}`)
      .send(updatedTask);

    expect(response.status).toBe(200);
  });

  // Test DELETE /api/books/:id
  it('should delete a book', async () => {
    const response = await request(app).delete(`/api/books/${bookId}`)

    expect(response.status).toBe(200);
  });
});

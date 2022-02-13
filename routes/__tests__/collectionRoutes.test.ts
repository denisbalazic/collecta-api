import supertest from 'supertest';
import app from '../../app';
import { clearDatabase, closeDatabase, connectToDatabase } from '../../tests/testDbHandler';

const request = supertest(app);

describe('Collection endpoints', () => {
    beforeAll(async () => {
        await connectToDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    it('GET /collections should show all collections', async () => {
        const res = await request.get('/collections');
        expect(res.status).toEqual(200);
        // expect(res.body).toHaveProperty('name');
    });
});

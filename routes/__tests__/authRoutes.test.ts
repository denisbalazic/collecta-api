import supertest from 'supertest';
import app from '../../app';
import { clearDatabase, closeDatabase, connectToDatabase, seedDatabase } from '../../tests/testDbHandler';
import { authedUser, user } from '../../tests/dbSeeds';
import userModel from '../../models/userModel';

const request = supertest(app);

describe('Authentication endpoints', () => {
    const token = authedUser.user.tokens[0];

    beforeAll(async () => {
        await connectToDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    it('registers user with requested properties and returns token', async () => {
        const res = await request.post('/auth/register').send({
            name: 'Barbara',
            email: 'barbara@gnail.com',
            password: 'Password1!',
            confirmedPassword: 'Password1!',
        });
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('does not register user with bad request', async () => {
        const invalidRequests = [
            { email: 'barbara@gnail.com', password: 'Password1!', confirmedPassword: 'Password1!' },
            { name: 'Barbara', password: 'Password1!', confirmedPassword: 'Password1!' },
            { name: 'Barbara', email: 'barbara@gnail.com', confirmedPassword: 'Password1!' },
            { name: 'Barbara', email: 'barbara@gnail.com', password: 'Password1!' },
            { name: '', email: 'barbara@gnail.com', password: 'Password1!', confirmedPassword: 'Password1!' },
            { name: 'Barbara', email: '', password: 'Password1!', confirmedPassword: 'Password1!' },
            { name: 'Barbara', email: 'barbara@gnail.com', password: '', confirmedPassword: 'Password1!' },
            { name: 'Barbara', email: 'barbara@gnail.com', password: 'Password1!', confirmedPassword: '' },
            { name: 'B', email: 'barbara@gnail.com', password: 'Password1!', confirmedPassword: 'Password1!' },
            { name: 'Barbara', email: 'barbaragnail.com', password: 'Password1!', confirmedPassword: 'Password1!' },
            { name: 'Barbara', email: 'barbara@gnail.com', password: 'Password1!', confirmedPassword: 'XXXXXXXX' },
            { name: 'Barbara', email: 'barbara@gnail.com', password: 'password', confirmedPassword: 'password' },
            { name: 'Barbara', email: 'barbara@gnail.com', password: 'Pp1!', confirmedPassword: 'Pp1!' },
            {},
        ];
        // eslint-disable-next-line no-restricted-syntax
        for (const body of invalidRequests) {
            // eslint-disable-next-line no-await-in-loop
            const res = await request.post('/auth/register').send(body);
            expect(res.status).toEqual(400);
        }
    });

    it('logs in user with right credentials and returns token', async () => {
        await seedDatabase(userModel, [user.user]);
        const res = await request.post('/auth/login').send(user.credentials);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('does not log in user with bad credentials', async () => {
        await seedDatabase(userModel, [user.user]);
        const invalidRequests = [
            { email: 'wrongEmail@test.com', password: 'Password1!' },
            { email: 'testuser@test.com', password: 'wrongPassword' },
            { email: 'testuser@test.com', password: '' },
            { email: '', password: 'Password1!' },
            { email: 'testuser@test.com' },
            { password: 'Password1!' },
            {},
        ];
        // eslint-disable-next-line no-restricted-syntax
        for (const body of invalidRequests) {
            // eslint-disable-next-line no-await-in-loop
            const res = await request.post('/auth/login').send(body);
            expect(res.status).toEqual(401);
        }
    });

    it('logs out user from particular device, erases token from db', async () => {
        await seedDatabase(userModel, [authedUser.user]);
        const res = await request.post('/auth/logout').auth(token, { type: 'bearer' }).send();
        expect(res.status).toEqual(200);
        const resLoggedOut = await request.get('/collections').auth(token, { type: 'bearer' }).send();
        expect(resLoggedOut.status).toEqual(401);
    });

    it('logs out user from all devices', async () => {
        await seedDatabase(userModel, [authedUser.user]);
        const res = await request.post('/auth/logout-all').auth(token, { type: 'bearer' }).send();
        expect(res.status).toEqual(200);
        // eslint-disable-next-line no-restricted-syntax
        for (const tok of authedUser.credentials.tokens) {
            // eslint-disable-next-line no-await-in-loop
            const resLoggedOut = await request.get('/collections').auth(tok, { type: 'bearer' }).send();
            expect(resLoggedOut.status).toEqual(401);
        }
    });
});

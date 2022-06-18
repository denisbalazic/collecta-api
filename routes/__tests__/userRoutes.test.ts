import supertest from 'supertest';
import app from '../../app';
import { clearDatabase, closeDatabase, connectToDatabase, seedDatabase } from '../../tests/testDbHandler';
import { authedUser } from '../../tests/dbSeeds';
import userModel from '../../models/userModel';

const request = supertest(app);

describe('User endpoints', () => {
    const token = authedUser.user.tokens[0];
    const nonexistentId = '6207a4ad48e6c1fceb15555d';

    beforeAll(async () => {
        await connectToDatabase();
    });

    beforeEach(async () => {
        await seedDatabase(userModel, [authedUser.user]);
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    it('retrieves logged user', async () => {
        const res = await request.get('/users/me').auth(token, { type: 'bearer' });
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(authedUser.user._id);
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('email');
    });

    it('updates logged user basic data', async () => {
        const res = await request.put('/users/me').auth(token, { type: 'bearer' }).send({
            _id: authedUser.user._id,
            name: 'Barbara',
            email: 'barbara@gnail.com',
        });
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(authedUser.user._id);
        expect(res.body.name).toEqual('Barbara');
    });

    it('does not update logged user with bad request', async () => {
        const invalidRequests = [
            { _id: authedUser.user._id, name: 'Barbara' },
            { _id: authedUser.user._id, email: 'barbara@gnail.com' },
            { _id: authedUser.user._id, name: 'Barbara', email: 'barbara@gnail.com', password: 'Password1!' },
            { _id: authedUser.user._id, name: '', email: 'barbara@gnail.com', confirmedPassword: 'Password1!' },
            { _id: authedUser.user._id, name: '', email: 'barbara@gnail.com', nonexistentProperty: 'XXXXXX' },
            { _id: authedUser.user._id, name: 'Barbara', email: '' },
            { _id: authedUser.user._id, name: 'B', email: 'barbara@gnail.com' },
            { _id: authedUser.user._id, name: 'Barbaraarbararbararbarabarabarabarab', email: 'barbara@gnail.com' },
        ];
        const invalidRequestsWithoutId = [
            { _id: nonexistentId, name: 'Barbara', email: 'barbara@gnail.com' },
            { name: 'Barbara', email: 'barbara@gnail.com' },
            {},
        ];
        // eslint-disable-next-line no-restricted-syntax
        for (const body of invalidRequests) {
            // eslint-disable-next-line no-await-in-loop
            const res = await request.put('/users/me').auth(token, { type: 'bearer' }).send(body);
            expect(res.status).toEqual(400);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const body of invalidRequestsWithoutId) {
            // eslint-disable-next-line no-await-in-loop
            const res = await request.put('/users/me').auth(token, { type: 'bearer' }).send(body);
            expect(res.status).toEqual(403);
        }
    });

    it('updates logged user password', async () => {
        const res = await request.put('/users/me/password-update').auth(token, { type: 'bearer' }).send({
            _id: authedUser.user._id,
            oldPassword: authedUser.credentials.password,
            password: 'Password2@',
            confirmedPassword: 'Password2@',
        });
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(authedUser.user._id);
    });

    it('does not update logged user with bad request', async () => {
        const invalidRequests = [
            {
                _id: authedUser.user._id,
                oldPassword: 'InvalidPassword!!!',
                password: 'Password2@',
                confirmedPassword: 'Password2@',
            },
            {
                _id: authedUser.user._id,
                password: 'Password2@',
                confirmedPassword: 'Password2@',
            },
            {
                _id: authedUser.user._id,
                oldPassword: authedUser.credentials.password,
                password: 'Password2@',
            },
            {
                _id: authedUser.user._id,
                oldPassword: authedUser.credentials.password,
                password: 'Password2@',
                confirmedPassword: 'XXXXXXXX',
            },
        ];
        // eslint-disable-next-line no-restricted-syntax
        for (const body of invalidRequests) {
            // eslint-disable-next-line no-await-in-loop
            const res = await request.put('/users/me').auth(token, { type: 'bearer' }).send(body);
            expect(res.status).toEqual(400);
        }
    });

    it('deletes logged user', async () => {
        const res = await request.delete('/users/me').auth(token, { type: 'bearer' });
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(authedUser.user._id);
        const resDeleted = await request.get('/users/me').auth(token, { type: 'bearer' });
        expect(resDeleted.status).toEqual(401);
    });
});

import supertest from 'supertest';
import app from '../../app';
import { clearDatabase, closeDatabase, connectToDatabase, seedDatabase } from '../../tests/testDbHandler';
import collectionModel from '../../models/collectionModel';
import { authedUser, collectionsSeed } from '../../tests/dbSeeds';
import userModel from '../../models/userModel';

const request = supertest(app);

describe('Collection endpoints', () => {
    const id1 = collectionsSeed[0]._id;
    const id2 = collectionsSeed[1]._id;
    const nonexistentId = '6207a4ad48e6c1fceb15555d';
    const token = authedUser.user.tokens[0];
    const collectionForCreation = {
        name: 'Hulk33',
        description: 'bla bla',
        type: 'COMIC',
        visibility: 'PUBLIC',
        admins: ['63b0810445f6b33f72afe6f0'],
        openItemUpdating: true,
        itemProperties: [
            {
                label: 'name',
                type: 'TEXT',
                required: false,
                unique: false,
                options: ['option1', 'option2'],
            },
        ],
    };

    beforeAll(async () => {
        await connectToDatabase();
    });

    beforeEach(async () => {
        await seedDatabase(userModel, [authedUser.user]);
        await seedDatabase(collectionModel, collectionsSeed);
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    it('GET /collections should show all collections', async () => {
        const res = await request.get('/collections?page=1&size=10').auth(token, { type: 'bearer' });
        expect(res.status).toEqual(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.pagination.numberOfElements).toEqual(2);
    });

    it('GET /collections should filter collections', async () => {
        const res = await request
            .get('/collections?page=1&size=10&filters=type:STICKER:eq')
            .auth(token, { type: 'bearer' });
        expect(res.status).toEqual(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.pagination.numberOfElements).toEqual(1);
        expect(res.body.data[0].type).toEqual('STICKER');
    });

    it('GET /collection with specified id should fetch it', async () => {
        const res = await request.get(`/collections/${id1}`).auth(token, { type: 'bearer' });
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(id1);
    });

    it('GET /collection with nonexistent id should respond with 404', async () => {
        const res = await request.get(`/collections/${nonexistentId}`).auth(token, { type: 'bearer' });
        expect(res.status).toEqual(404);
    });

    it('POST /collections should create collection in db and return it with id', async () => {
        const res = await request.post('/collections').auth(token, { type: 'bearer' }).send(collectionForCreation);
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name');
        expect(res.body.name).toEqual('Hulk33');
    });

    it('POST /collections should prevent invalid requests', async () => {
        // TODO: add more tests
        const invalidRequests = [
            { name: 'A' },
            { name: 'Abracadabracadabraabracadabra' },
            { name: 23 },
            { somethingElse: 'Something else' },
            {},
        ];
        // eslint-disable-next-line no-restricted-syntax
        for (const body of invalidRequests) {
            // eslint-disable-next-line no-await-in-loop
            const res = await request.post('/collections').auth(token, { type: 'bearer' }).send(body);
            expect(res.status).toEqual(400);
        }
    });

    it('PUT /collections/:id should update collection in db and return updated collection', async () => {
        const res = await request.put(`/collections/${id1}`).auth(token, { type: 'bearer' }).send(collectionsSeed[0]);
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(id1);
        expect(res.body.name).toEqual('Hulk');
    });

    it('PUT /collections/:id with nonexistent id should respond with 404', async () => {
        const res = await request
            .put(`/collections/${nonexistentId}`)
            .auth(token, { type: 'bearer' })
            .send({ ...collectionsSeed[0], _id: nonexistentId });
        expect(res.status).toEqual(404);
    });

    it('PUT /collections should prevent invalid requests', async () => {
        // TODO: add more tests
        const invalidRequests = [
            { name: 'A' },
            { name: 'Abracadabracadabraabracadabra' },
            { name: 23 },
            { somethingElse: 'Something else' },
            {},
            { _id: id2, name: 'Didi' },
        ];
        // eslint-disable-next-line no-restricted-syntax
        for (const body of invalidRequests) {
            // eslint-disable-next-line no-await-in-loop
            const res = await request.put(`/collections/${id1}`).auth(token, { type: 'bearer' }).send(body);
            expect(res.status).toEqual(400);
        }
    });

    it('DELETE /collections/:id should delete collection in db and return deleted collection', async () => {
        const res = await request.delete(`/collections/${id1}`).auth(token, { type: 'bearer' });
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(id1);
        const resAll = await request.get('/collections?page=1&size=10').auth(token, { type: 'bearer' });
        expect(resAll.body.data).toHaveLength(1);
        const resDeleted = await request.get(`/collections/${id1}`).auth(token, { type: 'bearer' });
        expect(resDeleted.status).toEqual(404);
    });

    it('DELETE /collections/:id with nonexistent id should respond with 404', async () => {
        const res = await request.delete(`/collections/${nonexistentId}`).auth(token, { type: 'bearer' });
        expect(res.status).toEqual(404);
    });
});

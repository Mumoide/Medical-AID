const { getAllUsers } = require('../../../controllers/userController');
const { Users } = require('../../../models');

jest.mock('../../../models');

describe('getAllUsers Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {}; // No request body or params are needed for this test

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        console.error.mockRestore();
    });

    it('should return all users successfully', async () => {
        const mockUsers = [
            {
                id_user: 1,
                email: 'test1@example.com',
                created_at: '2024-11-23T10:00:00Z',
                active: true,
                profile: {
                    names: 'John',
                    last_names: 'Doe',
                },
                roles: [
                    {
                        id_role: 1,
                        role: {
                            role_name: 'Admin',
                        },
                    },
                ],
            },
            {
                id_user: 2,
                email: 'test2@example.com',
                created_at: '2024-11-22T10:00:00Z',
                active: false,
                profile: {
                    names: 'Jane',
                    last_names: 'Smith',
                },
                roles: [
                    {
                        id_role: 2,
                        role: {
                            role_name: 'User',
                        },
                    },
                ],
            },
        ];

        Users.findAll.mockResolvedValue(mockUsers);

        await getAllUsers(req, res);

        expect(Users.findAll).toHaveBeenCalledWith({
            attributes: ['id_user', 'email', 'created_at', 'active'],
            include: [
                {
                    model: expect.anything(), // UserProfiles model
                    as: 'profile',
                    attributes: ['names', 'last_names'],
                },
                {
                    model: expect.anything(), // UserRoles model
                    as: 'roles',
                    attributes: ['id_role'],
                    include: [
                        {
                            model: expect.anything(), // Roles model
                            as: 'role',
                            attributes: ['role_name'],
                        },
                    ],
                },
            ],
            logging: console.log,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 if a server error occurs', async () => {
        Users.findAll.mockRejectedValue(new Error('Database error')); // Simulate database error

        await getAllUsers(req, res);

        expect(Users.findAll).toHaveBeenCalledWith({
            attributes: ['id_user', 'email', 'created_at', 'active'],
            include: [
                {
                    model: expect.anything(),
                    as: 'profile',
                    attributes: ['names', 'last_names'],
                },
                {
                    model: expect.anything(),
                    as: 'roles',
                    attributes: ['id_role'],
                    include: [
                        {
                            model: expect.anything(),
                            as: 'role',
                            attributes: ['role_name'],
                        },
                    ],
                },
            ],
            logging: console.log,
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching users' });
        expect(console.error).toHaveBeenCalledWith('Error fetching users:', expect.any(Error));
    });
});

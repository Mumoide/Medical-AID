const { getUserById } = require('../../../controllers/userController');
const { Users, UserProfiles, UserRoles, Roles } = require('../../../models');

jest.mock('../../../models');

describe('getUserById Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: '1', // Valid userId for the test
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should return 400 if the userId is invalid', async () => {
        req.params.id = 'invalid-id'; // Invalid userId

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID provided.' });
    });

    it('should return 404 if the user is not found', async () => {
        Users.findOne.mockResolvedValue(null); // Simulate no user found

        await getUserById(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({
            where: { id_user: req.params.id },
            include: [
                {
                    model: UserProfiles,
                    as: 'profile',
                    attributes: [
                        'names',
                        'last_names',
                        'birthdate',
                        'weight',
                        'height',
                        'gender',
                        'address',
                        'comune',
                        'phone_number',
                    ],
                },
                {
                    model: UserRoles,
                    as: 'roles',
                    include: [
                        {
                            model: Roles,
                            as: 'role',
                            attributes: ['role_name'],
                        },
                    ],
                },
            ],
            attributes: ['id_user', 'email', 'active'],
        });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return the user data successfully', async () => {
        const mockUser = {
            id_user: 1,
            email: 'test@example.com',
            active: true,
            profile: {
                names: 'John',
                last_names: 'Doe',
                birthdate: '1990-01-01',
                weight: 75,
                height: 180,
                gender: 'Masculino',
                address: '123 Test St',
                comune: 'Test City',
                phone_number: '123456789',
            },
            roles: [
                {
                    role: {
                        role_name: 'Admin',
                    },
                },
            ],
        };

        Users.findOne.mockResolvedValue(mockUser);

        await getUserById(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({
            where: { id_user: req.params.id },
            include: [
                {
                    model: UserProfiles,
                    as: 'profile',
                    attributes: [
                        'names',
                        'last_names',
                        'birthdate',
                        'weight',
                        'height',
                        'gender',
                        'address',
                        'comune',
                        'phone_number',
                    ],
                },
                {
                    model: UserRoles,
                    as: 'roles',
                    include: [
                        {
                            model: Roles,
                            as: 'role',
                            attributes: ['role_name'],
                        },
                    ],
                },
            ],
            attributes: ['id_user', 'email', 'active'],
        });
        expect(res.status).not.toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 500 if a server error occurs', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error')); // Simulate database error

        await getUserById(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({
            where: { id_user: req.params.id },
            include: [
                {
                    model: UserProfiles,
                    as: 'profile',
                    attributes: [
                        'names',
                        'last_names',
                        'birthdate',
                        'weight',
                        'height',
                        'gender',
                        'address',
                        'comune',
                        'phone_number',
                    ],
                },
                {
                    model: UserRoles,
                    as: 'roles',
                    include: [
                        {
                            model: Roles,
                            as: 'role',
                            attributes: ['role_name'],
                        },
                    ],
                },
            ],
            attributes: ['id_user', 'email', 'active'],
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching user data' });
    });
});

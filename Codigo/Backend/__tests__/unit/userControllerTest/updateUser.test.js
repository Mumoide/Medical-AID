const { updateUser } = require('../../../controllers/userController');
const { Users, UserProfiles, UserRoles, Roles } = require('../../../models');

jest.mock('../../../models');

describe('updateUser Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '1' },
            body: {
                email: 'updated@example.com',
                profile: {
                    names: 'Updated',
                    last_names: 'User',
                    birthdate: '1990-01-01',
                    gender: 'Masculino',
                    height: 180,
                    weight: 75,
                    phone_number: '987654321',
                    address: '123 Updated St',
                    comune: 'Updated City',
                },
                role: 'Admin',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('should return 404 if the user is not found', async () => {
        Users.findOne.mockResolvedValue(null);

        await updateUser(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { id_user: req.params.id } });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 400 if the role is invalid', async () => {
        Users.findOne.mockResolvedValue({ id_user: 1 });
        req.body.role = 'InvalidRole';

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid role.' });
    });

    it('should return 400 if the role is not found', async () => {
        Users.findOne.mockResolvedValue({ id_user: 1 });
        Roles.findOne.mockImplementation((query) => {
            if (query.where.role_name === req.body.role) {
                return null; // Simulate role not found
            }
            return { id_role: 2 }; // Simulate valid role
        });


        await updateUser(req, res);

        expect(Roles.findOne).toHaveBeenCalledWith({ where: { role_name: req.body.role } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Role not found.' });
    });

    it('should update the user successfully', async () => {
        const mockUser = { id_user: 1, update: jest.fn() };
        const mockUserProfile = { id_user: 1, update: jest.fn() };
        const mockUserRole = { id_user: 1, id_role: 2, update: jest.fn() };
        const mockRole = { id_role: 2 };

        console.log('Mock User:', mockUser);
        console.log('Mock UserProfile:', mockUserProfile);
        console.log('Mock UserRole:', mockUserRole);

        Users.findOne.mockResolvedValue(mockUser);
        UserProfiles.findOne.mockResolvedValue(mockUserProfile);
        UserRoles.findOne.mockResolvedValue(mockUserRole);
        Roles.findOne.mockResolvedValue(mockRole);

        await updateUser(req, res);

        // Validate interactions
        expect(Users.findOne).toHaveBeenCalledWith({ where: { id_user: req.params.id } });
        expect(Roles.findOne).toHaveBeenCalledWith({ where: { role_name: req.body.role } });

        expect(mockUser.update).toHaveBeenCalledWith({ email: req.body.email });
        expect(mockUserProfile.update).toHaveBeenCalledWith(req.body.profile);
        expect(mockUserRole.update).toHaveBeenCalledWith({ id_role: mockRole.id_role });
        expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully.' });
    });




    it('should create a user profile if it does not exist', async () => {
        const mockUser = { id_user: 1, update: jest.fn() };
        const mockRole = { id_role: 2 };

        Users.findOne.mockResolvedValue(mockUser);
        Roles.findOne.mockResolvedValue(mockRole);
        UserProfiles.findOne.mockResolvedValue(null);
        UserProfiles.create.mockResolvedValue({});

        await updateUser(req, res);

        expect(UserProfiles.create).toHaveBeenCalledWith({
            id_user: req.params.id,
            ...req.body.profile,
        });
    });

    it('should create a user role if it does not exist', async () => {
        const mockUser = { id_user: 1, update: jest.fn() };
        const mockRole = { id_role: 2 };

        Users.findOne.mockResolvedValue(mockUser);
        Roles.findOne.mockResolvedValue(mockRole);
        UserRoles.findOne.mockResolvedValue(null);
        UserRoles.create.mockResolvedValue({});

        await updateUser(req, res);

        expect(UserRoles.create).toHaveBeenCalledWith({
            id_user: req.params.id,
            id_role: mockRole.id_role,
        });
    });

    it('should return 500 if a server error occurs', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while updating the user.' });
    });
});

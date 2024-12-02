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

        jest.clearAllMocks(); // Clear mocks between tests
        jest.spyOn(console, 'log').mockImplementation(() => { }); // Suppress logs for cleaner output
        UserProfiles.findOne.mockResolvedValue(null); // Reset to return null for every test
        UserProfiles.create.mockResolvedValue({}); // Simulate profile creation
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
        const mockUser = {
            id_user: 1,
            update: jest.fn().mockResolvedValue({}),
        };

        Users.findOne.mockResolvedValue(mockUser);

        await updateUser(req, res);

        expect(mockUser.update).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.json).toHaveBeenCalledWith({ message: "User updated successfully." });
    });

    it('should create a user profile if it does not exist', async () => {
        // Mock user and simulate no existing profile
        Users.findOne.mockResolvedValue({ id_user: 1, email: 'old@example.com', update: jest.fn() });
        UserProfiles.findOne.mockResolvedValue(null); // Simulate profile not found
        UserProfiles.create.mockResolvedValue({}); // Simulate profile creation

        // Call the updateUser function
        await updateUser(req, res);

        // Debugging logs
        console.log('UserProfiles.findOne calls:', UserProfiles.findOne.mock.calls);
        console.log('UserProfiles.create calls:', UserProfiles.create.mock.calls);

        // Verify `UserProfiles.create` is called with correct arguments
        expect(UserProfiles.create).toHaveBeenCalledWith({
            id_user: req.params.id, // Ensure correct user ID is passed
            names: req.body.profile.names,
            last_names: req.body.profile.last_names,
            birthdate: req.body.profile.birthdate,
            gender: req.body.profile.gender,
            height: req.body.profile.height,
            weight: req.body.profile.weight,
            phone_number: req.body.profile.phone_number,
            address: req.body.profile.address,
            comune: req.body.profile.comune,
        });

        // Verify the response
        expect(res.json).toHaveBeenCalledWith({ message: "User updated successfully." });
    });

    it('should return 500 if a server error occurs', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while updating the user.' });
    });
});

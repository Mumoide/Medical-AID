const { registerAdmin } = require('../../../controllers/userController');
const { Users, UserProfiles, UserRoles } = require('../../../models');
const bcrypt = require('bcryptjs');

jest.mock('../../../models');
jest.mock('bcryptjs');

jest.mock('../../../helpers/validateForm', () => ({
    validateForm: jest.fn(() => ({ isValid: true })),
}));


describe('registerUser Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'securepassword',
                profile: {
                    names: 'John',
                    last_names: 'Doe Smith',
                    birthdate: '1990-01-01',
                    gender: 'Masculino',
                    height: 180,
                    weight: 75,
                    phone_number: '123456789',
                    address: '123 Test St',
                    comune: 'Test City',
                },
            },
        };

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

    it('should register an admin user successfully', async () => {
        Users.findOne.mockResolvedValue(null); // No existing user
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashedpassword');
        Users.create.mockResolvedValue({ id_user: 1 }); // Mocked user creation
        UserRoles.create.mockResolvedValue({}); // Mock role creation
        UserProfiles.create.mockResolvedValue({}); // Mock profile creation

        Users.create.mockResolvedValue({ id_user: 1 })

        await registerAdmin(req, res);

        Users.create.mock.calls
        res.json.mock.calls

        expect(Users.findOne).toHaveBeenCalledTimes(1);
        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 'salt');
        expect(Users.create).toHaveBeenCalledWith({
            email: req.body.email,
            password_hash: 'hashedpassword',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Admin registrado con éxito',
            userId: 1,
        });
    });



    it('should return 400 if the email is already registered', async () => {
        Users.findOne.mockResolvedValue({ id_user: 1 }); // Simulate existing user

        await registerAdmin(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Correo ya registrado en el sistema.',
        });
    });

    it('should return 400 for validation errors', async () => {
        req.body.email = ''; // Invalid email

        await registerAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Debe ingresar un correo electrónico.',
        });
    });

    it('should return 500 for server errors', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error')); // Simulate database error

        await registerAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error del servidor' });
        expect(console.error).toHaveBeenCalledWith('Error registering admin:', expect.any(Error));
    });
});

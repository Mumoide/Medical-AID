const { registerUser } = require('../../../controllers/userController');
const { Users, UserProfiles, UserRoles } = require('../../../models');
const bcrypt = require('bcryptjs');

jest.mock('../../../models');
jest.mock('bcryptjs');

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

    it('should register a new user successfully', async () => {
        // Mock database and bcrypt methods
        Users.findOne.mockResolvedValue(null); // Simulate no existing user
        bcrypt.genSalt.mockResolvedValue('salt'); // Mock bcrypt salt generation
        bcrypt.hash.mockResolvedValue('hashedpassword'); // Mock password hashing
        Users.create.mockResolvedValue({ id_user: 3 }); // Simulate user creation with id_user: 3
        UserRoles.create.mockResolvedValue({}); // Simulate role creation
        UserProfiles.create.mockResolvedValue({}); // Simulate profile creation

        // Call the controller
        await registerUser(req, res);

        // Verify method calls and arguments
        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 'salt');
        expect(Users.create).toHaveBeenCalledWith({
            email: req.body.email,
            password_hash: 'hashedpassword',
        });
        expect(UserRoles.create).toHaveBeenCalledWith({ id_role: 3 }); // Ensure id_user matches mocked value
        expect(UserProfiles.create).toHaveBeenCalledWith({
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

        // Verify response
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario registrado con éxito', // Ensure response matches mocked id_user
        });
    });


    it('should return 400 if the email is already registered', async () => {
        Users.findOne.mockResolvedValue({ id_user: 3 });

        await registerUser(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Correo ya registrado en el sistema.',
        });
    });

    it('should return 400 for validation errors', async () => {
        req.body.email = ''; // Invalid email

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Debe ingresar un correo electrónico.',
        });
    });

    it('should return 500 for server errors', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error del servidor' });
        expect(console.error).toHaveBeenCalledWith('Error registering user:', expect.any(Error));
    });
});

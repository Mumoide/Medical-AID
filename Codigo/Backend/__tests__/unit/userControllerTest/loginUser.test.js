const { loginUser } = require('../../../controllers/userController');
const { Users, Sessions } = require('../../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../../models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('loginUser Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'securepassword',
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

    it('should log in the user successfully', async () => {
        const mockUser = {
            id_user: 1,
            email: 'test@example.com',
            password_hash: 'hashedpassword',
            lockout_until: null,
            failed_attempts: 0,
            update: jest.fn(),
            increment: jest.fn(),
            roles: [{ id_role: 3 }],
            profile: { names: 'John', last_names: 'Doe Smith' },
        };

        const mockToken = 'mockToken';

        Users.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true); // Simulate password match
        jwt.sign.mockReturnValue(mockToken);
        Sessions.create.mockResolvedValue({});

        await loginUser(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({
            where: { email: req.body.email },
            include: expect.any(Array),
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password_hash);
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id_user: mockUser.id_user,
                email: mockUser.email,
                nombre: 'John Doe',
                role_id: 3,
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        expect(Sessions.create).toHaveBeenCalledWith({
            id_user: mockUser.id_user,
            session_token: mockToken,
            created_at: expect.any(String),
            expires_at: expect.any(String),
            updated_at: expect.any(String),
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Inicio de sesión exitoso',
            token: mockToken,
            userId: mockUser.id_user,
            email: mockUser.email,
            nombre: 'John Doe',
        });
    });

    it('should return 400 if the email is not found', async () => {
        Users.findOne.mockResolvedValue(null); // Simulate user not found

        await loginUser(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({
            where: { email: req.body.email },
            include: expect.any(Array),
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Correo o contraseña incorrectos' });
    });

    it('should return 403 if the user is locked out', async () => {
        const mockUser = {
            lockout_until: new Date(Date.now() + 60 * 1000), // Locked out for 1 minute
        };

        Users.findOne.mockResolvedValue(mockUser);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: expect.stringContaining('Cuenta bloqueada'),
        }));
    });

    it('should return 400 for invalid password', async () => {
        const mockUser = {
            id_user: 1,
            email: 'test@example.com',
            password_hash: 'hashedpassword',
            failed_attempts: 1,
            increment: jest.fn(),
            update: jest.fn(),
        };

        Users.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); // Simulate password mismatch

        await loginUser(req, res);

        expect(mockUser.increment).toHaveBeenCalledWith('failed_attempts');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Correo o contraseña incorrectos' });
    });

    it('should return 403 and lockout user after multiple failed attempts', async () => {
        const mockUser = {
            id_user: 1,
            email: 'test@example.com',
            password_hash: 'hashedpassword',
            failed_attempts: 2, // Already failed twice
            lockout_count: 0,
            increment: jest.fn().mockImplementation(() => {
                mockUser.failed_attempts += 1; // Simulate incrementing failed_attempts
            }),
            update: jest.fn(),
        };

        Users.findOne.mockResolvedValue(mockUser); // Simulate finding the user
        bcrypt.compare.mockResolvedValue(false); // Simulate password mismatch

        await loginUser(req, res); // Call the controller

        // Verify increment and update calls
        expect(mockUser.increment).toHaveBeenCalledWith('failed_attempts'); // Ensure increment is called
        expect(mockUser.failed_attempts).toBe(3); // Ensure failed_attempts is updated to 3
        expect(mockUser.update).toHaveBeenCalledWith(expect.objectContaining({
            failed_attempts: 0, // Reset to 0
            lockout_until: expect.any(Date), // Ensure lockout_until is updated
        }));

        // Verify response
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: expect.stringContaining('Cuenta bloqueada por'),
        }));
    });



    it('should return 500 for server errors', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error')); // Simulate database error

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error del servidor' });
        expect(console.error).toHaveBeenCalledWith('Error during login:', expect.any(Error));
    });
});

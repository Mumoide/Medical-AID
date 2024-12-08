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

    it('should mock bcrypt.compare correctly', async () => {
        // Mock bcrypt.compare
        bcrypt.compare.mockResolvedValue(true);

        const password = 'securepassword';
        const hashedPassword = 'hashedpassword';

        // Call bcrypt.compare
        const isMatch = await bcrypt.compare(password, hashedPassword);

        // Debugging log
        console.log('bcrypt.compare result:', isMatch);

        // Assertions
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
        expect(isMatch).toBe(true);
    });

    it('should log in the user successfully and create a new session', async () => {
        // Mock bcrypt.compare
        bcrypt.compare.mockResolvedValueOnce(true); // Simulate password match

        const mockUser = {
            id_user: 1,
            email: 'test@example.com',
            password_hash: 'hashedpassword', // Simulated hashed password
            lockout_until: null,
            failed_attempts: 0,
            roles: [{ id_role: 3 }],
            profile: { names: 'John', last_names: 'Doe Smith' },
            update: jest.fn(),
        };

        const mockToken = 'mockToken';

        // Mock Users and Sessions
        Users.findOne.mockResolvedValueOnce(mockUser); // Simulate finding a user
        Sessions.findOne.mockResolvedValueOnce(null); // Simulate no active session
        Sessions.create.mockResolvedValueOnce({}); // Simulate successful session creation
        jwt.sign.mockReturnValueOnce(mockToken); // Simulate token generation

        // Call the function
        await loginUser(req, res);

        // Assertions
        expect(Users.findOne).toHaveBeenCalledWith({
            where: { email: req.body.email },
            include: expect.any(Array),
        });

        expect(bcrypt.compare).toHaveBeenCalledTimes(1); // Ensure bcrypt.compare is called
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password_hash); // Ensure correct arguments

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


    it('should log in the user successfully and create a new session', async () => {
        // Mock bcrypt.compare
        bcrypt.compare.mockResolvedValueOnce(true); // Simulate password match

        const mockUser = {
            id_user: 1,
            email: 'test@example.com',
            password_hash: 'hashedpassword', // Simulated hashed password
            lockout_until: null,
            failed_attempts: 0,
            roles: [{ id_role: 3 }],
            profile: { names: 'John', last_names: 'Doe Smith' },
            update: jest.fn(),
        };

        const mockToken = 'mockToken';

        // Mock Users and Sessions
        Users.findOne.mockResolvedValueOnce(mockUser); // Simulate finding a user
        Sessions.findOne.mockResolvedValueOnce(null); // Simulate no active session
        Sessions.create.mockResolvedValueOnce({}); // Simulate successful session creation
        jwt.sign.mockReturnValueOnce(mockToken); // Simulate token generation

        // Call the function
        await loginUser(req, res);

        // Assertions
        expect(Users.findOne).toHaveBeenCalledWith({
            where: { email: req.body.email },
            include: expect.any(Array),
        });

        expect(bcrypt.compare).toHaveBeenCalledTimes(1); // Ensure bcrypt.compare is called
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password_hash); // Ensure correct arguments

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

    it('should update the expiration time for an active session', async () => {
        const mockUser = {
            id_user: 1,
            email: 'test@example.com',
            password_hash: 'hashedpassword',
            lockout_until: null,
            failed_attempts: 0,
            roles: [{ id_role: 3 }],
            profile: { names: 'John', last_names: 'Doe Smith' },
        };

        const activeSession = {
            id: 1,
            expires_at: new Date(Date.now() + 60 * 1000).toISOString(), // Active session
        };

        const updatedToken = 'updatedMockToken';

        // Mock Sequelize methods
        Users.findOne.mockResolvedValueOnce(mockUser); // Simulate user found
        Sessions.findOne.mockResolvedValueOnce(activeSession); // Simulate active session
        bcrypt.compare.mockResolvedValueOnce(true); // Simulate password match
        jwt.sign.mockReturnValueOnce(updatedToken); // Simulate token generation
        Sessions.update.mockResolvedValueOnce([1]); // Simulate successful session update

        // Call the function
        await loginUser(req, res);

        // Assertions
        expect(Sessions.findOne).toHaveBeenCalledWith({
            where: { id_user: mockUser.id_user }, // Ensure correct id_user is queried
        });

        expect(Sessions.update).toHaveBeenCalledWith(
            expect.objectContaining({
                session_token: updatedToken, // Validate updated token
                expires_at: expect.any(String), // Ensure expiration time is updated
            }),
            { where: { id_user: mockUser.id_user } } // Validate the user being updated
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Ya existe una sesión activa',
            token: updatedToken,
        });
    });



    it('should return 400 if the email is not found', async () => {
        Users.findOne.mockResolvedValue(null);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Correo o contraseña incorrectos' });
    });

    it('should return 403 if the user is locked out', async () => {
        const now = new Date();
        const lockoutDuration = 5 * 60 * 1000; // 5 minutes
        const mockUser = {
            id_user: 1,
            email: 'test@example.com',
            lockout_until: new Date(now.getTime() + lockoutDuration).toISOString(), // Locked out for 5 minutes
            failed_attempts: 3,
            roles: [],
            profile: { names: 'John', last_names: 'Doe Smith' },
        };

        // Mock Users.findOne to return a locked-out user
        Users.findOne.mockResolvedValueOnce(mockUser);

        // Call the function
        await loginUser(req, res);

        // Calculate remaining lockout time in minutes
        const minutesLeft = Math.ceil((new Date(mockUser.lockout_until) - now) / (60 * 1000));

        // Assertions
        expect(Users.findOne).toHaveBeenCalledWith({
            where: { email: req.body.email },
            include: expect.any(Array),
        });

        expect(res.status).toHaveBeenCalledWith(403); // Ensure correct status is returned
        expect(res.json).toHaveBeenCalledWith({
            error: `Cuenta bloqueada. Intente nuevamente en ${minutesLeft} minutos.`,
        });
    });




    it('should return 500 for server errors', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error del servidor' });
    });
});

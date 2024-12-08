const { logoutUser } = require('../../../controllers/userController');
const { Sessions } = require('../../../models');

jest.mock('../../../models');

describe('logoutUser Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer mockToken', // Mock token in Authorization header
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

    it('should return 400 if token is not provided', async () => {
        req.headers.authorization = undefined; // Simulate missing token

        await logoutUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token not provided.' });
    });

    it('should return 404 if session is not found', async () => {
        Sessions.destroy.mockResolvedValue(0); // Simulate no session found for token

        await logoutUser(req, res);

        expect(Sessions.destroy).toHaveBeenCalledWith({ where: { session_token: 'mockToken' } });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Session not found or already logged out.' });
    });

    it('should successfully log out the user', async () => {
        Sessions.destroy.mockResolvedValue(1); // Simulate successful session deletion

        await logoutUser(req, res);

        expect(Sessions.destroy).toHaveBeenCalledWith({ where: { session_token: 'mockToken' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully.' });
    });

    it('should return 500 if a server error occurs', async () => {
        Sessions.destroy.mockRejectedValue(new Error('Database error')); // Simulate server error

        await logoutUser(req, res);

        expect(Sessions.destroy).toHaveBeenCalledWith({ where: { session_token: 'mockToken' } });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error during logout.' });
        expect(console.error).toHaveBeenCalledWith('Error during logout:', expect.any(Error));
    });
});

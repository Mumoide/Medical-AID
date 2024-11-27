const { deleteUser } = require('../../../controllers/userController');
const { Users } = require('../../../models');

jest.mock('../../../models');

describe('deleteUser Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id_user: 1,
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should logically delete a user successfully', async () => {
        // Mock the user existence and update
        Users.findOne.mockResolvedValue({ id_user: 1 });
        Users.update.mockResolvedValue([1]); // Simulates successful update

        await deleteUser(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { id_user: req.params.id_user } });
        expect(Users.update).toHaveBeenCalledWith(
            { active: 0 },
            { where: { id_user: req.params.id_user } }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuario eliminado lógicamente con éxito.',
        });
    });

    it('should return 404 if the user is not found', async () => {
        // Mock no user found
        Users.findOne.mockResolvedValue(null);

        await deleteUser(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { id_user: req.params.id_user } });
        expect(Users.update).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado.' });
    });

    it('should return 500 if a server error occurs', async () => {
        // Mock a server error during the database query
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await deleteUser(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { id_user: req.params.id_user } });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error del servidor' });
    });
});

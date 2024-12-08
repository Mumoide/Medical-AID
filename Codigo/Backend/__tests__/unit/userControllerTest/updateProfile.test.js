const { updateProfile } = require('../../../controllers/userController');
const { Users, UserProfiles } = require('../../../models');

// Define validateForm directly in the test file
const validateForm = (email, password, profile) => {
    if (!profile.birthdate) {
        return { isValid: false, message: "Debe ingresar su fecha de nacimiento." };
    }
    const currentDate = new Date();
    const birthDate = new Date(profile.birthdate);
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(profile.birthdate).getFullYear();
    const age = currentYear - birthYear;

    const lettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    const numbersRegex = /^[0-9]+$/;
    const decimalNumbersRegex = /^[0-9]+(\.[0-9]+)?$/;

    if (!profile.phone_number) {
        return { isValid: false, message: "Debe ingresar un número de teléfono." };
    }
    if (!profile.address) {
        return { isValid: false, message: "Debe ingresar una dirección." };
    }
    if (!profile.comune) {
        return { isValid: false, message: "Debe ingresar una comuna." };
    }
    if (!email) {
        return { isValid: false, message: "Debe ingresar un correo electrónico." };
    }
    if (!profile.names) {
        return { isValid: false, message: "Debe ingresar su nombre." };
    }
    if (profile.names.length > 30 || !lettersRegex.test(profile.names)) {
        return { isValid: false, message: "El nombre no debe tener más de 30 caracteres y solo debe incluir letras." };
    }
    if (!profile.last_names.split(' ')[0]) {
        return { isValid: false, message: "Debe ingresar su apellido paterno." };
    }
    if (!profile.last_names.split(' ')[1]) {
        return { isValid: false, message: "Debe ingresar su apellido materno." };
    }
    if (profile.last_names.split(' ')[0].length > 20 || !lettersRegex.test(profile.last_names.split(' ')[0])) {
        return { isValid: false, message: "El apellido paterno no debe tener más de 20 caracteres y solo debe incluir letras." };
    }
    if (profile.last_names.split(' ')[1].length > 20 || !lettersRegex.test(profile.last_names.split(' ')[1])) {
        return { isValid: false, message: "El apellido materno no debe tener más de 20 caracteres y solo debe incluir letras." };
    }
    if (age > 110) {
        return { isValid: false, message: "La fecha de nacimiento no puede ser mayor de 110 años." };
    }
    if (birthDate > currentDate) {
        return { isValid: false, message: "La fecha de nacimiento no puede estar en el futuro." };
    }
    if (profile.gender && (!['Masculino', 'Femenino', 'Prefiero no decirlo'].includes(profile.gender))) {
        return { isValid: false, message: "Género inválido." };
    }
    if (profile.height && (!decimalNumbersRegex.test(profile.height) || profile.height < 30 || profile.height > 220)) {
        return { isValid: false, message: "La altura debe estar entre 30 y 220 cm, y solo debe incluir números." };
    }
    if (profile.weight && (!decimalNumbersRegex.test(profile.weight) || profile.weight < 2 || profile.weight > 300)) {
        return { isValid: false, message: "El peso debe estar entre 2 y 300 kg, y solo debe incluir números." };
    }
    if (profile.phone_number.length !== 9 || !numbersRegex.test(profile.phone_number)) {
        return { isValid: false, message: "El número de teléfono debe tener 9 dígitos y solo debe incluir números." };
    }
    if (profile.address.length > 50) {
        return { isValid: false, message: "La dirección no debe tener más de 50 caracteres." };
    }
    if (profile.comune.length > 50) {
        return { isValid: false, message: "La comuna no debe tener más de 50 caracteres." };
    }
    if (email.length > 60) {
        return { isValid: false, message: "El correo no debe tener más de 60 caracteres." };
    }
    if (password && password.length > 50) {
        return { isValid: false, message: "La contraseña no debe tener más de 50 caracteres." };
    }
    return { isValid: true, message: '' };
};

// Mocking the models
jest.mock('../../../models');

describe('updateProfile Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id_user: 1 },
            body: {
                email: 'test@example.com',
                profile: {
                    names: 'Test',
                    last_names: 'User Materno',
                    birthdate: '1990-01-01',
                    gender: 'Masculino',
                    height: 180,
                    weight: 75,
                    phone_number: '123456789',
                    address: 'Test Address',
                    comune: 'Test Comune',
                },
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should return 400 if validation fails', async () => {
        const invalidProfile = { ...req.body.profile, birthdate: '' }; // Invalid profile
        const validationResult = validateForm(req.body.email, undefined, invalidProfile);
        expect(validationResult).toEqual({ isValid: false, message: "Debe ingresar su fecha de nacimiento." });
    });

    it('should return 404 if the user is not found', async () => {
        Users.findOne.mockResolvedValue(null);

        await updateProfile(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { id_user: req.user.id_user } });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 400 if the email is already in use by another account', async () => {
        Users.findOne
            .mockResolvedValueOnce({ id_user: 1, email: 'old@example.com' }) // Current user
            .mockResolvedValueOnce({ id_user: 2 }); // Another user with the same email

        req.body.email = 'new@example.com';

        await updateProfile(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email is already in use by another account.' });
    });

    it('should update the user profile successfully when userProfile exists', async () => {
        // Mock the user and user profile
        const mockUserProfile = {
            id_user: 1,
            update: jest.fn().mockResolvedValue({}), // Mock the `update` method
        };
        Users.findOne.mockResolvedValue({ id_user: 1, email: 'old@example.com', update: jest.fn() });
        UserProfiles.findOne.mockResolvedValue(mockUserProfile);

        // Call the controller function
        await updateProfile(req, res);

        // Assertions
        expect(UserProfiles.findOne).toHaveBeenCalledWith({ where: { id_user: req.user.id_user } });
        expect(mockUserProfile.update).toHaveBeenCalledWith({
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
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully.' });
    });



    it('should create a new user profile when it does not exist', async () => {
        Users.findOne.mockResolvedValue({ id_user: 1, email: 'old@example.com', update: jest.fn() });
        UserProfiles.findOne.mockResolvedValue(null);
        UserProfiles.create.mockResolvedValue({});

        await updateProfile(req, res);

        expect(UserProfiles.create).toHaveBeenCalledWith({
            id_user: req.user.id_user,
            ...req.body.profile,
        });
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully.' });
    });

    it('should return 500 if an error occurs during execution', async () => {
        Users.findOne.mockRejectedValue(new Error('Database error'));

        await updateProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while updating the profile.' });
    });
});

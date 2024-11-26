const validateForm = (email, password, profile) => {
    if (!profile.birthdate) {
        return { isValid: false, message: "Debe ingresar su fecha de nacimiento." };
    }
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(profile.birthdate).getFullYear();
    const age = currentYear - birthYear;

    const lettersRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Regex to allow only letters and spaces
    const numbersRegex = /^[0-9]+$/; // Regex to allow only integer numbers
    const decimalNumbersRegex = /^[0-9]+(\.[0-9]+)?$/; // Regex to allow integers or decimals

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

    if (password.length > 50) {
        return { isValid: false, message: "La contraseña no debe tener más de 50 caracteres." };
    }

    return { isValid: true, message: '' };
};

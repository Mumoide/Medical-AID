const createUser = async (
  nombre, apellidos, fechaNacimiento, genero, altura, telefono, direccion, comuna, correo, contrasena
) => {
  const query = `
    INSERT INTO users 
    (nombre, apellidos, fecha_nacimiento, genero, altura, telefono, direccion, comuna, correo, contrasena) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

  try {
    console.log('Executing query to insert user...');
    const result = await pool.query(query, [
      nombre, apellidos, fechaNacimiento, genero, altura, telefono, direccion, comuna, correo, contrasena
    ]);
    console.log('Query executed successfully, result:', result.rows[0]); // Log query result
    return result.rows[0];
  } catch (error) {
    console.error('Error executing query:', error);  // Log any query errors
    throw error;
  }
};

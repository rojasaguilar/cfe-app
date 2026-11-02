import { jest } from '@jest/globals';

// 1. Declarar los mocks PRIMERO (antes de importar el código real)
jest.unstable_mockModule('../../config/Database.js', () => ({
  Database: {
    getInstance: jest.fn(),
  },
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: jest.fn(),
  },
}));

// 2. Importar los módulos dinámicamente DESPUÉS de haberlos mockeado
const { Database } = await import('../../config/Database.js');
const bcrypt = (await import('bcrypt')).default;
const { createUser } = await import('./auth.service.js');
const { AppError } = await import('../../utils/error.js');

describe('Auth Service - createUser', () => {
  let mockQuery;

  beforeEach(() => {
    // Preparamos la BD simulada
    mockQuery = jest.fn();
    
    // Ahora Database.getInstance sí es reconocido como un mock de Jest
    Database.getInstance.mockReturnValue({ query: mockQuery });
    
    // Simulamos bcrypt
    bcrypt.hash.mockResolvedValue('contraseña_hasheada_123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Debería arrojar error si faltan datos', async () => {
    const userData = { email: 'test@test.com', password: '123' }; 
    
    await expect(createUser(userData)).rejects.toThrow(AppError);
    await expect(createUser(userData)).rejects.toThrow('Por favor, proporciona todos los datos requeridos.');
  });

  it('Debería arrojar error si las contraseñas no coinciden', async () => {
    const userData = { email: 'test@test.com', password: '123', passwordConfirm: '456' };
    
    await expect(createUser(userData)).rejects.toThrow(AppError);
    await expect(createUser(userData)).rejects.toThrow('Las contraseñas no coinciden');
  });

  it('Debería arrojar error si el usuario ya existe', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    
    const userData = { email: 'existe@test.com', password: '123', passwordConfirm: '123' };
    
    await expect(createUser(userData)).rejects.toThrow('auth_service: El correo electrónico ya está registrado');
  });

  it('Debería crear un usuario exitosamente', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 }); 
    mockQuery.mockResolvedValueOnce({ 
      rows: [{ id: 1, email: 'nuevo@test.com', created_at: '2023-01-01' }] 
    });

    const userData = { email: 'nuevo@test.com', password: '123', passwordConfirm: '123' };
    const newUser = await createUser(userData);

    expect(newUser).toHaveProperty('id', 1);
    expect(newUser.email).toBe('nuevo@test.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('123', expect.any(Number));
  });
});
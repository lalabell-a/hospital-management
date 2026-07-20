/* eslint-env jest */

const {
  apiFetch,
  PacientesAPI,
  CitasAPI,
} = require('../api.js');

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('api.js', () => {
  test('apiFetch_llamaFetchConURLCorrecta', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 1 }) });

    await apiFetch('/pacientes');

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/pacientes', expect.objectContaining({
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  test('apiFetch_respuestaError_noLanzaExcepcion', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({ message: 'error' }) });

    await expect(apiFetch('/pacientes')).resolves.toEqual({ message: 'error' });
  });

  test('PacientesAPI_listar_llamaGET', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([{ id: 1 }]) });

    await PacientesAPI.listar();

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/pacientes', expect.objectContaining({
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  test('PacientesAPI_crear_llamaPOSTConBody', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 1 }) });

    const payload = { nombre: 'Ana', apellido: 'Perez' };
    await PacientesAPI.crear(payload);

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/pacientes', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(payload),
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  test('PacientesAPI_eliminar_intentaParsearJSON_deleteSinBody', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')) });

    await expect(PacientesAPI.eliminar(7)).rejects.toThrow(SyntaxError);
  });

  test('CitasAPI_porRangoFechas_noValidaOrden', async () => {
    globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

    await CitasAPI.porRangoFechas('2026-12-10', '2026-12-01');

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas/rango-fechas?inicio=2026-12-10&fin=2026-12-01', expect.any(Object));
  });

  test('apiFetch_sinTimeout_noCancelaPeticion', async () => {
    globalThis.fetch.mockImplementation(() => new Promise(() => {}));

    const pending = apiFetch('/historias-clinicas');

    expect(pending).toBeInstanceOf(Promise);
    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/historias-clinicas', expect.objectContaining({
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });
});
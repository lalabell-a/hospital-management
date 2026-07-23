const {
  apiFetch,
  PacientesAPI,
  DoctoresAPI,
  CitasAPI,
  HistoriasAPI,
} = require('../api.js');

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('api.js', () => {
  describe('apiFetch (base)', () => {
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

    test('apiFetch_sinTimeout_noCancelaPeticion', async () => {
      globalThis.fetch.mockImplementation(() => new Promise(() => {}));

      const pending = apiFetch('/historias-clinicas');

      expect(pending).toBeInstanceOf(Promise);
      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/historias-clinicas', expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }));
    });
    
  });
  
  describe('PacientesAPI', () => {
    test('PacientesAPI_listar_llamaGET', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([{ id: 1 }]) });

      await PacientesAPI.listar();

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/pacientes', expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }));
    });

    test('PacientesAPI_buscar_llamaGETConId', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 3 }) });

      await PacientesAPI.buscar(3);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/pacientes/3', expect.any(Object));
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

    test('PacientesAPI_actualizar_llamaPUTConBody', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 5 }) });

      const payload = { nombre: 'Ana Actualizada' };
      await PacientesAPI.actualizar(5, payload);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/pacientes/5', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(payload),
      }));
    });

    test('PacientesAPI_eliminar_intentaParsearJSON_deleteSinBody', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')) });

      await expect(PacientesAPI.eliminar(7)).rejects.toThrow(SyntaxError);
    });

    test('PacientesAPI_buscarPorNombre_noSanitizaEntrada', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      const payloadXSS = '<script>alert(1)</script>';
      await PacientesAPI.buscarPorNombre(payloadXSS);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/pacientes/buscar?nombre=${encodeURIComponent(payloadXSS)}`,
        expect.any(Object),
      );
    });

    test('PacientesAPI_edadPromedio_llamaEndpointEstadisticas', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ promedio: 0 }) });

      await PacientesAPI.edadPromedio();

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/pacientes/estadisticas/edad-promedio', expect.any(Object));
    });
  });

  describe('DoctoresAPI', () => {
    test('DoctoresAPI_listar_llamaGET', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([{ id: 1 }]) });

      await DoctoresAPI.listar();

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/doctores', expect.any(Object));
    });

    test('DoctoresAPI_buscar_llamaGETConId', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 2 }) });

      await DoctoresAPI.buscar(2);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/doctores/2', expect.any(Object));
    });

    test('DoctoresAPI_crear_llamaPOSTConBody', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 1 }) });

      const payload = { nombre: 'Carlos', apellido: 'Ruiz', especialidad: 'Cardiologia' };
      await DoctoresAPI.crear(payload);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/doctores', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }));
    });

    test('DoctoresAPI_crear_sinEspecialidad_noValida', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 9 }) });

      const payloadSinEspecialidad = { nombre: 'Carlos', apellido: 'Ruiz' };
      await DoctoresAPI.crear(payloadSinEspecialidad);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/doctores', expect.objectContaining({
        body: JSON.stringify(payloadSinEspecialidad),
      }));
    });

    test('DoctoresAPI_actualizar_llamaPUTConBody', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 2 }) });

      const payload = { especialidad: 'Neurologia' };
      await DoctoresAPI.actualizar(2, payload);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/doctores/2', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(payload),
      }));
    });

    test('DoctoresAPI_eliminar_llamaDELETE', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

      await DoctoresAPI.eliminar(4);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/doctores/4', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    test('DoctoresAPI_buscarPorEspecialidad_usaEndpointInseguro', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      const payloadSQLi = "'; DROP TABLE doctores; --";
      await DoctoresAPI.buscarPorEspecialidad(payloadSQLi);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/doctores/buscar-especialidad?q=${encodeURIComponent(payloadSQLi)}`,
        expect.any(Object),
      );
    });

    test('DoctoresAPI_buscarPorNombre_conParametrosVacios_noValida', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await DoctoresAPI.buscarPorNombre('', '');

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/doctores/buscar-nombre?nombre=&apellido=', expect.any(Object));
    });
  });

  describe('CitasAPI', () => {
    test('CitasAPI_listar_llamaGET', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await CitasAPI.listar();

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas', expect.any(Object));
    });

    test('CitasAPI_buscar_llamaGETConId', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 1 }) });

      await CitasAPI.buscar(1);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas/1', expect.any(Object));
    });

    test('CitasAPI_crear_llamaPOSTConBody', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 10 }) });

      const payload = { pacienteId: 1, doctorId: 2, fechaHora: '2026-12-01T10:00:00' };
      await CitasAPI.crear(payload);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }));
    });

    test('CitasAPI_actualizar_llamaPUTConBody', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 10 }) });

      const payload = { estado: 'CONFIRMADA' };
      await CitasAPI.actualizar(10, payload);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas/10', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(payload),
      }));
    });

    test('CitasAPI_eliminar_llamaDELETE', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

      await CitasAPI.eliminar(10);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas/10', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    test('CitasAPI_porPaciente_llamaEndpointCorrecto', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await CitasAPI.porPaciente(3);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas/paciente/3', expect.any(Object));
    });

    test('CitasAPI_porDoctor_llamaEndpointCorrecto', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await CitasAPI.porDoctor(4);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas/doctor/4', expect.any(Object));
    });

    test('CitasAPI_porEstado_llamaEndpointCorrecto', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await CitasAPI.porEstado('PENDIENTE');

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas/estado/PENDIENTE', expect.any(Object));
    });

    test('CitasAPI_porRangoFechas_noValidaOrden', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await CitasAPI.porRangoFechas('2026-12-10', '2026-12-01');

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/citas/rango-fechas?inicio=2026-12-10&fin=2026-12-01', expect.any(Object));
    });
  });

  describe('HistoriasAPI', () => {
    test('HistoriasAPI_listar_llamaGET', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await HistoriasAPI.listar();

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/historias-clinicas', expect.any(Object));
    });

    test('HistoriasAPI_buscar_llamaGETConId', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 1 }) });

      await HistoriasAPI.buscar(1);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/historias-clinicas/1', expect.any(Object));
    });

    test('HistoriasAPI_crear_llamaPOSTConBody_sinSanitizarDiagnostico', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 1 }) });

      const payload = { pacienteId: 1, diagnostico: '<script>alert(1)</script>' };
      await HistoriasAPI.crear(payload);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/historias-clinicas', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }));
    });

    test('HistoriasAPI_crear_sinDoctor_permiteOmitirlo', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 2 }) });

      const payloadSinDoctor = { pacienteId: 1, diagnostico: 'Gripe comun' };
      await HistoriasAPI.crear(payloadSinDoctor);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/historias-clinicas', expect.objectContaining({
        body: JSON.stringify(payloadSinDoctor),
      }));
    });

    test('HistoriasAPI_porPaciente_llamaEndpointCorrecto', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await HistoriasAPI.porPaciente(1);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/historias-clinicas/paciente/1', expect.any(Object));
    });

    test('HistoriasAPI_porDoctor_llamaEndpointCorrecto', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await HistoriasAPI.porDoctor(2);

      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:8080/api/historias-clinicas/doctor/2', expect.any(Object));
    });
  });
});
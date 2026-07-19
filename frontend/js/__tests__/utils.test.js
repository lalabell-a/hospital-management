/* eslint-env jest */

const {
  formatDate,
  formatDateTime,
  escapeHTML,
  showAlert,
  validateEmail,
  validateTelefono,
  isFutureDate,
  localToISO,
} = require('../utils.js');

describe('utils.js', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="alert-container"></div>';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('formatDate_fechaValida_retornaStringFormateado', () => {
    expect(formatDate('2000-01-15')).toContain('2000');
    expect(formatDate('2000-01-15').toLowerCase()).toContain('enero');
  });

  test('formatDate_null_retornaInvalidDate', () => {
    expect(formatDate(null)).toBe('1 de enero de 1970');
  });

  test('formatDate_undefined_retornaStringInvalido', () => {
    expect(formatDate(undefined)).toBe('Invalid Date');
  });

  test('formatDate_stringNoFecha_retornaInvalidDate', () => {
    expect(formatDate('no-es-fecha')).toBe('Invalid Date');
  });

  test('formatDateTime_fechaValida_retornaStringConHora', () => {
    const result = formatDateTime('2000-01-15T10:30:00');
    expect(result).toContain('2000');
    expect(result).toMatch(/10:30|10:30 a\. m\.|10:30 a\. m\./i);
  });

  test('formatDateTime_null_retornaInvalidDate', () => {
    expect(formatDateTime(null)).toContain('1970');
  });

  test('escapeHTML_conTags_escapaLtGt', () => {
    expect(escapeHTML('<script>')).toBe('&lt;script&gt;');
  });

  test('escapeHTML_conAmpersand_escapaAmp', () => {
    expect(escapeHTML('a & b')).toBe('a &amp; b');
  });

  test('escapeHTML_conComillaDoble_escapaQuot', () => {
    expect(escapeHTML('"hola"')).toBe('&quot;hola&quot;');
  });

  test('escapeHTML_conComillaSimple_NOEscapa', () => {
    expect(escapeHTML("l'eau")).toBe("l'eau");
  });

  test('escapeHTML_conBacktick_NOEscapa', () => {
    expect(escapeHTML('use `this`')).toBe('use `this`');
  });

  test('escapeHTML_stringVacio_retornaVacio', () => {
    expect(escapeHTML('')).toBe('');
  });

  test('escapeHTML_null_retornaVacio', () => {
    expect(escapeHTML(null)).toBe('');
  });

  test('showAlert_insertaMensaje_enContenedor', () => {
    showAlert('Mensaje de prueba', 'success');
    expect(document.getElementById('alert-container').innerHTML).toContain('Mensaje de prueba');
    jest.advanceTimersByTime(4000);
    expect(document.getElementById('alert-container').innerHTML).toBe('');
  });

  test('validateEmail_emailValido_retornaTrue', () => {
    expect(validateEmail('user@domain.com')).toBe(true);
  });

  test('validateEmail_sinArroba_retornaFalse', () => {
    expect(validateEmail('userdomain.com')).toBe(false);
  });

  test('validateEmail_conMasSigno_retornaTrue', () => {
    expect(validateEmail('user+tag@domain.com')).toBe(true);
  });

  test('validateEmail_TLDDeUnChar_retornaTrue_deberiaSeFalse', () => {
    expect(validateEmail('user@domain.c')).toBe(true);
  });

  test('validateEmail_null_retornaFalse', () => {
    expect(validateEmail(null)).toBe(false);
  });

  test('validateEmail_stringVacio_retornaFalse', () => {
    expect(validateEmail('')).toBe(false);
  });

  test('validateTelefono_10Digitos_retornaTrue', () => {
    expect(validateTelefono('0991234567')).toBe(true);
  });

  test('validateTelefono_9Digitos_retornaFalse', () => {
    expect(validateTelefono('099123456')).toBe(false);
  });

  test('validateTelefono_conLetras_retornaFalse', () => {
    expect(validateTelefono('099ABC4567')).toBe(false);
  });

  test('validateTelefono_prefijosInvalidos_retornaTrue', () => {
    expect(validateTelefono('1234567890')).toBe(true);
  });

  test('isFutureDate_fechaFutura_retornaTrue', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(isFutureDate(tomorrow)).toBe(true);
  });

  test('isFutureDate_fechaPasada_retornaFalse', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(isFutureDate(yesterday)).toBe(false);
  });

  test('isFutureDate_ahora_resultadoIncierto', () => {
    const now = new Date().toISOString();
    expect(isFutureDate(now)).toBe(false);
  });

  test('localToISO_fechaLocal_convierteAISO', () => {
    const mockDate = {
      toISOString: jest.fn(() => '2026-12-01T15:00:00.000Z'),
    };
    const realDate = globalThis.Date;

    try {
      globalThis.Date = jest.fn(() => mockDate);
      expect(localToISO('2026-12-01T10:00')).toBe('2026-12-01T15:00:00.000Z');
      expect(globalThis.Date).toHaveBeenCalledWith('2026-12-01T10:00');
    } finally {
      globalThis.Date = realDate;
    }
  });

  test('localToISO_asumeTZ_UTC_noConsideraEcuador', () => {
    const mockDate = {
      toISOString: jest.fn(() => '2026-12-01T10:00:00.000Z'),
    };
    const realDate = globalThis.Date;

    try {
      globalThis.Date = jest.fn(() => mockDate);
      expect(localToISO('2026-12-01T10:00')).toBe('2026-12-01T10:00:00.000Z');
    } finally {
      globalThis.Date = realDate;
    }
  });
});
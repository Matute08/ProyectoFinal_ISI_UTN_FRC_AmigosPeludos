/**
 * Validador para las credenciales de Mercado Pago
 * 
 * Este archivo contiene funciones para validar el formato de las Public Keys
 * y Access Tokens de Mercado Pago
 */

/**
 * Valida el formato de una Public Key de Mercado Pago
 * 
 * @param {string} publicKey - La public key a validar
 * @returns {{ isValid: boolean, error?: string, type?: 'production' | 'test' }}
 * 
 * Formatos válidos:
 * - Producción: APP_USR-xxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx
 * - Test/Sandbox: TEST-xxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx
 */
export const validateMercadoPagoPublicKey = (publicKey) => {
  // Verificar que no esté vacía
  if (!publicKey || typeof publicKey !== 'string') {
    return {
      isValid: false,
      error: 'La Public Key no puede estar vacía'
    };
  }

  const trimmedKey = publicKey.trim();

  // Verificar que comience con el prefijo correcto
  const productionPattern = /^APP_USR-[a-zA-Z0-9-]+$/;
  const testPattern = /^TEST-[a-zA-Z0-9-]+$/;

  if (productionPattern.test(trimmedKey)) {
    // Validar longitud aproximada para producción (generalmente ~100+ caracteres)
    if (trimmedKey.length < 50) {
      return {
        isValid: false,
        error: 'La Public Key de producción parece tener un formato incorrecto (muy corta)'
      };
    }
    
    return {
      isValid: true,
      type: 'production'
    };
  }

  if (testPattern.test(trimmedKey)) {
    // Validar longitud aproximada para test
    if (trimmedKey.length < 40) {
      return {
        isValid: false,
        error: 'La Public Key de test parece tener un formato incorrecto (muy corta)'
      };
    }
    
    return {
      isValid: true,
      type: 'test'
    };
  }

  return {
    isValid: false,
    error: 'La Public Key no tiene un formato válido. Debe comenzar con "APP_USR-" (producción) o "TEST-" (test)'
  };
};

/**
 * Valida el formato de un Access Token de Mercado Pago
 * 
 * @param {string} accessToken - El access token a validar
 * @returns {{ isValid: boolean, error?: string, type?: 'production' | 'test' }}
 * 
 * Formatos válidos:
 * - Producción: APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx
 * - Test/Sandbox: TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx
 */
export const validateMercadoPagoAccessToken = (accessToken) => {
  // Verificar que no esté vacío
  if (!accessToken || typeof accessToken !== 'string') {
    return {
      isValid: false,
      error: 'El Access Token no puede estar vacío'
    };
  }

  const trimmedToken = accessToken.trim();

  // Verificar que comience con el prefijo correcto
  const productionPattern = /^APP_USR-[a-zA-Z0-9-]+$/;
  const testPattern = /^TEST-[a-zA-Z0-9-]+$/;

  if (productionPattern.test(trimmedToken)) {
    // Validar longitud aproximada para producción (generalmente ~100+ caracteres)
    if (trimmedToken.length < 50) {
      return {
        isValid: false,
        error: 'El Access Token de producción parece tener un formato incorrecto (muy corto)'
      };
    }
    
    return {
      isValid: true,
      type: 'production'
    };
  }

  if (testPattern.test(trimmedToken)) {
    // Validar longitud aproximada para test
    if (trimmedToken.length < 40) {
      return {
        isValid: false,
        error: 'El Access Token de test parece tener un formato incorrecto (muy corto)'
      };
    }
    
    return {
      isValid: true,
      type: 'test'
    };
  }

  return {
    isValid: false,
    error: 'El Access Token no tiene un formato válido. Debe comenzar con "APP_USR-" (producción) o "TEST-" (test)'
  };
};

/**
 * Valida ambas credenciales y verifica que sean del mismo tipo (producción o test)
 * 
 * @param {string} publicKey - La public key a validar
 * @param {string} accessToken - El access token a validar
 * @returns {{ isValid: boolean, errors?: string[], warnings?: string[] }}
 */
export const validateMercadoPagoCredentials = (publicKey, accessToken) => {
  const errors = [];
  const warnings = [];

  // Validar public key
  const publicKeyValidation = validateMercadoPagoPublicKey(publicKey);
  if (!publicKeyValidation.isValid) {
    errors.push(`Public Key: ${publicKeyValidation.error}`);
  }

  // Validar access token
  const accessTokenValidation = validateMercadoPagoAccessToken(accessToken);
  if (!accessTokenValidation.isValid) {
    errors.push(`Access Token: ${accessTokenValidation.error}`);
  }

  // Si ambas son válidas, verificar que sean del mismo tipo
  if (publicKeyValidation.isValid && accessTokenValidation.isValid) {
    if (publicKeyValidation.type !== accessTokenValidation.type) {
      warnings.push(
        `Advertencia: La Public Key es de tipo "${publicKeyValidation.type}" pero el Access Token es de tipo "${accessTokenValidation.type}". Deberían ser del mismo tipo.`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

/**
 * Función de utilidad para verificar credenciales desde variables de entorno
 * Útil para validar en tiempo de desarrollo
 * 
 * @param {object} env - Objeto con las variables de entorno (por ejemplo: import.meta.env)
 * @returns {{ isValid: boolean, errors?: string[], warnings?: string[], publicKeyType?: string, accessTokenType?: string }}
 */
export const validateMercadoPagoEnvCredentials = (env = {}) => {
  const publicKey = env.VITE_MERCADOPAGO_PUBLIC_KEY || env.MERCADOPAGO_PUBLIC_KEY;
  const accessToken = env.VITE_MERCADOPAGO_ACCESS_TOKEN || env.MERCADOPAGO_ACCESS_TOKEN;

  if (!publicKey && !accessToken) {
    return {
      isValid: false,
      errors: ['No se encontraron credenciales de Mercado Pago en las variables de entorno']
    };
  }

  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (publicKey) {
    const publicKeyValidation = validateMercadoPagoPublicKey(publicKey);
    if (!publicKeyValidation.isValid) {
      result.isValid = false;
      result.errors.push(`Public Key: ${publicKeyValidation.error}`);
    } else {
      result.publicKeyType = publicKeyValidation.type;
    }
  } else {
    result.warnings.push('No se encontró VITE_MERCADOPAGO_PUBLIC_KEY en las variables de entorno');
  }

  if (accessToken) {
    const accessTokenValidation = validateMercadoPagoAccessToken(accessToken);
    if (!accessTokenValidation.isValid) {
      result.isValid = false;
      result.errors.push(`Access Token: ${accessTokenValidation.error}`);
    } else {
      result.accessTokenType = accessTokenValidation.type;
    }
  } else {
    result.warnings.push('No se encontró VITE_MERCADOPAGO_ACCESS_TOKEN en las variables de entorno');
  }

  // Verificar compatibilidad de tipos
  if (result.publicKeyType && result.accessTokenType && result.publicKeyType !== result.accessTokenType) {
    result.warnings.push(
      `Advertencia: Public Key (${result.publicKeyType}) y Access Token (${result.accessTokenType}) son de tipos diferentes`
    );
  }

  if (result.errors.length === 0) {
    delete result.errors;
  }
  if (result.warnings.length === 0) {
    delete result.warnings;
  }

  return result;
};


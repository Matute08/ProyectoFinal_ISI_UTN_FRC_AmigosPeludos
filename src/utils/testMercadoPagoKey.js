/**
 * Script de prueba para validar credenciales de Mercado Pago
 * 
 * Para usar este script, ejecuta en la consola del navegador:
 * import { validateMercadoPagoPublicKey } from './utils/mercadoPagoValidator';
 * validateMercadoPagoPublicKey('TU_PUBLIC_KEY_AQUI');
 */

import { 
  validateMercadoPagoPublicKey, 
  validateMercadoPagoAccessToken,
  validateMercadoPagoCredentials,
  validateMercadoPagoEnvCredentials 
} from './mercadoPagoValidator';

/**
 * Función de prueba rápida para validar una Public Key
 * 
 * Ejemplo de uso:
 * testPublicKey('APP_USR-tu-public-key-aqui');
 */
export const testPublicKey = (publicKey) => {
  console.log('🔍 Validando Public Key de Mercado Pago...\n');
  console.log('Public Key:', publicKey ? `${publicKey.substring(0, 20)}...` : 'No proporcionada');
  
  const result = validateMercadoPagoPublicKey(publicKey);
  
  if (result.isValid) {
    console.log('✅ La Public Key es válida');
    console.log('📋 Tipo:', result.type === 'production' ? 'Producción' : 'Test/Sandbox');
    console.log('✅ Formato correcto');
  } else {
    console.error('❌ La Public Key NO es válida');
    console.error('🚫 Error:', result.error);
  }
  
  return result;
};

/**
 * Función de prueba rápida para validar un Access Token
 */
export const testAccessToken = (accessToken) => {
  console.log('🔍 Validando Access Token de Mercado Pago...\n');
  console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'No proporcionado');
  
  const result = validateMercadoPagoAccessToken(accessToken);
  
  if (result.isValid) {
    console.log('✅ El Access Token es válido');
    console.log('📋 Tipo:', result.type === 'production' ? 'Producción' : 'Test/Sandbox');
    console.log('✅ Formato correcto');
  } else {
    console.error('❌ El Access Token NO es válido');
    console.error('🚫 Error:', result.error);
  }
  
  return result;
};

/**
 * Función para validar ambas credenciales juntas
 */
export const testCredentials = (publicKey, accessToken) => {
  console.log('🔍 Validando credenciales de Mercado Pago...\n');
  
  const result = validateMercadoPagoCredentials(publicKey, accessToken);
  
  if (result.isValid) {
    console.log('✅ Las credenciales son válidas');
    if (result.warnings) {
      console.warn('⚠️ Advertencias:');
      result.warnings.forEach(warning => console.warn('  -', warning));
    }
  } else {
    console.error('❌ Las credenciales NO son válidas');
    if (result.errors) {
      console.error('🚫 Errores:');
      result.errors.forEach(error => console.error('  -', error));
    }
    if (result.warnings) {
      console.warn('⚠️ Advertencias:');
      result.warnings.forEach(warning => console.warn('  -', warning));
    }
  }
  
  return result;
};

/**
 * Función para validar desde variables de entorno
 */
export const testEnvCredentials = () => {
  console.log('🔍 Validando credenciales desde variables de entorno...\n');
  
  const result = validateMercadoPagoEnvCredentials(import.meta.env);
  
  if (result.isValid) {
    console.log('✅ Las credenciales encontradas son válidas');
    if (result.publicKeyType) {
      console.log('📋 Tipo Public Key:', result.publicKeyType === 'production' ? 'Producción' : 'Test');
    }
    if (result.accessTokenType) {
      console.log('📋 Tipo Access Token:', result.accessTokenType === 'production' ? 'Producción' : 'Test');
    }
    if (result.warnings) {
      console.warn('⚠️ Advertencias:');
      result.warnings.forEach(warning => console.warn('  -', warning));
    }
  } else {
    console.error('❌ Las credenciales NO son válidas o no se encontraron');
    if (result.errors) {
      console.error('🚫 Errores:');
      result.errors.forEach(error => console.error('  -', error));
    }
    if (result.warnings) {
      console.warn('⚠️ Advertencias:');
      result.warnings.forEach(warning => console.warn('  -', warning));
    }
  }
  
  return result;
};

// Exportar funciones de validación directamente también
export {
  validateMercadoPagoPublicKey,
  validateMercadoPagoAccessToken,
  validateMercadoPagoCredentials,
  validateMercadoPagoEnvCredentials
};



const crypto = require('crypto');

/**
 * Generates a random hex secret key for TOTP.
 * @returns {string} Hexadecimal secret key
 */
const generateSecret = () => {
  return crypto.randomBytes(20).toString('hex');
};

/**
 * Generates a 6-digit Time-Based One-Time Password (TOTP) based on RFC 6238.
 * @param {string} secretHex The secret key in hex format
 * @param {number} timeStep Time window in seconds (default: 30)
 * @returns {string} 6-digit code
 */
const generateTOTP = (secretHex, timeStep = 30) => {
  if (!secretHex) return '000000';
  
  try {
    const counter = Math.floor(Date.now() / 1000 / timeStep);
    
    // Create an 8-byte buffer to hold the counter
    const buffer = Buffer.alloc(8);
    // Write the big integer in big-endian format
    buffer.writeBigInt64BE(BigInt(counter), 0);
    
    // Compute the HMAC-SHA1 using the secret
    const hmac = crypto.createHmac('sha1', Buffer.from(secretHex, 'hex'));
    hmac.update(buffer);
    const hmacResult = hmac.digest();
    
    // Dynamic truncation of HMAC-SHA1 value
    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const binary = ((hmacResult[offset] & 0x7f) << 24) |
                   ((hmacResult[offset + 1] & 0xff) << 16) |
                   ((hmacResult[offset + 2] & 0xff) << 8) |
                   (hmacResult[offset + 3] & 0xff);
                   
    // Generate a 6-digit numeric token
    const token = (binary % 1000000).toString().padStart(6, '0');
    return token;
  } catch (error) {
    console.error('TOTP generation error:', error);
    return '000000';
  }
};

module.exports = {
  generateSecret,
  generateTOTP
};

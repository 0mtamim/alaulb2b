
// Security Utility Functions

// OWASP A07: Identification and Authentication Failures
// Enforce strong password complexity
export const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) return { valid: false, message: "Password must be at least 8 characters." };
  if (!/[A-Z]/.test(password)) return { valid: false, message: "Password must contain an uppercase letter." };
  if (!/[a-z]/.test(password)) return { valid: false, message: "Password must contain a lowercase letter." };
  if (!/[0-9]/.test(password)) return { valid: false, message: "Password must contain a number." };
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return { valid: false, message: "Password must contain a special character." };
  return { valid: true, message: "" };
};

// OWASP A04: Insecure Design (Rate Limiting)
// Simple client-side rate limiter to prevent spamming actions like OTP resend or Login attempts
const attemptLog: Record<string, number[]> = {};

export const checkRateLimit = (action: string, limit: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  if (!attemptLog[action]) attemptLog[action] = [];
  
  // Filter out timestamps older than the window
  attemptLog[action] = attemptLog[action].filter(timestamp => now - timestamp < windowMs);
  
  // Check if limit reached
  if (attemptLog[action].length >= limit) return false;
  
  // Log new attempt
  attemptLog[action].push(now);
  return true;
};

// OWASP A03: Injection
// Safe HTML sanitizer (basic implementation for text content)
export const sanitizeInput = (str: string): string => {
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
};

// Payment Security: Luhn Algorithm for basic card validation
export const validateCardLuhn = (cardNumber: string): boolean => {
    const sanitized = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized.charAt(i));
        
        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    
    return (sum % 10) === 0;
};

// Masking for display
export const maskCardNumber = (cardNumber: string): string => {
    const sanitized = cardNumber.replace(/\D/g, '');
    return `•••• •••• •••• ${sanitized.slice(-4)}`;
};

// --- FILE SECURITY UTILITIES (OWASP File Upload) ---

// 1. Magic Number Verification (Prevents Extension Spoofing)
const FILE_SIGNATURES: Record<string, string> = {
    'FFD8FF': 'image/jpeg',
    '89504E47': 'image/png',
    '47494638': 'image/gif',
    '25504446': 'application/pdf'
};

export const verifyFileSignature = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            if (e.target?.readyState === FileReader.DONE) {
                const arr = (new Uint8Array(e.target.result as ArrayBuffer)).subarray(0, 4);
                let header = "";
                for(let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16).toUpperCase();
                }
                
                // Check if the header starts with any of our known signatures
                const isValid = Object.keys(FILE_SIGNATURES).some(signature => {
                    return header.startsWith(signature);
                });
                
                resolve(isValid);
            }
        };
        reader.onerror = () => resolve(false);
        reader.readAsArrayBuffer(file.slice(0, 4));
    });
};

// 2. Image Scrubbing (Prevents Steganography & Code Injection)
// This re-encodes the image via Canvas, stripping metadata and potential hidden payloads.
export const sanitizeImageFile = async (file: File): Promise<File | null> => {
    if (!file.type.startsWith('image/')) return file; // Return as-is if not image (e.g. PDF)

    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                URL.revokeObjectURL(url);
                resolve(null);
                return;
            }

            // Draw image to canvas (this process "washes" the pixels)
            ctx.drawImage(img, 0, 0);
            
            // Export as clean Blob
            canvas.toBlob((blob) => {
                URL.revokeObjectURL(url);
                if (blob) {
                    // Create a new clean file
                    // Note: file.name is used but sanitized in practice by browser upload handling usually, 
                    // but here we just ensure the Blob is fresh.
                    const cleanFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
                    resolve(cleanFile);
                } else {
                    resolve(null);
                }
            }, file.type, 0.9);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(null); // Corrupt file or script masked as image
        };

        img.src = url;
    });
};

/**
 * OTP Service for account verification
 * Generates, stores, and validates OTP codes
 */

interface OTPRecord {
  code: string;
  email: string;
  phone?: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
}

class OTPService {
  private otpStore: Map<string, OTPRecord> = new Map();
  private OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
  private OTP_LENGTH = 6;
  private MAX_ATTEMPTS = 5;

  /**
   * Generate a random OTP code
   */
  private generateOTPCode(): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < this.OTP_LENGTH; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return code;
  }

  /**
   * Generate and send OTP to user
   * @param email User email address
   * @param phone Optional phone number
   * @returns OTP code (for demo purposes)
   */
  public generateOTP(email: string, phone?: string): string {
    const code = this.generateOTPCode();
    const now = Date.now();

    const otpRecord: OTPRecord = {
      code,
      email,
      phone,
      createdAt: now,
      expiresAt: now + this.OTP_EXPIRY_TIME,
      attempts: 0,
      maxAttempts: this.MAX_ATTEMPTS,
      verified: false
    };

    this.otpStore.set(email, otpRecord);

    // Log OTP (in real app, would send via email/SMS)
    console.log(`[OTP Service] Generated OTP for ${email}: ${code}`);
    console.log(`[OTP Service] Expires at: ${new Date(otpRecord.expiresAt).toLocaleTimeString()}`);

    return code; // Return for demo purposes only
  }

  /**
   * Verify OTP code
   * @param email User email
   * @param code OTP code to verify
   * @returns true if valid, false otherwise
   */
  public verifyOTP(email: string, code: string): { valid: boolean; message: string } {
    const otpRecord = this.otpStore.get(email);

    if (!otpRecord) {
      return { valid: false, message: 'No OTP found for this email. Request a new OTP.' };
    }

    // Check if OTP is already verified
    if (otpRecord.verified) {
      return { valid: false, message: 'This OTP has already been used.' };
    }

    // Check if OTP has expired
    if (Date.now() > otpRecord.expiresAt) {
      this.otpStore.delete(email);
      return { valid: false, message: 'OTP has expired. Request a new OTP.' };
    }

    // Check max attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      this.otpStore.delete(email);
      return { valid: false, message: 'Maximum OTP attempts exceeded. Request a new OTP.' };
    }

    // Verify code
    if (code !== otpRecord.code) {
      otpRecord.attempts++;
      return {
        valid: false,
        message: `Invalid OTP. Attempts remaining: ${otpRecord.maxAttempts - otpRecord.attempts}`
      };
    }

    // Mark as verified
    otpRecord.verified = true;
    return { valid: true, message: 'OTP verified successfully!' };
  }

  /**
   * Get OTP details (for demo)
   */
  public getOTPDetails(email: string): OTPRecord | null {
    return this.otpStore.get(email) || null;
  }

  /**
   * Clear OTP after verification
   */
  public clearOTP(email: string): void {
    this.otpStore.delete(email);
  }

  /**
   * Check if OTP is still valid
   */
  public isOTPValid(email: string): boolean {
    const otpRecord = this.otpStore.get(email);
    if (!otpRecord) return false;
    return Date.now() <= otpRecord.expiresAt && !otpRecord.verified;
  }

  /**
   * Get remaining time for OTP
   */
  public getRemainingTime(email: string): number {
    const otpRecord = this.otpStore.get(email);
    if (!otpRecord) return 0;
    const remaining = otpRecord.expiresAt - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }
}

// Export singleton instance
export const otpService = new OTPService();
export default OTPService;

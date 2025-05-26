import { scrypt, randomBytes, timingSafeEqual } from "crypto";

// The scryptjs version
const VERSION = "v1";

/** The scryptjs options */
type Options = {
  /**
   * The CPU/memory cost parameter
   * @default 4096
   */
  N: number;
  /**
   * The block size parameter
   * @default 8
   */
  r: number;
  /**
   * The parallelization parameter
   * @default 1
   */
  p: number;
  /**
   * The key length
   * @default 64
   */
  keylen: number;
  /**
   * The size of the salt
   * @default 32
   */
  saltSize: number;
};

/** The scryptjs options */
type ScryptJSOptions = Partial<Options>;

// The default scryptjs options
const DEFAULT_SCRYPT_OPTIONS: Options = {
  N: 4096,
  r: 8,
  p: 1,
  keylen: 64,
  saltSize: 32,
};

/**
 * Create a scrypt password hashing utility
 * @param options - The scrypt options
 * @returns The scrypt password hashing utility
 * @throws An error if the hashing fails
 * @example
 * ```typescript
 * import scryptjs from "scryptjs";
 *
 * const scrypt = scryptjs();
 * const hashedPassword = await scrypt.hash("password");
 * const isMatch = await scrypt.compare("password", hashedPassword);
 * console.log(isMatch); // true
 * ```
 */
function scryptjs(options?: ScryptJSOptions) {
  // The scrypt options
  const SCRYPT_OPTIONS = {
    ...DEFAULT_SCRYPT_OPTIONS,
    ...options,
  };

  /**
   * Async  scrypt implementation
   * @param password - The password to hash
   * @param salt - The salt to use
   * @param keylen - The key length
   * @param options - The scrypt options
   * @returns The hashed password
   * @throws An error if the hashing fails
   */
  async function scryptAsync(
    password: string,
    salt: string,
    keylen: number,
    options: Record<string, number>,
  ): Promise<Buffer<ArrayBufferLike>> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, keylen, options, (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey);
        }
      });
    });
  }

  /**
   * Hash a password
   * @param password - The password to hash
   * @param salt - The salt to use (optional). If not provided, a random salt will be generated
   * @returns The hashed password
   */
  async function hash(password: string, salt?: string): Promise<string> {
    const { N, r, p, keylen, saltSize } = SCRYPT_OPTIONS;
    if (!salt) {
      salt = randomBytes(saltSize).toString("hex");
    }
    const buffer = await scryptAsync(password, salt, keylen, {
      N,
      r,
      p,
    });

    return JSON.stringify({
      version: VERSION,
      hash: buffer.toString("hex"),
      salt,
    });
  }

  /**
   * Compare a supplied password with a stored password
   * @param suppliedPassword - The password to compare
   * @param storedPassword - The stored password to compare
   * @returns A boolean indicating if the passwords match
   */
  async function compare(
    suppliedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    const { version, hash, salt } = JSON.parse(storedPassword);

    if (version !== VERSION) {
      throw new Error("Unsupported password version");
    }

    const { N, r, p, keylen } = SCRYPT_OPTIONS;

    const hashedPasswordBuf = Buffer.from(hash, "hex");

    const suppliedPasswordBuf = await scryptAsync(
      suppliedPassword,
      salt,
      keylen,
      {
        N,
        r,
        p,
      },
    );

    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  }

  return { hash, compare };
}

export default scryptjs;

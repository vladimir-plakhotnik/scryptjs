# scryptjs

A lightweight library for password hashing using scrypt in Node.js.

This library offers a reliable, modern, and efficient alternative to bcrypt and other libraries for password generation and storage on the server side.


## Motivation

Although Node.js provides built-in support for the [scrypt](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback) algorithm, using it often requires repetitive boilerplate code. For example, each time you need to:

1. Wrap the scrypt function in a Promise to use it asynchronously.
2. Manually handle salt generation.
3. Serialize or structure the resulting hash for storage.

This package was created to simplify the process by:

- Providing an easy-to-use API for password hashing and verification.
- Automatically handling salt generation and JSON formatting.
- Ensuring safe and consistent password comparisons using timingSafeEqual.

With this package, you can securely hash and verify passwords without worrying about these implementation details.

## Installation

```bash
npm i @vladimir-plakhotnik/scryptjs
```

## Usage

```typescript
import scryptjs from "@vladimir-plakhotnik/scryptjs";

const scrypt = scryptjs();
const hashedPassword = await scrypt.hash("password");
const isMatch = await scrypt.compare("password", hashedPassword);
console.log(isMatch); // true
```

## Options

The scryptjs options allows you to customize the behavior of the scryptjs library. All fields are optional, and any omitted fields will use the default values.

Fields:

- `N`: The CPU/memory cost parameter. This controls the computational cost of the hashing process.<br>Default: `4096`
- `r`: The block size parameter. This affects the amount of memory used for the hashing operation.<br>Default: `8`
- `p`: The parallelization parameter. This determines the number of parallel threads used during hashing.<br>Default: `1`
- `keylen`: The length of the derived key (hashed password) in bytes.<br>Default: `64`
- `saltSize`: The size of the randomly generated salt in bytes.<br>Default: `32`

You can pass custom options to configure the scrypt hashing algorithm:

```typescript
const scrypt = scryptjs({
  N: 16384,
  r: 8,
  p: 2,
  keylen: 64,
  saltSize: 32,
});
```

## Password Hash Format

The hashed password returned by the hash method is a stringified JSON object. It includes the following parameters:

- `version`: The version of the hash format. Currently, this is `"v1"`. This allows for future updates to the hashing mechanism while maintaining backward compatibility.
- `hash`: The derived key (password hash), represented as a hexadecimal string.
- `salt`: A randomly generated salt used during the hashing process, represented as a hexadecimal string.

Example:

```json
{
  "version": "v1",
  "hash": "a3d53f9c5a2bd4711f3e2c9ad760b63eebf4e8b0b7485a5f5c0c9fda9a7c7b5b",
  "salt": "5f4dcc3b5aa765d61d8327deb882cf99"
}
```

This JSON object is then stringified into a single string for storage or further use.

## Examples

The project includes examples that demonstrate how to use the library. These examples are located in the [example](https://github.com/vladimir-plakhotnik/scryptjs/tree/main/example) folder of the project.

### How to Run the Examples

If you have cloned the repository locally, you can run the examples as follows:

1. **Build the Project**.<br>Ensure the TypeScript source files are compiled:

```bash
npm run build
```

1. **Run the example**.<br>Use `ts-node` to execute the example:

```bash
npx ts-node example/usage.ts
```

## License

This library is licensed under the MIT License.

import scryptjs from "../index";

describe("scryptjs", () => {
  const password = "securePassword";
  const invalidPassword = "wrongPassword";

  it("should hash and verify a password successfully", async () => {
    const scrypt = scryptjs();
    const hashedPassword = await scrypt.hash(password);
    const isMatch = await scrypt.compare(password, hashedPassword);

    expect(isMatch).toBe(true);
  });

  it("should fail to verify an incorrect password", async () => {
    const scrypt = scryptjs();
    const hashedPassword = await scrypt.hash(password);
    const isMatch = await scrypt.compare(invalidPassword, hashedPassword);

    expect(isMatch).toBe(false);
  });

  it("should throw an error for unsupported versions", async () => {
    const scrypt = scryptjs();
    const invalidStoredPassword = JSON.stringify({
      version: "v2",
      hash: "1234",
      salt: "abcd",
    });

    await expect(
      scrypt.compare(password, invalidStoredPassword),
    ).rejects.toThrow("Unsupported password version");
  });
});

import scryptjs from "../src/index";

async function runExample() {
  try {
    const scrypt = scryptjs();

    // Hashing the password
    const password = "my-secure-password";
    const hashedPassword = await scrypt.hash(password);
    console.log("Hashed Password:", hashedPassword);

    // Comparing the password
    const isMatch = await scrypt.compare(password, hashedPassword);
    console.log("Password Match:", isMatch);

    // Checking with an incorrect password
    const isMatchWrong = await scrypt.compare("wrong-password", hashedPassword);
    console.log("Password Match (wrong):", isMatchWrong);
  } catch (error) {
    console.error("Error:", error);
  }
}

runExample();

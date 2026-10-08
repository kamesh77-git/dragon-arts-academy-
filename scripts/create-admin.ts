// Creates (or resets the password of) an admin account.
//
//   npm run admin:create                 asks for email, name and password
//                                        (password is typed invisibly)
//   npm run admin:create -- <email> <password> [name]
//   npm run admin:create -- --seed       uses ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD
//                                        from .env.local (local dev only)
import { config } from "dotenv";
import { createInterface } from "node:readline";

config({ path: ".env.local" });

function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Echo nothing while the password is typed.
      (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s: string) => {
        if (s.includes(question)) process.stdout.write(question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  let email = "";
  let password = "";
  let name = "Admin";

  if (args[0] === "--seed") {
    email = process.env.ADMIN_SEED_EMAIL ?? "";
    password = process.env.ADMIN_SEED_PASSWORD ?? "";
  } else if (args.length >= 2) {
    [email, password] = args;
    name = args[2] ?? name;
  } else if (process.stdin.isTTY) {
    const host = (process.env.DATABASE_URL ?? "").match(/@([^/:?]+)/)?.[1] ?? "unknown database";
    console.log(`Creating an admin in: ${host}\n`);
    email = await ask("Admin email: ");
    name = (await ask("Name: ")) || name;
    password = await ask("Password (min 8 characters, hidden): ", true);
    const again = await ask("Type the password again: ", true);
    if (password !== again) {
      console.error("Passwords don't match. Nothing was changed.");
      process.exit(1);
    }
  } else {
    console.error("Run this in a terminal so it can ask for the email and password, or pass: <email> <password> [name]");
    process.exit(1);
  }

  email = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("That doesn't look like an email address.");
    process.exit(1);
  }
  if (/@(example|youremail)\.com$/.test(email) || /^(YourStrongPassword|ChooseARealPassword)$/.test(password)) {
    console.error("That's the example text from the instructions. Use your real email and your own password.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const [{ db }, { users }, bcrypt] = await Promise.all([import("../db"), import("../db/schema"), import("bcryptjs")]);
  const passwordHash = await bcrypt.hash(password, 12);
  await db
    .insert(users)
    .values({ email, name, passwordHash, role: "admin" })
    .onConflictDoUpdate({ target: users.email, set: { passwordHash, role: "admin", name } });

  console.log(`Admin ready: ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

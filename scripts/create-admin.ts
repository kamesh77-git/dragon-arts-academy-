// Creates (or resets the password of) an admin account.
// Usage: npm run admin:create -- <email> <password> [name]
// With no arguments it uses ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD from .env.local.
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const [{ db }, { users }, bcrypt] = await Promise.all([
    import("../db"),
    import("../db/schema"),
    import("bcryptjs"),
  ]);

  const email = (process.argv[2] ?? process.env.ADMIN_SEED_EMAIL ?? "").trim().toLowerCase();
  const password = process.argv[3] ?? process.env.ADMIN_SEED_PASSWORD ?? "";
  const name = process.argv[4] ?? "Admin";
  if (!email || password.length < 8) {
    console.error("Need an email and a password of at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db
    .insert(users)
    .values({ email, name, passwordHash, role: "admin" })
    .onConflictDoUpdate({ target: users.email, set: { passwordHash, role: "admin" } });

  console.log(`Admin ready: ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

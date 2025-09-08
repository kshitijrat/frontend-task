// lib/hash.ts
import bcrypt from 'bcryptjs'

export function hashPassword(password: string) {
  // sync hashing is OK for small dev usage
  return bcrypt.hashSync(password, 8) // cost 8 (dev-friendly)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

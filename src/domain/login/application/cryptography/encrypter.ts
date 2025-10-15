export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>, expiresIn?: unknown): Promise<string>
}
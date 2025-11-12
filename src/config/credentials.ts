/**
 * User credentials for authentication
 * Note: In a production app, these should be stored securely (e.g., backend, environment variables)
 */

export const CREDENTIALS = {
  maria: "ilovemochi",
  leo: "Yjh20010209!",
} as const;

export type UserCharacter = keyof typeof CREDENTIALS;

/**
 * Validate user credentials
 * @param character - The selected character (maria or leo)
 * @param password - The entered password
 * @returns boolean - Whether the credentials are valid
 */
export const validateCredentials = (
  character: UserCharacter,
  password: string
): boolean => {
  return CREDENTIALS[character] === password;
};

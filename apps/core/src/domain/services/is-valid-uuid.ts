type UUIDTemplate = `${string}-${string}-${string}-${string}-${string}`;

export default function isValidUUID(value: string): value is UUIDTemplate {
  const pattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  return pattern.test(value);
}

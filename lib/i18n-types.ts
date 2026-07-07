export type AppTranslateFn = (
  key: string,
  values?: Record<string, string | number | Date>
) => string;

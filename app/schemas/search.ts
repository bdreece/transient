import z from 'zod';

export const SearchSchema = z.object({
  search: z.string().min(1, 'Must have at least 1 character'),
});

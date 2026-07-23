import { z } from 'zod';

export const SearchSchema = z.object({
  q: z.string().min(1, 'You must enter a search term.'),
});

export type SearchSchema = z.infer<typeof SearchSchema>;

export const NameSchema = z.string().trim().min(1, 'Name is required.').max(100);
export const DescriptionSchema = z.string().trim().max(1000).or(z.null());
export const LatSchema = z.preprocess(
  value => value === '' ? undefined : value,
  z.coerce.number({ message: 'Latitude is required.' }).min(-90).max(90),
);
export const LongSchema = z.preprocess(
  value => value === '' ? undefined : value,
  z.coerce.number({ message: 'Longitude is required.' }).min(-180).max(180),
);
export const DateSchema = z.number({
  message: 'Date is required',
});

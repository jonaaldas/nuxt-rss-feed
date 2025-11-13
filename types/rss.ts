import { z } from 'zod';
export type NavItem = {
  title: string;
  url: string;
  items?: NavItem[];
  isActive?: boolean;
  id: string;
};

export const RssFeedItemSchema = z.object({
  content: z.string(),
  contentEncoded: z.string().optional(),
  contentEncodedSnippet: z.string().optional(),
  contentSnipper: z.string().optional(),
  creator: z.string(),
  dcCreator: z.string().optional(),
  enclosure: z
    .object({
      length: z
        .union([z.number(), z.string()])
        .transform((val) =>
          typeof val === 'string' ? parseInt(val, 10) || 0 : val,
        ),
      type: z.string(),
      url: z.string(),
    })
    .optional(),
  guid: z.string(),
  isoDate: z.string(),
  link: z.string(),
  pubDate: z.string(),
  title: z.string(),
});

export type RssFeedItem = {
  content: string;
  contentEncoded?: string;
  contentEncodedSnippet?: string;
  contentSnipper?: string;
  creator: string;
  dcCreator?: string;
  enclosure?: { length: number; type: string; url: string };
  guid: string;
  isoDate: string;
  link: string;
  pubDate: string;
  title: string;
};

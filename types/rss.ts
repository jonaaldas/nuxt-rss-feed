export type NavItem = {
  title: string;
  url: string;
  items?: NavItem[];
  isActive?: boolean;
  id: string;
};

export type RssFeedItem = {
  content: string;
  contentEncoded: string;
  contentEncodedSnippet: string;
  contentSnipper: string;
  creator: string;
  dcCreator: string;
  enclosure: { length: number; type: string; url: string };
  guid: string;
  isoDate: string;
  link: string;
  pubDate: string;
  title: string;
}[];

import { ofetch } from "ofetch";
import Parser from "rss-parser";

export const fetchRssFeed = async (url: string) => {
  try {
    const response = await ofetch(url, { responseType: "text" });
    const parser = new Parser();
    const result = await parser.parseString(response);

    return {
      items: result.items,
      link: result.link || "",
      feedUrl: result.feedUrl || url,
      title: result.title || "",
      lastBuildDate: result.lastBuildDate || new Date().toISOString(),
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch RSS feed: ${error}`);
  }
};

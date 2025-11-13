import { generateText } from 'ai';
import { RssFeedItem } from '~~/types/rss';
import { google } from '@ai-sdk/google';
import { get, set } from '~~/server/lib/redis';

export const summarizeArticle = async (article: RssFeedItem) => {
  try {
    const cacheKey = `summary:${article.guid}`;
    const cachedSummary = await get(cacheKey);
    if (cachedSummary) {
      return { data: cachedSummary, error: null };
    }

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: `You are an expert article summarizer. When summarizing articles:
      **Structure:**
      - Begin with a one-sentence thesis statement
      - Present key points in logical order
      - Include supporting evidence or data when relevant
      - End with conclusions or implications

      **Quality Standards:**
      - Accuracy: Faithfully represent the source material
      - Clarity: Use simple, direct language
      - Conciseness: Reduce length by 60-80% while retaining essential information
      - Completeness: Cover all major themes and arguments

      **Tone:** Match the original article's tone while remaining objective
      **Length:** Max 4 lines of text`,
      prompt: `Summarize the following article: ${article.content || article.contentEncoded || article.contentEncodedSnippet || article.contentSnipper}`,
    });

    await set(cacheKey, text);
    return { data: text, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: error as string };
  }
};

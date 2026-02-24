'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * @fileOverview note.comのRSSフィードから記事を取得し、
 * タイトルと概要を同期するためのサーバーアクションです。
 */

export async function fetchNoteRss() {
  const NOTE_RSS_URL = 'https://note.com/lucky_minnow287/rss';
  
  try {
    const response = await fetch(NOTE_RSS_URL);
    const xmlText = await response.text();
    
    // シンプルな正規表現によるXMLパース（ブラウザAPIがサーバーサイドで使えないため）
    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const parsedArticles = items.map(item => {
      const title = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || 
                    item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const description = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || 
                          item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      
      return {
        title,
        noteUrl: link,
        excerpt: description.replace(/<[^>]*>?/gm, '').substring(0, 200),
        publishDate: pubDate,
        id: link.split('/').pop() || Math.random().toString(36).substring(7)
      };
    });

    return { success: true, articles: parsedArticles };
  } catch (error) {
    console.error('RSS Sync Error:', error);
    return { success: false, error: '同期に失敗しました。' };
  }
}
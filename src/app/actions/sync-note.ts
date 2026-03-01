'use server';

/**
 * @fileOverview note.comのRSSフィードから記事を取得し、Firestoreに保存可能な形式に変換するサーバーアクション。
 * 同期時に本文が空になる現象を防ぐためのバリデーションを強化。
 */

export async function fetchAndSyncNoteRss() {
  const NOTE_RSS_URL = 'https://note.com/lucky_minnow287/rss';
  
  try {
    const response = await fetch(NOTE_RSS_URL, { 
      next: { revalidate: 0 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`RSSの取得に失敗しました: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    if (items.length === 0) {
      return { success: true, articles: [], message: '同期対象の記事が見つかりませんでした。' };
    }

    const parsedArticles = items.map(item => {
      const extract = (tag: string) => {
        const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i');
        const match = item.match(regex);
        return match ? match[1].trim() : "";
      };

      const title = extract('title');
      const link = extract('link');
      const pubDate = extract('pubDate');
      
      let htmlContent = extract('content:encoded');
      if (!htmlContent || htmlContent.length < 10) {
        htmlContent = extract('description');
      }

      // もし本文が極端に短い場合は、同期エラーとして扱うか、またはdescriptionを優先
      if (!htmlContent) {
        htmlContent = "<p>記事の内容を読み込めませんでした。元のサイトをご確認ください。</p>";
      }

      // 不要なタグのクリーンアップ
      htmlContent = htmlContent.replace(/<a\s+href=['"][^'"]+['"][^>]*>(?:続きを?見[るる]|続きを読む|続きを見る)<\/a>/gi, '');
      htmlContent = htmlContent.replace(/(?:続きを?見[るる]|続きを読む|続きを見る)/gi, '');
      htmlContent = htmlContent.replace(/(?:<p[^>]*>\s*<\/p>|<br\s*\/?>|\s)*$/gi, '').trim();

      const description = extract('description');

      let imageUrl = item.match(/<media:thumbnail>(.*?)<\/media:thumbnail>/)?.[1] || "";
      if (!imageUrl) {
        const imgMatch = description.match(/<img[^+]+src="([^">]+)"/);
        imageUrl = imgMatch ? imgMatch[1] : "";
      }

      const noteId = link.split('/').pop() || Math.random().toString(36).substring(7);

      let categoryId = 'Campus';
      if (title.includes('インタビュー')) categoryId = 'Interview';
      else if (title.includes('イベント')) categoryId = 'Event';
      else if (title.includes('部') || title.includes('大会')) categoryId = 'Sports';

      return {
        id: noteId,
        title: title,
        noteUrl: link,
        source: 'note',
        htmlContent: htmlContent,
        summary: "",
        mainImageUrl: imageUrl,
        publishDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        lastSyncedDate: new Date().toISOString(),
        isPublished: true,
        categoryId: categoryId,
        authorName: '北海学園大学新聞 (note)'
      };
    });

    return { success: true, articles: parsedArticles };
  } catch (error: any) {
    console.error('RSS Sync Error:', error);
    return { success: false, error: error.message || 'RSSの通信に失敗しました。' };
  }
}
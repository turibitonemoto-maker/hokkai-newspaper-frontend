'use server';

/**
 * @fileOverview note.comのRSSフィードから記事を高度に取得し、Firestoreに保存可能な形式に変換するサーバーアクション。
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
    
    // <item>タグで分割
    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    if (items.length === 0) {
      return { success: true, articles: [], message: '同期対象の記事が見つかりませんでした。' };
    }

    const parsedArticles = items.map(item => {
      // データの抽出（CDATAセクション対応）
      const extract = (tag: string) => {
        const regex = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`);
        return item.match(regex)?.[1]?.trim() || "";
      };

      const title = extract('title');
      const link = extract('link');
      const description = extract('description');
      const pubDate = extract('pubDate');
      
      // noteのアイキャッチ画像 (media:thumbnail または content:encoded から抽出を試みる)
      let imageUrl = item.match(/<media:thumbnail>(.*?)<\/media:thumbnail>/)?.[1] || "";
      if (!imageUrl) {
        // description内にある最初のimgタグを探す
        imageUrl = description.match(/<img[^>]+src="([^">]+)"/)?.[1] || "";
      }

      // noteのIDを抽出
      const noteId = link.split('/').pop() || Math.random().toString(36).substring(7);

      // 本文からHTMLタグを除去してプレーンテキストの要約を作成
      const plainTextContent = description.replace(/<[^>]*>?/gm, '');

      return {
        id: noteId,
        title: title,
        noteUrl: link,
        source: 'note',
        htmlContent: description, // noteはdescriptionにリッチコンテンツが含まれることが多い
        summary: plainTextContent.substring(0, 200).trim() + (plainTextContent.length > 200 ? '...' : ''),
        mainImageUrl: imageUrl,
        publishDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        lastSyncedDate: new Date().toISOString(),
        isPublished: true,
        categoryId: 'Campus',
        authorName: '北海学園大学新聞 (note)'
      };
    });

    return { success: true, articles: parsedArticles };
  } catch (error: any) {
    console.error('RSS Sync Error:', error);
    return { success: false, error: error.message || 'RSSの通信に失敗しました。' };
  }
}

'use server';

/**
 * @fileOverview note.comのRSSフィードから記事を取得し、Firestoreに保存するためのサーバーアクション。
 */

export async function fetchAndSyncNoteRss() {
  const NOTE_RSS_URL = 'https://note.com/lucky_minnow287/rss';
  
  try {
    const response = await fetch(NOTE_RSS_URL, { next: { revalidate: 3600 } });
    const xmlText = await response.text();
    
    // シンプルな正規表現によるXMLパース（ブラウザのDOMParserはサーバーサイドで使えないため）
    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const parsedArticles = items.map(item => {
      const title = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || 
                    item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const description = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || 
                          item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      
      // noteのURLから一意のIDを抽出 (例: https://note.com/user/n/n12345 -> n12345)
      const noteId = link.split('/').pop() || Math.random().toString(36).substring(7);

      // 簡単なHTMLタグ除去
      const plainTextContent = description.replace(/<[^>]*>?/gm, '');

      return {
        id: noteId,
        title,
        noteUrl: link,
        source: 'note',
        htmlContent: description,
        summary: plainTextContent.substring(0, 200) + '...',
        publishDate: new Date(pubDate).toISOString(),
        lastSyncedDate: new Date().toISOString(),
        isPublished: true,
        categoryId: 'Campus', // デフォルトカテゴリー
        authorName: '北海学園大学新聞 (note)'
      };
    });

    return { success: true, articles: parsedArticles };
  } catch (error) {
    console.error('RSS Sync Error:', error);
    return { success: false, error: 'RSSの取得に失敗しました。' };
  }
}

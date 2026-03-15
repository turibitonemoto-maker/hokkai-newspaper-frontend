'use server';

/**
 * 【改革により廃止】
 * note.comとのRSS連携は解除されました。
 * 今後は管理画面からの「人力投稿」のみが唯一のソースとなります。
 */
export async function fetchAndSyncNoteRss() {
  console.log('RSS Sync is disabled. Switching to manual input mode.');
  return { success: true, articles: [], message: 'Sync disabled by commander order.' };
}

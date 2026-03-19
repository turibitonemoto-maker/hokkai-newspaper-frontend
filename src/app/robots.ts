import { MetadataRoute } from 'next'

/**
 * クローラー規律命令 (robots.txt)
 * 全世界の検索エンジンに対し、アクセス許可・拒否の境界線を物理的に示します。
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hokkai-gakuen-news.web.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // 管理画面とAPIはクロールさせない
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

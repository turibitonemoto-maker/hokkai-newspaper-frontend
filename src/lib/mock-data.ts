import type { Article, Category } from './types';

export const CATEGORIES: Category[] = ['Campus', 'Event', 'Interview', 'Sports', 'Opinion'];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: '北海学園大学、新キャンパス棟の建設を計画',
    excerpt: '次世代の学習環境を提供するため、学内に新しい研究棟の建設が決定しました。',
    content: '北海学園大学は、創立100周年を前に、最新設備を備えた新研究棟「イノベーション・プラザ」の建設を計画していることを発表しました。この建物にはAIラボやデジタル工作室などが設置され、学部を超えた交流の場となる予定です。建設は来春から開始され、2026年の完成を目指しています。学長は「学生たちが未来を創造するための拠点となるだろう」と述べています。',
    summary: '北海学園大学が最新設備を備えた新研究棟「イノベーション・プラザ」の建設を発表。2026年完成予定。',
    category: 'Campus',
    author: '新聞会 取材班',
    publishDate: '2024-05-15',
    imageUrl: 'https://picsum.photos/seed/1/800/500',
    imageHint: 'university building',
    featured: true
  },
  {
    id: '2',
    title: '春の学園祭「豊平祭」が盛大に開催',
    excerpt: '3年ぶりに制限なしで開催された学園祭。模擬店やライブステージに多くの笑顔が溢れました。',
    content: '今年の豊平祭は、快晴の中で開催されました。学内には50以上の模擬店が並び、メインステージでは軽音楽部やダンスサークルによる情熱的なパフォーマンスが披露されました。地域住民も多く訪れ、キャンパスは一日中賑わいを見せました。',
    category: 'Event',
    author: '山田 太郎',
    publishDate: '2024-05-10',
    imageUrl: 'https://picsum.photos/seed/2/800/500',
    imageHint: 'festival crowd'
  },
  {
    id: '3',
    title: '卒業生インタビュー：IT業界で活躍する佐藤さん',
    excerpt: '経済学部を卒業し、現在は大手IT企業でリードエンジニアを務める佐藤さんに学生時代の思い出を聞きました。',
    content: '佐藤さんは学生時代、新聞会に所属していました。「当時はアナログな編集作業でしたが、情報を伝える難しさと楽しさを学びました」と語ります。現在の仕事でも、新聞会で培った「客観的に物事を見る目」が役立っているそうです。',
    category: 'Interview',
    author: '新聞会 編集部',
    publishDate: '2024-04-28',
    imageUrl: 'https://picsum.photos/seed/3/800/500',
    imageHint: 'business interview'
  },
  {
    id: '4',
    title: '硬式野球部、春季リーグ戦で見事優勝',
    excerpt: '接戦を制し、硬式野球部が悲願のリーグ優勝を果たしました。',
    content: '最終戦の相手は強豪校。9回裏、2死満塁の場面で見事なサヨナラ打が飛び出しました。主将は「チーム一丸となって戦った結果です」と涙ながらにコメント。全日本大学野球選手権への出場権も獲得しました。',
    category: 'Sports',
    author: '田中 二郎',
    publishDate: '2024-05-20',
    imageUrl: 'https://picsum.photos/seed/4/800/500',
    imageHint: 'baseball victory'
  }
];
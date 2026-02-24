"use client";

import Link from 'next/link';

export function Navbar() {
  return (
    <div style={{ backgroundColor: '#eeeeee', padding: '5px', borderBottom: '1px solid #000', marginBottom: '10px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#000' }}>
          HGU新聞会 簡易版
        </Link>
        <div style={{ fontSize: '0.8rem' }}>
          <Link href="/admin" style={{ marginLeft: '10px' }}>管理者ログイン</Link>
        </div>
      </div>
    </div>
  );
}
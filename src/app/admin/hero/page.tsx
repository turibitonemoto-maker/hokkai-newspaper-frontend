'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function HeroImageAdmin() {
  const db = useFirestore();
  const { toast } = useToast();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const heroImagesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'hero-images'), orderBy('order', 'asc'));
  }, [db]);

  const { data: heroImages, isLoading } = useCollection(heroImagesRef);

  const handleAddImage = () => {
    if (!db || !newImageUrl) return;
    setIsAdding(true);

    const id = Math.random().toString(36).substring(7);
    const newOrder = (heroImages?.length || 0) + 1;
    
    const docRef = doc(db, 'hero-images', id);
    setDocumentNonBlocking(docRef, {
      id,
      imageUrl: newImageUrl,
      order: newOrder,
    }, { merge: true });

    setNewImageUrl('');
    setIsAdding(false);
    toast({ title: "画像追加", description: "ヒーロー背景画像を追加しました。" });
  };

  const handleDelete = (id: string) => {
    if (!db || !confirm('この画像を削除しますか？')) return;
    const docRef = doc(db, 'hero-images', id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "画像削除", description: "背景画像を削除しました。" });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-xl">
          <Link href="/admin"><ArrowLeft size={20} /></Link>
        </Button>
        <div>
          <h2 className="text-3xl font-black tracking-tight">ヒーロー画像管理</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage Top Page Background Slideshow</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="rounded-[32px] border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-black">画像の追加</CardTitle>
              <CardDescription>背景に使用する画像のURLを入力してください。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">画像URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleAddImage} className="w-full h-12 rounded-2xl font-bold" disabled={!newImageUrl || isAdding}>
                {isAdding ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                追加する
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : heroImages && heroImages.length > 0 ? (
              heroImages.map((img) => (
                <Card key={img.id} className="overflow-hidden rounded-[24px] border-none shadow-md group relative">
                  <div className="aspect-video relative">
                    <img src={img.imageUrl} alt="Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(img.id)} className="rounded-xl">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                <ImageIcon className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">画像が登録されていません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
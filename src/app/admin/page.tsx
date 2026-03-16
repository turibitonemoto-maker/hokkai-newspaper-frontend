'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, Loader2, Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/**
 * 紙面アーカイブ発行フォーム (物理直結・システム内完結版)
 * サーバーサイド中継API (/api/upload) を経由して画像を安全に保存します。
 */
export default function AdminPage() {
  const db = useFirestore();
  const [issueNumber, setIssueNumber] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndSave = async () => {
    if (!issueNumber || !publishDate || selectedFiles.length === 0 || !db) {
      toast({
        variant: "destructive",
        title: "入力不備",
        description: "号数、日付、画像は必須です。",
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // 1. 各画像を中継API経由でCloudinaryへ物理的に転送
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Upload failed");
        uploadedUrls.push(data.result.secure_url);
      }

      // 2. Firestoreに「物理的に」保存 (categoryId: Viewer を採用)
      await addDoc(collection(db, "articles"), {
        title: `${issueNumber} 紙面アーカイブ`,
        issueNumber,
        publishDate: new Date(publishDate).toISOString(),
        paperImages: uploadedUrls,
        categoryId: "Viewer",
        isPublished: true,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "発行完了",
        description: `${issueNumber} が物理的に保存されました。`,
      });

      // フォームリセット
      setIssueNumber("");
      setPublishDate("");
      setSelectedFiles([]);

    } catch (error: any) {
      console.error("Admin save error:", error);
      toast({
        variant: "destructive",
        title: "エラー発生",
        description: error.message || "予期せぬエラーが発生しました。サーバーのログ(npm run dev)を確認してください。",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="rounded-[40px] border-none shadow-2xl ring-1 ring-slate-100 overflow-hidden">
        <CardHeader className="bg-primary text-white p-10">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Archiving System</span>
          </div>
          <CardTitle className="text-3xl font-black italic tracking-tighter">紙面アーカイブ発行</CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Number</label>
            <Input 
              placeholder="例：第101号" 
              value={issueNumber}
              onChange={(e) => setIssueNumber(e.target.value)}
              className="rounded-2xl border-slate-100 h-14 font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publish Date</label>
            <Input 
              type="date" 
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="rounded-2xl border-slate-100 h-14 font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paper Images (JPEG)</label>
            <div className="relative">
              <input 
                id="file-input"
                type="file" 
                multiple 
                accept="image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="file-input"
                className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[32px] p-12 cursor-pointer hover:bg-slate-50 transition-colors group"
              >
                <Plus size={48} className="text-slate-200 group-hover:text-primary transition-colors mb-4" />
                <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600">画像を複数選択（JPEG形式）</span>
              </label>
            </div>
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-4">
                {selectedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="text-slate-300 hover:text-destructive transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={handleUploadAndSave}
            disabled={uploading}
            className="w-full h-16 rounded-full bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                サーバー中継中...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2" />
                紙面を発行する
              </>
            )}
          </Button>

          <p className="text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
            Secure Mediation Protocol Active
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

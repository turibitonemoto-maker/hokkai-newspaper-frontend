'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, Loader2, Plus, X, FileUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * 紙面アーカイブ発行フォーム (PDF/JPEG 統合・物理直結版)
 * 一号分（複数ページ）の一括アップロードに対応。
 */
export default function AdminPage() {
  const db = useFirestore();
  const [issueNumber, setIssueNumber] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // 複数ファイルを追加
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndSave = async (mode: 'pdf' | 'jpeg') => {
    if (!issueNumber || !publishDate || !db) {
      toast({ variant: "destructive", title: "入力不備", description: "号数、日付は必須です。" });
      return;
    }

    if (mode === 'pdf' && !pdfFile) {
      toast({ variant: "destructive", title: "ファイル未選択", description: "PDFファイルを選択してください。" });
      return;
    }

    if (mode === 'jpeg' && selectedFiles.length === 0) {
      toast({ variant: "destructive", title: "ファイル未選択", description: "JPEG画像を1枚以上選択してください。" });
      return;
    }

    setUploading(true);
    
    try {
      if (mode === 'pdf' && pdfFile) {
        // PDFアップロード
        const formData = new FormData();
        formData.append("file", pdfFile);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Upload failed");

        await addDoc(collection(db, "articles"), {
          title: `${issueNumber} 紙面アーカイブ`,
          issueNumber,
          publishDate: new Date(publishDate).toISOString(),
          pdfUrl: data.result.secure_url,
          categoryId: "Viewer",
          isPublished: true,
          createdAt: serverTimestamp(),
        });
      } else {
        // JPEG複数枚アップロード（一号分）
        const uploadedUrls: string[] = [];
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (!data.success) throw new Error(data.error || "Upload failed");
          uploadedUrls.push(data.result.secure_url);
        }

        // 全ページのURLを一つの記事データとして保存
        await addDoc(collection(db, "articles"), {
          title: `${issueNumber} 紙面アーカイブ`,
          issueNumber,
          publishDate: new Date(publishDate).toISOString(),
          paperImages: uploadedUrls,
          categoryId: "Viewer",
          isPublished: true,
          createdAt: serverTimestamp(),
        });
      }

      toast({ title: "発行完了", description: `${issueNumber}（全${mode === 'pdf' ? '1ファイル' : selectedFiles.length + 'ページ'}）が物理的に保存されました。` });
      setIssueNumber("");
      setPublishDate("");
      setSelectedFiles([]);
      setPdfFile(null);

    } catch (error: any) {
      toast({ variant: "destructive", title: "エラー発生", description: error.message });
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

          <Tabs defaultValue="pdf" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl mb-6">
              <TabsTrigger value="pdf" className="rounded-xl font-bold">PDF (一号分一括)</TabsTrigger>
              <TabsTrigger value="jpeg" className="rounded-xl font-bold">JPEG (複数枚選択)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pdf" className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paper PDF</label>
              <div className="relative">
                <input id="pdf-input" type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
                <label htmlFor="pdf-input" className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[32px] p-12 cursor-pointer hover:bg-slate-50 transition-colors group">
                  <FileUp size={48} className="text-slate-200 group-hover:text-primary transition-colors mb-4" />
                  <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600">
                    {pdfFile ? pdfFile.name : "PDFファイルを選択"}
                  </span>
                </label>
              </div>
              <Button onClick={() => handleUploadAndSave('pdf')} disabled={uploading} className="w-full h-16 rounded-full bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 mt-4">
                {uploading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                PDFを発行する
              </Button>
            </TabsContent>

            <TabsContent value="jpeg" className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paper Images (複数ページ選択)</label>
              <div className="relative">
                <input id="jpeg-input" type="file" multiple accept="image/jpeg,image/jpg" onChange={handleFileChange} className="hidden" />
                <label htmlFor="jpeg-input" className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[32px] p-12 cursor-pointer hover:bg-slate-50 transition-colors group">
                  <Plus size={48} className="text-slate-200 group-hover:text-primary transition-colors mb-4" />
                  <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600">画像を複数選択（ページ順）</span>
                </label>
              </div>
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-4">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">P.{i+1}: {f.name}</span>
                      <button onClick={() => removeFile(i)} className="text-slate-300 hover:text-destructive"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={() => handleUploadAndSave('jpeg')} disabled={uploading} className="w-full h-16 rounded-full bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 mt-4">
                {uploading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                JPEG群を一号分として発行
              </Button>
            </TabsContent>
          </Tabs>

          <p className="text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">Secure Mediation Protocol Active</p>
        </CardContent>
      </Card>
    </div>
  );
}

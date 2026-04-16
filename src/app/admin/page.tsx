'use client';

import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, Loader2, Plus, FileUp, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

const ADMIN_EMAILS = ["r06hgunews@gmail.com", "turibitonemoto@gmail.com"];

export default function AdminPage() {
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const [issueNumber, setIssueNumber] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  if (isUserLoading) return <div className="container mx-auto px-4 py-40 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-50 p-12 rounded-[48px] border border-slate-100 shadow-xl max-w-md">
          <ShieldAlert className="text-destructive mx-auto mb-6" size={64} />
          <h1 className="text-2xl font-black mb-4">ACCESS DENIED</h1>
          <Button asChild variant="outline" className="rounded-full px-8 font-black tracking-widest"><Link href="/">TOPに戻る</Link></Button>
        </div>
      </div>
    );
  }

  const handleUploadAndSave = async (mode: 'pdf' | 'jpeg') => {
    if (!issueNumber || !publishDate || !db) {
      toast({ variant: "destructive", title: "入力不備", description: "号数、日付は必須です。" });
      return;
    }

    setUploading(true);
    
    try {
      const colRef = collection(db, "articles");
      const baseData = {
        issueNumber,
        publishDate: new Date(publishDate).toISOString(),
        categoryId: "Viewer",
        isPublished: true,
        createdAt: serverTimestamp(),
      };

      if (mode === 'pdf' && pdfFile) {
        const formData = new FormData();
        formData.append("file", pdfFile);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!data.success) throw new Error("Upload failed");

        addDoc(colRef, {
          ...baseData,
          title: `${issueNumber} 紙面アーカイブ`,
          pdfUrl: data.result.secure_url,
        }).catch(err => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: colRef.path, operation: 'create' }));
        });
      } else {
        const uploadedUrls: string[] = [];
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (data.success) uploadedUrls.push(data.result.secure_url);
        }

        addDoc(colRef, {
          ...baseData,
          title: `${issueNumber} 紙面アーカイブ`,
          paperImages: uploadedUrls,
        }).catch(err => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({ path: colRef.path, operation: 'create' }));
        });
      }

      toast({ title: "発行プロセス開始", description: "データの保存を開始しました。" });
      setIssueNumber(""); setPublishDate(""); setSelectedFiles([]); setPdfFile(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "エラー発生", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary text-white p-10">
          <div className="flex items-center gap-3 mb-2"><FileText size={24} /><span className="text-[10px] font-black uppercase tracking-[0.4em]">Archiving System</span></div>
          <CardTitle className="text-3xl font-black italic tracking-tighter">紙面アーカイブ発行</CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <Input placeholder="例：第101号" value={issueNumber} onChange={(e) => setIssueNumber(e.target.value)} className="rounded-2xl h-14 font-bold" />
          <Input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="rounded-2xl h-14 font-bold" />
          <Tabs defaultValue="pdf" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl mb-6">
              <TabsTrigger value="pdf" className="rounded-xl font-bold">PDF 一括</TabsTrigger>
              <TabsTrigger value="jpeg" className="rounded-xl font-bold">JPEG 複数</TabsTrigger>
            </TabsList>
            <TabsContent value="pdf" className="space-y-4">
              <input id="pdf-input" type="file" accept="application/pdf" onChange={(e) => e.target.files && setPdfFile(e.target.files[0])} className="hidden" />
              <label htmlFor="pdf-input" className="flex flex-col items-center justify-center border-4 border-dashed rounded-[32px] p-12 cursor-pointer hover:bg-slate-50 transition-colors">
                <FileUp size={48} className="text-slate-200 mb-4" />
                <span className="text-sm font-bold text-slate-400">{pdfFile ? pdfFile.name : "PDFを選択"}</span>
              </label>
              <Button onClick={() => handleUploadAndSave('pdf')} disabled={uploading} className="w-full h-16 rounded-full font-black text-lg">
                {uploading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />} PDFを発行
              </Button>
            </TabsContent>
            <TabsContent value="jpeg" className="space-y-4">
              <input id="jpeg-input" type="file" multiple accept="image/jpeg,image/jpg" onChange={(e) => e.target.files && setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])} className="hidden" />
              <label htmlFor="jpeg-input" className="flex flex-col items-center justify-center border-4 border-dashed rounded-[32px] p-12 cursor-pointer hover:bg-slate-50 transition-colors">
                <Plus size={48} className="text-slate-200 mb-4" />
                <span className="text-sm font-bold text-slate-400">画像を複数選択</span>
              </label>
              <Button onClick={() => handleUploadAndSave('jpeg')} disabled={uploading} className="w-full h-16 rounded-full font-black text-lg">
                {uploading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />} JPEG群を発行
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

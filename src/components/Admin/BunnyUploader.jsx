import React, { useState } from 'react';
import { Upload, FileText, Image, Video, CheckCircle, X } from 'lucide-react';
import { uploadEBook, uploadEBookCover, uploadCourseVideo } from '../../services/bunnyService';

const BunnyUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleUpload = async (file, type, id) => {
    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      let uploadResult;
      
      if (type === 'ebook') {
        uploadResult = await uploadEBook(file, id);
      } else if (type === 'cover') {
        uploadResult = await uploadEBookCover(file, id);
      } else if (type === 'video') {
        uploadResult = await uploadCourseVideo(file, id, Date.now());
      }

      setProgress(100);
      setResult({ success: true, url: uploadResult.url });
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const id = prompt(`Enter ${type === 'ebook' ? 'Book' : type === 'video' ? 'Course' : 'Book'} ID:`);
    if (!id) return;

    await handleUpload(file, type, id);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Bunny.net File Uploader</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileSelect(e, 'ebook')}
            className="hidden"
            disabled={uploading}
          />
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-[#5edff4] transition-colors text-center">
            <FileText className="size-8 mx-auto mb-2 text-slate-400" />
            <p className="font-bold text-sm">Upload E-Book PDF</p>
          </div>
        </label>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'cover')}
            className="hidden"
            disabled={uploading}
          />
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-[#5edff4] transition-colors text-center">
            <Image className="size-8 mx-auto mb-2 text-slate-400" />
            <p className="font-bold text-sm">Upload Cover Image</p>
          </div>
        </label>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e, 'video')}
            className="hidden"
            disabled={uploading}
          />
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-[#5edff4] transition-colors text-center">
            <Video className="size-8 mx-auto mb-2 text-slate-400" />
            <p className="font-bold text-sm">Upload Course Video</p>
          </div>
        </label>
      </div>

      {uploading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5edff4] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {result && (
        <div className={`p-4 rounded-xl ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex items-center gap-2">
            {result.success ? <CheckCircle className="size-5" /> : <X className="size-5" />}
            <div className="flex-1">
              {result.success ? (
                <>
                  <p className="font-bold">Upload Successful!</p>
                  <p className="text-xs break-all">{result.url}</p>
                </>
              ) : (
                <p className="font-bold">Upload Failed: {result.error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BunnyUploader;

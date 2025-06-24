"use client"

import { upload } from '@imagekit/next'
import React, { useState } from 'react'

interface FileUploadProps {
    onSuccess: (res: any) => void
    onProgress?: (progress: number) => void
    fileType?: "image" | "video"
}

function FileUpload({
  onSuccess,
  onProgress,
  fileType
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File) => {
        if (fileType === "video") {
          if (!file.type.startsWith("video")) {
            setError("please upload a valid file type");
          }
        }
        if (file.size > 100*1024*1024) {
          setError("file size should not exceed 100mb");
        }

        return true;
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !validateFile(file)) return;

      setUploading(true);
      setError(null);

      try {
        const response = await fetch("/api/auth/imagekit-auth");
        const data = await response.json();

        const result = await upload({
          file,
          fileName: file.name,
          publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
          signature: data.signature,
          expire: data.expire,
          token: data.token,
          onProgress: (e) => {
            if (e.lengthComputable && onProgress) {
              const percentage = (e.loaded/e.total)*100;
              onProgress(Math.round(percentage));
            }
          }
        })
        //@ts-ignore
        onSuccess(result);
        
      } catch (error) {
        console.log("upload failed",error);
      } finally {
        setUploading(false);
      }
    }
  return (
    <div>
        <input 
          type="file"
          accept={fileType === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}  
        />
        {uploading && (
          <span>Loading...</span>
        )}

        
    </div>
  )
}

export default FileUpload

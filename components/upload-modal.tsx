"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, X } from "lucide-react"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onFileUpload: (file: File) => void
}

export function UploadModal({ isOpen, onClose, onFileUpload }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.includes("spreadsheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setSelectedFile(file)
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile)
      setSelectedFile(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Review Data</DialogTitle>
          <DialogDescription>Upload an Excel file containing customer reviews for AI analysis.</DialogDescription>
        </DialogHeader>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-500">
                <FileSpreadsheet className="w-8 h-8" />
                <span className="font-medium">{selectedFile.name}</span>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleUpload} className="glow-primary">
                  Upload & Analyze
                </Button>
                <Button variant="outline" onClick={() => setSelectedFile(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">Drop your Excel file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" id="file-upload" />
              <Button variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Browse Files
                </label>
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Supported formats: .xlsx, .xls</p>
          <p>Your data is processed locally in your browser for privacy.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

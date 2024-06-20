import { MoveRight, Upload, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../components/ui/button'
import { UploadDropzone } from '../lib/uploadthing'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  apiEndpoint: 'avatar' | 'banner'
  onChange: (url?: string) => void
  value?: string
}

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split('.').pop()
  if(type === 'pdf') {
    toast.error('PDFs are not supported')
    onChange('')
  }

  if (value) {
    return (
      <>
      {
        apiEndpoint === 'banner' ? (
          <Image src={value} alt="uploaded image" className="object-cover w-full h-full" fill />
        ) : (
          
          <div className="flex flex-col justify-center md:items-center items-center rounded-full h-full">
          <div className={cn(apiEndpoint === 'avatar' ? "relative w-40 h-40" : 'w-full h-full')}>
          <Image
          src={value}
          alt="uploaded image"
          className={cn(apiEndpoint === 'avatar' ? "object-contain rounded-full border-2 border-muted" : "object-cover")}
          fill
          />
          </div>
          <Button
          onClick={() => onChange('')}
          variant="ghost"
          type="button"
          >
          <X className="h-4 w-4" />
          {
            apiEndpoint === 'avatar' ? 'Remove Avatar' : 'Remove Banner'
          }
          </Button>
          </div>
        )
      }
      </>
    )
  }
  return (
    <div className='flex gap-4 md:flex-row flex-col md:px-0 px-5'>
      {
        apiEndpoint === 'avatar' ? (
          <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className='flex w-40'>
          Upload Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
    <div className="w-full border border-dashed border-muted-foreground rounded-xl bg-background p-3 flex justify-center items-center">
      <UploadDropzone
      content={{
        label: 'Drag Drop or Choose',
        button: 'Upload Avatar',
        uploadIcon: <Upload />,
      }}
      appearance={{
        container: 'rounded-full w-40 h-52',
        button: 'ut-button:cursor-pointer',
      }}
      endpoint={apiEndpoint ? apiEndpoint : 'avatar'}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
      className='flex flex-col justify-center items-center ut-label:text-xs ut-button:cursor-pointer'
      />
    </div>
      </DialogContent>
    </Dialog>
    ) : (
      <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className='flex justify-center items-center'>
          Upload Cover
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
      <UploadDropzone
      appearance={{
        container: 'w-full h-full border-dashed border-muted-foreground bg-background p-3',
        button: 'ut-button:cursor-pointer',
      }}
      endpoint={apiEndpoint ? apiEndpoint : 'banner'}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
      className='flex flex-col justify-center items-center ut-label:text-xs ut-button:cursor-pointer'
      />
      </DialogContent>
    </Dialog>
    )
  }
      </ div>
    )
}

export default FileUpload
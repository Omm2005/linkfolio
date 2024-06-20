'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useRouter } from 'next/navigation'
import { Loader, LucideIcon, Pen, Plus } from 'lucide-react'
import { createCategory, createLink, updateCategory, updateLink } from '../../server/actions'
import { ConfettiButton } from '../ui/confetti'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'
type Props = {
  title?: string | null,
  url?: string | null,
  id?: string | null,
  categories: {
    name: string,
    id: string,
  },
  editButton?: boolean
}


const FormSchema = z.object({
  title: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  url: z.string().url('Invalid URL').min(1, 'URL is required').max(50, 'URL is too long')
})

export default function LinkForm({
  editButton,
  id,
  title,
  url,
  categories
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Assuming dialog is open by default
  const [text, setText] = useState({
    whenLoading: 'Creating',
    whenNotLoading: 'Create Link'
  }); // Assuming dialog is open by default
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: title || '',
      url: url || ''
    }
  })
  const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 1000));


  const isLoading = form.formState.isSubmitting
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const bodyData = {
        title: values.title,
        url: values.url,
        category: categories.id
      };
      if (id) {
        await updateLink({
          id: id,
          title: bodyData.title,
          url: bodyData.url,
          category: bodyData.category
        }).then((res: any) => {
          if (res.error) {
            toast.error(res.error, { duration: 5000 });
            form.reset();
            router.refresh();
          } else {
            router.push('/editor/links');
            toast.promise(promise, {
              loading: 'Updating...',
              success: (data) => {
                return `Link Updated Successfully`;
              },
              error: 'Error',
            });
          }
        });
      } else {

        await createLink(bodyData).then((res: any) => {
          if (res.error) {
            toast.error(res.error, { duration: 5000 });
            form.reset();
            router.refresh();
          } else {
            router.push('/editor/links');
            toast.promise(promise, {
              loading: 'Creating...',
              success: (data) => {
                return `Link created Successfully`;
              },
              error: 'Error',
            });
          }
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsDialogOpen(false);
    }
  }

  useEffect(() => {
    editButton && setText({
      whenLoading: 'Updating',
      whenNotLoading: 'Update Link'
    })
  }
    , [editButton])

  return (
    <div className={cn('w-full h-full', editButton && 'w-full h-full')}>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)} >
        <DialogTrigger asChild className='w-full'>
          <Button onClick={() => setIsDialogOpen(true)} variant={editButton ? 'outline' : 'default'} className={cn(editButton && 'rounded-lg bg-muted/30 border border-muted-foreground w-full flex gap-2')} >
            {
              editButton ? (
                <>
                  <Pen className='text-destructive-foreground' size={20} />
                  Edit Link
                </>
              ) : (
                <>
                  <Plus />
                  Create Link
                </>
              )
            }
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md !bg-background text-foreground w-full">
          <DialogHeader>
            <DialogTitle>{editButton ? 'Update' : 'Create'} Link</DialogTitle>
            <DialogDescription>
              {
                editButton ? (
                  <>
                    Update the Link name.
                  </>
                ) : (
                  <>
                    Create a new Link.
                  </>
                )
              }
            </DialogDescription>
          </DialogHeader>
          <Form {...form} >
            <form autoComplete='off' onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4 justify-start items-start w-full'>
              <FormField disabled={isLoading} control={form.control} name="title" render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='flex flex-col gap-2 justify-start items-start w-full'>

                    <Label>Title</Label>
                    <FormControl className='w-full'>
                      <Input
                        {...field}
                        className="text-start w-full bg-background"
                        placeholder="Showoff"
                        onChange={field.onChange}
                        value={field.value}
                        type='text'
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField disabled={isLoading} control={form.control} name="url" render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='flex flex-col gap-2 justify-start items-start w-full'>

                    <Label>Url</Label>
                    <FormControl className='w-full'>
                      <Input
                        {...field}
                        className="text-start w-full bg-background"
                        placeholder="Showoff"
                        onChange={field.onChange}
                        value={field.value}
                        type='url'
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
              />
              <div className='flex flex-col gap-2 justify-start items-start w-full'>

                <Label>
                  Category Name
                </Label>
                <p>
                  {categories.name}
                </p>
              </div>
              <ConfettiButton
                className='w-full'
                type="submit"
                // onClick={() => form.handleSubmit(handleSubmit)()}
                disabled={
                  isLoading
                }
              >
                {isLoading && <Loader />}
                {isLoading ? text.whenLoading : text.whenNotLoading}
              </ConfettiButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

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
import { createCategory, updateCategory } from '../../server/actions'
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
  name?: string | null,
  id?: string | null,
  buttonTitle?: string | null,
}


const FormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
})

export default function createCategoryForm({
  name,
  id,
  buttonTitle
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Assuming dialog is open by default
  const [text, setText] = useState({
    whenLoading: 'Creating',
    whenNotLoading: 'Create Category'
  }); // Assuming dialog is open by default
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name || '',
    }
  })
  const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 1000));


  const isLoading = form.formState.isSubmitting
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const bodyData = {
        name: values.name,
      };
      if (id) {
        await updateCategory({
          id: id,
          name: bodyData.name
        }).then((res: any) => {
          form.reset();
          if (res.error) {
            toast.error(res.error, { duration: 5000 });
            router.refresh();
          } else {
            router.push('/editor/links');
            toast.promise(promise, {
              loading: 'Updating...',
              success: (data) => {
                return `Category Updated Successfully`;
              },
              error: 'Error',
            });
          }
        });
      } else {

        await createCategory(bodyData).then((res: any) => {
          form.reset();
          if (res.error) {
            toast.error(res.error, { duration: 5000 });
            router.refresh();
          } else {
            router.push('/editor/links');
            toast.promise(promise, {
              loading: 'Updating...',
              success: (data) => {
                return `Category Created Successfully`;
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
    buttonTitle && setText({
      whenLoading: 'Updating',
      whenNotLoading: 'Update Category'
    })
  }
    , [buttonTitle])

  return (
    <div className={cn('w-auto h-full', buttonTitle && 'w-full')}>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)} >
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)} variant={buttonTitle ? 'outline' : 'default'} className={cn(buttonTitle && 'rounded-lg bg-muted/30 border border-muted-foreground w-full flex gap-2')} >
            {
              buttonTitle ? (
                <>
                  <Pen className='text-foreground' />
                  <span className='sm:hidden md:flex'>
                    {buttonTitle}
                  </span>
                </>
              ) : (
                <Plus />
              )
            }
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md !bg-background text-foreground w-full">
          <DialogHeader>
            <DialogTitle>{buttonTitle ? 'Update' : 'Create'} Category</DialogTitle>
            <DialogDescription>
              {
                buttonTitle ? (
                  <>
                    Update the category name.
                  </>
                ) : (
                  <>
                    Create a new category for your links.
                  </>
                )
              }
            </DialogDescription>
          </DialogHeader>
          <Form {...form} >
            <form autoComplete='off' onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4 justify-start items-start w-full'>
              <FormField disabled={isLoading} control={form.control} name="name" render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='flex flex-col gap-2 justify-start items-start w-full'>

                    <Label>Category Name</Label>
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

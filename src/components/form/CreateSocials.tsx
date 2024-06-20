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
import { Loader, Plus } from 'lucide-react'
import {  createSocials } from '../../server/actions'
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
type Props = {
}


const FormSchema = z.object({
    url: z.string().min(1, 'URL is required').max(50, 'URL is too long')
})

export default function CreateSocial ({
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Assuming dialog is open by default
  const [text, setText] = useState({
    whenLoading: 'Creating',
    whenNotLoading: 'Create Social'
  }); // Assuming dialog is open by default
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(FormSchema),
        defaultValues: {
            url: ''
        }
      })
      
      const isLoading = form.formState.isSubmitting
      const handleSubmit = async(values: z.infer<typeof FormSchema>) => {
      try {
          const bodyData = {
            url: values.url,
          };

          await createSocials(bodyData).then((res: any) => {
              form.reset();
              if (res.error) {
                toast.error(res.error, { duration: 5000 });
                router.refresh();
              } else {
                setTimeout(() => {
                  toast.success("Social Created Successfully! Don't see it? Try refreshing", { duration: 5000 });
                router.push('/editor/socials');
                }
                , 1000);
              }
            });
        } catch (e) {
          console.log(e);
        } finally {
          setIsDialogOpen(false);
          }
      }

    return (
      <div className='w-full h-full' >

    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)} > 
    <DialogTrigger asChild className='w-full'>
      <Button onClick={() => setIsDialogOpen(true)} variant='default' >
              <>
                <Plus />
                Create Social
            </>
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md !bg-background text-foreground w-full">
    <DialogHeader>
          <DialogTitle>Create Social</DialogTitle>
          <DialogDescription>
                  Create a new Link.
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
        <form autoComplete='off' onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4 justify-start items-start w-full'>
        <FormField disabled={isLoading} control={form.control} name="url" render={({field}) => (
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

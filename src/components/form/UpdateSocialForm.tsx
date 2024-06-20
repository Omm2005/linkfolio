'use client'

import React from 'react'
import { SocialIcon } from 'react-social-icons'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { deleteSocials, updateSocials } from '@/server/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Loader, Trash } from 'lucide-react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'


type Props = {
  url: string,
  id: string
}


const FormSchema = z.object({
  url: z.string().min(1, 'URL is required').max(50, 'URL is too long')
})

const UpdateSocialForm = ({
  url,
  id
}: Props) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: url || ''
    }
  })
  const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 1000));


  const isLoading = form.formState.isSubmitting
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const bodyData = {
        url: values.url,
        id: id
      };

      await updateSocials(bodyData).then((res: any) => {
        if (res.error) {
          toast.error(res.error, { duration: 5000 });
          form.reset();
          router.refresh();
        } else {
          router.push('/editor/socials');
          toast.promise(promise, {
            loading: 'Creating...',
            success: (data) => {
              return `Socials Created Successfully`;
            },
            error: 'Error',
          });

        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSocials(id).then((res: any) => {
        form.reset();
        if (res.error) {
          toast.error(res.error, { duration: 5000 });
          router.refresh();
        } else {
          setIsOpen(false)
          router.push('/editor/socials');
          toast.success("Social Deleted Successfully", { duration: 5000 });
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <PopoverTrigger asChild >
        <div onClick={() => setIsOpen(true)} className='w-fit h-fit relative cursor-pointer' >
          <div className='h-full w-full absolute z-10' />
          <SocialIcon url={url} />
        </div>
      </PopoverTrigger>
      <PopoverContent className='flex gap-3 flex-col' >
        <Form {...form} >
          <form autoComplete='off' onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4 justify-start items-start w-full'>
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
                      type='text'
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
            />
            <Button
              className='w-full'
              type="submit"
              // onClick={() => form.handleSubmit(handleSubmit)()}
              disabled={
                isLoading
              }
            >
              {isLoading && <Loader />}
              {isLoading ? 'Saving' : 'Save'}
            </Button>
          </form>
        </Form>
        <Button variant='destructive' className='flex gap-3' onClick={() => handleDelete()} >
          <Trash className='text-destructive-foreground h-5 w-5' />
          Delete
        </Button>
      </PopoverContent>
    </Popover>

  )
}

export default UpdateSocialForm
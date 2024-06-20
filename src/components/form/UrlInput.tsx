'use client'

import React from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import { claimUrl } from '@/server/actions'
import { ConfettiButton } from '../ui/confetti'

type Props = {
}


const FormSchema = z.object({
  url: z.string().min(1).max(100).regex(/^[a-z0-9_-]+$/, 'Only lowercase letters and numbers are allowed. No spaces or special characters expect hypnhen and underscore.'),
})

const UrlInput = (props: Props) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
    }
  })
  const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 1000));


  const isLoading = form.formState.isSubmitting
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const bodyData = {
        url: values.url,
      };
      await claimUrl(bodyData.url).then((res: any) => {
        form.reset();
        if (res.error) {
          toast.error(res.error, { duration: 5000 });
          router.refresh();
        } else {
          router.push('/editor');
          toast.promise(promise, {
            loading: 'Claiming...',
            success: (data) => {
              return `It's Your Now! 🎉`;
            },
            error: 'Error',
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Form {...form}>
      <form autoComplete='off' onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4 justify-center items-center'>
        <FormField disabled={isLoading} control={form.control} name="url" render={({ field }) => (
          <FormItem>
            <div className='flex gap-2 justify-center items-center'>

              <Label>linkit.vercel.app/</Label>
              <FormControl>
                <Input
                  {...field}
                  className="text-start"
                  placeholder="Om Shah Best Man Ever"
                  onChange={field.onChange}
                  value={field.value}
                  pattern="^[a-z0-9_-]+$"
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
          {isLoading ? 'Claiming...' : 'Claim Url'}
        </ConfettiButton>
      </form>
    </Form>
  )
}

export default UrlInput
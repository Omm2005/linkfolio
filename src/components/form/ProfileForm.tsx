'use client'

import React from 'react'
import FileUpload from '@/components/FileUpload'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateProfileData } from '@/server/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

type Props = {
  data: {
    id: string,
    url: string,
    name: string | null,
    designation: string | null,
    image: string | null,
    description: string | null,
    backgroundImage?: string | null,
  }
}

const FormSchema = z.object({
  url: z.string().min(1).max(100).regex(/^[a-z0-9_-]+$/, 'Only lowercase letters and numbers are allowed. No spaces or special characters expect hypnhen and underscore.'),
  name: z.string().min(1).max(100),
  designation: z.string().min(1).max(50),
  image: z.string().min(1, 'Please upload an image'),
  description: z.string().min(1).max(255),
  backgroundImage: z.string().optional(),
})

export default function ProfileForm({ data }: Props) {
  const router = useRouter()
  const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 1000));

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: data?.image || '',
      url: data.url,
      name: data?.name || '',
      description: data?.description || '',
      designation: data?.designation || '',
      backgroundImage: data?.backgroundImage || '',
    }
  })

  const isLoading = form.formState.isSubmitting
  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const bodyData = {
        id: data.id,
        url: values.url,
        image: values.image,
        name: values.name,
        description: values.description,
        designation: values.designation,
        backgroundImage: values.backgroundImage,
      };
      await updateProfileData(bodyData).then((res: any) => {
        // form.reset();
        if (res.error) {
          toast.error(res.error, { duration: 5000 });
          router.refresh();
        } else {
          const { id } = res;
          toast.promise(promise, {
            loading: 'Loading...',
            success: (data) => {
              return `Profile Saved Successfully`;
            },
            error: 'Error',
          });
          router.refresh();
        }
      });
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong', { duration: 5000 });
    }
  }

  return (
    <div
      className="items-center justify-center w-full h-full bg-background"
    >
      <Form {...form} >
        <form autoComplete='off' onSubmit={form.handleSubmit(handleSubmit)} className='flex justify-center items-center'>
          <div className='flex flex-col md:gap-6 gap-3 rounded-lg md:p-4 p-2 w-full h-full bg-background justify-center items-center md:w-1/2'>

            <div className='flex md:flex-row flex-col justify-center items-center gap-5 w-full h-full' >

              <FormField disabled={isLoading} control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload apiEndpoint="avatar" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className='flex flex-col gap-2 w-full'>
                <FormField disabled={isLoading} control={form.control} name="url" render={({ field }) => (
                  <FormItem>
                    <Label className='text-lg'>
                      URL
                    </Label>
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
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField disabled={isLoading} control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <Label className='text-lg'>
                      Name
                    </Label>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Ek Tanng wala" className='h-12 w-full' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField disabled={isLoading} control={form.control} name="designation" render={({ field }) => (
                  <FormItem>
                    <Label className='text-lg'>
                      Designation
                    </Label>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Former Hockey Player" className='bg-background' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            <FormField disabled={isLoading} control={form.control} name="description" render={({ field }) => (
              <FormItem className='w-full'>
                <Label className='text-lg'>
                  Bio
                </Label>

                <FormControl>
                  <Textarea {...field} placeholder="Meri Ek taang nakli hai, Mai hockey ka bohoth bada khiladi tha.
Ek din Uday bhai ko meri kisi baat pe gussa aagaya aur mere he hockey se meri taang ke do tukde kar diye.
Lekin dil ke bohot ache hai, Fauran mujhe hospital le gaye aur ye nakli taang lagwayi." maxLength={255} minLength={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className='flex justify-center items-center w-full gap-3'>
              <Button
                className="flex rounded-base gap-2 h-12 w-full"
                type="submit"
                // onClick={() => form.handleSubmit(handleSubmit)()}
                disabled={
                  isLoading
                }
                onClick={form.handleSubmit(handleSubmit)}
              >
                {isLoading && <Loader />}
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button
                variant='outline'
                className="flex rounded-base gap-2 h-12 w-full"
                disabled={isLoading || data?.name === '' || data?.designation === '' || data?.description === '' || data?.image === ''}
                type="button"
                onClick={() => router.push('/editor/links')}
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
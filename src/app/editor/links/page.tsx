
import LinksEditor from '@/components/LinksEditor'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCategories, getProfileData } from '@/server/actions'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const page = async(props: Props) => {
  const userDB = await getProfileData()
  if(!userDB || userDB?.url === null) {
    redirect('/')
  }

  const Categories = userDB.Categories

  const formattedCategories = Categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
      order: category.order,
      links: category.links.map((link) => {
        return {
          id: link.id,
          title: link.title,
          url: link.url,
          isPublished: link.isPublished,
          order: link.order,
        }
      }
      )
    }
  }
  )

    return (
    <section className='bg-background text-foreground h-full w-full flex justify-center items-start'>
        {/* <LinkForm data={formattedData} /> */}
        <div className='h-full md:w-1/2 w-full flex flex-col justify-start items-center gap-4 p-3'>
        <div className='w-full h-auto flex flex-col justify-center items-center gap-5 bg-muted/30 border-muted/70 rounded-lg border p-5'>
          <div className='flex gap-5 justify-center items-center text-start'>
          <Image src={userDB.image!} alt={userDB.name!} width={125} height={125} className='rounded-full' />
          <div>
            <h1 className='md:text-2xl text-lg font-bold'>{userDB.name}</h1>
            <p className='md:text-lg text-base text-foreground/80'>{userDB.designation}</p>
          </div>
          </div>
          <Separator />
          <p className='text-muted-foreground' >
            {
              userDB.bio
            }
          </p>
        </div>
        <LinksEditor Categories={formattedCategories} />
        </div>
      </section>
    )
}

export default page
import Preview from '@/components/global/preview'
import { Separator } from '@/components/ui/separator'
import { getProfileData } from '@/server/actions'
import Image from 'next/image'
import React from 'react'
import NotFoundPage from './notfound'
import { SocialIcon } from 'react-social-icons'
import { AnimatedCopyButton } from '@/components/global/animated-copy-button'

type Props = {
    params: {
        url: string
    }
}

const page = async({
    params
}: Props) => {
    const { url } = params
    const userDB = await getProfileData(url)
    if(!userDB) {
        return (
            <NotFoundPage />
        )
    }

    const Categories = userDB?.Categories

    const formattedCategories = Categories?.map((category) => {
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

    const isAllData = formattedCategories?.length === 0 || userDB.bio === null || userDB.Socials.length === 0 || userDB.image === null || userDB.name === null || userDB.designation === null || userDB.url === null
    if(isAllData) {
        return (
            <NotFoundPage isThere />
        )
    }

  return (
    <section className='bg-background text-foreground h-full w-full flex justify-center items-center'>
    {/* <LinkForm data={formattedData} /> */}
    <div className='h-full md:w-1/2 w-full flex flex-col justify-start items-center gap-4 p-3'>
    <div className='w-full h-auto flex flex-col justify-center items-center gap-5 bg-muted/30 border-muted/70 rounded-lg border p-5'>
      <div className='flex gap-5 justify-center items-center text-start'>
      <Image src={userDB.image!} alt={userDB.name!} width={125} height={125} className='rounded-full' />
      <div>
        <h1 className='md:text-2xl text-lg font-bold'>{userDB.name}</h1>
        <p className='md:text-lg text-base text-foreground/80'>{userDB.designation}</p>
      </div>
      <AnimatedCopyButton url={process.env.NEXTAUTH_URL + '/' + url} isShare />
      </div>
      <Separator />
      <p className='text-muted-foreground' >
        {
          userDB.bio
        }
      </p>
      <div className='flex gap-3' >
        {
          userDB.Socials.map((social) => (
            <SocialIcon key={social.id} url={social.url} />
          ))
        }
      </div>
    </div>
    <Preview Categories={formattedCategories!} />
    </div>
    </section>
  )
}

export default page
import Preview from '@/components/global/preview'
import { Separator } from '@/components/ui/separator'
import { getProfileData } from '@/server/actions'
import Image from 'next/image'
import React from 'react'
import NotFoundPage from './notfound'
import { SocialIcon } from 'react-social-icons'
import { AnimatedCopyButton } from '@/components/global/animated-copy-button'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: {
    url: string
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const url = params.url

  // fetch data
  const profile = await getProfileData(url)

  if (!profile || profile.bio === null || profile.Socials.length === 0 || profile.image === null || profile.name === null || profile.designation === null || profile.url === null) {
    return {
      title: "LinkLists | Not Found",
      description: "The user you are looking for does not exist",
      icons: ['https://linklists.vercel.app/link-lists.png'],
      openGraph: {
        title: "LinkLists | Not Found",
        description: "The user you are looking for does not exist",
        images: ['https://linklists.vercel.app/link-lists.png'],
      },
      twitter: {
        card: "summary_large_image",

        title: "LinkLists | Not Found",
        description: "The user you are looking for does not exist",
        images: ['https://linklists.vercel.app/link-lists.png'],
        creator: `@${url}`,
      },
      metadataBase: new URL(`https://linklists.vercel.app/`),

    }
  }

  // optionally access and extend (rather than replace) parent metadata
  const title = "LinkLists | " + profile.name;
  const description = profile.bio;
  const image = profile.image;

  return {
    title,
    description,
    icons: [image],
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: `@${url}`,
    },
    metadataBase: new URL(`https://linklists.vercel.app/${url}`),
  }
}


const page = async ({
  params
}: Props) => {
  const { url } = params
  const userDB = await getProfileData(url)
  if (!userDB) {
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
  if (isAllData) {
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
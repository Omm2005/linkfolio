'use client'

import React from 'react'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import CreateCategoryForm from './form/CategoryForm'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import { deleteCategory, deleteLink, updatePublishLink } from '@/server/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import LinkForm from './form/LinkForm'
import { Switch } from './ui/switch'

type Props = {
  Categories: {
    id: string
    name: string,
    order: number,
    links: {
      id: string,
      title: string,
      url: string,
      isPublished: boolean,
      order: number,
    }[] | null
  }[]
}

function LinksEditor({
  Categories
}: Props) {
  const [activeTab, setActiveTab] = React.useState('All')
  const router = useRouter()
  const isLinkBollean = Categories.map((category) => category.links?.length === 0)
  const isLink = isLinkBollean.includes(true)

  const handleSubmit = async (id: string, e: React.FormEvent) => {
    e.preventDefault()
    try {
      await deleteCategory(id).then((res: any) => {
        if (res.error) {
          toast.error(res.error, { duration: 5000 });;
          router.refresh();
        } else {
          setTimeout(() => {
            router.refresh();
          }
            , 1000);
          toast.success("Category deleted Successfully", { duration: 5000 });
          setActiveTab('All');
        }
      });;
    } catch (e) {
      console.log(e);
    }
  }

  const handleDeleteLink = async (id: string, e: React.FormEvent) => {
    e.preventDefault()
    try {
      await deleteLink(id).then((res: any) => {
        if (res.error) {
          toast.error(res.error, { duration: 5000 });;
          router.refresh();
        } else {
          setTimeout(() => {
            router.refresh();
          }
            , 1000);
          toast.success("Link deleted Successfully", { duration: 5000 });
          setActiveTab('All');
        }
      });;
    } catch (e) {
      console.log(e);
    }
  }

  const handleLinkPublish = async (id: string, isPublished: boolean) => {
    // e.preventDefault()
    try {
      await updatePublishLink(id , isPublished).then((res: any) => {
        if (res.error) {
          toast.error(res.error, { duration: 5000 });;
          router.refresh();
        } else {
          setTimeout(() => {
            router.refresh();
          }
            , 100);
          toast.success("Publish change Successfully", { duration: 5000 });
        }
      });;
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <div className='flex flex-col justify-center items-center w-full md:w-full overflow-y-scroll gap-3 py-5 bg-muted/30 border-muted/70 rounded-lg border px-2' >

      <div className='flex gap-3 justify-center items-center w-full'>

        <ScrollArea className="w-full whitespace-nowrap rounded-full border border-muted-foreground ">
          <div className="flex w-max space-x-4 p-2">
            <div className="flex space-x-1">
              <button
            onClick={() => setActiveTab('All')}
            className={`${activeTab === 'All' ? "" : "hover:text-muted-foreground/30"
              } relative rounded-full px-3 py-1.5 text-sm font-medium outline-sky-400 transition focus-visible:outline-2`}
          >
            {activeTab === 'All' && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 bg-background dark:bg-foreground mix-blend-difference"
                style={{ borderRadius: 9999 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            All
          </button>
              {Categories?.map((tab) => (
                 <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`${activeTab === tab.id ? "" : "hover:text-muted-foreground/60"
                   } relative rounded-full px-3 py-1.5 text-sm font-medium outline-sky-400 transition focus-visible:outline-2`}
               >
                 {activeTab === tab.id && (
                   <motion.span
                     layoutId="bubble"
                     className="absolute inset-0 bg-background dark:bg-foreground mix-blend-difference"
                     style={{ borderRadius: 9999 }}
                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                   />
                 )}
                 {tab.name}
               </button>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />

        </ScrollArea>
        <CreateCategoryForm />
      </div>
      <div className='w-full h-[100% - 48px] overflow-auto' >
      <ScrollArea className="w-auto whitespace-nowrap px-3">

        {
          Categories && (
            Categories.map((category) => (
              <div key={category.name} className={cn('flex flex-col gap-3 w-full', activeTab === 'All' ? 'block' : 'hidden')} >

                {
                  (category.links != null) && (
                    category.links.map((link) => (
                      link && (
                        <div key={link.id} className='bg-muted/30 p-3 rounded-lg w-full my-2'>
                          <h1 className='text-lg font-bold'>{link.title}</h1>
                          <p className='text-muted-foreground truncate'>{link.url}</p>
                        </div>
                      )
                    ))
                  )
                }
              </div>
            ))
          )
        }
        {
          Categories && (
            Categories.map((category) => (
              <div key={category.id} className={cn('flex flex-col gap-3 w-full', category.id === activeTab ? 'block' : 'hidden')} >
                <div className='h-auto w-full flex gap-3 justify-center items-center mb-3 md:flex-row flex-col'>
                  <Button
                    className='rounded-lg w-full flex gap-2'
                    variant='destructive'
                    onClick={(e) => handleSubmit(category.id, e)}
                  >
                    <Trash className='text-destructive-foreground' size={20} />
                    <span className='sm:hidden md:flex'>
                      Delete
                    </span>
                  </Button>
                  <CreateCategoryForm name={category.name} id={category.id} buttonTitle='Edit' />
                  <LinkForm categories={category} />
                </div>
                <div>

                  {
                    category.links && (
                      category.links.map((link) => (
                        <div key={link.id}>
                          <div className='bg-muted/30 p-3 rounded-lg w-full flex justify-between items-center my-2'>
                            <div className='flex flex-col gap-2'>
                              <h1 className='md:text-lg text-base font-bold'>{link.title}</h1>
                              <p className='text-muted-foreground truncate md:text-base text-sm'>{link.url}</p>
                            </div>
                            <div className='flex flex-col gap-2'>
                              <Switch checked={link.isPublished} onCheckedChange={(isPublish) => handleLinkPublish(link.id , isPublish)} />
                            </div>
                          </div>
                          <div className='flex gap-5 w-full'>

                            <LinkForm id={link.id} title={link.title} url={link.url} categories={category} editButton />
                            <Button
                    className='rounded-lg w-full flex gap-2'
                    variant='destructive'
                              onClick={(e) => handleDeleteLink(link.id, e)}
                            >
                              <Trash className='text-destructive-foreground' size={20} />
                              <span className='sm:hidden md:flex'>
                                Delete
                              </span>
                            </Button>
                          </div>
                        </div>
                      ))
                    )
                  }
                </div>
              </div>
            ))
          )
        }
        <ScrollBar />
      </ScrollArea>
      </div>
      <Button
            variant='outline'
              className="flex rounded-base gap-2 h-12 w-full"
              type="button"
              disabled={Categories.length === 0 || isLink}
              onClick={() => router.push('/editor/socials')}
            >
              Start with adding Socials
            </Button>
    </div>
  )
}

export default LinksEditor
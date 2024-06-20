'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LinkPreview } from '@/components/global/link-preview'
import { Check, Copy, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AnimatedCopyButton } from './animated-copy-button'

type Props = {
    Categories: {
        id: string,
        name: string,
        order: number,
        links: {
        id: string,
        title: string,
        url: string,
        isPublished: boolean,
        order: number
        }[]
    }[]
}

const Preview = ({
    Categories
}: Props) => {
    const [activeTab, setActiveTab] = React.useState('All')

  return (
    <div className='flex flex-col justify-center items-center w-full md:w-full overflow-y-scroll gap-3 p-5 bg-muted/30 border-muted/70 rounded-lg border' >

    <div className='flex gap-3 justify-center items-center w-full'>

    <ScrollArea className="w-auto whitespace-nowrap rounded-full border border-muted-foreground ">
      <div className="flex w-max space-x-4 p-2" >
        <div className="flex space-x-1" >
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
    </div>
    <div className='h-full w-full overflow-auto'>
    <ScrollArea className="w-auto whitespace-nowrap pb-5">

    {
      Categories && (
        Categories.map((category) => (
          <div key={category.name} className={cn('flex flex-col gap-3w-full', activeTab === 'All' ? 'block' : 'hidden')} >

            {
              (category.links != null) && (
                category.links.map((link) => (
                  link.isPublished && (
                    <div className='h-full w-full flex justify-center items-center gap-3 my-2' key={link.id} >

                        <LinkPreview url={link.url} className='bg-muted/30 p-3 rounded-lg w-full z-20 flex justify-start items-center' >
                          <Link size={24} className='text-muted-foreground mr-3' />
                        { link.title }
                        </LinkPreview>
                        <AnimatedCopyButton url={link.url} />
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
            <div>

              {
                category.links && (
                  category.links.map((link) => (
                    link.isPublished && (
                      <div className='h-full w-full flex justify-center items-center gap-3 my-2' key={link.id} >
                      <LinkPreview url={link.url} className='bg-muted/30 p-3 rounded-lg w-full z-20 flex justify-start items-center' >
                        <Link size={24} className='text-muted-foreground mr-3' />
                      { link.title }
                      </LinkPreview>
                      <AnimatedCopyButton url={link.url} />
                      </div>
                )
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
  </div>
  )
}

export default Preview
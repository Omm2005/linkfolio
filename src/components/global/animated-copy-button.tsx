"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Clipboard, Share } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface AnimatedSubscribeButtonProps {
    url: string,
    isShare?: boolean
}

export const AnimatedCopyButton: React.FC<
  AnimatedSubscribeButtonProps
> = ({
    url,
    isShare
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const copylink = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard')
    setTimeout(() => {
      setIsCopied(false)
    }
      , 2000)
  }


  return (
    <AnimatePresence mode="wait">
      {isCopied ? (
        <motion.button
          className="relative flex w-fit items-center justify-center overflow-hidden rounded-md bg-white p-[10px] outline outline-1 outline-black"
          onClick={() => setIsCopied(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backgroundColor: "green", color: "white"}}
        >
          <motion.span
            key="action"
            className="relative block h-full w-full font-semibold"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
          >
            <Check />
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          className="relative flex w-fit cursor-pointer items-center justify-center rounded-md border-none p-[10px]"
          onClick={() => copylink()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="reaction"
            className="relative block font-semibold"
            initial={{ x: 0 }}
            exit={{ x: 50, transition: { duration: 0.1 } }}
          >
            {isShare ? <Share /> : <Clipboard />}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

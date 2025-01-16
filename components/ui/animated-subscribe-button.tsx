"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface AnimatedSubscribeButtonProps {
  buttonColor: string;
  buttonTextColor?: string;
  subscribeStatus: boolean;
  initialText: React.ReactElement | string;
  changeText: React.ReactElement | string;
}

export const AnimatedSubscribeButton: React.FC<AnimatedSubscribeButtonProps> = ({
  buttonColor,
  subscribeStatus,
  buttonTextColor,
  changeText,
  initialText,
}) => {
  const variants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  };

  return (
    <div className="relative w-[200px]">
      <AnimatePresence mode="wait">
        {!subscribeStatus ? (
          <motion.button
            key="subscribe"
            type="submit"
            className="absolute inset-0 flex h-10 cursor-pointer items-center justify-center rounded-md"
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {initialText}
          </motion.button>
        ) : (
          <motion.button
            key="subscribed"
            type="button"
            className="absolute inset-0 flex h-10 cursor-default items-center justify-center rounded-md"
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {changeText}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

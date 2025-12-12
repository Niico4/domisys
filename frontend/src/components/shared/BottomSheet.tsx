"use client";

import { useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import { Button } from "@heroui/react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxHeight?: string;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = "90vh",
}: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current =
        (document.activeElement as HTMLElement) || null;

      setTimeout(() => {
        const firstFocusable = sheetRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          sheetRef.current?.focus();
        }
      }, 150);
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl"
            style={{ maxHeight }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "bottom-sheet-title" : undefined}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-default-300 rounded-full" />
            </div>

            {title && (
              <div className="flex items-center justify-between px-4 pb-4 border-b border-default-200">
                <h2
                  id="bottom-sheet-title"
                  className="text-xl font-bold text-default-900"
                >
                  {title}
                </h2>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={onClose}
                  className="min-w-unit-8 w-unit-8 h-unit-8"
                  aria-label="Cerrar"
                >
                  <IconX size={20} stroke={1.5} />
                </Button>
              </div>
            )}

            <div
              className="overflow-y-auto"
              style={{ maxHeight: `calc(${maxHeight} - 80px)` }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

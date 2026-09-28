"use client";

import { motion } from "framer-motion";

/**
 * Page transition. Opacity only: transforms/filters here would break the
 * fixed-position 3D backdrop by creating a new containing block.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/hooks/useMedia";

type CursorMode = "default" | "link" | "button" | "text";

export function CustomCursor() {
  const finePointer = useFinePointer();

  if (!finePointer) return null;

  return <CuteCursor />;
}

function CuteCursor() {
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, {
    stiffness: reduceMotion ? 1000 : 900,
    damping: reduceMotion ? 100 : 46,
    mass: 0.16,
  });

  const y = useSpring(mouseY, {
    stiffness: reduceMotion ? 1000 : 900,
    damping: reduceMotion ? 100 : 46,
    mass: 0.16,
  });

  const previous = useRef({ x: 0, y: 0 });

  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");

  const [lookX, setLookX] = useState(0);
  const [lookY, setLookY] = useState(0);
  const [tilt, setTilt] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      const px = event.clientX;
      const py = event.clientY;

      const dx = px - previous.current.x;
      const dy = py - previous.current.y;

      previous.current = { x: px, y: py };

      mouseX.set(px);
      mouseY.set(py);

      setVisible(true);

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        setLookX(Math.max(-1, Math.min(1, dx / 7)));
        setLookY(Math.max(-1, Math.min(1, dy / 7)));

        if (!reduceMotion) {
          setTilt(Math.max(-6, Math.min(6, dx * 0.25)));
        }
      }

      const target = event.target as Element | null;

      if (!target) {
        setMode("default");
        return;
      }

      if (
        target.closest(
          "button, [role='button'], summary, [data-cursor='button']",
        )
      ) {
        setMode("button");
        return;
      }

      if (
        target.closest(
          "a, [data-cursor='link'], [data-cursor='view']",
        )
      ) {
        setMode("link");
        return;
      }

      if (
        target.closest(
          "p, h1, h2, h3, h4, h5, h6, li, blockquote",
        )
      ) {
        setMode("text");
        return;
      }

      setMode("default");
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, {
      passive: true,
    });

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.classList.remove(
        "has-custom-cursor",
      );

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);

      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [mouseX, mouseY, reduceMotion]);

  /*
   * =====================================================
   * TEXT MODE
   * =====================================================
   */

  if (mode === "text") {
    return (
      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[9999]
        "
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scaleY: pressed ? 0.75 : 1,
        }}
      >
        <div className="relative h-[25px] w-[10px]">
          <span
            className="
              absolute
              left-1/2
              top-0
              h-full
              w-[2px]
              -translate-x-1/2
              rounded-full
              bg-accent
            "
          />

          <span
            className="
              absolute
              left-0
              top-0
              h-[2px]
              w-full
              rounded-full
              bg-accent
            "
          />

          <span
            className="
              absolute
              bottom-0
              left-0
              h-[2px]
              w-full
              rounded-full
              bg-accent
            "
          />
        </div>
      </motion.div>
    );
  }

  /*
   * =====================================================
   * CHARACTER
   * =====================================================
   */

  return (
    <motion.div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        z-[9999]
      "
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        opacity: visible ? 1 : 0,

        rotate:
          reduceMotion
            ? 0
            : tilt,

        scaleX:
          pressed
            ? 1.12
            : mode === "button"
              ? 1.05
              : 1,

        scaleY:
          pressed
            ? 0.72
            : mode === "link"
              ? 1.05
              : 1,
      }}
      transition={{
        rotate: {
          type: "spring",
          stiffness: 550,
          damping: 30,
        },

        scaleX: {
          type: "spring",
          stiffness: 700,
          damping: 28,
        },

        scaleY: {
          type: "spring",
          stiffness: 700,
          damping: 28,
        },

        opacity: {
          duration: 0.12,
        },
      }}
    >
      <div className="relative h-[38px] w-[42px]">

        {/* ===============================================
            LEFT EAR
           =============================================== */}

        <motion.div
          className="
            absolute
            left-[5px]
            top-[1px]
            h-[10px]
            w-[10px]
            rotate-[-18deg]
            rounded-[3px_8px_3px_8px]
            border-[2px]
            border-accent
            bg-black
          "
          animate={{
            rotate:
              mode === "button"
                ? -28
                : mode === "link"
                  ? -10
                  : -18,

            y:
              mode === "button"
                ? -2
                : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
          }}
        />

        {/* ===============================================
            RIGHT EAR
           =============================================== */}

        <motion.div
          className="
            absolute
            right-[5px]
            top-[1px]
            h-[10px]
            w-[10px]
            rotate-[18deg]
            rounded-[8px_3px_8px_3px]
            border-[2px]
            border-accent
            bg-black
          "
          animate={{
            rotate:
              mode === "button"
                ? 28
                : mode === "link"
                  ? 10
                  : 18,

            y:
              mode === "button"
                ? -2
                : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
          }}
        />

        {/* ===============================================
            BODY
           =============================================== */}

        <motion.div
          className="
            absolute
            left-[2px]
            top-[7px]
            h-[28px]
            w-[38px]
            overflow-hidden
            border-[2px]
            border-accent
            bg-black/95
          "
          style={{
            borderRadius: "48% 52% 45% 55% / 52% 48% 58% 42%",
          }}
          animate={{
            borderRadius:
              mode === "button"
                ? "45% 55% 50% 50% / 48% 52% 52% 48%"
                : mode === "link"
                  ? "52% 48% 42% 58% / 48% 52% 55% 45%"
                  : "48% 52% 45% 55% / 52% 48% 58% 42%",
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 30,
          }}
        >
          {/* =============================================
              LEFT EYE
             ============================================= */}

          <motion.div
            className="
              absolute
              left-[8px]
              top-[8px]
              h-[7px]
              w-[6px]
              overflow-hidden
              rounded-full
              bg-white
            "
            animate={{
              scaleY: pressed ? 0.15 : 1,

              height:
                mode === "button"
                  ? 6
                  : 7,
            }}
            transition={{
              duration: 0.1,
            }}
          >
            <motion.span
              className="
                absolute
                left-1/2
                top-1/2
                h-[3px]
                w-[3px]
                rounded-full
                bg-black
              "
              style={{
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                x:
                  mode === "link"
                    ? 1
                    : lookX * 1.5,

                y:
                  mode === "link"
                    ? -0.5
                    : lookY * 1.2,
              }}
            />
          </motion.div>

          {/* =============================================
              RIGHT EYE
             ============================================= */}

          <motion.div
            className="
              absolute
              right-[8px]
              top-[8px]
              h-[7px]
              w-[6px]
              overflow-hidden
              rounded-full
              bg-white
            "
            animate={{
              scaleY: pressed ? 0.15 : 1,

              height:
                mode === "button"
                  ? 6
                  : 7,
            }}
            transition={{
              duration: 0.1,
            }}
          >
            <motion.span
              className="
                absolute
                left-1/2
                top-1/2
                h-[3px]
                w-[3px]
                rounded-full
                bg-black
              "
              style={{
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                x:
                  mode === "link"
                    ? 1
                    : lookX * 1.5,

                y:
                  mode === "link"
                    ? -0.5
                    : lookY * 1.2,
              }}
            />
          </motion.div>

          {/* =============================================
              BLUSH
             ============================================= */}

          <motion.span
            className="
              absolute
              left-[4px]
              top-[17px]
              h-[2px]
              w-[5px]
              rounded-full
              bg-accent/50
            "
            animate={{
              opacity:
                mode === "button"
                  ? 1
                  : 0.55,
            }}
          />

          <motion.span
            className="
              absolute
              right-[4px]
              top-[17px]
              h-[2px]
              w-[5px]
              rounded-full
              bg-accent/50
            "
            animate={{
              opacity:
                mode === "button"
                  ? 1
                  : 0.55,
            }}
          />

          {/* =============================================
              MOUTH
             ============================================= */}

          <div
            className="
              absolute
              bottom-[5px]
              left-1/2
              h-[5px]
              w-[8px]
              -translate-x-1/2
            "
          >
            <motion.span
              className="
                absolute
                left-0
                top-0
                h-[4px]
                w-[4px]
                rotate-[35deg]
                rounded-bl-full
                border-b-[1.5px]
                border-accent
              "
              animate={{
                rotate:
                  mode === "button"
                    ? 45
                    : 35,
              }}
            />

            <motion.span
              className="
                absolute
                right-0
                top-0
                h-[4px]
                w-[4px]
                -rotate-[35deg]
                rounded-br-full
                border-b-[1.5px]
                border-accent
              "
              animate={{
                rotate:
                  mode === "button"
                    ? -45
                    : -35,
              }}
            />
          </div>
        </motion.div>

        {/* ===============================================
            LITTLE FEET
           =============================================== */}

        <motion.span
          className="
            absolute
            bottom-0
            left-[11px]
            h-[4px]
            w-[7px]
            rounded-b-full
            bg-accent
          "
          animate={{
            y:
              mode === "link"
                ? -1
                : 0,
          }}
        />

        <motion.span
          className="
            absolute
            bottom-0
            right-[11px]
            h-[4px]
            w-[7px]
            rounded-b-full
            bg-accent
          "
          animate={{
            y:
              mode === "link"
                ? 1
                : 0,
          }}
        />

        {/* ===============================================
            LINK ARROW
           =============================================== */}

        <motion.div
          className="
            absolute
            right-[-8px]
            top-[7px]
            text-[12px]
            font-bold
            leading-none
            text-accent
          "
          initial={false}
          animate={{
            opacity:
              mode === "link"
                ? 1
                : 0,

            x:
              mode === "link"
                ? 0
                : -4,

            y:
              mode === "link"
                ? -1
                : 2,

            scale:
              mode === "link"
                ? 1
                : 0.5,
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 28,
          }}
        >
          ↗
        </motion.div>

        {/* ===============================================
            EXCITEMENT MARKS — BUTTON
           =============================================== */}

        <motion.span
          className="
            absolute
            left-[-4px]
            top-[5px]
            h-[6px]
            w-[2px]
            -rotate-[40deg]
            rounded-full
            bg-accent
          "
          animate={{
            opacity:
              mode === "button"
                ? 1
                : 0,

            scale:
              mode === "button"
                ? 1
                : 0,
          }}
        />

        <motion.span
          className="
            absolute
            right-[-4px]
            top-[5px]
            h-[6px]
            w-[2px]
            rotate-[40deg]
            rounded-full
            bg-accent
          "
          animate={{
            opacity:
              mode === "button"
                ? 1
                : 0,

            scale:
              mode === "button"
                ? 1
                : 0,
          }}
        />
      </div>
    </motion.div>
  );
}
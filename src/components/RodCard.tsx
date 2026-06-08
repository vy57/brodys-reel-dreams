import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { FishingRod3D } from "./FishingRod3D";
import { Magnetic } from "./motion-primitives";

interface RodCardProps {
  index: string;
  name: string;
  spec: string;
  price: string;
  accent: string;
  notes: string[];
}

export function RodCard({ index, name, spec, price, accent, notes }: RodCardProps) {
  const smsHref = `sms:+17285007700?&body=Hi Brody, I'd like to order the ${name}.`;
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 18 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="group relative overflow-hidden border border-border bg-card grain transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_oklch(0.72_0.14_55/0.35)] hover:border-copper/60"
    >
      {/* Copper sweep highlight on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: "linear-gradient(115deg, transparent 30%, oklch(0.72 0.14 55 / 0.08) 50%, transparent 70%)",
        }}
      />
      <div className="grid md:grid-cols-[1fr_1.2fr] relative">
        <div className="relative h-[420px] border-b md:border-b-0 md:border-r border-border bg-[oklch(0.16_0.015_80)] overflow-hidden">
          <div className="absolute top-4 left-4 z-10 font-serif text-xs tracking-widest text-muted-foreground">
            № {index}
          </div>
          <motion.div
            className="absolute top-4 right-4 z-10 text-[10px] uppercase tracking-[0.3em] text-copper"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            ● Live
          </motion.div>
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]">
            <FishingRod3D accent={accent} />
          </div>
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-between gap-8">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl text-bone leading-[0.95]"
            >
              {name}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="mt-3 text-sm uppercase tracking-[0.25em] text-copper"
            >
              {spec}
            </motion.p>
            <ul className="mt-8 space-y-3">
              {notes.map((n, i) => (
                <motion.li
                  key={n}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="flex gap-3 text-sm text-muted-foreground"
                >
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                    style={{ transformOrigin: "left" }}
                    className="mt-2 h-[1px] w-6 bg-copper shrink-0"
                  />
                  <span>{n}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="flex items-end justify-between border-t border-border pt-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Starting at
              </div>
              <div className="font-serif text-3xl text-bone">{price}</div>
            </div>
            <Magnetic strength={0.25}>
              <a
                href={smsHref}
                className="group/btn relative inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-widest font-medium overflow-hidden"
              >
                <span className="relative z-10">Order — Text</span>
                <span aria-hidden className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                <span className="absolute inset-0 bg-[oklch(0.78_0.14_55)] origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 ease-out" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

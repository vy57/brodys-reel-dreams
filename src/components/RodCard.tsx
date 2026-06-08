import { motion } from "framer-motion";
import { FishingRod3D } from "./FishingRod3D";

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
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden border border-border bg-card grain"
    >
      <div className="grid md:grid-cols-[1fr_1.2fr]">
        <div className="relative h-[420px] border-b md:border-b-0 md:border-r border-border bg-[oklch(0.16_0.015_80)]">
          <div className="absolute top-4 left-4 z-10 font-serif text-xs tracking-widest text-muted-foreground">
            № {index}
          </div>
          <FishingRod3D accent={accent} />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-between gap-8">
          <div>
            <h3 className="font-serif text-4xl md:text-5xl text-bone leading-[0.95]">
              {name}
            </h3>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-copper">
              {spec}
            </p>
            <ul className="mt-8 space-y-3">
              {notes.map((n) => (
                <li key={n} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 h-[1px] w-6 bg-copper shrink-0" />
                  <span>{n}</span>
                </li>
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
            <a
              href={smsHref}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-[oklch(0.78_0.14_55)] transition-colors"
            >
              Order — Text
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

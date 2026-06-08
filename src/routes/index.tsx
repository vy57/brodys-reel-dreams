import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FishingRod3D } from "@/components/FishingRod3D";
import { RodCard } from "@/components/RodCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brody's Custom Rods — Hand-Built Fishing Rods" },
      {
        name: "description",
        content:
          "Brody's Custom Rods builds tailored, hand-wrapped fishing rods for serious anglers. Custom blanks, custom wraps, shipping included. Starting at $175.",
      },
      { property: "og:title", content: "Brody's Custom Rods" },
      {
        property: "og:description",
        content: "Hand-built custom fishing rods. Starting at $175. Shipping provided.",
      },
    ],
  }),
  component: Index,
});

const RODS = [
  {
    index: "01",
    name: "The River Forge",
    spec: "Inshore / 7'0\" Medium-Fast",
    price: "$175",
    accent: "#c97f3d",
    notes: [
      "Hand-wrapped copper trim with epoxy finish",
      "Cork grip turned to your hand",
      "Built for redfish, trout, and snook",
    ],
  },
  {
    index: "02",
    name: "The Quiet Bend",
    spec: "Freshwater / 6'8\" Medium-Light",
    price: "$195",
    accent: "#9a7b3f",
    notes: [
      "Slow-loading blank, sensitive tip",
      "Custom thread wraps in your colors",
      "Bass, walleye, smallmouth specialist",
    ],
  },
  {
    index: "03",
    name: "The Long Iron",
    spec: "Surf & Offshore / 9'0\" Heavy",
    price: "$245",
    accent: "#7fa66b",
    notes: [
      "Reinforced butt section for big fights",
      "Saltwater-rated guides and seat",
      "Built to your reel and lure weight",
    ],
  },
];

function Index() {
  const smsHref = "sms:+17285007700?&body=Hi Brody, I'd like to talk about a custom rod.";

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="font-serif text-lg tracking-tight">
            Brody's <span className="text-copper">/</span> Custom Rods
          </a>
          <nav className="hidden md:flex gap-10 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <a href="#rods" className="hover:text-bone transition-colors">The Rods</a>
            <a href="#process" className="hover:text-bone transition-colors">Process</a>
            <a href="#contact" className="hover:text-bone transition-colors">Contact</a>
          </nav>
          <a
            href={smsHref}
            className="text-xs uppercase tracking-widest border border-copper text-copper px-4 py-2 hover:bg-copper hover:text-primary-foreground transition-colors"
          >
            Text 728·500·7700
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen pt-16 grain">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-28 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-xs uppercase tracking-[0.4em] text-copper mb-6"
            >
              Est. on the water · Hand-built
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="font-serif text-[clamp(3rem,9vw,7.5rem)] leading-[0.88] text-bone"
            >
              Rods
              <br />
              <span className="text-stroke italic">built</span> for
              <br />
              the <span className="text-copper italic">fight.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 max-w-md text-muted-foreground text-lg leading-relaxed"
            >
              One angler. One bench. Every rod wrapped, sealed, and tuned by
              hand — to the water you fish and the way you fish it.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#rods"
                className="bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-[oklch(0.78_0.14_55)] transition-colors"
              >
                See the Build
              </a>
              <a
                href={smsHref}
                className="border border-border text-bone px-8 py-4 text-sm uppercase tracking-widest hover:border-copper transition-colors"
              >
                Order Yours →
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-14 flex gap-10 text-xs uppercase tracking-widest text-muted-foreground"
            >
              <div>
                <div className="text-bone font-serif text-2xl normal-case tracking-normal">$175+</div>
                <div className="mt-1">Starting price</div>
              </div>
              <div>
                <div className="text-bone font-serif text-2xl normal-case tracking-normal">3–4 wks</div>
                <div className="mt-1">Build time</div>
              </div>
              <div>
                <div className="text-bone font-serif text-2xl normal-case tracking-normal">Free</div>
                <div className="mt-1">Shipping</div>
              </div>
            </motion.div>
          </div>

          <div className="relative h-[60vh] md:h-[85vh]">
            <FishingRod3D accent="#c97f3d" />
            <div className="absolute bottom-6 right-6 text-xs uppercase tracking-widest text-muted-foreground">
              Drag · Float · Cast
            </div>
          </div>
        </div>

        {/* Scrolling marquee */}
        <div className="border-y border-border mt-12 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 py-5 whitespace-nowrap font-serif text-2xl text-muted-foreground"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                Inshore Saltwater
                <span className="text-copper">✦</span>
                Bass & Walleye
                <span className="text-copper">✦</span>
                Surf Casting
                <span className="text-copper">✦</span>
                Custom Wraps
                <span className="text-copper">✦</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* RODS */}
      <section id="rods" className="relative py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-copper mb-4">
                The Collection
              </div>
              <h2 className="font-serif text-5xl md:text-7xl text-bone max-w-2xl leading-[0.95]">
                Three blanks. <em className="text-copper">Infinite</em> builds.
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Pick a starting point. We tune length, action, wrap color, and
              hardware to you over a quick text conversation.
            </p>
          </div>

          <div className="space-y-10">
            {RODS.map((rod) => (
              <RodCard key={rod.index} {...rod} />
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="relative py-28 md:py-36 border-t border-border bg-[oklch(0.16_0.015_80)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-xs uppercase tracking-[0.4em] text-copper mb-4">
            How a rod gets made
          </div>
          <h2 className="font-serif text-5xl md:text-7xl text-bone max-w-3xl leading-[0.95] mb-20">
            From blank to <em className="text-copper">first cast.</em>
          </h2>

          <div className="grid md:grid-cols-4 gap-10">
            {[
              { n: "01", t: "Conversation", b: "We text. You tell me what you fish, where, and how. I sketch the build." },
              { n: "02", t: "Blank & Hardware", b: "Pick your colors, your reel seat, your grip. Every choice is yours." },
              { n: "03", t: "Wrap & Finish", b: "Thread is laid by hand, sealed in epoxy, cured slow. No shortcuts." },
              { n: "04", t: "Shipped", b: "Tested, boxed, and on its way. Shipping is on me, every time." },
            ].map((s) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-t border-copper pt-6"
              >
                <div className="font-serif text-copper text-3xl mb-4">{s.n}</div>
                <h3 className="font-serif text-2xl text-bone mb-3">{s.t}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-28 md:py-40 grain">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-copper mb-6">
            Start a build
          </div>
          <h2 className="font-serif text-[clamp(3rem,9vw,7rem)] leading-[0.9] text-bone">
            Text me.
            <br />
            <span className="text-stroke italic">Tell me</span> your water.
          </h2>
          <p className="mt-8 max-w-xl mx-auto text-muted-foreground text-lg">
            Easiest way to get a rod started is a text. No forms, no callbacks —
            just a real conversation about what you need.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={smsHref}
              className="bg-primary text-primary-foreground px-10 py-5 text-base uppercase tracking-widest font-medium hover:bg-[oklch(0.78_0.14_55)] transition-colors"
            >
              Text 728 · 500 · 7700
            </a>
            <a
              href="https://www.tiktok.com/@brodys_custom_rods1"
              target="_blank"
              rel="noreferrer"
              className="border border-border text-bone px-10 py-5 text-base uppercase tracking-widest hover:border-copper transition-colors"
            >
              @brodys_custom_rods1
            </a>
          </div>

          <div className="mt-20 grid sm:grid-cols-3 gap-8 text-left max-w-3xl mx-auto">
            <div className="border-t border-border pt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Text only</div>
              <div className="mt-2 font-serif text-xl text-bone">(728) 500-7700</div>
            </div>
            <div className="border-t border-border pt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">TikTok</div>
              <div className="mt-2 font-serif text-xl text-bone">@brodys_custom_rods1</div>
            </div>
            <div className="border-t border-border pt-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Shipping</div>
              <div className="mt-2 font-serif text-xl text-bone">Always included</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap justify-between gap-4 text-xs uppercase tracking-widest text-muted-foreground">
          <div>© {new Date().getFullYear()} Brody's Custom Rods</div>
          <div>Built by hand · Shipped with care</div>
        </div>
      </footer>
    </div>
  );
}

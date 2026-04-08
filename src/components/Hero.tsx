import { cn } from "@/src/lib/utils";

export function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 py-[90px] min-h-[80vh]">
      <h1 
        className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-foreground animate-fade-rise"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Where <em className="not-italic text-muted-foreground">dreams</em> rise <br className="hidden md:block" />
        <em className="not-italic text-muted-foreground">through the silence.</em>
      </h1>
      
      <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
        We're crafting experiences for deep thinkers, bold creators, and quiet rebels. 
        Amid the chaos, we build culinary spaces for sharp focus and inspired dining.
      </p>

      <button className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 transition-transform hover:scale-[1.03] cursor-pointer animate-fade-rise-delay-2">
        Begin Journey
      </button>
    </section>
  );
}

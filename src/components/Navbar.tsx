import { cn } from "@/src/lib/utils";

export function Navbar() {
  const navLinks = [
    { name: "Home", active: true },
    { name: "Studio", active: false },
    { name: "About", active: false },
    { name: "Journal", active: false },
    { name: "Reach Us", active: false },
  ];

  return (
    <nav className="relative z-10 flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center">
        <span 
          className="text-3xl tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Velorah<sup className="text-xs">®</sup>
        </span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href="#"
            className={cn(
              "text-sm transition-colors hover:text-foreground",
              link.active ? "text-foreground font-medium" : "text-muted-foreground"
            )}
          >
            {link.name}
          </a>
        ))}
      </div>

      <button className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03] cursor-pointer">
        Begin Journey
      </button>
    </nav>
  );
}

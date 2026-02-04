import { CheckCircle, ChevronDown } from 'lucide-react';
const Navbar = () => {
  return <nav className="bg-card border-b border-border px-4 md:px-5 h-16 flex items-center sticky top-0 z-50">
      <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="text-primary text-2xl flex items-center">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Attendance<span className="text-primary">Pro 2.0</span>
            </h1>
          </div>
          <span className="hidden sm:inline-block text-[0.6rem] bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold tracking-wide">
            ​Made By Maddy                 
          </span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border">
          <div className="w-7 h-7 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
            M
          </div>
          <span className="hidden sm:block text-sm font-medium text-foreground">Maddy</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </nav>;
};
export default Navbar;
import { Heart, LogOut, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/App";

export function AppHeader({
  authenticated,
  user,
  onLogout,
}: {
  authenticated: boolean;
  user?: User | null;
  onLogout?: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/80 backdrop-blur-md dark:border-rose-900/40 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/30">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold tracking-tight text-rose-950 dark:text-rose-50">
              Qavé
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-rose-400">
              Dating
            </span>
          </div>
        </div>

        {authenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 sm:flex">
              <MapPin className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user.location.city}
              </span>
            </div>
            {user.verified && (
              <Badge
                variant="secondary"
                className="gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              >
                <ShieldCheck className="h-3 w-3" />
                מאומת
              </Badge>
            )}
            <Avatar className="h-9 w-9 border-2 border-rose-200 dark:border-rose-800">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-rose-100 text-rose-700">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm font-medium text-rose-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
            חינם ללא תשלום
          </div>
        )}
      </div>
    </header>
  );
}
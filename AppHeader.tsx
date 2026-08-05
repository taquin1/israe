import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, MapPin } from "lucide-react";
import type { User } from "@/lib/store";

export function AppHeader({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <header className="mb-6 mt-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 shadow-md shadow-rose-200">
          <span className="font-serif text-lg font-bold text-white">S</span>
        </div>
        <div>
          <h1 className="font-serif text-xl font-bold text-slate-800">Spark</h1>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3" />
            {user.city}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative rounded-xl bg-white p-2.5 shadow-sm transition hover:bg-rose-50">
          <Bell className="h-5 w-5 text-rose-500" />
          <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-rose-500" />
        </button>
        <Avatar className="h-10 w-10 border-2 border-rose-200">
          <AvatarImage src={user.photo} alt={user.name} />
          <AvatarFallback className="bg-rose-100 text-rose-600">
            {user.name[0]}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={onLogout}
          className="rounded-xl bg-white p-2.5 shadow-sm transition hover:bg-slate-50"
        >
          <LogOut className="h-5 w-5 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
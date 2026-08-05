import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "framer-motion";
import { AuthScreen } from "@/components/AuthScreen";
import { DiscoverScreen } from "@/components/DiscoverScreen";
import { MatchesScreen } from "@/components/MatchesScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { AppHeader } from "@/components/AppHeader";
import { useStore } from "@/lib/store";
import { Heart, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "discover" | "matches" | "profile";

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("discover");
  const { currentUser, matches } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50/40 to-orange-50 text-slate-800">
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-5xl px-4 pb-28 sm:px-6">
        <AnimatePresence mode="wait">
          {!authed ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AuthScreen onAuthed={() => setAuthed(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AppHeader user={currentUser} onLogout={() => setAuthed(false)} />
              <AnimatePresence mode="wait">
                {tab === "discover" && (
                  <motion.div key="d" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <DiscoverScreen />
                  </motion.div>
                )}
                {tab === "matches" && (
                  <motion.div key="m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <MatchesScreen />
                  </motion.div>
                )}
                {tab === "profile" && (
                  <motion.div key="p" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <ProfileScreen />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {authed && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-rose-200/60 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-md items-center justify-around px-6 py-3">
            <NavBtn icon={Compass} label="גלה" active={tab === "discover"} onClick={() => setTab("discover")} />
            <NavBtn icon={Heart} label="התאמות" active={tab === "matches"} onClick={() => setTab("matches")} badge={matches.length} />
            <NavBtn icon={User} label="פרופיל" active={tab === "profile"} onClick={() => setTab("profile")} />
          </div>
        </div>
      )}
    </div>
  );
}

function NavBtn({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center gap-1">
      <div className="relative">
        <Icon className={cn("h-6 w-6 transition-colors", active ? "text-rose-600" : "text-slate-400")} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </div>
      <span className={cn("text-xs font-medium transition-colors", active ? "text-rose-600" : "text-slate-400")}>
        {label}
      </span>
    </button>
  );
}
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { AuthScreen } from "@/components/AuthScreen";
import { Dashboard } from "@/components/Dashboard";
import { AppHeader } from "@/components/AppHeader";

export type User = {
  name: string;
  email: string;
  avatar: string;
  age: number;
  bio: string;
  interests: string[];
  location: { city: string; lat: number; lng: number };
  verified: boolean;
  online: boolean;
  distanceKm: number;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authMethod, setAuthMethod] = useState<"google" | "facebook" | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50/40 dark:from-rose-950/30 dark:via-slate-950 dark:to-slate-950">
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <AppHeader authenticated={false} />
            <AuthScreen
              authMethod={authMethod}
              setAuthMethod={setAuthMethod}
              onAuthenticated={(u) => setUser(u)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <AppHeader authenticated user={user} onLogout={() => setUser(null)} />
            <Dashboard user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
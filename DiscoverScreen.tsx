import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useStore, store } from "@/lib/store";
import { Heart, X, MapPin, ShieldCheck, Sparkles } from "lucide-react";

export function DiscoverScreen() {
  const { profiles, likedIds, passedIds } = useStore();
  const [direction, setDirection] = useState<"" | "left" | "right">("");

  const queue = useMemo(
    () => profiles.filter((p) => !likedIds.includes(p.id) && !passedIds.includes(p.id)),
    [profiles, likedIds, passedIds]
  );

  const current = queue[0];

  const handleAction = (liked: boolean) => {
    if (!current) return;
    setDirection(liked ? "right" : "left");
    setTimeout(() => {
      if (liked) {
        store.like(current.id);
        toast.success("יש התאמה עם " + current.name + "!", {
          description: "כנס/י ללשונית ההתאמות לשיחה",
        });
      } else {
        store.pass(current.id);
      }
      setDirection("");
    }, 300);
  };

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
          <Sparkles className="h-10 w-10 text-rose-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-700">זה הכל לעכשיו!</h2>
        <p className="mt-2 text-slate-500">חזור מאוחר יותר לפרופילים חדשים באזורך</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: direction === "right" ? 300 : direction === "left" ? -300 : 0,
              rotate: direction === "right" ? 15 : direction === "left" ? -15 : 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) handleAction(true);
              else if (info.offset.x < -100) handleAction(false);
            }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl shadow-rose-200/60">
              <div className="relative h-96 overflow-hidden">
                <img
                  src={current.photo}
                  alt={current.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {current.verified && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    מאומת
                  </div>
                )}

                <motion.div
                  className="absolute left-4 top-4 rounded-lg border-4 border-emerald-400 px-3 py-1 text-xl font-bold text-emerald-400"
                  animate={{ opacity: direction === "right" ? 1 : 0 }}
                >
                  LIKE
                </motion.div>
                <motion.div
                  className="absolute right-4 top-4 rounded-lg border-4 border-rose-500 px-3 py-1 text-xl font-bold text-rose-500"
                  animate={{ opacity: direction === "left" ? 1 : 0 }}
                >
                  NOPE
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">
                        {current.name}, {current.age}
                      </h2>
                      <div className="mt-1 flex items-center gap-1 text-sm text-white/90">
                        <MapPin className="h-3.5 w-3.5" />
                        {current.city} · {current.distanceKm} ק"מ ממך
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5">
                <p className="text-sm leading-relaxed text-slate-600">{current.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {current.interests.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full bg-rose-50 text-rose-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <Button
          size="icon"
          onClick={() => handleAction(false)}
          className="h-16 w-16 rounded-full border-2 border-rose-200 bg-white shadow-lg shadow-rose-100 transition hover:scale-110 hover:bg-rose-50"
        >
          <X className="h-7 w-7 text-rose-500" />
        </Button>
        <Button
          size="icon"
          onClick={() => handleAction(true)}
          className="h-16 w-16 rounded-full border-2 border-emerald-200 bg-white shadow-lg shadow-emerald-100 transition hover:scale-110 hover:bg-emerald-50"
        >
          <Heart className="h-7 w-7 fill-emerald-500 text-emerald-500" />
        </Button>
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        החלק ימינה להתאמה · שמאלה לדילוג
      </p>
    </div>
  );
}
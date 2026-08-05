import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore, store, type Match } from "@/lib/store";
import { Video, Send, MessageCircle, ArrowRight, MapPin, Star } from "lucide-react";

export function MatchesScreen() {
  const { matches } = useStore();
  const [activeMatch, setActiveMatch] = useState<number | null>(null);

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
          <MessageCircle className="h-10 w-10 text-rose-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-700">אין התאמות עדיין</h2>
        <p className="mt-2 text-slate-500">התחל לגלות פרופילים כדי למצוא התאמות</p>
      </div>
    );
  }

  if (activeMatch !== null && matches[activeMatch]) {
    return <ChatView match={matches[activeMatch]} index={activeMatch} onBack={() => setActiveMatch(null)} />;
  }

  return (
    <div className="mx-auto max-w-md space-y-3">
      <h2 className="mb-4 font-serif text-2xl font-bold text-slate-800">ההתאמות שלך</h2>
      <AnimatePresence>
        {matches.map((m, i) => (
          <motion.div
            key={m.user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setActiveMatch(i)}
              className="flex w-full items-center gap-3 rounded-2xl border border-rose-100 bg-white p-4 text-right shadow-sm transition hover:bg-rose-50/50 hover:shadow-md"
            >
              <Avatar className="h-14 w-14 border-2 border-rose-100">
                <AvatarImage src={m.user.photo} alt={m.user.name} />
                <AvatarFallback className="bg-rose-100 text-rose-600">{m.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{m.user.name}</h3>
                  <span className="text-sm text-slate-400">{m.user.age}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {m.user.distanceKm} ק"מ · {m.user.city}
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">
                  {m.messages.length > 0
                    ? m.messages[m.messages.length - 1].text
                    : "התחל שיחה עכשיו!"}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ChatView({ match, index, onBack }: { match: Match; index: number; onBack: () => void }) {
  const [text, setText] = useState("");
  const [inCall, setInCall] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    store.sendMessage(index, text.trim());
    setText("");
  };

  if (inCall) {
    return <VideoCallView match={match} onEnd={() => setInCall(false)} />;
  }

  return (
    <div className="mx-auto flex h-[70vh] max-w-md flex-col">
      <div className="mb-3 flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
          <ArrowRight className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 border-2 border-rose-100">
          <AvatarImage src={match.user.photo} alt={match.user.name} />
          <AvatarFallback className="bg-rose-100 text-rose-600">{match.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{match.user.name}</h3>
          <span className="flex items-center gap-1 text-xs text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> מחובר/ת
          </span>
        </div>
        <Button
          size="icon"
          onClick={() => setInCall(true)}
          className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md hover:from-emerald-600 hover:to-teal-600"
        >
          <Video className="h-5 w-5 text-white" />
        </Button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-rose-100 bg-white/60 p-4">
        <div className="rounded-xl bg-rose-50 p-3 text-center text-sm text-rose-600">
          <Star className="mx-auto mb-1 h-4 w-4 fill-rose-400 text-rose-400" />
          יש לכם התאמה! שלחו הודעה ראשונה
        </div>
        <AnimatePresence>
          {match.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.fromMe ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  msg.fromMe
                    ? "rounded-bl-sm bg-gradient-to-br from-rose-500 to-orange-400 text-white"
                    : "rounded-br-sm bg-white text-slate-700 shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="הקלד/י הודעה..."
          className="border-rose-200 focus-visible:ring-rose-400"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function VideoCallView({ match, onEnd }: { match: Match; onEnd: () => void }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto flex h-[70vh] max-w-md flex-col items-center justify-center rounded-3xl bg-slate-900 p-6 text-white">
      <div className="relative mb-6">
        <Avatar className="h-32 w-32 border-4 border-white/20">
          <AvatarImage src={match.user.photo} alt={match.user.name} />
          <AvatarFallback className="bg-rose-500 text-3xl">{match.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium">
          חי
        </div>
      </div>
      <h3 className="font-serif text-2xl font-bold">{match.user.name}</h3>
      <p className="mt-1 text-sm text-white/60">
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
      </p>

      <div className="absolute bottom-24 right-8 h-28 w-20 overflow-hidden rounded-xl border-2 border-white/30 bg-slate-700">
        <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
          את/ה
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20">
          <Video className="h-6 w-6" />
        </button>
        <button
          onClick={onEnd}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/50 transition hover:bg-rose-600"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>
      <p className="mt-4 text-xs text-white/40">שיחת וידאו מאובטחת · מוצפנת end-to-end</p>
    </div>
  );
}
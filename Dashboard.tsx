import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Heart,
  X,
  Star,
  MapPin,
  Video,
  MessageCircle,
  Bell,
  Send,
  Sparkles,
  Users,
  TrendingUp,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "@/App";

type Match = User & { matched: boolean; liked: boolean };

const PROFILES: Match[] = [
  {
    name: "נועה",
    email: "noa@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noa",
    age: 26,
    bio: "אוהבת קפה בבוקר, טיולים בטבע וספרים טובים. מחפשת מישהו כן ומצחיק 🌿",
    interests: ["טיולים", "קפה", "ספרים", "יוגה"],
    location: { city: "תל אביב", lat: 32.0853, lng: 34.7818 },
    verified: true,
    online: true,
    distanceKm: 2.5,
    matched: false,
    liked: false,
  },
  {
    name: "איתי",
    email: "itay@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Itay",
    age: 29,
    bio: "מפתח אפליקציות וגיטריסט בנשמה. אוהב הופעות חיות ובישול 🎸",
    interests: ["מוזיקה", "בישול", "טכנולוגיה", "קולנוע"],
    location: { city: "רמת גן", lat: 32.0684, lng: 34.8248 },
    verified: true,
    online: false,
    distanceKm: 5.1,
    matched: false,
    liked: false,
  },
  {
    name: "שירה",
    email: "shira@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shira",
    age: 24,
    bio: "צלמת ומעצבת. אוהבת אמנות, חיות ואופנה בת קיימא 📸",
    interests: ["צילום", "אופנה", "חיות", "אמנות"],
    location: { city: "הרצליה", lat: 32.1663, lng: 34.8253 },
    verified: true,
    online: true,
    distanceKm: 12.3,
    matched: false,
    liked: false,
  },
  {
    name: "רון",
    email: "ron@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ron",
    age: 31,
    bio: "חובב כושר ותזונה. מחפפש מישהי לטיולים ארוכים ושיחות עמוקות 💪",
    interests: ["כושר", "טיולים", "תזונה", "ספורט"],
    location: { city: "גבעתיים", lat: 32.0723, lng: 34.8119 },
    verified: false,
    online: true,
    distanceKm: 4.8,
    matched: false,
    liked: false,
  },
];

type Notification = {
  id: number;
  type: "like" | "match" | "message" | "view";
  text: string;
  time: string;
};

export function Dashboard({ user }: { user: User }) {
  const [profiles, setProfiles] = useState<Match[]>(PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [activeChat, setActiveChat] = useState<Match | null>(null);
  const [showVideoCall, setShowVideoCall] = useState<Match | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate real-time notifications
  useEffect(() => {
    const events = [
      { type: "view" as const, text: "דנה צפתה בפרופיל שלך" },
      { type: "like" as const, text: "יונתן שלח לך לייק! 💕" },
      { type: "message" as const, text: "מאיה: היי! איך עובר היום?" },
      { type: "view" as const, text: "אורי צפתה בפרופיל שלך" },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= events.length) {
        clearInterval(interval);
        return;
      }
      const ev = events[i++];
      const notif: Notification = {
        id: Date.now(),
        type: ev.type,
        text: ev.text,
        time: "עכשיו",
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 12));
      setUnreadCount((c) => c + 1);
      toast(ev.text, {
        icon: ev.type === "like" ? "💕" : ev.type === "message" ? "💬" : "👀",
        duration: 4000,
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSwipe = (liked: boolean) => {
    const target = profiles[currentIndex];
    if (!target) return;

    if (liked) {
      setProfiles((prev) =>
        prev.map((p, i) => (i === currentIndex ? { ...p, liked: true } : p))
      );
      // 70% chance of match
      if (Math.random() > 0.3) {
        const matched = { ...target, matched: true, liked: true };
        setMatches((prev) => [...prev, matched]);
        setProfiles((prev) =>
          prev.map((p, i) => (i === currentIndex ? matched : p))
        );
        toast.success(`יש התאמה עם ${target.name}! 🎉💕`, {
          duration: 5000,
        });
        const notif: Notification = {
          id: Date.now(),
          type: "match",
          text: `התאמה חדשה עם ${target.name}! 🎉`,
          time: "עכשיו",
        };
        setNotifications((prev) => [notif, ...prev].slice(0, 12));
      }
    } else {
      toast(`דילגת על ${target.name}`, { duration: 2000 });
    }

    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
    }, 300);
  };

  const currentProfile = profiles[currentIndex];
  const isFinished = currentIndex >= profiles.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Stats row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard icon={Heart} label="התאמות" value={matches.length} color="rose" />
        <StatCard icon={Eye} label="צפיות" value={47} color="amber" />
        <StatCard icon={TrendingUp} label="לייקים" value={12} color="emerald" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Swipe deck */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-rose-950 dark:text-rose-50">
              התאמות בקרבתך
            </h2>
            <Badge variant="secondary" className="gap-1 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <MapPin className="h-3 w-3" />
              {user.location.city} והסביבה
            </Badge>
          </div>

          <div className="relative" style={{ height: "460px" }}>
            {isFinished ? (
              <EmptyState onReset={() => { setCurrentIndex(0); setProfiles(PROFILES); }} />
            ) : (
              <AnimatePresence mode="popLayout">
                {currentProfile && (
                  <SwipeCard
                    key={currentIndex}
                    profile={currentProfile}
                    onLike={() => handleSwipe(true)}
                    onPass={() => handleSwipe(false)}
                  />
                )}
              </AnimatePresence>
            )}
          </div>

          {!isFinished && currentProfile && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <Button
                onClick={() => handleSwipe(false)}
                size="icon"
                className="h-14 w-14 rounded-full border-2 border-slate-200 bg-white text-slate-400 shadow-lg hover:bg-slate-50 hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800"
                variant="outline"
              >
                <X className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => handleSwipe(true)}
                size="icon"
                className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl shadow-rose-500/40 hover:scale-105 transition-transform"
              >
                <Heart className="h-7 w-7" fill="white" />
              </Button>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full border-2 border-amber-200 bg-white text-amber-500 shadow-lg hover:bg-amber-50 dark:border-amber-800 dark:bg-slate-800"
                variant="outline"
              >
                <Star className="h-6 w-6" fill="currentColor" />
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar: matches + notifications */}
        <div className="space-y-4">
          {/* Notifications */}
          <Card className="border-rose-100 bg-white/90 shadow-md dark:border-rose-900/40 dark:bg-slate-900/90">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base text-rose-950 dark:text-rose-50">
                  <Bell className="h-4 w-4 text-rose-500" />
                  התראות
                </CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-rose-500 text-white">{unreadCount} חדש</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {notifications.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-400">
                  אין התראות עדיין
                </p>
              ) : (
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-2 rounded-lg bg-rose-50/60 p-2.5 dark:bg-rose-950/20"
                    >
                      <span className="mt-0.5 text-lg">
                        {n.type === "like" ? "💕" : n.type === "match" ? "🎉" : n.type === "message" ? "💬" : "👀"}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{n.text}</p>
                        <p className="text-[10px] text-slate-400">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matches */}
          <Card className="border-rose-100 bg-white/90 shadow-md dark:border-rose-900/40 dark:bg-slate-900/90">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-rose-950 dark:text-rose-50">
                <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                ההתאמות שלי ({matches.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {matches.length === 0 ? (
                <div className="py-6 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  <p className="text-sm text-slate-400">
                    לחץ/י על הלב כדי להתחיל להתאים
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {matches.map((m) => (
                    <div
                      key={m.email}
                      className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/40 p-2.5 transition hover:bg-rose-50 dark:border-rose-900/30 dark:bg-rose-950/20 dark:hover:bg-rose-950/40"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-rose-200 dark:border-rose-800">
                          <AvatarImage src={m.avatar} alt={m.name} />
                          <AvatarFallback className="bg-rose-100 text-rose-700">
                            {m.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {m.online && (
                          <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.location.city} · {m.distanceKm} ק״מ</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40"
                          onClick={() => setActiveChat(m)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          onClick={() => setShowVideoCall(m)}
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {activeChat && (
          <ChatModal match={activeChat} onClose={() => setActiveChat(null)} onVideoCall={() => { setShowVideoCall(activeChat); setActiveChat(null); }} />
        )}
      </AnimatePresence>

      {/* Video Call Modal */}
      <AnimatePresence>
        {showVideoCall && (
          <VideoCallModal match={showVideoCall} onClose={() => setShowVideoCall(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: "rose" | "amber" | "emerald" }) {
  const colors = {
    rose: "from-rose-500 to-pink-600 shadow-rose-500/30",
    amber: "from-amber-400 to-orange-500 shadow-amber-500/30",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
  };
  return (
    <Card className="overflow-hidden border-0 bg-white shadow-md dark:bg-slate-900">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} shadow-md`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">{value}</div>
          <div className="text-xs text-slate-400">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function SwipeCard({ profile, onLike, onPass }: { profile: Match; onLike: () => void; onPass: () => void }) {
  const [dragX, setDragX] = useState(0);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, info) => {
        if (info.offset.x > 120) onLike();
        else if (info.offset.x < -120) onPass();
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0, x: dragX }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="h-full overflow-hidden border-0 bg-white shadow-2xl dark:bg-slate-900">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-slate-800">
          <div className="flex h-full items-center justify-center">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl dark:border-slate-700">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-rose-200 text-4xl font-bold text-rose-700">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute right-3 top-3 flex gap-2">
            {profile.verified && (
              <Badge className="gap-1 bg-emerald-500 text-white shadow-md">
                <ShieldCheck className="h-3 w-3" />
                מאומת
              </Badge>
            )}
            {profile.online && (
              <Badge className="gap-1 bg-white/90 text-emerald-600 shadow-md">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                מחובר/ת
              </Badge>
            )}
          </div>
          <motion.div
            className="pointer-events-none absolute left-4 top-4 -rotate-12 rounded-xl bg-emerald-500 px-4 py-1.5 text-lg font-bold text-white shadow-lg"
            style={{ opacity: dragX > 40 ? Math.min(dragX / 120, 1) : 0 }}
          >
            LIKE
          </motion.div>
          <motion.div
            className="pointer-events-none absolute right-4 top-4 rotate-12 rounded-xl bg-rose-500 px-4 py-1.5 text-lg font-bold text-white shadow-lg"
            style={{ opacity: dragX < -40 ? Math.min(-dragX / 120, 1) : 0 }}
          >
            NOPE
          </motion.div>
        </div>
        <CardContent className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-white">
              {profile.name}, {profile.age}
            </h3>
            <div className="flex items-center gap-1 text-sm text-rose-500">
              <MapPin className="h-3.5 w-3.5" />
              {profile.distanceKm} ק״מ
            </div>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {profile.bio}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <Card className="flex h-full flex-col items-center justify-center border-2 border-dashed border-rose-200 bg-white/60 dark:border-rose-900/40 dark:bg-slate-900/60">
      <CardContent className="p-8 text-center">
        <Sparkles className="mx-auto mb-4 h-12 w-12 text-rose-300" />
        <h3 className="mb-2 font-serif text-xl font-bold text-slate-700 dark:text-slate-200">
          זה הכל לעכשיו!
        </h3>
        <p className="mb-4 text-sm text-slate-400">
          בדקת את כל הפרופילים באזור. חזור/י מאוחר יותר לעוד התאמות
        </p>
        <Button onClick={onReset} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/40">
          טען/י מחדש
        </Button>
      </CardContent>
    </Card>
  );
}

function ChatModal({ match, onClose, onVideoCall }: { match: Match; onClose: () => void; onVideoCall: () => void }) {
  const [messages, setMessages] = useState<{ id: number; sender: "me" | "them"; text: string }[]>([
    { id: 1, sender: "them", text: `היי! נעים להכיר 😊` },
    { id: 2, sender: "me", text: "היי! גם לי נעים מאוד" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg = { id: Date.now(), sender: "me" as const, text: input };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    // Simulate reply
    setTimeout(() => {
      const replies = ["וואו נשמע מעניין! 😄", "ספר/י לי עוד", "אני אוהב/ת את זה! 🌟", "נשמע נהדר, מתי ניפגש? 😉"];
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "them", text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900 sm:h-96 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-slate-100 p-4 dark:border-slate-800">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src={match.avatar} alt={match.name} />
            <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">{match.name}</p>
            <p className="text-xs text-emerald-500">{match.online ? "מחובר/ת עכשיו" : "לא מחובר/ת"}</p>
          </div>
          <Button size="icon" variant="ghost" className="h-9 w-9 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40" onClick={onVideoCall}>
            <Video className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "me" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-75% rounded-2xl px-3.5 py-2 text-sm ${
                  m.sender === "me"
                    ? "rounded-bl-sm bg-rose-500 text-white"
                    : "rounded-br-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
          <Input
            placeholder="הקלד/י הודעה..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="h-10 flex-1"
          />
          <Button size="icon" className="h-10 w-10 rounded-full bg-rose-500 text-white hover:bg-rose-600" onClick={send}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VideoCallModal({ match, onClose }: { match: Match; onClose: () => void }) {
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950"
    >
      {/* Remote video (simulated) */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950">
        <div className="flex flex-col items-center">
          <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl">
            <AvatarImage src={match.avatar} alt={match.name} />
            <AvatarFallback className="bg-rose-500 text-5xl font-bold text-white">
              {match.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p className="mt-4 text-lg font-semibold text-white">{match.name}</p>
          <div className="mt-1 flex items-center gap-2 text-sm text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {formatTime(duration)}
          </div>
        </div>

        {/* Self video (PiP) */}
        <div className="absolute bottom-4 left-4 h-32 w-24 overflow-hidden rounded-xl border-2 border-white/20 bg-gradient-to-b from-rose-900 to-slate-900 shadow-lg">
          {videoOff ? (
            <div className="flex h-full items-center justify-center">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-rose-500 text-white">את/ה</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-white/60">
              <Video className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Top bar */}
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-white">שיחת וידאו · {formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 bg-slate-900 px-6 py-6">
        <Button
          size="icon"
          onClick={() => setMuted(!muted)}
          className={`h-14 w-14 rounded-full shadow-lg ${muted ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
        <Button
          size="icon"
          onClick={() => setVideoOff(!videoOff)}
          className={`h-14 w-14 rounded-full shadow-lg ${videoOff ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          {videoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </Button>
        <Button
          size="icon"
          onClick={onClose}
          className="h-16 w-16 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 hover:bg-rose-700"
        >
          <Phone className="h-7 w-7 rotate-[135deg]" />
        </Button>
      </div>
    </motion.div>
  );
}

// Helper icons not in lucide-react default — using inline SVGs
function Eye(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Mic(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function MicOff(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
      <path d="M5 10v2a7 7 0 0 0 12 5" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function VideoOff(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8" />
      <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
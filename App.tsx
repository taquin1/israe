import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Heart, MapPin, ShieldCheck, Video, Bell, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AuthScreen } from '@/components/AuthScreen';
import { MatchScreen } from '@/components/MatchScreen';
import { ChatScreen } from '@/components/ChatScreen';
import { Profile, Match, Notification } from '@/types';

export default function App() {
  const [user, setUser] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'chats' | 'profile'>('discover');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeChat, setActiveChat] = useState<Match | null>(null);

  const handleAuth = (profile: Profile) => {
    setUser(profile);
    toast.success(`ברוך הבא, ${profile.name}!`, {
      description: 'ההרשמה הושלמה בהצלחה ✓',
    });
  };

  const addNotification = (n: Omit<Notification, 'id' | 'timestamp'>) => {
    setNotifications((prev) => [
      { ...n, id: crypto.randomUUID(), timestamp: Date.now() },
      ...prev,
    ]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <AuthScreen onAuth={handleAuth} />
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/80 backdrop-blur-lg">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-200">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Qavé</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-full hover:bg-rose-50 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
            <Avatar className="w-9 h-9 border-2 border-rose-200">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-rose-100 text-rose-700 font-semibold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MatchScreen user={user} onMatch={(m) => { addNotification({ type: 'match', title: 'יש התאמה חדשה!', description: m.name }); setActiveTab('matches'); }} />
            </motion.div>
          )}
          {activeTab === 'matches' && (
            <motion.div key="matches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <MatchesView onOpenChat={(m) => { setActiveChat(m); setActiveTab('chats'); }} />
            </motion.div>
          )}
          {activeTab === 'chats' && (
            <motion.div key="chats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ChatScreen match={activeChat} user={user} />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ProfileView user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-rose-100 bg-white/90 backdrop-blur-lg">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
          {[
            { id: 'discover', icon: Sparkles, label: 'גלה' },
            { id: 'matches', icon: Heart, label: 'התאמות' },
            { id: 'chats', icon: MessageCircle, label: 'צאט' },
            { id: 'profile', icon: ShieldCheck, label: 'פרופיל' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
                activeTab === tab.id ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <Toaster position="top-center" richColors />
    </div>
  );
}

function MatchesView({ onOpenChat }: { onOpenChat: (m: Match) => void }) {
  const matches: Match[] = [
    { id: '1', name: 'נועה', age: 26, distance: 2, bio: 'אוהבת אמנות וקפה', avatar: 'https://i.pravatar.cc/150?img=5', verified: true },
    { id: '2', name: 'איתי', age: 29, distance: 5, bio: 'מטייל וצלם', avatar: 'https://i.pravatar.cc/150?img=12', verified: true },
    { id: '3', name: 'מאיה', age: 24, distance: 1, bio: 'סטודנטית לפסיכולוגיה', avatar: 'https://i.pravatar.cc/150?img=9', verified: false },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">ההתאמות שלך</h2>
      <div className="grid grid-cols-2 gap-4">
        {matches.map((m) => (
          <Card key={m.id} className="overflow-hidden border-rose-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onOpenChat(m)}>
            <div className="aspect-square bg-gradient-to-br from-rose-100 to-amber-100 relative">
              <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
              {m.verified && (
                <Badge className="absolute top-2 right-2 bg-emerald-500 hover:bg-emerald-500 gap-1">
                  <ShieldCheck className="w-3 h-3" /> מאומת
                </Badge>
              )}
            </div>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{m.name}, {m.age}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {m.distance} ק"מ
                  </p>
                </div>
                <Button size="icon" className="rounded-full bg-rose-500 hover:bg-rose-600 h-9 w-9">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ user }: { user: Profile }) {
  return (
    <div className="space-y-6">
      <Card className="border-rose-100 shadow-md overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-rose-400 to-amber-400" />
        <CardContent className="pt-0 -mt-12">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-rose-100 text-rose-700 text-2xl font-bold">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mt-4 space-y-1">
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1 mt-2">
              <ShieldCheck className="w-3 h-3" /> פרופיל מאומת
            </Badge>
          </div>
        </CardContent>
      </Card>
      <Card className="border-rose-100">
        <CardHeader>
          <CardTitle className="text-lg">העדפות</CardTitle>
          <CardDescription>מיקום והתאמות</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span className="font-medium">מרחק חיפוש</span>
            </div>
            <span className="font-semibold text-rose-600">עד 10 ק"מ</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
            <div className="flex items-center gap-2 text-slate-700">
              <Video className="w-5 h-5 text-amber-500" />
              <span className="font-medium">שיחות וידאו</span>
            </div>
            <span className="font-semibold text-amber-600">זמין</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
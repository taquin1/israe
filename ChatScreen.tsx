import { useState, useRef, useEffect } from 'react';
import { Send, Video, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Match, Profile } from '@/types';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: number;
}

export function ChatScreen({ match, user }: { match: Match | null; user: Profile }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [inVideoCall, setInVideoCall] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (match) {
      setMessages([
        { id: '1', sender: 'them', text: `היי ${user.name}! נעים להכיר אותך 😊`, timestamp: Date.now() - 60000 },
      ]);
    }
  }, [match, user.name]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !match) return;
    const newMsg: Message = { id: crypto.randomUUID(), sender: 'me', text: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        sender: 'them',
        text: 'נשמע מעניין! ספר לי עוד 🌟',
        timestamp: Date.now(),
      }]);
    }, 1500);
  };

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <Send className="w-8 h-8 text-rose-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">אין צ'אט פעיל</h3>
        <p className="text-sm text-slate-500 mt-1">בחר התאמה מהרשימה כדי להתחיל לשוחח</p>
      </div>
    );
  }

  if (inVideoCall) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
        {/* Remote Video */}
        <div className="flex-1 relative overflow-hidden">
          <img src={match.avatar} alt={match.name} className="w-full h-full object-cover opacity-90" />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Button onClick={() => setInVideoCall(false)} variant="ghost" className="text-white hover:bg-white/20">
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Badge className="bg-rose-500 hover:bg-rose-500 gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE
            </Badge>
          </div>
          {/* Self Video */}
          <div className="absolute bottom-4 left-4 w-24 h-32 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center">
              <span className="text-white text-xs font-medium">{user.name}</span>
            </div>
          </div>
        </div>
        {/* Controls */}
        <div className="h-20 bg-slate-800 flex items-center justify-center gap-4">
          <Button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600">
            <Phone className="w-5 h-5 text-white" />
          </Button>
          <Button onClick={() => setInVideoCall(false)} className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600">
            <Phone className="w-6 h-6 text-white rotate-[135deg]" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-rose-100 shadow-sm">
        <Avatar className="w-12 h-12">
          <AvatarImage src={match.avatar} />
          <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{match.name}</h3>
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" /> מחובר כעת
          </p>
        </div>
        <Button onClick={() => setInVideoCall(true)} size="icon" className="rounded-full bg-emerald-500 hover:bg-emerald-600">
          <Video className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-96 overflow-y-auto space-y-3 p-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-rose-500 text-white rounded-bl-sm'
                  : 'bg-white border border-slate-100 text-slate-700 rounded-br-sm'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="הקלד הודעה..."
          className="flex-1 h-12 rounded-full border-rose-100 focus:border-rose-300"
        />
        <Button onClick={sendMessage} size="icon" className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600">
          <Send className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
}
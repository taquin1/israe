import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, MapPin, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Match, Profile } from '@/types';

const mockMatches: Match[] = [
  { id: '1', name: 'נועה', age: 26, distance: 2, bio: 'אוהבת אמנות, קפה וטיולים בטבע 🌿', avatar: 'https://i.pravatar.cc/300?img=5', verified: true },
  { id: '2', name: 'איתי', age: 29, distance: 5, bio: 'צלם ומטייל. מחפש הרפתקאות חדשות 📷', avatar: 'https://i.pravatar.cc/300?img=12', verified: true },
  { id: '3', name: 'מאיה', age: 24, distance: 1, bio: 'סטודנטית לפסיכולוגיה. אוהבת ספרים ויין 📚', avatar: 'https://i.pravatar.cc/300?img=9', verified: false },
  { id: '4', name: 'עומר', age: 31, distance: 8, bio: 'מהנדס תוכנה. גיטאריסט בשעות הפנאי 🎸', avatar: 'https://i.pravatar.cc/300?img=15', verified: true },
];

export function MatchScreen({ user, onMatch }: { user: Profile; onMatch: (m: Match) => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const current = mockMatches[index];

  const handleSwipe = (liked: boolean) => {
    setDirection(liked ? 1 : -1);
    if (liked && current) {
      onMatch(current);
    }
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % mockMatches.length);
      setDirection(0);
    }, 300);
  };

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">גלה</h2>
          <p className="text-sm text-slate-500">אנשים בקרבת מקום</p>
        </div>
        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
          {mockMatches.length} התאמות
        </Badge>
      </div>

      {/* Card Stack */}
      <div className="relative h-[520px]">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? 200 : -200, rotate: direction > 0 ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl bg-white border border-rose-100"
          >
            {/* Image */}
            <div className="h-80 relative overflow-hidden">
              <img src={current.avatar} alt={current.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {current.verified && (
                <Badge className="absolute top-4 right-4 bg-emerald-500/90 hover:bg-emerald-500 gap-1 backdrop-blur-sm">
                  <ShieldCheck className="w-3 h-3" /> מאומת
                </Badge>
              )}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{current.name}, {current.age}</h3>
                    <p className="text-sm flex items-center gap-1 text-white/90">
                      <MapPin className="w-4 h-4" /> {current.distance} ק"מ ממך
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="p-5 space-y-3">
              <p className="text-slate-700">{current.bio}</p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="border-rose-200 text-rose-600">תל אביב</Badge>
                <Badge variant="outline" className="border-amber-200 text-amber-600">אמנות</Badge>
                <Badge variant="outline" className="border-emerald-200 text-emerald-600">טבע</Badge>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={() => handleSwipe(false)}
          size="icon"
          className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 hover:border-rose-300 hover:bg-rose-50 shadow-md"
        >
          <X className="w-6 h-6 text-slate-600" />
        </Button>
        <Button
          onClick={() => handleSwipe(true)}
          size="icon"
          className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-200"
        >
          <Heart className="w-7 h-7 text-white" fill="white" />
        </Button>
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 shadow-md"
        >
          <Star className="w-6 h-6 text-amber-500" fill="currentColor" />
        </Button>
      </div>
    </div>
  );
}
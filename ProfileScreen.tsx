import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore, store } from "@/lib/store";
import { toast } from "sonner";
import { ShieldCheck, MapPin, Edit3, Save, Plus, X } from "lucide-react";

export function ProfileScreen() {
  const { currentUser } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [city, setCity] = useState(currentUser.city);
  const [interests, setInterests] = useState<string[]>(currentUser.interests);
  const [newInterest, setNewInterest] = useState("");

  const handleSave = () => {
    store.updateProfile({ name, bio, city, interests });
    setEditing(false);
    toast.success("הפרופיל עודכן!");
  };

  const addInterest = () => {
    if (!newInterest.trim() || interests.includes(newInterest.trim())) return;
    setInterests([...interests, newInterest.trim()]);
    setNewInterest("");
  };

  const removeInterest = (tag: string) => {
    setInterests(interests.filter((t) => t !== tag));
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Card className="overflow-hidden border-0 shadow-xl shadow-rose-100/50">
        <div className="relative h-32 bg-gradient-to-br from-rose-400 to-orange-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent)]" />
        </div>
        <CardContent className="-mt-16 pb-6">
          <div className="flex items-end justify-between">
            <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
              <AvatarImage src={currentUser.photo} alt={currentUser.name} />
              <AvatarFallback className="bg-rose-200 text-3xl text-rose-600">
                {currentUser.name[0]}
              </AvatarFallback>
            </Avatar>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="mb-2 border-rose-200 bg-rose-50/50 hover:bg-rose-100"
              >
                <Edit3 className="ml-1 h-4 w-4" />
                עריכה
              </Button>
            )}
          </div>

          <div className="mt-4">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="p-name">שם</Label>
                  <Input
                    id="p-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-rose-200 focus-visible:ring-rose-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-city">עיר</Label>
                  <Input
                    id="p-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border-rose-200 focus-visible:ring-rose-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-bio">ביו</Label>
                  <Textarea
                    id="p-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="border-rose-200 focus-visible:ring-rose-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label>תחומי עניין</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addInterest()}
                      placeholder="הוסף תחום עניין"
                      className="border-rose-200 focus-visible:ring-rose-400"
                    />
                    <Button
                      onClick={addInterest}
                      size="icon"
                      variant="outline"
                      className="border-rose-200 bg-rose-50 hover:bg-rose-100"
                    >
                      <Plus className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {interests.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 rounded-full bg-rose-50 text-rose-600"
                      >
                        {tag}
                        <button onClick={() => removeInterest(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"
                >
                  <Save className="ml-2 h-4 w-4" />
                  שמור שינויים
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-2xl font-bold text-slate-800">
                    {currentUser.name}, {currentUser.age}
                  </h2>
                  {currentUser.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      מאומת
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {currentUser.city}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{currentUser.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentUser.interests.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full bg-rose-50 text-rose-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-100 bg-white/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">סטטיסטיקה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <Stat value="12" label="צפיות" />
            <Stat value="5" label="לייקים" />
            <Stat value="3" label="התאמות" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-rose-50/50 p-3">
      <div className="font-serif text-2xl font-bold text-rose-600">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
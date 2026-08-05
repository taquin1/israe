import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Heart,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "@/App";

const GOOGLE_COLORS = "#4285F4";
const FB_COLOR = "#1877F2";

export function AuthScreen({
  authMethod,
  setAuthMethod,
  onAuthenticated,
}: {
  authMethod: "google" | "facebook" | null;
  setAuthMethod: (m: "google" | "facebook" | null) => void;
  onAuthenticated: (u: User) => void;
}) {
  const [step, setStep] = useState<"choose" | "verify" | "profile">("choose");
  const [verifyChannel, setVerifyChannel] = useState<"sms" | "email">("sms");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [profile, setProfile] = useState({ name: "", age: "", bio: "" });

  const handleSocial = (provider: "google" | "facebook") => {
    setAuthMethod(provider);
    setStep("verify");
    toast.success(`נכנסת עם ${provider === "google" ? "Google" : "Facebook"} — כעת נאמת את החשבון`);
  };

  const handleSendCode = () => {
    if (!contact.trim()) {
      toast.error("נא למלא פרטי קשר");
      return;
    }
    toast.success(`קוד אימות נשלח ל${verifyChannel === "sms" ? "מספר" : "דוא״ל"} שלך`);
  };

  const handleVerify = () => {
    const entered = code.join("");
    if (entered.length < 6) {
      toast.error("נא להזין את כל 6 הספרות");
      return;
    }
    toast.success("אימות הצליח! 🎉");
    setStep("profile");
  };

  const handleFinish = () => {
    if (!profile.name.trim() || !profile.age.trim()) {
      toast.error("נא למלא שם וגיל");
      return;
    }
    const newUser: User = {
      name: profile.name,
      email: verifyChannel === "email" ? contact : `${profile.name}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`,
      age: parseInt(profile.age) || 25,
      bio: profile.bio || "מחפש/ת להכיר אנשים חדשים 😊",
      interests: ["מוזיקה", "טיולים", "בישול"],
      location: { city: "תל אביב", lat: 32.0853, lng: 34.7818 },
      verified: true,
      online: true,
      distanceKm: 0,
    };
    onAuthenticated(newUser);
  };

  const setDigit = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
      {/* Hero */}
      <div className="mb-10 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/40"
        >
          <Heart className="h-8 w-8 text-white" fill="white" />
        </motion.div>
        <h1 className="font-serif text-3xl font-bold text-rose-950 dark:text-rose-50 sm:text-4xl">
          מצא/י את ההתאמה המושלמת
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          היכרויות חינמיות עם אימות זהות, שיחות וידאו והתאמה גיאוגרפית חכמה
        </p>
      </div>

      {/* Feature pills */}
      <div className="mx-auto mb-8 flex max-w-2xl flex-wrap justify-center gap-2">
        {[
          { icon: ShieldCheck, label: "אימות SMS/דוא״ל" },
          { icon: Video, label: "שיחות וידאו" },
          { icon: MapPin, label: "התאמה לפי מיקום" },
          { icon: MessageCircle, label: "התראות בזמן אמת" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-1.5 rounded-full border border-rose-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-rose-900/40 dark:bg-slate-900 dark:text-slate-300"
          >
            <f.icon className="h-3.5 w-3.5 text-rose-500" />
            {f.label}
          </div>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Left visual panel */}
        <div className="hidden overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 p-8 shadow-xl lg:flex lg:flex-col lg:justify-between" style={{ minHeight: "480px" }}>
          <div>
            <Sparkles className="mb-6 h-8 w-8 text-white/90" />
            <h2 className="font-serif text-2xl font-bold leading-snug text-white">
              אלפי רווקים ורווקות מחכים לך
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-rose-50/90">
              הצטרף/י עכשיו לקהילה הגדולה בישראל. אימות זהות מלא, פרטיות מובטחת, והתאמות חכמות לפי תחומי עניין ומיקום.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {[
              { icon: Users, stat: "12,500+", label: "משתמשים פעילים" },
              { icon: Heart, stat: "3,200+", label: "התאמות כל חודש" },
              { icon: ShieldCheck, stat: "100%", label: "פרופילים מאומתים" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{s.stat}</div>
                  <div className="text-xs text-rose-50/80">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right auth flow */}
        <Card className="border-rose-100 bg-white/90 shadow-lg backdrop-blur dark:border-rose-900/40 dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-rose-950 dark:text-rose-50">
              {step === "choose" && "התחברות / הרשמה"}
              {step === "verify" && "אימות זהות"}
              {step === "profile" && "השלם את הפרופיל"}
            </CardTitle>
            <CardDescription>
              {step === "choose" && "בחר/י שיטת התחברות — זה לגמרי בחינם"}
              {step === "verify" && "נשלח קוד חד-פעמי לאימות החשבון שלך"}
              {step === "profile" && "כמה פרטים וסיימנו"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "choose" && (
              <>
                <Button
                  onClick={() => handleSocial("google")}
                  className="h-12 w-full gap-3 border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  variant="outline"
                >
                  <GoogleIcon />
                  <span className="text-sm font-semibold">המשך עם Google</span>
                </Button>
                <Button
                  onClick={() => handleSocial("facebook")}
                  className="h-12 w-full gap-3 text-white shadow-sm hover:opacity-90"
                  style={{ backgroundColor: FB_COLOR }}
                >
                  <FacebookIcon />
                  <span className="text-sm font-semibold">המשך עם Facebook</span>
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-slate-400 dark:bg-slate-900">או</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setAuthMethod(null);
                    setStep("verify");
                  }}
                  className="h-12 w-full bg-rose-500 text-white shadow-md shadow-rose-500/30 hover:bg-rose-600"
                >
                  הרשמה עם דוא״ל / טלפון
                </Button>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="flex gap-2">
                  <Button
                    variant={verifyChannel === "sms" ? "default" : "outline"}
                    onClick={() => setVerifyChannel("sms")}
                    className={`h-10 flex-1 gap-2 ${verifyChannel === "sms" ? "bg-rose-500 text-white" : ""}`}
                  >
                    <Phone className="h-4 w-4" />
                    SMS
                  </Button>
                  <Button
                    variant={verifyChannel === "email" ? "default" : "outline"}
                    onClick={() => setVerifyChannel("email")}
                    className={`h-10 flex-1 gap-2 ${verifyChannel === "email" ? "bg-rose-500 text-white" : ""}`}
                  >
                    <Mail className="h-4 w-4" />
                    דוא״ל
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">
                    {verifyChannel === "sms" ? "מספר טלפון" : "כתובת דוא״ל"}
                  </Label>
                  <Input
                    id="contact"
                    placeholder={verifyChannel === "sms" ? "050-1234567" : "you@example.com"}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="h-11"
                  />
                </div>

                <Button onClick={handleSendCode} variant="secondary" className="w-full">
                  שלח קוד אימות
                </Button>

                <div className="space-y-2">
                  <Label>הזן/י את הקוד בן 6 הספרות</Label>
                  <div className="flex gap-2" dir="ltr">
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => setDigit(i, e.target.value)}
                        className="h-12 w-12 rounded-lg border border-slate-200 bg-white text-center text-lg font-bold text-slate-800 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    ))}
                  </div>
                </div>

                <Button onClick={handleVerify} className="h-11 w-full bg-rose-500 text-white shadow-md shadow-rose-500/30 hover:bg-rose-600">
                  <ShieldCheck className="ml-2 h-4 w-4" />
                  אמת/י והמשך/י
                </Button>
              </>
            )}

            {step === "profile" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input
                    id="name"
                    placeholder="ישראלה ישראלי"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">גיל</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="28"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">ביו קצר</Label>
                  <textarea
                    id="bio"
                    placeholder="ספר/י קצת על עצמך..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="min-h-20 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <Button onClick={handleFinish} className="h-11 w-full bg-rose-500 text-white shadow-md shadow-rose-500/30 hover:bg-rose-600">
                  סיום וכניסה לאפליקציה
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}
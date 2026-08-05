import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Profile } from '@/types';

const mockAvatars = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
];

export function AuthScreen({ onAuth }: { onAuth: (p: Profile) => void }) {
  const [step, setStep] = useState<'method' | 'verify' | 'profile'>('method');
  const [authMethod, setAuthMethod] = useState<Profile['authMethod']>('google');
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleMethodSelect = (method: Profile['authMethod']) => {
    setAuthMethod(method);
    if (method === 'google' || method === 'facebook') {
      // Simulate OAuth - auto-fill profile
      onAuth({
        id: crypto.randomUUID(),
        name: method === 'google' ? 'דניאל כהן' : 'רוני לוי',
        email: method === 'google' ? 'daniel@gmail.com' : 'roni@facebook.com',
        avatar: mockAvatars[Math.floor(Math.random() * mockAvatars.length)],
        verified: true,
        authMethod: method,
      });
    } else {
      setStep('verify');
    }
  };

  const handleVerify = () => {
    if (code.length >= 4) {
      setStep('profile');
    }
  };

  const handleProfileComplete = () => {
    if (name.trim()) {
      onAuth({
        id: crypto.randomUUID(),
        name,
        email: authMethod === 'sms' ? `${contact}@sms.qave` : contact,
        avatar: mockAvatars[Math.floor(Math.random() * mockAvatars.length)],
        verified: true,
        authMethod,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 items-center justify-center shadow-lg shadow-rose-200 mb-4"
          >
            <Heart className="w-8 h-8 text-white" fill="white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">Qavé</h1>
          <p className="text-slate-500 mt-1">מצא את ההתאמה המושלמת שלך</p>
        </div>

        <Card className="border-rose-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">
              {step === 'method' && 'בחר דרך הרשמה'}
              {step === 'verify' && 'אימות חשבון'}
              {step === 'profile' && 'השלם את הפרופיל'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'method' && '100% חינם • אימות מאובטח'}
              {step === 'verify' && `הזן את הקוד שנשלח ל-${contact || 'מספר/דוא"ל'}`}
              {step === 'profile' && 'כמה פרטים קטנים ומתחילים'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'method' && (
              <div className="space-y-3">
                <Button
                  onClick={() => handleMethodSelect('google')}
                  className="w-full h-12 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800"
                >
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  המשך עם Google
                </Button>
                <Button
                  onClick={() => handleMethodSelect('facebook')}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg className="w-5 h-5 ml-2" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  המשך עם Facebook
                </Button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400">או</span>
                  </div>
                </div>
                <Button
                  onClick={() => { setAuthMethod('sms'); setStep('verify'); }}
                  variant="outline"
                  className="w-full h-12 border-slate-200 hover:bg-rose-50 hover:border-rose-200"
                >
                  <Phone className="w-5 h-5 ml-2 text-rose-500" />
                  הרשמה עם SMS
                </Button>
                <Button
                  onClick={() => { setAuthMethod('email'); setStep('verify'); }}
                  variant="outline"
                  className="w-full h-12 border-slate-200 hover:bg-amber-50 hover:border-amber-200"
                >
                  <Mail className="w-5 h-5 ml-2 text-amber-500" />
                  הרשמה עם דוא"ל
                </Button>
              </div>
            )}

            {step === 'verify' && (
              <div className="space-y-4">
                {authMethod === 'sms' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">מספר טלפון</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="050-1234567"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">דוא"ל</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="h-12"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="code">קוד אימות</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="••••"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="h-12 text-center text-2xl tracking-widest"
                  />
                </div>
                <Button onClick={handleVerify} className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white">
                  <ShieldCheck className="w-5 h-5 ml-2" />
                  אמת והמשך
                </Button>
                <Button onClick={() => setStep('method')} variant="ghost" className="w-full text-slate-500">
                  חזרה
                </Button>
              </div>
            )}

            {step === 'profile' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="השם שלך"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button onClick={handleProfileComplete} className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white">
                  סיום והתחלה
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          בהרשמה אתה מאשר את תנאי השימוש ומדיניות הפרטיות
        </p>
      </motion.div>
    </div>
  );
}
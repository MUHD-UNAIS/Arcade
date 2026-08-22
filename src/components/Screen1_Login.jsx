import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, Heart, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { sounds } from '../SoundEffects';

export function Screen1_Login({ onLogin, onRegister, onGuestAccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');
    setFormError('');
    setIsSubmitting(true);
    sounds.playLaunch();
    let result;
    try {
      result = isLoginTab
        ? await onLogin({ email, password, rememberMe })
        : await onRegister({ name, email, password });
    } catch (error) {
      result = { error: error.message || 'Authentication failed. Please try again.' };
    }
    setIsSubmitting(false);
    if (result?.error) setFormError(result.error);
    else if (result?.message) setFormMessage(result.message);
  };

  const handleGuest = () => {
    sounds.playClick();
    onGuestAccess();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-zen-pinkLight via-[#F9E9EC] to-zen-cream relative overflow-hidden">
      
      {/* Background Decorative Floating Bubbles & Glows */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-zen-pinkAccent/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-zen-tealBg/40 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white/85 backdrop-blur-xl rounded-3xl border border-white shadow-zen-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 transition-all duration-300">
        
        {/* LEFT PANEL: Illustration & Welcome Branding */}
        <div className="p-5 sm:p-8 lg:p-10 bg-gradient-to-b from-zen-pinkCard to-zen-pinkLight/60 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-zen-pinkAccent/30">
          
          {/* Top Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-zen-mauve" />
            </div>
            <span className="font-display font-bold text-lg text-zen-plum tracking-tight">Lumina Zen</span>
          </div>

          {/* Central Hero Text & Mascot Illustration */}
          <div className="my-4 sm:my-6 md:my-8 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-zen-pinkAccent/40 text-xs font-semibold text-zen-mauve mb-3 shadow-sm">
              <Heart className="w-3.5 h-3.5 text-zen-mauve fill-zen-pinkAccent" />
              <span>Your Cozy Mindfulness Sanctuary</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zen-plum font-display leading-tight mb-2 sm:mb-3">
              Welcome back to your safe space.
            </h2>
            <p className="text-xs sm:text-sm text-zen-plum/80 leading-relaxed max-w-sm">
              A gentle environment created for your peace of mind. Log in or register to enter your personal cozy game arcade.
            </p>

            {/* Custom 3D-Style Meditating Cloud Mascot Vector SVG */}
            <div className="mt-4 sm:mt-6 md:mt-8 relative flex items-center justify-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-t from-zen-pinkAccent/40 to-transparent absolute blur-lg animate-pulse-glow" />
              
              {/* Cloud Mascot */}
              <div className="relative z-10 animate-float flex flex-col items-center">
                <svg className="w-36 h-28 sm:w-44 sm:h-36 drop-shadow-md" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Fluffy Pink Cloud Base */}
                  <path d="M40 120C23.4315 120 10 106.569 10 90C10 75.3129 20.5794 63.0932 34.6186 60.5283C38.077 37.3822 58.1256 20 82.5 20C100.865 20 116.711 29.8156 124.966 44.4251C129.585 41.597 135.1 40 141 40C158.673 40 173 54.3269 173 72C173 74.0772 172.802 76.108 172.424 78.0743C182.721 82.4938 190 92.8988 190 105C190 121.569 176.569 135 160 135H40Z" fill="#FCEBEF" stroke="#F7C5D1" strokeWidth="3" />
                  
                  {/* Meditating Soft Marshmallow Mascot */}
                  <rect x="75" y="45" width="50" height="55" rx="25" fill="#FAF7F2" stroke="#EADF9E" strokeWidth="3" />
                  {/* Sleeping eyes */}
                  <path d="M88 65C90 68 94 68 96 65" stroke="#4A353B" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M104 65C106 68 110 68 112 65" stroke="#4A353B" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Gentle blush cheeks */}
                  <circle cx="85" cy="72" r="4" fill="#F7C5D1" />
                  <circle cx="115" cy="72" r="4" fill="#F7C5D1" />
                  {/* Serene smile */}
                  <path d="M96 76C98 78 102 78 104 76" stroke="#4A353B" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Floating sparkles */}
                  <circle cx="35" cy="40" r="3" fill="#A86B79" className="animate-ping" />
                  <circle cx="165" cy="30" r="4" fill="#7A8450" />
                  <circle cx="180" cy="80" r="3" fill="#4A7C7D" />
                </svg>
              </div>
            </div>

          </div>

          {/* Bottom Security Note */}
          <div className="flex items-center justify-center md:justify-start gap-2 text-[11px] text-zen-mauve font-medium mt-2">
            <ShieldCheck className="w-4 h-4 text-zen-olive shrink-0" />
            <span>100% Private, Safe & Non-judgmental space.</span>
          </div>

        </div>

        {/* RIGHT PANEL: Form Inputs */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-between bg-white/60">
          
          <div>
            {/* Top Pill Switcher: Login / Register */}
            <div className="flex items-center bg-zen-pinkLight p-1 rounded-full border border-zen-pinkAccent/40 mb-6 shadow-zen-inner">
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(true);
                  sounds.playClick();
                }}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isLoginTab
                    ? 'bg-white text-zen-plum shadow-sm'
                    : 'text-zen-mauve hover:text-zen-plum'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(false);
                  sounds.playClick();
                }}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  !isLoginTab
                    ? 'bg-white text-zen-plum shadow-sm'
                    : 'text-zen-mauve hover:text-zen-plum'
                }`}
              >
                Register
              </button>
            </div>

            {/* Header Title */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-zen-plum font-display">
                {isLoginTab ? 'Hello again!' : 'Create your safe profile'}
              </h3>
              <p className="text-xs text-zen-mauve mt-1">
                {isLoginTab
                  ? 'Enter your credentials to continue your journey.'
                  : 'Start your mindfulness journey with a cozy personal account.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-semibold text-zen-plum mb-1.5">Display Name</label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-zen-mauve absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cozy Mind"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zen-pinkLight/50 border border-zen-pinkAccent/60 rounded-2xl text-xs font-medium text-zen-plum placeholder-zen-mauve/60 focus:outline-none focus:border-zen-plum focus:ring-2 focus:ring-zen-pinkAccent/50 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zen-plum mb-1.5">Email / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zen-mauve absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@safeplace.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zen-pinkLight/50 border border-zen-pinkAccent/60 rounded-2xl text-xs font-medium text-zen-plum placeholder-zen-mauve/60 focus:outline-none focus:border-zen-plum focus:ring-2 focus:ring-zen-pinkAccent/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zen-plum mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zen-mauve absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-zen-pinkLight/50 border border-zen-pinkAccent/60 rounded-2xl text-xs font-medium text-zen-plum placeholder-zen-mauve/60 focus:outline-none focus:border-zen-plum focus:ring-2 focus:ring-zen-pinkAccent/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zen-mauve hover:text-zen-plum"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zen-plum/90 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zen-pinkAccent text-zen-plum focus:ring-zen-pinkAccent accent-zen-plum cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); }} className="text-zen-mauve font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 px-6 rounded-2xl bg-zen-plum hover:bg-zen-plumHover text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>{isSubmitting ? 'Please wait...' : (isLoginTab ? 'Enter Safe Space' : 'Create Account')}</span>
                <ArrowRight className="w-4 h-4 text-zen-pinkAccent group-hover:translate-x-1 transition-transform" />
              </button>
              {formError && <p role="alert" className="text-xs font-semibold text-red-600">{formError}</p>}
              {formMessage && <p role="status" className="text-xs font-semibold text-emerald-700">{formMessage}</p>}
            </form>
          </div>

          {/* Guest Access Option */}
          <div className="mt-6 pt-6 border-t border-zen-pinkAccent/30 text-center">
            <p className="text-xs text-zen-mauve mb-2">Just exploring?</p>
            <button
              type="button"
              onClick={handleGuest}
              className="w-full py-2.5 px-4 rounded-2xl bg-zen-pinkLight border border-zen-pinkAccent text-zen-plum font-semibold text-xs hover:bg-zen-pinkCard transition-all flex items-center justify-center gap-2"
            >
              <span>Continue as Guest</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

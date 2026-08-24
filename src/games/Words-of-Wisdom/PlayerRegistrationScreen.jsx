import React, { useState } from "react";
import GameBackground from "./GameBackground";

const PlayerRegistrationScreen = ({ onComplete, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    age: initialData?.age || "",
    gender: initialData?.gender || "guy",
    college: initialData?.college || "",
    otherCollege: initialData?.otherCollege || "",
    field_of_study: initialData?.field_of_study || "",
    country: "India",
    state: initialData?.state || "",
  });

  const [showOtherCollege, setShowOtherCollege] = useState(
    Boolean(initialData?.otherCollege)
  );
  const [errors, setErrors] = useState({});

  const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const MAJOR_COLLEGES = [
    "Indian Institute of Science (IISc), Bangalore",
    "IIT Madras",
    "IIT Delhi",
    "IIT Bombay",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Roorkee",
    "IIT Guwahati",
    "AIIMS, New Delhi",
    "BITS Pilani",
    "University of Delhi",
    "Jawaharlal Nehru University (JNU)",
    "Banaras Hindu University (BHU)",
    "Anna University, Chennai",
    "VIT University, Vellore",
    "Cochin University of Science and Technology (CUSAT)",
    "Sahrudaya College of Engineering & Technology",
    "APJ Abdul Kalam Technological University (KTU)",
    "University of Kerala",
    "Mahatma Gandhi University, Kottayam",
    "University of Calicut",
    "NIT Calicut",
    "NIT Trichy",
    "NIT Surathkal",
    "Manipal Academy of Higher Education",
    "Savitribai Phule Pune University",
    "University of Mumbai",
    "University of Calcutta",
    "Jadavpur University",
    "Amrita Vishwa Vidyapeetham",
    "SRM Institute of Science and Technology",
    "Christ University",
    "TISS, Mumbai",
    "Delhi Technological University (DTU)",
    "National Institute of Design (NID)",
    "Jamia Millia Islamia",
    "Aligarh Muslim University",
    "Osmania University",
    "Amity University",
    "LPU (Lovely Professional University)",
  ].sort();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "college") {
      if (value === "OTHER") {
        setShowOtherCollege(true);
        setFormData((prev) => ({ ...prev, [name]: "" }));
      } else {
        setShowOtherCollege(false);
        setFormData((prev) => ({ ...prev, [name]: value, otherCollege: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name] || (name === "otherCollege" && errors.college)) {
      setErrors((prev) => ({
        ...prev,
        [name === "otherCollege" ? "college" : name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age && formData.age !== 0) newErrors.age = "Age is required";
    const collegeToSave = showOtherCollege
      ? formData.otherCollege
      : formData.college;
    if (!collegeToSave.trim()) newErrors.college = "College / Institution is required";
    if (!formData.field_of_study.trim())
      newErrors.field_of_study = "Field of Study is required";
    if (!formData.state) newErrors.state = "State is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onComplete({
      ...formData,
      college: showOtherCollege ? formData.otherCollege : formData.college,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 overflow-y-auto select-none touch-pan-y"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <GameBackground harmony={50} />

      <div className="relative w-full max-w-lg z-10 animate-scale-in py-4 md:py-8 my-auto">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/15 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-4xl relative">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="absolute top-6 right-6 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title="Close Profile"
            >
              ✕
            </button>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-3xl rounded-2xl mb-3 flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden -rotate-6 transform hover:rotate-0 transition-all duration-700">
              <img
                src="/stickman_assets/logo.svg"
                alt="Words of Wisdom"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter text-center leading-none">
              Player <span className="text-teal-400">Profile</span>
            </h1>
            <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[8px] mt-2">
              Words of Wisdom • Mind Empowered
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar / Gender Selector */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black text-teal-400 uppercase tracking-widest ml-2">
                Choose Avatar
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, gender: "guy" }))}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                    formData.gender === "guy"
                      ? "bg-teal-500/20 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                      : "bg-white/5 border-white/10 hover:border-white/25 opacity-70"
                  }`}
                >
                  <img
                    src="/stickman_assets/guy_idle.svg"
                    alt="Guy"
                    className="w-8 h-8 object-contain"
                  />
                  <div className="text-left">
                    <p className="text-xs font-black text-white leading-tight">Guy Avatar</p>
                    <p className="text-[8px] text-teal-300">Stick Hero</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, gender: "girl" }))}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                    formData.gender === "girl"
                      ? "bg-teal-500/20 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                      : "bg-white/5 border-white/10 hover:border-white/25 opacity-70"
                  }`}
                >
                  <img
                    src="/stickman_assets/girl_idle.svg"
                    alt="Girl"
                    className="w-8 h-8 object-contain"
                  />
                  <div className="text-left">
                    <p className="text-xs font-black text-white leading-tight">Girl Avatar</p>
                    <p className="text-[8px] text-teal-300">Stick Heroine</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-teal-400 uppercase tracking-widest ml-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={`w-full bg-white/5 border-2 ${errors.name ? "border-red-500/60" : "border-white/10"} hover:border-teal-500/40 focus:border-teal-500 focus:outline-none text-white px-4 py-2.5 rounded-xl transition-all placeholder:text-white/20 font-bold text-sm`}
              />
              {errors.name && (
                <p className="text-red-400 text-[8px] font-bold uppercase tracking-widest ml-2">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Age & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[9px] font-black text-teal-400 uppercase tracking-widest ml-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className={`w-full bg-white/5 border-2 ${errors.age ? "border-red-500/60" : "border-white/10"} hover:border-teal-500/40 focus:border-teal-500 focus:outline-none text-white px-4 py-2.5 rounded-xl transition-all placeholder:text-white/20 font-bold text-sm`}
                />
                {errors.age && (
                  <p className="text-red-400 text-[8px] font-bold uppercase tracking-widest ml-2">
                    {errors.age}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-teal-400 uppercase tracking-widest ml-2">
                  Country
                </label>
                <input
                  type="text"
                  value="India"
                  disabled
                  className="w-full bg-white/5 border-2 border-white/10 text-white/40 px-4 py-2.5 rounded-xl font-bold text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Field of Study */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-teal-400 uppercase tracking-widest ml-2">
                Field of Study / Profession
              </label>
              <input
                type="text"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                placeholder="Student, Psychology, Medicine, Engineering, etc."
                className={`w-full bg-white/5 border-2 ${errors.field_of_study ? "border-red-500/60" : "border-white/10"} hover:border-teal-500/40 focus:border-teal-500 focus:outline-none text-white px-4 py-2.5 rounded-xl transition-all placeholder:text-white/20 font-bold text-sm`}
              />
              {errors.field_of_study && (
                <p className="text-red-400 text-[8px] font-bold uppercase tracking-widest ml-2">
                  {errors.field_of_study}
                </p>
              )}
            </div>

            {/* College / Institution */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-teal-400 uppercase tracking-widest ml-2">
                College / Institution
              </label>
              <div className="space-y-2">
                <select
                  name="college"
                  value={showOtherCollege ? "OTHER" : formData.college}
                  onChange={handleChange}
                  className={`w-full bg-slate-800 border-2 ${errors.college ? "border-red-500/60" : "border-white/10"} hover:border-teal-500/40 focus:border-teal-500 focus:outline-none text-white px-4 py-2.5 rounded-xl transition-all font-bold text-xs appearance-none cursor-pointer`}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1rem",
                  }}
                >
                  <option value="" disabled className="text-white/40">
                    Select your college / institution
                  </option>
                  {MAJOR_COLLEGES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                  <option value="OTHER" className="bg-slate-900 text-teal-400 font-bold">
                    + Other / Not Listed
                  </option>
                </select>

                {showOtherCollege && (
                  <div className="animate-slide-in-top">
                    <input
                      type="text"
                      name="otherCollege"
                      value={formData.otherCollege}
                      onChange={handleChange}
                      placeholder="Enter your institution's name"
                      className="w-full bg-white/5 border-2 border-teal-500/40 text-white px-4 py-2.5 rounded-xl transition-all placeholder:text-white/20 font-bold text-xs"
                    />
                  </div>
                )}
              </div>
              {errors.college && (
                <p className="text-red-400 text-[8px] font-bold uppercase tracking-widest ml-2">
                  {errors.college}
                </p>
              )}
            </div>

            {/* State */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-teal-400 uppercase tracking-widest ml-2">
                State / Territory
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full bg-slate-800 border-2 ${errors.state ? "border-red-500/60" : "border-white/10"} hover:border-teal-500/40 focus:border-teal-500 focus:outline-none text-white px-4 py-2.5 rounded-xl transition-all font-bold text-xs appearance-none cursor-pointer`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="" disabled className="text-white/40">
                  Select your state
                </option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-400 text-[8px] font-bold uppercase tracking-widest ml-2">
                  {errors.state}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="group relative w-full overflow-hidden bg-teal-500 hover:bg-teal-400 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl mt-4"
            >
              <span className="relative z-10">Save & Continue</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerRegistrationScreen;

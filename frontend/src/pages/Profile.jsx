import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  getMyProfile, 
  updateProfile,
  updateStats 
} from '../services/userProfileService';
import { 
  Edit, MapPin, Calendar, Award, DollarSign, Zap, 
  Cpu, Mail, CheckCircle, Phone, Globe, Upload,
  Facebook, Twitter, Instagram, Linkedin, Briefcase,
  ShieldCheck, Layout, Terminal, Code
} from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    bio: '',
    contactEmail: '',
    phoneNumber: '',
    whatsappNumber: '',
    taxId: '',
    gstNumber: '',
    businessRegistrationNumber: '',
    yearsOfExperience: 0,
    specialization: '',
    skills: '',
    secondarySkills: '',
    expertise: '',
    certifications: [],
    infrastructure: {
      tools: '',
      techStack: '',
      hardware: '',
      bandwidth: ''
    },
    website: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const data = await getMyProfile(token);
      setProfile(data);
      
      if (!data.isProfileComplete) {
        setIsEditing(true);
      }
      
      setFormData({
        businessName: data.businessName || '',
        location: data.location || '',
        bio: data.bio || '',
        contactEmail: data.contactEmail || '',
        phoneNumber: data.phoneNumber || '',
        whatsappNumber: data.whatsappNumber || '',
        taxId: data.taxId || '',
        gstNumber: data.gstNumber || '',
        businessRegistrationNumber: data.businessRegistrationNumber || '',
        yearsOfExperience: data.yearsOfExperience || 0,
        specialization: data.specialization || '',
        skills: data.skills?.join(', ') || '',
        secondarySkills: data.secondarySkills?.join(', ') || '',
        expertise: data.expertise?.join(', ') || '',
        certifications: data.certifications || [],
        infrastructure: data.infrastructure || {
          tools: '',
          techStack: '',
          hardware: '',
          bandwidth: ''
        },
        website: data.website || '',
        socialMedia: data.socialMedia || {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: ''
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const submissionData = {
        ...formData,
        skills: formData.skills.split(',').map(item => item.trim()).filter(item => item),
        secondarySkills: formData.secondarySkills.split(',').map(item => item.trim()).filter(item => item),
        expertise: formData.expertise.split(',').map(item => item.trim()).filter(item => item)
      };
      
      const updatedProfile = await updateProfile(submissionData, token);
      setProfile(updatedProfile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 p-4 text-slate-900 dark:text-white transition-colors duration-500">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
            
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-4 tracking-tighter uppercase italic">
              <Code className="w-10 h-10 text-indigo-600"/> 
              {profile?.isProfileComplete ? 'Edit Profile' : 'Setup Profile'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg">
              Define your professional identity on the BidBuddy platform.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 ml-1">Freelancer / Company Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 ring-indigo-500 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 ml-1">Current Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 ring-indigo-500 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 ml-1">Professional Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 ring-indigo-500 transition-all font-bold"
                  placeholder="Summarize your expertise..."
                />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-8 space-y-8">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Technical Infrastructure</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 ml-1">Primary Tech Stack</label>
                    <input
                      type="text"
                      value={formData.infrastructure.techStack}
                      onChange={(e) => handleNestedInputChange('infrastructure', 'techStack', e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 ring-indigo-500 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 ml-1">Hardware & Tools</label>
                    <input
                      type="text"
                      value={formData.infrastructure.tools}
                      onChange={(e) => handleNestedInputChange('infrastructure', 'tools', e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 ring-indigo-500 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase text-sm hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase text-sm shadow-xl shadow-indigo-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <div className="px-8 pb-8">
                <div className="-mt-16 flex justify-center">
                  <div className="w-32 h-32 rounded-3xl border-8 border-white dark:border-slate-900 bg-indigo-100 flex items-center justify-center text-5xl font-black text-indigo-600 shadow-xl">
                    {profile.businessName?.charAt(0) || 'B'}
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{profile.businessName}</h1>
                  <p className="text-indigo-600 dark:text-indigo-400 font-black uppercase text-xs tracking-widest mt-1">{profile.specialization || 'Strategic Partner'}</p>
                  <div className="flex items-center justify-center mt-4 text-slate-500 gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-tight">{profile.location || 'Distributed'}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-8 flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30"
                >
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>

                <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{profile.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{profile.yearsOfExperience || 0} Years Exp.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] pointer-events-none" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter italic">About</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {profile.bio || 'Crafting excellence in every project. Specialized in modular delivery and high-impact solutions.'}
              </p>
              
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'DELIVERED', val: '24', icon: CheckCircle, color: 'text-indigo-600' },
                  { label: 'RATING', val: '4.9', icon: Award, color: 'text-purple-600' },
                  { label: 'TRUSTED', val: '99%', icon: ShieldCheck, color: 'text-emerald-500' },
                  { label: 'VELOCITY', val: 'FAST', icon: Zap, color: 'text-amber-500' }
                ].map(stat => (
                  <div key={stat.label} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl text-center border border-slate-100 dark:border-slate-800">
                    <stat.icon className={`w-5 h-5 mx-auto mb-3 ${stat.color}`} />
                    <p className="text-2xl font-black tracking-tight">{stat.val}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tighter italic">Professional Assets</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Terminal className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Stack & Tools</h3>
                  </div>
                  <p className="text-slate-900 dark:text-white font-black text-lg">{profile.infrastructure?.techStack || 'Modern Stack'}</p>
                  <p className="text-slate-500 text-sm mt-2">{profile.infrastructure?.tools || 'Pro-grade tooling'}</p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Layout className="w-5 h-5 text-purple-600" />
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Core Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(profile.skills || ['Solution Arch', 'Cloud Native']).map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

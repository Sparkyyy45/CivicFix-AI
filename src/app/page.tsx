"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Complaint } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, AlertTriangle, Plus, Brain, Activity, Users, ArrowRight, Zap, CheckCircle2, TrendingUp, ShieldCheck, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const { user, loading } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchComplaints = async () => {
        setLoadingComplaints(true);
        try {
          const q = query(
            collection(db, "complaints"),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint))
            .sort((a, b) => b.createdAt - a.createdAt);
          setComplaints(data);
        } catch (error) {
          console.error("Error fetching complaints:", error);
        } finally {
          setLoadingComplaints(false);
        }
      };

      fetchComplaints();
    }
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  // ----------------------------------------------------------------------
  // UNAUTHENTICATED LANDING PAGE
  // ----------------------------------------------------------------------
  if (!user) {
    return (
      <div className="pb-20 overflow-x-hidden">
        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* HERO SECTION */}
        <div className="relative pt-16 pb-24 lg:pt-32 lg:pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:w-1/2 text-center lg:text-left"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-blue-100 backdrop-blur-md text-blue-700 text-sm font-bold mb-8 shadow-sm hover:bg-white/80 transition-colors cursor-default">
                  <span className="flex h-2.5 w-2.5 relative mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                  AI-Powered Civic Intelligence v2.0
                </div>

                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.95] mb-8 font-heading">
                  Fix Your City, <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 animate-gradient-x bg-300%">
                    In Seconds.
                  </span>
                </h1>

                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  Snap a photo, and our advanced AI analyzes, categorizes, and routes your report instantly. Civic maintenance for the modern age.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold text-white bg-slate-900 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 hover:shadow-blue-600/30 hover:-translate-y-1"
                  >
                    Start Reporting
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    Live Demo
                  </a>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-400 grayscale opacity-70">
                  {/* Trust indicators/Logos could go here */}
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                  </div>
                  <div className="text-sm font-medium">Trusted by 10,000+ citizens</div>
                </div>
              </motion.div>

              {/* Hero Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="lg:w-1/2 w-full relative perspective-2000"
              >
                <div className="relative w-full aspect-square max-w-[650px] mx-auto transform hover:scale-[1.02] transition-transform duration-700 ease-out">
                  {/* Abstract Background Shapes */}
                  <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-blue-200 to-indigo-100 rounded-[4rem] rotate-12 opacity-60 mix-blend-multiply blur-2xl animate-blob"></div>
                  <div className="absolute bottom-10 left-10 w-2/3 h-2/3 bg-gradient-to-tr from-teal-200 to-emerald-100 rounded-[5rem] -rotate-6 opacity-60 mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>

                  {/* Main Glass Card */}
                  <div className="glass-dark rounded-[2.5rem] p-8 absolute top-[10%] left-[5%] right-[5%] bottom-[10%] z-20 shadow-2xl border border-white/40 backdrop-blur-xl flex flex-col">
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                          <Brain size={24} />
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg tracking-tight">AI Diagnostic Engine</div>
                          <div className="text-blue-200 text-sm flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            System Active • Live Processing
                          </div>
                        </div>
                      </div>
                      <div className="glass px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20">
                        v2.4.0
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      {/* Analysis Item */}
                      <div className="flex gap-5 items-start">
                        <div className="w-28 h-28 rounded-2xl bg-slate-800 relative overflow-hidden shadow-lg border border-white/10 shrink-0 group">
                          <Image src="/hero-image.png" alt="Issue" fill className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="h-2 bg-blue-500/50 rounded-full w-20"></div>
                            <span className="text-xs font-mono text-blue-300">ID: #8X92</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-slate-700/50 rounded-full w-full"></div>
                            <div className="h-3 bg-slate-700/50 rounded-full w-2/3"></div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[10px] font-bold border border-orange-500/20">POTHOLE DETECTED</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/20">98% CONFIDENCE</span>
                          </div>
                        </div>
                      </div>

                      {/* Routing Visual */}
                      <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <Zap size={20} />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">Automated Routing</h4>
                            <p className="text-slate-400 text-xs mt-0.5">Dispatched to <span className="text-white font-semibold">Public Works Dept</span></p>
                          </div>
                          <CheckCircle2 className="ml-auto text-green-400" size={20} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Stats Card 1 */}
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, -2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 top-24 z-30 glass p-5 rounded-2xl shadow-xl shadow-blue-900/10 border border-white/40 w-52 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Threat Level</div>
                        <div className="font-bold text-slate-900">High Severity</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>

                  {/* Floating Stats Card 2 */}
                  <motion.div
                    animate={{ y: [0, 25, 0], rotate: [0, 3, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-12 bottom-32 z-30 glass p-5 rounded-2xl shadow-xl shadow-indigo-900/10 border border-white/40 w-60 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-black text-xl shadow-sm border border-teal-100">
                        98%
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Completion Rate</div>
                        <div className="text-xs text-slate-500 font-medium">Top performing city</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div id="features" className="py-32 relative bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24 max-w-3xl mx-auto">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Technology</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading">Smart City Management</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                We leverage cutting-edge computer vision and geolocation technology to transform how citizens interact with their local government.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Brain, title: "AI Diagnostics", desc: "Our neural networks identify pothole depth, debris type, and infrastructure damage with 99% accuracy.", color: "text-violet-600", bg: "bg-violet-100", border: "hover:border-violet-200" },
                { icon: Activity, title: "Real-time Tracking", desc: "Watch your report move through the municipal pipeline with live status updates and notifications.", color: "text-blue-600", bg: "bg-blue-100", border: "hover:border-blue-200" },
                { icon: ShieldCheck, title: "Verified Solutions", desc: "Admins must provide photographic proof of repairs, verified by AI before ticket closure.", color: "text-teal-600", bg: "bg-teal-100", border: "hover:border-teal-200" }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ y: -10 }}
                  className={`bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 border border-slate-100 ${feature.border} group`}
                >
                  <div className={`w-20 h-20 ${feature.bg} rounded-3xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform duration-300`}>
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 mt-20">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-center text-white shadow-2xl relative overflow-hidden group">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,107,158,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer opacity-20"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] group-hover:bg-blue-500/50 transition-colors duration-1000"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] group-hover:bg-purple-500/50 transition-colors duration-1000"></div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black mb-8 font-heading tracking-tight">Ready to upgrade your city?</h2>
              <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto font-medium">Join thousands of citizens making a difference today. It's free, fast, and impactful.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login" className="bg-white text-slate-900 px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:scale-105 active:scale-95">
                  Get Started Now
                </Link>
                <Link href="/about" className="bg-slate-800 text-white border border-slate-700 px-12 py-5 rounded-full font-bold text-lg hover:bg-slate-700 transition-all hover:scale-105 active:scale-95">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // AUTHENTICATED DASHBOARD (Glassmorphic)
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl text-white group"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-3xl opacity-40 -mr-20 -mt-20 group-hover:opacity-60 transition-opacity duration-1000"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-200">Citizen Dashboard</span>
            </div>
            <h1 className="text-5xl font-black mb-4 font-heading tracking-tight">Hello, Citizen!</h1>
            <p className="text-slate-300 text-lg max-w-lg mb-2">Your contributions are building a better community. You have <span className="text-white font-bold">{complaints.length} active reports</span>.</p>
          </div>

          <Link
            href="/submit"
            className="inline-flex items-center px-8 py-5 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 group/btn"
          >
            <div className="bg-blue-600 text-white p-2 rounded-lg mr-3 group-hover/btn:rotate-90 transition-transform duration-500">
              <Plus className="w-5 h-5" />
            </div>
            Report New Issue
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Reports", count: complaints.length, color: "text-blue-600", bg: "bg-blue-50", icon: Activity, sub: "Lifetime contributions" },
          { label: "Pending", count: complaints.filter(c => c.status === 'Pending').length, color: "text-orange-500", bg: "bg-orange-50", icon: Clock, sub: "Awaiting action" },
          { label: "Resolved", count: complaints.filter(c => c.status === 'Resolved').length, color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2, sub: "Successfully fixed" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                {/* @ts-ignore */}
                <stat.icon className="w-6 h-6" />
              </div>
              {i === 2 && <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-md">Top 10%</div>}
            </div>
            <div className={`text-5xl font-black ${stat.color} mb-2 tracking-tight`}>{stat.count}</div>
            <div className="text-slate-800 font-bold mb-1 text-lg">{stat.label}</div>
            <div className="text-slate-400 text-sm font-medium">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
          </div>
          <Link href="/history" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:gap-2 transition-all">
            View All History <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingComplaints ? (
          <div className="p-24 text-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-6" />
            <p className="text-slate-500 font-medium text-lg">Syncing with database...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-24 text-center bg-slate-50/30">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-6 shadow-md shadow-slate-200 transform rotate-3">
              <TrendingUp className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No activity yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">Be the first to spot an issue in your neighborhood and earn community points.</p>
            <Link href="/submit" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline text-lg">
              Create your first report
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.map((complaint, i) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/complaint/${complaint.id}`} className="block p-6 hover:bg-slate-50 transition-colors group relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all border border-slate-100">
                        <Image
                          src={complaint.imageUrl}
                          alt="Issue"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {complaint.department}
                          </span>
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{complaint.category}</h3>
                        <p className="text-sm text-slate-500 flex items-center line-clamp-1 max-w-md font-medium">
                          {complaint.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 pr-4">
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={complaint.status} />
                        <StatusBadge urgency={complaint.urgency} />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  )
}

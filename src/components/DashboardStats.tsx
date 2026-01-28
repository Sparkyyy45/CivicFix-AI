import { motion } from 'framer-motion';
import { Users, AlertCircle, CheckCircle, Activity } from 'lucide-react';

interface StatsProps {
    totalUpvotes: number;
    pendingCount: number;
    resolvedCount: number;
}

export default function DashboardStats({ totalUpvotes, pendingCount, resolvedCount }: StatsProps) {
    const stats = [
        {
            label: "Community Impact",
            value: totalUpvotes,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
            sub: "Total Upvotes"
        },
        {
            label: "Pending Action",
            value: pendingCount,
            icon: AlertCircle,
            color: "text-orange-600",
            bg: "bg-orange-100",
            sub: "Open Reports"
        },
        {
            label: "Resolved",
            value: resolvedCount,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-100",
            sub: "Issues Fixed"
        },
        {
            label: "Sys Health",
            value: "98%",
            icon: Activity,
            color: "text-indigo-600",
            bg: "bg-indigo-100",
            sub: "Operational"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/70 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <span className={`text-2xl font-bold font-heading ${stat.color}`}>
                            {stat.value}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-bold text-sm">{stat.label}</h3>
                        <p className="text-slate-500 text-xs">{stat.sub}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

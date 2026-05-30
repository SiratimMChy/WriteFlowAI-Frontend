"use client"

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieLabelRenderProps } from "recharts"
import { Users, FileText, Activity, DollarSign } from "lucide-react"

export function AdminAnalytics({
  overview,
  dailyAIUsage,
  userSignups,
  contentTypeBreakdown
}: {
  overview: { totalUsers: number, totalDocuments: number, aiCallsToday: number, monthlyRevenue: number }
  dailyAIUsage: any[]
  userSignups: any[]
  contentTypeBreakdown: any[]
}) {
  const COLORS = ["#8b5cf6", "#3b82f6", "#ec4899", "#10b981", "#f59e0b"]

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium text-sm">Total Users</h3>
          </div>
          <div className="text-3xl font-bold">{overview.totalUsers.toLocaleString()}</div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <FileText className="w-5 h-5 text-violet-400" />
            <h3 className="font-medium text-sm">Total Documents</h3>
          </div>
          <div className="text-3xl font-bold">{overview.totalDocuments.toLocaleString()}</div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-medium text-sm">AI Calls Today</h3>
          </div>
          <div className="text-3xl font-bold">{overview.aiCallsToday.toLocaleString()}</div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <h3 className="font-medium text-sm">Monthly Revenue</h3>
          </div>
          <div className="text-3xl font-bold">${overview.monthlyRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily AI Usage */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Daily AI Usage</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyAIUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "#ffffff10", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="calls" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Signups */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">User Signups</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userSignups}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "#ffffff10", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="signups" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Type Breakdown */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6">Content Type Breakdown</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: PieLabelRenderProps) => `${name ?? ''} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {contentTypeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", borderColor: "#ffffff10", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

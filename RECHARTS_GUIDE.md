# Recharts Usage Guide for WriteFlow AI

## What is Recharts?

Recharts is a composable charting library built on React components. It's used in WriteFlow AI to display analytics and data visualizations in the admin dashboard.

**Official Documentation:** https://recharts.org/

---

## Where Recharts is Used

### Location: Admin Analytics Dashboard
- **Page:** `/dashboard/admin/analytics`
- **Component:** `src/components/admin-analytics.tsx`
- **Route:** `src/app/dashboard/admin/analytics/page.tsx`

**Access:** Only available to users with `admin` role

---

## Charts Implemented

### 1. **Bar Chart** - Daily AI Usage
Shows the number of AI calls made each day over the last 7 days.

**Features:**
- Purple bars (`#8b5cf6`)
- Rounded corners
- Grid lines
- Hover tooltips
- Y-axis shows call count
- X-axis shows day of week

**Data Structure:**
```typescript
[
  { date: "Mon", calls: 250 },
  { date: "Tue", calls: 300 },
  { date: "Wed", calls: 350 },
  // ...
]
```

### 2. **Line Chart** - User Signups
Displays user registration trends over the last 7 days.

**Features:**
- Blue line (`#3b82f6`)
- Smooth curve (monotone)
- Active dot on hover
- No dots on line (cleaner look)
- Grid lines

**Data Structure:**
```typescript
[
  { date: "Mon", signups: 15 },
  { date: "Tue", signups: 20 },
  { date: "Wed", signups: 25 },
  // ...
]
```

### 3. **Pie Chart** - Content Type Breakdown
Shows distribution of document types created by users.

**Features:**
- Donut chart (inner radius)
- 5 color palette
- Percentage labels
- Legend at bottom
- Padding between slices

**Data Structure:**
```typescript
[
  { name: "Blog Post", value: 400 },
  { name: "Email", value: 300 },
  { name: "Social Media", value: 300 },
  { name: "Ad Copy", value: 200 }
]
```

---

## Code Breakdown

### Imports
```typescript
import { 
  BarChart, Bar,           // Bar chart components
  LineChart, Line,         // Line chart components
  PieChart, Pie, Cell,     // Pie chart components
  XAxis, YAxis,            // Axis components
  CartesianGrid,           // Grid lines
  Tooltip,                 // Hover tooltips
  ResponsiveContainer,     // Responsive wrapper
  Legend,                  // Chart legend
  PieLabelRenderProps      // Type for pie labels
} from "recharts"
```

### Color Palette
```typescript
const COLORS = [
  "#8b5cf6",  // Purple
  "#3b82f6",  // Blue
  "#ec4899",  // Pink
  "#10b981",  // Green
  "#f59e0b"   // Orange
]
```

### Responsive Container
All charts are wrapped in `ResponsiveContainer` for automatic sizing:
```typescript
<ResponsiveContainer width="100%" height="100%">
  {/* Chart components */}
</ResponsiveContainer>
```

---

## Customization Examples

### Change Bar Chart Color
```typescript
<Bar 
  dataKey="calls" 
  fill="#3b82f6"  // Change to blue
  radius={[8, 8, 0, 0]}  // Increase border radius
/>
```

### Add Multiple Lines
```typescript
<LineChart data={data}>
  <Line type="monotone" dataKey="signups" stroke="#3b82f6" />
  <Line type="monotone" dataKey="conversions" stroke="#10b981" />
</LineChart>
```

### Change Pie Chart to Full Circle
```typescript
<Pie
  data={data}
  cx="50%"
  cy="50%"
  innerRadius={0}  // Remove donut hole
  outerRadius={120}
  dataKey="value"
/>
```

### Custom Tooltip
```typescript
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
        <p className="text-white">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

// Use it:
<Tooltip content={<CustomTooltip />} />
```

---

## Adding New Charts

### Example: Area Chart for Revenue

1. **Import components:**
```typescript
import { AreaChart, Area } from "recharts"
```

2. **Prepare data:**
```typescript
const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 5000 },
  { month: "Mar", revenue: 6000 },
]
```

3. **Add chart:**
```typescript
<div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
  <h3 className="text-lg font-bold mb-6">Monthly Revenue</h3>
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis dataKey="month" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "#0a0a0a", 
            borderColor: "#ffffff10" 
          }}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          fill="#10b98120" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>
```

---

## Common Chart Types

### 1. Bar Chart
**Use for:** Comparing discrete categories or time periods
```typescript
<BarChart data={data}>
  <Bar dataKey="value" fill="#8b5cf6" />
</BarChart>
```

### 2. Line Chart
**Use for:** Showing trends over time
```typescript
<LineChart data={data}>
  <Line type="monotone" dataKey="value" stroke="#3b82f6" />
</LineChart>
```

### 3. Area Chart
**Use for:** Showing cumulative values over time
```typescript
<AreaChart data={data}>
  <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b98120" />
</AreaChart>
```

### 4. Pie Chart
**Use for:** Showing proportions of a whole
```typescript
<PieChart>
  <Pie data={data} dataKey="value" />
</PieChart>
```

### 5. Composed Chart
**Use for:** Combining multiple chart types
```typescript
<ComposedChart data={data}>
  <Bar dataKey="value1" fill="#8b5cf6" />
  <Line type="monotone" dataKey="value2" stroke="#3b82f6" />
</ComposedChart>
```

---

## Styling Tips

### Dark Theme (Current)
```typescript
// Grid
<CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />

// Axes
<XAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
<YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />

// Tooltip
<Tooltip 
  contentStyle={{ 
    backgroundColor: "#0a0a0a", 
    borderColor: "#ffffff10", 
    borderRadius: "8px" 
  }}
  itemStyle={{ color: "#fff" }}
/>
```

### Light Theme
```typescript
// Grid
<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

// Axes
<XAxis stroke="#6b7280" />
<YAxis stroke="#6b7280" />

// Tooltip
<Tooltip 
  contentStyle={{ 
    backgroundColor: "#ffffff", 
    borderColor: "#e5e7eb" 
  }}
/>
```

---

## Data Fetching

### Current Implementation
The analytics page fetches real data from Prisma:

```typescript
// Real data
const totalUsers = await prisma.user.count()
const totalDocuments = await prisma.document.count()

// Document types (real)
const types = await prisma.document.groupBy({
  by: ['type'],
  _count: true
})

// Mock data (for demo)
const dailyAIUsage = dates.map((date, i) => ({
  date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
  calls: Math.floor(Math.random() * 500) + 200
}))
```

### Implementing Real Time-Series Data

To get real daily AI usage:

```typescript
// Get AI logs grouped by date
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

const aiLogs = await prisma.aILog.groupBy({
  by: ['createdAt'],
  _count: true,
  where: {
    createdAt: { gte: sevenDaysAgo }
  }
})

// Format for chart
const dailyAIUsage = aiLogs.map(log => ({
  date: new Date(log.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
  calls: log._count
}))
```

---

## Performance Tips

### 1. Limit Data Points
```typescript
// Don't render 10,000 points
const limitedData = data.slice(-100) // Last 100 points
```

### 2. Use ResponsiveContainer
```typescript
// Always wrap charts
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={data}>
    {/* ... */}
  </BarChart>
</ResponsiveContainer>
```

### 3. Disable Animations for Large Datasets
```typescript
<Bar dataKey="value" fill="#8b5cf6" isAnimationActive={false} />
```

### 4. Memoize Chart Data
```typescript
const chartData = useMemo(() => {
  return processData(rawData)
}, [rawData])
```

---

## Accessibility

### Add Labels
```typescript
<BarChart data={data} accessibilityLayer>
  <Bar dataKey="value" fill="#8b5cf6" />
</BarChart>
```

### Provide Alt Text
```typescript
<div role="img" aria-label="Bar chart showing daily AI usage">
  <ResponsiveContainer>
    <BarChart data={data}>
      {/* ... */}
    </BarChart>
  </ResponsiveContainer>
</div>
```

---

## Common Issues & Solutions

### Issue: Chart Not Showing
**Solution:** Ensure parent has defined height
```typescript
// ❌ Bad - no height
<div>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} />
  </ResponsiveContainer>
</div>

// ✅ Good - defined height
<div className="h-[300px]">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} />
  </ResponsiveContainer>
</div>
```

### Issue: Tooltip Not Styled
**Solution:** Add contentStyle prop
```typescript
<Tooltip 
  contentStyle={{ 
    backgroundColor: "#0a0a0a", 
    borderColor: "#ffffff10" 
  }}
/>
```

### Issue: Labels Overlapping
**Solution:** Rotate or hide labels
```typescript
<XAxis 
  dataKey="date" 
  angle={-45} 
  textAnchor="end" 
  height={80}
/>
```

---

## Resources

- **Official Docs:** https://recharts.org/
- **Examples:** https://recharts.org/en-US/examples
- **API Reference:** https://recharts.org/en-US/api
- **GitHub:** https://github.com/recharts/recharts

---

## Quick Reference

| Chart Type | Best For | Component |
|------------|----------|-----------|
| Bar | Comparisons | `<BarChart>` |
| Line | Trends | `<LineChart>` |
| Area | Cumulative | `<AreaChart>` |
| Pie | Proportions | `<PieChart>` |
| Scatter | Correlations | `<ScatterChart>` |
| Radar | Multi-variable | `<RadarChart>` |
| Composed | Multiple types | `<ComposedChart>` |

---

## Your Current Setup ✅

- ✅ Recharts installed (`recharts@^3.8.1`)
- ✅ 3 charts implemented (Bar, Line, Pie)
- ✅ Dark theme styling
- ✅ Responsive design
- ✅ Admin analytics dashboard
- ✅ Real + mock data integration

**View it:** Login as admin → `/dashboard/admin/analytics`

**Demo Admin:**
- Email: `admin@writeflow.com`
- Password: `admin123`

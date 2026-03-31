import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function RiskChart({ data }) {
  if (!data || data.length === 0) return <p className="text-gray-500">No data</p>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="risk" stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ClaimsChart({ data }) {
  if (!data || data.length === 0) return <p className="text-gray-500">No data</p>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="claims" fill="#ec4899" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PieChartComponent({ data, colors = ['#2563eb', '#ec4899', '#10b981', '#f59e0b'] }) {
  if (!data || data.length === 0) return <p className="text-gray-500">No data</p>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

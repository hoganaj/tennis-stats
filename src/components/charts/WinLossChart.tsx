import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { MatchResult } from '../../types';

interface WinLossChartProps {
  matches: MatchResult[];
}

export const WinLossChart: React.FC<WinLossChartProps> = ({ matches }) => {
  const wins = matches.filter(match => match.isWin).length;
  const losses = matches.filter(match => !match.isWin).length;
  
  const data = [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses },
  ];
  
  const COLORS = ['#0088FE', '#FF8042'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} matches`, '']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
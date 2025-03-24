import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Player } from '../../types';

interface SurfaceComparisonChartProps {
  player: Player;
}

export const SurfaceComparisonChart: React.FC<SurfaceComparisonChartProps> = ({ player }) => {
  const { surfaceStats } = player;
  
  if (!surfaceStats) {
    return <div>No surface data available</div>;
  }
  
  const data = [
    {
      name: 'Hard',
      Wins: surfaceStats.hard.wins,
      Losses: surfaceStats.hard.losses,
    },
    {
      name: 'Clay',
      Wins: surfaceStats.clay.wins,
      Losses: surfaceStats.clay.losses,
    },
    {
      name: 'Grass',
      Wins: surfaceStats.grass.wins,
      Losses: surfaceStats.grass.losses,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="Wins" fill="#8884d8" />
        <Bar yAxisId="left" dataKey="Losses" fill="#FF8042" />
      </BarChart>
    </ResponsiveContainer>
  );
};
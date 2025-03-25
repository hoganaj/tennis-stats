import React, { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';
import { Box, Text, Select, Flex, Portal, createListCollection } from '@chakra-ui/react';
import { Player } from '../../types';

interface PlayerAttributeChartProps {
  player: Player;
  topPlayers: Player[];
}

// Generate random attribute values for demo purposes
const generateRandomAttributes = (playerId: string) => {
  // Use playerId to ensure consistent random values for the same player
  const seed = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Prime numbers to create more varied patterns
  const primes = [11, 13, 17, 19, 23, 29];
  
  const randomValue = (index: number) => {
    const prime = primes[index % primes.length];
    const position = playerId.charCodeAt(index % playerId.length) || 67;
    // Create a mixed value between 60-95
    let val = 60 + (((seed + prime + position) * (index + 1)) % 36);
    // Ensure we don't get values that are all the same
    val = val + (index * 2) % 7;
    
    return Math.round(val);
  };
  
  return [
    { attribute: 'Serve', value: randomValue(0), fullMark: 100 },
    { attribute: 'Return', value: randomValue(1), fullMark: 100 },
    { attribute: 'Forehand', value: randomValue(2), fullMark: 100 },
    { attribute: 'Backhand', value: randomValue(3), fullMark: 100 },
    { attribute: 'Net Game', value: randomValue(4), fullMark: 100 },
    { attribute: 'Movement', value: randomValue(5), fullMark: 100 },
  ];
};

export const PlayerAttributeChart: React.FC<PlayerAttributeChartProps> = ({ player, topPlayers }) => {
  const [comparisonPlayerId, setComparisonPlayerId] = useState<string[]>([]);
  
  // Filter out the current player from the comparison options
  const availablePlayers = topPlayers.filter(p => p.id !== player.id);

  const playerCollection = createListCollection({
    items: availablePlayers.map(player => ({
      label: player.name,
      value: player.id,
    })),
  });
  
  // Get the comparison player if one is selected
  const comparisonPlayer = comparisonPlayerId.length > 0 
    ? topPlayers.find(p => p.id === comparisonPlayerId[0]) 
    : null;
  
  // Generate attribute data for the main player
  const mainPlayerData = generateRandomAttributes(player.id);
  
  // If there's a comparison player, combine the data for the chart
  const chartData = mainPlayerData.map(item => {
    if (comparisonPlayer) {
      const comparisonData = generateRandomAttributes(comparisonPlayer.id);
      const matchingItem = comparisonData.find(i => i.attribute === item.attribute);
      
      return {
        attribute: item.attribute,
        [player.name]: item.value,
        [comparisonPlayer.name]: matchingItem?.value || 0,
        fullMark: 100
      };
    }
    
    return {
      attribute: item.attribute,
      [player.name]: item.value,
      fullMark: 100
    };
  });
  
  const handleComparisonChange = (e: {value: string[]}) => {
    setComparisonPlayerId(e.value);
  };
  
  const playerColor = "#8884d8";
  const comparisonColor = "#82ca9d";
  
  return (
    <Box>
      <Box mb={6}>
        <Flex justify="center">
          <Box maxWidth="300px" width="100%" >
            <Select.Root
              collection={playerCollection}
              value={comparisonPlayerId || ""} 
              onValueChange={handleComparisonChange}
            >
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select player to compare" /> 
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.ClearTrigger />
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {playerCollection.items.map((player) => (
                      <Select.Item item={player} key={player.value}>
                        {player.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>
        </Flex>
      </Box>
      
      <Flex justify="center">
        <Text fontSize="sm" mb={4} color="gray.500" textAlign="center">
          Attribute ratings are generated randomly for demonstration purposes.
        </Text>
      </Flex>
      
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="attribute" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          
          <Radar
            name={player.name}
            dataKey={player.name}
            stroke={playerColor}
            fill={playerColor}
            fillOpacity={0.6}
          />
          
          {comparisonPlayer && (
            <Radar
              name={comparisonPlayer.name}
              dataKey={comparisonPlayer.name}
              stroke={comparisonColor}
              fill={comparisonColor}
              fillOpacity={0.6}
            />
          )}
          
          <Tooltip formatter={(value) => [`${value}/100`, 'Rating']} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};
import React from 'react';
import { Box, Heading, SimpleGrid, Tabs } from '@chakra-ui/react';
import { Player, MatchResult } from '../../types';
import { WinLossChart } from '../charts/WinLossChart';
import { SurfaceComparisonChart } from '../charts/SurfaceComparisonChart';
import { PlayerStats } from './PlayerStats';

interface PlayerAnalyticsProps {
  player: Player;
  matches: MatchResult[];
}

export const PlayerAnalytics: React.FC<PlayerAnalyticsProps> = ({ player, matches }) => {
  return (
    <Box p={4}>
      <PlayerStats player={player} recentMatches={matches} />
      
      <Tabs.Root mt={6} defaultValue="overview" colorScheme="blue" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="overview">Performance Overview</Tabs.Trigger>
          <Tabs.Trigger value="history">Match History</Tabs.Trigger>
          <Tabs.Trigger value="surface">Surface Analysis</Tabs.Trigger>
          <Tabs.Trigger value="serve/return">Serve & Return</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Win/Loss Distribution</Heading>
            <WinLossChart matches={matches} />
          </Box>
        </Tabs.Content>
        
        <Tabs.Content value="history">
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Match Timeline</Heading>
            {/* Match history */}
          </Box>
        </Tabs.Content>
        
        <Tabs.Content value="surface">
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Performance by Surface</Heading>
            <SurfaceComparisonChart player={player} />
          </Box>
        </Tabs.Content>
        
        <Tabs.Content value="serve/return">
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>First Serve Performance</Heading>
              {/* Chart for first serve percentage, points won, etc. */}
            </Box>
            
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
              <Heading size="md" mb={4}>Return Game</Heading>
              {/* Chart for return points won, break points converted, etc. */}
            </Box>
          </SimpleGrid>
        </Tabs.Content>
        
      </Tabs.Root>
    </Box>
  );
};
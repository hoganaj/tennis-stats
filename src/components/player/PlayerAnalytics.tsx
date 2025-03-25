import React, { useEffect, useState } from 'react';
import { Box, Center, Heading, Spinner, Tabs } from '@chakra-ui/react';
import { Player, MatchResult } from '../../types';
import { WinLossChart } from '../charts/WinLossChart';
import { SurfaceComparisonChart } from '../charts/SurfaceComparisonChart';
import { PlayerStats } from './PlayerStats';
import { PlayerAttributeChart } from '../charts/PlayerAttributeChart';
import { getTopPlayers } from '../../services/tennisDataService';

interface PlayerAnalyticsProps {
  player: Player;
  matches: MatchResult[];
}

export const PlayerAnalytics: React.FC<PlayerAnalyticsProps> = ({ player, matches }) => {
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  
  // Fetch top players for comparison
  useEffect(() => {
    const loadTopPlayers = async () => {
      try {
        const players = await getTopPlayers(10);
        setTopPlayers(players);
      } catch (error) {
        console.error('Error loading top players for comparison:', error);
      }
    };
    
    loadTopPlayers();
  }, []);
  return (
    <Box p={4}>
      <PlayerStats player={player} recentMatches={matches} />
      
      <Tabs.Root mt={6} defaultValue="overview" colorScheme="blue" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="overview">Performance Overview</Tabs.Trigger>
          <Tabs.Trigger value="attributes">Player Attributes</Tabs.Trigger>
          <Tabs.Trigger value="surface">Surface Analysis</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Win/Loss Distribution</Heading>
            <WinLossChart matches={matches} />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="attributes">
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Player Style Analysis</Heading>
            {topPlayers.length === 0 ? (
              <Center py={10}>
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : (
              <PlayerAttributeChart player={player} topPlayers={topPlayers} />
            )}
          </Box>
        </Tabs.Content>
        
        <Tabs.Content value="surface">
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Performance by Surface</Heading>
            <SurfaceComparisonChart player={player} />
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
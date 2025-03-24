import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatHelpText } from '@chakra-ui/react';
import { Player, MatchResult } from '../../types';

interface PlayerStatsProps {
  player: Player;
  recentMatches: MatchResult[];
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player, recentMatches }) => {
 
  const winPercentage = (player.stats.wins / (player.stats.wins + player.stats.losses) * 100).toFixed(1);
  
  const recentForm = recentMatches.slice(0, 5).reduce((acc, match) => {
    return acc + (match.isWin ? 'W' : 'L');
  }, '');
  
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
      <Heading size="lg" mb={4}>2024 Statistics</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10} mb={6}>
        <Stat.Root>
          <Stat.Label>Current Ranking</Stat.Label>
          <Stat.ValueText>#{player.ranking}</Stat.ValueText>
          <Stat.HelpText>
            {player.rankingChange > 0 ? (
              <>
                <Stat.UpIndicator/>
                {player.rankingChange}
              </>
            ) : player.rankingChange < 0 ? (
              <>
                <Stat.DownIndicator/>
                {Math.abs(player.rankingChange)}
              </>
            ) : (
              'No change'
            )}
          </Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root>
          <Stat.Label>Win/Loss Record</Stat.Label>
          <Stat.ValueText>{player.stats.wins}-{player.stats.losses}</Stat.ValueText>
          <StatHelpText>{winPercentage}% win rate</StatHelpText>
        </Stat.Root>
        
        <Stat.Root>
          <Stat.Label>Titles</Stat.Label>
          <Stat.ValueText>{player.stats.titles}</Stat.ValueText>
          <Stat.HelpText>
            Grand Slams: {player.stats.grandSlams || 0}
          </Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>
      
      <Heading size="md" mb={4}>Recent Form: {recentForm}</Heading>
    </Box>
  );
};
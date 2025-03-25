import React from 'react';
import { Box, Heading, Flex, Text, VStack, Span } from '@chakra-ui/react';
import { Player, MatchResult } from '../../types';

interface PlayerStatsProps {
  player: Player;
  recentMatches: MatchResult[];
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player, recentMatches }) => {
  const winPercentage = (player.stats.wins / (player.stats.wins + player.stats.losses) * 100).toFixed(1);
  
  const recentForm = recentMatches.slice(0, 5).map(match => match.isWin ? 'W' : 'L');
  
  const ResultIndicator = ({ result }: { result: string }) => (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width="28px"
      height="28px"
      borderRadius="md"
      bg={result === 'W' ? 'green.500' : 'red.500'}
      color="white"
      fontWeight="bold"
      fontSize="sm"
      mx={0.5}
    >
      {result}
    </Box>
  );

  const StatItem = ({ label, value, helpText }: { label: string; value: React.ReactNode; helpText: React.ReactNode }) => (
    <VStack gap={1} w="100%" align="center">
      <Text fontSize="sm" fontWeight="medium" color="gray.500">
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        {value}
      </Text>
      <Box fontSize="sm" color="gray.500" textAlign="center">
        {helpText}
      </Box>
    </VStack>
  );
  
  const renderRankingChange = () => {
    if (player.rankingChange > 0) {
      return <Span color="green.500">{player.rankingChange}</Span>;
    } else if (player.rankingChange < 0) {
      return <Span color="red.500">{Math.abs(player.rankingChange)}</Span>;
    } else {
      return 'No change';
    }
  };
  
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
      <Heading size="lg" mb={6} textAlign="center">
        2024 Statistics
      </Heading>
      
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'center', md: 'flex-start' }}
        gap={{ base: 8, md: 4 }}
        mb={6}
      >
        <StatItem 
          label="Current Ranking" 
          value={`#${player.ranking}`}
          helpText={renderRankingChange()}
        />
        <StatItem 
          label="Win/Loss Record" 
          value={`${player.stats.wins}-${player.stats.losses}`}
          helpText={`${winPercentage}% win rate`}
        />
        <StatItem 
          label="Titles" 
          value={player.stats.titles}
          helpText={`Grand Slams: ${player.stats.grandSlams || 0}`}
        />
      </Flex>
      
      <Heading size="md" mb={4} textAlign="center">
        Recent Form: 
        <Flex 
          display="inline-flex" 
          alignItems="center" 
          justifyContent="center" 
          ml={2}
        >
          {recentForm.map((result, index) => (
            <ResultIndicator key={index} result={result} />
          ))}
        </Flex>
      </Heading>
    </Box>
  );
};
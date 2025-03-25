import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Heading, Spinner, Flex, Text, Image, VStack, HStack, Center } from '@chakra-ui/react';
import { getPlayerById, getPlayerMatches } from '../services/tennisDataService';
import { Player, MatchResult } from '../types';
import { PlayerAnalytics } from '../components/player/PlayerAnalytics';
import { getFlagUrlFromIocCode } from '../utils/countryUtils';

const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlayerData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const playerData = await getPlayerById(id);
        if (playerData) {
          setPlayer(playerData);
          const matchesData = await getPlayerMatches(id);
          setMatches(matchesData);
        }
      } catch (error) {
        console.error('Error loading player data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayerData();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxW="container.xl">
        <Flex direction="column" align="center" justify="center" minH="60vh">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading player data...</Text>
        </Flex>
      </Container>
    );
  }

  if (!player) {
    return (
      <Container maxW="container.xl">
        <Box textAlign="center" py={10}>
          <Heading as="h2" size="xl">Player Not Found</Heading>
          <Text mt={4}>The requested player could not be found.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl">
      <Box py={6}>
        <Flex direction={{ base: "column", md: "row" }} align="center" mb={8} gap={6}>
        <Center w={{ base: "full", md: "auto" }} minW={{ md: "200px" }}>
            <Image
              src={player.headImageUrl}
              alt={player.name}
              borderRadius="full"
              boxSize={{ base: "180px", sm: "200px" }}
              objectFit="cover"
              boxShadow="lg"
            />
          </Center>
          <VStack align={{ base: "center", md: "flex-start" }} gap={3} flex="1">
            <Heading as="h1" size="2xl">{player.name}</Heading>
            {player.country && (
              <HStack>
                <Text fontSize="lg" fontWeight="medium">Country:</Text>
                <HStack gap={1}>
                  <Image 
                      src={getFlagUrlFromIocCode(player.country)}
                      alt={`${player.country} flag`}
                      height="auto"
                      objectFit="contain"
                      borderRadius="sm"
                      border="1px solid"
                      borderColor="gray.200"
                    />
                  <Text fontSize="lg">{player.country}</Text>
                </HStack>
              </HStack>
            )}
          </VStack>
        </Flex>
        <PlayerAnalytics player={player} matches={matches} />
      </Box>
    </Container>
  );
};

export default PlayerDetailPage;
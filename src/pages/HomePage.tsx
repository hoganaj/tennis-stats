import { useState, useEffect } from 'react';
import { Container, Heading, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import { useNavigate } from 'react-router-dom';
import { getTopPlayers } from '../services/tennisDataService';
import { Player } from '../types';
import PlayerCarousel from '../components/player/PlayerCarousel';

const HomePage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setIsLoading(true);
        const data = await getTopPlayers(10);
        setPlayers(data);
      } catch (error) {
        console.error('Error loading players:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const handlePlayerClick = (playerId: string) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <Container maxW="container.xl">
      {isLoading ? (
        <Flex direction="column" align="center" justify="center" minH="60vh">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading players...</Text>
        </Flex>
      ) : (
        <Box>
          <Flex direction="column" align="center" mb={8}>
            <Heading as="h1" size="xl" mb={2} color={headingColor}>
              ATP Player Stats
            </Heading>
            <Text fontSize="lg" textAlign="center" maxW="800px">
              Browse through the top men's tennis players and click on a player to see their detailed statistics.
            </Text>
          </Flex>
          <Box mb={12}>
            <PlayerCarousel 
              players={players} 
              onPlayerClick={handlePlayerClick} 
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
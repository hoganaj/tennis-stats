import { useState, useEffect } from 'react';
import { Container, Heading, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { getTopPlayers } from '../services/tennisDataService';
import { Player } from '../types';

const HomePage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <Container maxW="container.xl">
      {isLoading ? (
        <Flex direction="column" align="center" justify="center" minH="60vh">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading players...</Text>
        </Flex>
      ) : (
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            Top Tennis Players
          </Heading>
          <Flex wrap="wrap">
            {players.map((player) => (
              <Box key={player.id} w="100%" p={2} mb={4}>
                <Heading as="h3" size="md" mb={2}>
                  {player.name}
                </Heading>
                <Text>Country: {player.country}</Text>
                <Text>Ranking: {player.ranking}</Text>
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
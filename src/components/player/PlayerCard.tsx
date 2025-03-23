import { Box, Image, Text, Flex, Badge } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { Player } from '../../types';

interface PlayerCardProps {
  player: Player;
  onClick: () => void;
}

const PlayerCard = ({ player, onClick }: PlayerCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box 
      onClick={onClick}
      cursor="pointer"
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ 
        transform: 'translateY(-8px)', 
        boxShadow: 'xl' 
      }}
      bg={cardBg}
      height="360px"
      width="100%"
      display="flex"
      flexDirection="column"
    >
      <Box height="260px" position="relative" overflow="hidden">
        <Image 
          src={player.imageUrl} 
          alt={player.name}
          width="100%"
          height="100%"
          objectFit="cover"
          objectPosition="top"
        />
        <Box 
          position="absolute" 
          bottom={2} 
          right={2}
        >
          <Badge 
            colorScheme="green" 
            fontSize="0.8em" 
            px={2} 
            py={1} 
            borderRadius="full"
            boxShadow="md"
          >
            Rank {player.ranking}
          </Badge>
        </Box>
      </Box>
      
      <Box p={4} flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
        <Text 
          fontWeight="bold" 
          fontSize="lg" 
          color={textColor}
          mb={2}
        >
          {player.name}
        </Text>
        
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="sm" color="gray.500">
            {player.country}
          </Text>
          <Flex>
            <Badge colorScheme="blue" mr={1}>
              W: {player.stats.wins}
            </Badge>
            <Badge colorScheme="red">
              L: {player.stats.losses}
            </Badge>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default PlayerCard;
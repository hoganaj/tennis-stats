import { useRef, useState, TouchEvent } from 'react';
import { 
  Box, 
  Flex, 
  IconButton,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Player } from '../../types';
import PlayerCard from './PlayerCard';

interface PlayerCarouselProps {
  players: Player[];
  onPlayerClick: (playerId: string) => void;
}

const PlayerCarousel = ({ players, onPlayerClick }: PlayerCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const MIN_SWIPE_DISTANCE = 50;
  
  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonColor = useColorModeValue('blue.500', 'blue.300');
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const cardWidth = 250 + 16;
      const scrollAmount = direction === 'left' 
        ? -cardWidth 
        : cardWidth;
      
      current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;
    
    if (isLeftSwipe) {
      scroll('right');
    } else if (isRightSwipe) {
      scroll('left');
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <Box position="relative" width="100%" my={8}>
      <IconButton
        aria-label="Scroll left"
        position="absolute"
        left={0}
        top="50%"
        transform="translateY(-50%)"
        zIndex={10}
        onClick={() => scroll('left')}
        rounded="full"
        size="lg"
        boxShadow="lg"
        bg={buttonBg}
        color={buttonColor}
        opacity="0.9"
        _hover={{ opacity: 1, transform: "translateY(-50%) scale(1.1)" }}
        transition="all 0.2s"
      >
        <FaChevronLeft size="1.5em" />
      </IconButton>
      
      <Box 
        ref={scrollRef}
        overflowX="auto"
        css={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollSnapType: 'x mandatory',
        }}
        mx={"48px"}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Flex>
          {players.map((player) => (
            <Box
              key={player.id}
              flex="0 0 auto"
              width={{ base: "100%", sm: "calc(50% - 16px)", md: "calc(33.333% - 16px)", lg: "calc(25% - 16px)", xl: "calc(20% - 16px)" }}
              mx={2}
              scrollSnapAlign="center"
            >
              <PlayerCard 
                player={player} 
                onClick={() => onPlayerClick(player.id)} 
              />
            </Box>
          ))}
        </Flex>
      </Box>
      
      <IconButton
        aria-label="Scroll right"
        position="absolute"
        right={0}
        top="50%"
        transform="translateY(-50%)"
        zIndex={10}
        onClick={() => scroll('right')}
        rounded="full"
        size="lg"
        boxShadow="lg"
        bg={buttonBg}
        color={buttonColor}
        opacity="0.9"
        _hover={{ opacity: 1, transform: "translateY(-50%) scale(1.1)" }}
        transition="all 0.2s"
      >
        <FaChevronRight size="1.5em" />
      </IconButton>
    </Box>
  );
};

export default PlayerCarousel;
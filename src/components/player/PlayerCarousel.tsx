import { useRef, useState, TouchEvent, useEffect } from 'react';
import { Box, Flex, IconButton, useBreakpointValue } from '@chakra-ui/react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fixed card dimensions
  const CARD_WIDTH = 190;
  const CARD_SPACING = 16;
  const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_SPACING;
  const ARROW_SPACE = 60;
  
  // Number of cards to show based on breakpoint
  const visibleCards = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  }) || 1;
  
  // Calculate container width to show exact number of full cards
  const containerWidth = visibleCards * TOTAL_CARD_WIDTH;
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const MIN_SWIPE_DISTANCE = 50;
  
  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonColor = useColorModeValue('blue.500', 'blue.300');
  
  // Update max scroll when container or visible cards change
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setMaxScroll(scrollWidth - clientWidth);
    }
  }, [visibleCards, players]);
  
  // Handle scroll event to update scroll position
  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };
  
  // Attach scroll listener
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
      return () => scrollEl.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Scroll one card width in the given direction
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = TOTAL_CARD_WIDTH * (direction === 'left' ? -1 : 1);
      scrollRef.current.scrollBy({
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

  const showArrows = players.length > visibleCards;

  return (
    <Box 
      position="relative" 
      width="100%" 
      my={8}
      ref={containerRef}
      px={showArrows ? `${ARROW_SPACE}px` : 0} // Add padding for arrows when needed
    >
      {showArrows && (
        <IconButton
          aria-label="Scroll left"
          position="absolute"
          left={3}
          top="50%"
          transform="translateY(-50%)"
          zIndex={10}
          onClick={() => scroll('left')}
          rounded="full"
          size="lg"
          boxShadow="lg"
          bg={buttonBg}
          color={buttonColor}
          opacity={scrollPosition <= 0 ? 0.3 : 0.9}
          pointerEvents={scrollPosition <= 0 ? 'none' : 'auto'}
          _hover={{ opacity: scrollPosition <= 0 ? 0.3 : 1, transform: scrollPosition <= 0 ? "translateY(-50%)" : "translateY(-50%) scale(1.1)" }}
          transition="all 0.2s"
        >
          <FaChevronLeft size="1.5em" />
        </IconButton>
      )}
      
      <Flex justifyContent="center">
        <Box
          mx="auto"
          maxWidth={`${containerWidth}px`}
          overflow="hidden"
        >
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Flex py={2}>
              {players.map((player) => (
                <Box
                  key={player.id}
                  flex="0 0 auto"
                  width={`${CARD_WIDTH}px`}
                  mx={`${CARD_SPACING / 2}px`}
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
        </Box>
      </Flex>
      
      {showArrows && (
        <IconButton
          aria-label="Scroll right"
          position="absolute"
          right={3}
          top="50%"
          transform="translateY(-50%)"
          zIndex={10}
          onClick={() => scroll('right')}
          rounded="full"
          size="lg"
          boxShadow="lg"
          bg={buttonBg}
          color={buttonColor}
          opacity={scrollPosition >= maxScroll ? 0.3 : 0.9}
          pointerEvents={scrollPosition >= maxScroll ? 'none' : 'auto'}
          _hover={{ opacity: scrollPosition >= maxScroll ? 0.3 : 1, transform: scrollPosition >= maxScroll ? "translateY(-50%)" : "translateY(-50%) scale(1.1)" }}
          transition="all 0.2s"
        >
          <FaChevronRight size="1.5em" />
        </IconButton>
      )}
    </Box>
  );
};

export default PlayerCarousel;
import { useState } from 'react';
import { Box, Icon, useColorModeValue, Link } from '@chakra-ui/react';
import { MdAddBox } from 'react-icons/md';

// Les données mockées
const cardData = [
  {
    id: 1,
    title: "WordCloud",
    author: "@YouAreLucky",
    description: "Need help getting started? Discover key concepts!",
    image: "https://res.cloudinary.com/dy4hywvlz/image/upload/v1717347496/octpzrjiba0xovd4d4aw.png",
    views: "28.9m",
    likes: "14.1k"
  },
  {
    id: 2,
    title: "🇨🇳 Customs Regulation Specialist",
    author: "Emma Wang",
    description: "Have questions about customs regulations in China?",
    image: "https://res.cloudinary.com/dy4hywvlz/image/upload/v1717345836/ii1pyuujbhpouu3mcqks.png",
    views: "13.5m",
    likes: "4.0k"
  },
  {
    id: 3,
    title: "🇺🇸 International Trade Lawyer",
    author: "Robert F. Smith",
    description: "Need legal advice on international trade?",
    image: "https://res.cloudinary.com/dy4hywvlz/image/upload/v1717345836/jy1chds9abdyxpmq2g22.png",
    views: "7.3m",
    likes: "2.9k"
  }
  // Ajoute plus de cartes ici si nécessaire
];

// Le composant Card
const Card = ({ card, isSelected, onClick }) => {
  return (
    <div 
      style={{ 
        ...styles.card, 
        border: isSelected ? '2px solid #b8bffd' : '2px solid transparent' 
      }}
      onClick={onClick}
    >
      <img src={card.image} alt={card.title} style={styles.image} />
      <div style={styles.textContainer}>
        <h3 style={styles.title}>{card.title}</h3>
        <p style={styles.author}>By {card.author}</p>
        <p style={styles.description}>{card.description}</p>
        <div style={styles.stats}>
          <span>{card.views}</span>
          <span>{card.likes}</span>
        </div>
      </div>
    </div>
  );
};

// Le composant AddCard
const AddCard = () => {
  const navbarIcon = useColorModeValue('gray.500', 'white');
  return (
    <Box>
      <Link href="/sign-in" py="0px" lineHeight={'120%'}>
        <Icon boxSize={16} as={MdAddBox} color={navbarIcon} />
      </Link>
    </Box>
  );
};

// Le composant Carousel
const Carousel = ({ onSelectPlugin }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (id) => {
    setSelectedCard(id);
    onSelectPlugin(id);
  };

  return (
    <div style={styles.carousel}>
      {cardData.map((card) => (
        <Card 
          key={card.id} 
          card={card} 
          isSelected={selectedCard === card.id}
          onClick={() => handleCardClick(card.id)}
        />
      ))}
      <AddCard />
    </div>
  );
};

// Styles
const styles = {
  carousel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'auto',
    padding: '20px',
    gap: '20px'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '10px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    width: '300px',
    height: '120px'
  },
  image: {
    width: '70px',
    height: '70px',
    borderRadius: '10px',
    marginRight: '10px'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1'
  },
  title: {
    fontSize: '0.6em',
    margin: '0 0 5px 0'
  },
  author: {
    color: '#777',
    margin: '0 0 5px 0',
    fontSize: '0.7em'
  },
  description: {
    fontSize: '0.6em',
    margin: '0 0 10px 0'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75em'
  },
  addCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    width: '150px',
    height: '120px'
  },
  addLink: {
    display: 'block',
    textDecoration: 'none',
    color: '#000',
    fontSize: 'small',
    textAlign: 'center',
    lineHeight: '100px',
    width: '100%'
  }
};

export default Carousel;

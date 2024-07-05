import { useState, useEffect } from 'react';
import { Box, Progress, Text } from '@chakra-ui/react';

// Les données mockées
const formSteps = [
  [
    "🍎 Food Products",
    "🔋 Hazardous Materials",
    "📦 Fragile Goods",
    "🏗️ Heavy Machinery",
    "👗 Clothing Apparel",
    "📚 Educational Materials",
    "🛠️ Industrial Equipment",
    "💎 Luxury Items",
    "📱 Electronic Devices",
    "🧴 Beauty Products",
    "🧸 Children's Toys",
    "🏠 Home Decor",
    "🌿 Organic Produce",
    "💊 Pharmaceuticals",
    "🚗 Automotive Parts",
    "🐶 Pet Supplies",
    "🛋️ Furniture",
    "🎨 Art Pieces",
    "💼 Office Supplies",
    "🎮 Gaming Gear"
  ],
  [
    "📄 Form Completed",
    "✅ Certification Acquired",
    "🔍 Initial Research",
    "📋 Documents Ready",
    "🏭 Production Phase",
    "📦 Packaging Done",
    "🚚 Logistics Planned",
    "📜 License Obtained",
    "💬 Negotiation Ongoing",
    "🛳️ Shipping Scheduled",
    "📊 Market Analyzed",
    "💼 Partner Confirmed",
    "🔧 Testing Phase",
    "📝 Contract Signed",
    "🌐 Trade Agreement",
    "📈 Sales Started",
    "🔒 Compliance Met",
    "🗂️ Documentation Sent",
    "🔄 Process Review",
    "📅 Timeline Set"
  ],
  ["📈 Market Trends", "🆕 New Markets", "🛠️ Technical Review", "💼 Established Partnerships", "🌐 Global Presence", "🔔 Deadline Approaching", "❓ Flexible / Not Sure", "🛡️ Compliance Check"]
];

// Le composant Question
const Question = ({ options, selectedOptions, onOptionSelect }) => {
  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
        {options.map((option, index) => (
          <button 
            key={index} 
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: selectedOptions.includes(option) ? '#b8bffd' : '#7e71ff',
              color: '#fff',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onClick={() => onOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// Le composant Form
const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter(opt => opt !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const handleNextStep = () => {
    const updatedAnswers = [...answers, selectedOptions];
    setAnswers(updatedAnswers);
    setSelectedOptions([]);
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSkipStep = () => {
    const updatedAnswers = [...answers, []];
    setAnswers(updatedAnswers);
    setSelectedOptions([]);
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isSubmitting) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            setIsSubmitting(false);
            setIsCompleted(true);
            return 100;
          }
          return oldProgress + 25;
        });
      }, 500); // Vitesse de l'animation
      return () => {
        clearInterval(timer);
      };
    }
  }, [isSubmitting]);

  return (
    <Box textAlign="center" marginTop="20px">
      {isSubmitting ? (
        <Progress width='auto' value={progress} size="md" colorScheme="purple" />
      ) : isCompleted ? (
        <Text fontSize="lg" color="purple.500">
          Your request has been taken into account. We update your project.
        </Text>
      ) : (
        <>
          <Question 
            options={formSteps[currentStep]} 
            selectedOptions={selectedOptions}
            onOptionSelect={handleOptionSelect}
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {currentStep < formSteps.length - 1 && (
              <button
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: '#000',
                  color: '#fff',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  marginRight: '10px'
                }}
                onClick={handleSkipStep}
              >
                Skip
              </button>
            )}
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onClick={handleNextStep}
            >
              {currentStep < formSteps.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </>
      )}
    </Box>
  );
};

export default MultiStepForm;

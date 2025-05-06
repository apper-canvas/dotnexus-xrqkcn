import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);
  
  // Icons
  const DotIcon = getIcon('Dot');
  const GridIcon = getIcon('Grid');
  const TrophyIcon = getIcon('Trophy');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  const startGame = () => {
    setShowIntro(false);
    toast.success("Game started! Connect the dots to create boxes.");
  };
  
  useEffect(() => {
    // Game tutorial
    if (!showIntro) {
      setTimeout(() => {
        toast.info("Take turns connecting dots. When you complete a box, you get an extra turn!");
      }, 1000);
    }
  }, [showIntro]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 transition-colors">
      {showIntro ? (
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h1 className="font-bold mb-2 text-gradient">
              <span className="inline-block">Dot<span className="text-accent">Nexus</span></span>
            </h1>
            <p className="text-surface-600 dark:text-surface-300 text-lg md:text-xl max-w-2xl">
              The classic connect-the-dots game reimagined for two players.
            </p>
          </motion.div>
          
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mb-12"
          >
            <motion.li variants={itemVariants} className="card-neu p-6 md:p-8 flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                <DotIcon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Dots</h3>
              <p className="text-surface-600 dark:text-surface-400">Take turns connecting adjacent dots with lines</p>
            </motion.li>
            
            <motion.li variants={itemVariants} className="card-neu p-6 md:p-8 flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-secondary/10 dark:bg-secondary/20 text-secondary">
                <GridIcon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Form Boxes</h3>
              <p className="text-surface-600 dark:text-surface-400">Complete the fourth side of a box to claim it</p>
            </motion.li>
            
            <motion.li variants={itemVariants} className="card-neu p-6 md:p-8 flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-accent/10 dark:bg-accent/20 text-accent">
                <TrophyIcon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Win the Game</h3>
              <p className="text-surface-600 dark:text-surface-400">Player with the most boxes when the grid is full wins</p>
            </motion.li>
          </motion.ul>
          
          <motion.button
            className="btn btn-primary py-3 px-8 text-lg shadow-lg shadow-primary/20 dark:shadow-primary/10"
            onClick={startGame}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Game
          </motion.button>
        </div>
      ) : (
        <MainFeature />
      )}
    </div>
  );
};

export default Home;
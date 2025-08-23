import React, { useState } from 'react';
import { motion, scale } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router';

const ReadMoreButton = () => {
   const [isHovered, setIsHovered] = useState(false);

   return (
      <Link to="rooms">
         <motion.button
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ width: 48 }}
            animate={{ width: isHovered ? 140 : 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="items-center justify-center h-12 bg-accent text-white rounded-full overflow-hidden px-4 active:scale-95 cursor-pointer drop-shadow-[0_0_3px_rgba(234,88,12,1)] hidden lg:flex"
         >
            {/* Conditionally rendered text */}
            {isHovered && (
               <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap text-md mr-2"
               >
                  View All
               </motion.span>
            )}

            <FiArrowRight size={20} />
         </motion.button>
      </Link>
   );
};

export default ReadMoreButton;

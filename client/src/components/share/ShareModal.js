import React, { useRef, useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import ShareCard from './ShareCard';

const ShareModal = ({ isOpen, onClose, daysLeft = 0, deathDate = null, percentCompleted = 0 }) => {
  const shareCardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    console.log('ShareModal props:', { daysLeft, deathDate, percentCompleted });
  }, [daysLeft, deathDate, percentCompleted]);

  const generateImage = async () => {
    if (!shareCardRef.current) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'finalcount-share.png';
      link.href = imageUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToTwitter = () => {
    const formattedDays = Math.max(0, Math.round(Number(daysLeft))).toLocaleString();
    const text = `I have ${formattedDays} days left to make an impact. What will you do with your time? #FinalCount`;
    const url = 'https://finalcount.app';
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(intentUrl, '_blank');
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    
    try {
      const formattedDays = Math.max(0, Math.round(Number(daysLeft))).toLocaleString();
      await navigator.share({
        title: 'My FinalCount',
        text: `I have ${formattedDays} days left to make an impact. What will you do with your time?`,
        url: 'https://finalcount.app'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/75" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-gray-900 rounded-2xl p-6 max-w-2xl w-full"
        >
          <Dialog.Title className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            Share Your Journey
          </Dialog.Title>

          <div className="flex justify-center mb-6" ref={shareCardRef}>
            <ShareCard
              daysLeft={Number(daysLeft)}
              deathDate={deathDate}
              percentCompleted={Number(percentCompleted)}
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Download Image'}
            </button>
            
            <button
              onClick={shareToTwitter}
              className="px-6 py-3 bg-[#1DA1F2] rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Share on Twitter
            </button>

            {navigator.share && (
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-gray-700 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Share...
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default ShareModal;

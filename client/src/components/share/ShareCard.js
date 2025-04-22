import React, { useEffect, useMemo } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const quotes = [
  "Every day is a gift. Make it count.",
  "Your time is limited. Don't waste it living someone else's life.",
  "Life is not about finding yourself. It's about creating yourself.",
  "The purpose of life is a life of purpose.",
  "Make each day your masterpiece."
];

const formatDate = (date) => {
  if (!date) return 'calculating...';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'calculating...';
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return 'calculating...';
  }
};

const ShareCard = ({ daysLeft = 0, deathDate = null, percentCompleted = 0 }) => {
  useEffect(() => {
    console.log('ShareCard received:', { daysLeft, deathDate, percentCompleted });
  }, [daysLeft, deathDate, percentCompleted]);

  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);
  const formattedDaysLeft = useMemo(() => Math.max(0, Math.round(Number(daysLeft))).toLocaleString(), [daysLeft]);
  const formattedDate = useMemo(() => {
    if (!deathDate) {
      if (daysLeft === 0) {
        return 'calculating...';
      }
      // Calculate death date based on daysLeft
      const now = new Date();
      now.setDate(now.getDate() + Number(daysLeft));
      return now.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    try {
      const d = new Date(deathDate);
      if (isNaN(d.getTime())) return 'calculating...';
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'calculating...';
    }
  }, [deathDate, daysLeft]);

  return (
    <div id="share-card" className="w-full max-w-[600px] h-[315px] bg-gradient-to-br from-gray-900 to-black p-4 md:p-8 rounded-2xl flex flex-col justify-between">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div className=" md:space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            {formattedDaysLeft} Days Left
          </h2>
          <p className="text-gray-400  md:text-xl text-orange-500">
            Until {formattedDate}
          </p>
        </div>
        <div className="w-32 h-32">
          <CircularProgressbar
            value={Math.min(100, Math.max(0, Number(percentCompleted)))}
            text={`${Math.round(Math.min(100, Math.max(0, Number(percentCompleted))))}%`}
            styles={buildStyles({
              textSize: '1rem',
              pathColor: '#f97316',
              textColor: '#f97316',
              trailColor: '#1f2937'
            })}
          />
        </div>
      </div>
      <p className="text-gray-300 text-base md:text-lg italic mt-4">
        "{randomQuote}"
      </p>
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-2 md:gap-0">
        <p className="text-gray-500 text-sm md:text-base">Made with FinalCount</p>
        {/* <div className="text-orange-500 font-bold text-sm md:text-base">
          finalcount.app
        </div> */}
      </div>
    </div>
  );
};

export default ShareCard;

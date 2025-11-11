'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Leaf, ScanLine, Trophy, Zap, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { LoginForm } from './login-form';
import { Button } from '../ui/button';

const onboardingSteps = [
  {
    icon: ScanLine,
    title: 'Identify Waste with AI',
    description: 'Snap a photo of any item, and our AI will tell you how to recycle or dispose of it properly.',
  },
  {
    icon: Trophy,
    title: 'Earn Rewards for Recycling',
    description: 'Log your recycling activities to earn EcoPoints and redeem them for exciting rewards.',
  },
  {
    icon: Zap,
    title: 'Join the Green Revolution',
    description: 'Connect with a community that’s making a real impact, one recycled item at a time.',
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      handleShowLogin();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };
  
  const handleShowLogin = () => {
    setIsTransitioning(true);
    setTimeout(() => {
        setShowLogin(true);
    }, 500)
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 via-green-50 to-yellow-50 dark:from-green-900/50 dark:via-gray-900 dark:to-yellow-900/50">
      <div className="absolute top-8 flex items-center gap-2">
        <Leaf className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Bhumy
        </h1>
      </div>
      <p className="absolute top-16 text-sm text-muted-foreground">
        Smart Waste, Clean Earth.
      </p>

      <div className="relative w-full max-w-sm h-[400px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          {!showLogin && !isTransitioning && (
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute flex w-full flex-col items-center justify-center p-6 text-center"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                {React.createElement(onboardingSteps[step].icon, {
                  className: 'h-10 w-10',
                })}
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {onboardingSteps[step].title}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {onboardingSteps[step].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTransitioning && !showLogin && (
             <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center gap-4 text-primary"
            >
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="font-semibold">Getting things ready...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
            {showLogin && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                    className="w-full"
                >
                    <LoginForm />
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {!showLogin && !isTransitioning && (
        <div className="absolute bottom-8 w-full max-w-sm px-6">
          <div className="mb-4 flex justify-center gap-2">
            {onboardingSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  step === i ? 'w-6 bg-primary' : 'bg-primary/20'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleShowLogin}>
              Skip
            </Button>
            <div className='flex items-center gap-2'>
              {step > 0 && (
                <Button variant="outline" size="icon" onClick={handlePrev}>
                    <ArrowLeft />
                </Button>
              )}
              <Button onClick={handleNext}>
                {step === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

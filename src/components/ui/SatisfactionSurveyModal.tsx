import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Heart, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle, 
  Sparkles,
  Award,
  Clock,
  Users,
  Zap,
  Shield
} from 'lucide-react';
import { StarRating } from './StarRating';

interface SurveyData {
  overallRating: number;
  responseTime: number;
  helpfulness: number;
  professionalism: number;
  resolutionQuality: number;
  feedback: string;
  improvements: string;
}

interface SatisfactionSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SurveyData) => void;
  ticketNumber?: string;
  staffName?: string;
  isSubmitting?: boolean;
}

export const SatisfactionSurveyModal: React.FC<SatisfactionSurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  ticketNumber,
  staffName,
  isSubmitting = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    overallRating: 0,
    responseTime: 0,
    helpfulness: 0,
    professionalism: 0,
    resolutionQuality: 0,
    feedback: '',
    improvements: ''
  });
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsCompleted(false);
      setSurveyData({
        overallRating: 0,
        responseTime: 0,
        helpfulness: 0,
        professionalism: 0,
        resolutionQuality: 0,
        feedback: '',
        improvements: ''
      });
    }
  }, [isOpen]);

  const steps = [
    {
      title: "Overall Experience",
      subtitle: "How would you rate your overall experience?",
      icon: Star,
      color: "from-purple-500 to-pink-500",
      field: 'overallRating' as keyof SurveyData
    },
    {
      title: "Response Time",
      subtitle: "How satisfied were you with our response time?",
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
      field: 'responseTime' as keyof SurveyData
    },
    {
      title: "Staff Helpfulness",
      subtitle: "How helpful was our support team?",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      field: 'helpfulness' as keyof SurveyData
    },
    {
      title: "Professionalism",
      subtitle: "How professional was the service?",
      icon: Shield,
      color: "from-indigo-500 to-purple-500",
      field: 'professionalism' as keyof SurveyData
    },
    {
      title: "Solution Quality",
      subtitle: "How satisfied are you with the resolution?",
      icon: CheckCircle,
      color: "from-orange-500 to-red-500",
      field: 'resolutionQuality' as keyof SurveyData
    },
    {
      title: "Additional Feedback",
      subtitle: "Tell us more about your experience",
      icon: MessageSquare,
      color: "from-teal-500 to-blue-500",
      field: 'feedback' as keyof SurveyData
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isRatingStep = currentStep < 5;

  const updateRating = (field: keyof SurveyData, value: number) => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const updateFeedback = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsCompleted(true);
    await onSubmit(surveyData);
    
    // Auto close after showing success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const isStepValid = () => {
    if (isRatingStep) {
      return surveyData[currentStepData.field as keyof SurveyData] > 0;
    }
    return true; // Feedback is optional
  };

  const getAverageRating = () => {
    const ratings = [
      surveyData.overallRating,
      surveyData.responseTime,
      surveyData.helpfulness,
      surveyData.professionalism,
      surveyData.resolutionQuality
    ].filter(rating => rating > 0);
    
    return ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Animated Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.color} opacity-5`} />
          
          {/* Header */}
          <div className="relative p-8 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${currentStepData.color} shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <currentStepData.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Customer Satisfaction Survey
                  </h2>
                  {ticketNumber && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ticket #{ticketNumber}
                    </p>
                  )}
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mb-6">
              <motion.div
                className={`h-2 bg-gradient-to-r ${currentStepData.color} rounded-full`}
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              {!isCompleted ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Step Header */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {currentStepData.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentStepData.subtitle}
                    </p>
                  </div>

                  {/* Step Content */}
                  <div className="flex flex-col items-center space-y-8">
                    {isRatingStep ? (
                      <>
                        <StarRating
                          rating={surveyData[currentStepData.field as keyof SurveyData] as number}
                          onRatingChange={(rating) => updateRating(currentStepData.field as keyof SurveyData, rating)}
                          size="xl"
                          showValue
                          className="justify-center"
                        />
                        
                        {/* Motivational Message */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-center"
                        >
                          {surveyData[currentStepData.field as keyof SurveyData] as number > 0 && (
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span>Thank you for your feedback!</span>
                            </div>
                          )}
                        </motion.div>
                      </>
                    ) : (
                      <div className="w-full space-y-6">
                        {/* Feedback Textarea */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Share your thoughts about our service:
                          </label>
                          <motion.textarea
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full p-4 border border-gray-300 dark:border-dark-600 rounded-xl bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            rows={4}
                            placeholder="Tell us what you liked or what we could improve..."
                            value={surveyData.feedback}
                            onChange={(e) => updateFeedback('feedback', e.target.value)}
                          />
                        </div>

                        {/* Improvements Textarea */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            How can we improve? (Optional)
                          </label>
                          <motion.textarea
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="w-full p-4 border border-gray-300 dark:border-dark-600 rounded-xl bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            rows={3}
                            placeholder="Suggestions for improvement..."
                            value={surveyData.improvements}
                            onChange={(e) => updateFeedback('improvements', e.target.value)}
                          />
                        </div>

                        {/* Summary Card */}
                        {getAverageRating() > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                  Your Overall Rating
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Based on your responses
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {getAverageRating().toFixed(1)}
                                </span>
                                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                // Success State
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="text-center space-y-6 py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Thank You! 🎉
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Your feedback helps us improve our service. We truly appreciate you taking the time to share your experience.
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Survey completed successfully
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {!isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-dark-700"
              >
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-blue-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={handleNext}
                  disabled={!isStepValid() || isSubmitting}
                  className={`
                    px-8 py-3 rounded-xl font-medium transition-all duration-200
                    ${isStepValid() 
                      ? `bg-gradient-to-r ${currentStepData.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105` 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  whileHover={isStepValid() ? { scale: 1.05 } : {}}
                  whileTap={isStepValid() ? { scale: 0.95 } : {}}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : isLastStep ? (
                    <div className="flex items-center space-x-2">
                      <span>Submit Survey</span>
                      <Award className="w-4 h-4" />
                    </div>
                  ) : (
                    'Next'
                  )}
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
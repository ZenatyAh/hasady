import React from 'react';

export type TrackingStatus = 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

interface OrderTrackingStepperProps {
  currentStatus: TrackingStatus;
}

const steps = [
  { id: 'PENDING', label: 'قيد الانتظار', icon: '⏳' },
  { id: 'PREPARING', label: 'قيد التجهيز', icon: '📦' },
  { id: 'OUT_FOR_DELIVERY', label: 'في الطريق', icon: '🚚' },
  { id: 'DELIVERED', label: 'تم التسليم', icon: '✅' },
];

export function OrderTrackingStepper({ currentStatus }: OrderTrackingStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStatus);

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors duration-300 border-4 ${
                    isCompleted
                      ? 'bg-primary border-primary/20 text-white shadow-md'
                      : 'bg-white border-border-light text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-3 text-xs md:text-sm font-bold absolute -bottom-8 w-24 text-center ${
                    isCompleted ? 'text-primary' : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`flex-1 h-1.5 transition-colors duration-300 mx-2 rounded-full ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-border-light'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

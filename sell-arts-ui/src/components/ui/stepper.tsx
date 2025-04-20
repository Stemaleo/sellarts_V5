import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronRight } from "lucide-react"

interface Step {
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  currentStep > index
                    ? "border-indigo-600 bg-indigo-600"
                    : currentStep === index
                    ? "border-indigo-600"
                    : "border-gray-300"
                )}
              >
                {currentStep > index ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      currentStep === index ? "text-indigo-600" : "text-gray-500"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="ml-2">
                <h3
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= index ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-xs text-gray-500">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn(
                    "h-0.5",
                    currentStep > index ? "bg-indigo-600" : "bg-gray-300"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export { Stepper } 
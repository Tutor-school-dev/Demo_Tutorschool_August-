// Analytics utility for GSC Registration Form Tracking
// This file contains helper functions for tracking user behavior through the registration funnel

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface FormAnalyticsData {
  step_number: number;
  step_name: string;
  child_age?: string;
  theme_selected?: string;
  error_type?: string;
  form_progress?: number;
}

export class GSCAnalytics {
  // Track when user starts the registration form
  static trackFormStart() {
    this.sendGTMEvent('gsc_form_started', {
      step_number: 1,
      step_name: 'Parent Information',
      form_progress: 25
    });

    this.sendGAEvent('gsc_form_started', {
      event_category: 'GSC Registration',
      event_label: 'Registration Form Started',
      step_number: 1,
      step_name: 'Parent Information'
    });
  }

  // Track when user completes a step
  static trackStepCompleted(stepNumber: number, stepName: string) {
    this.sendGTMEvent('gsc_step_completed', {
      step_number: stepNumber,
      step_name: stepName,
      form_progress: (stepNumber / 4) * 100
    });

    this.sendGAEvent('gsc_step_completed', {
      event_category: 'GSC Registration',
      event_label: `Step ${stepNumber}`,
      step_number: stepNumber,
      step_name: stepName,
      value: stepNumber
    });
  }

  // Track when user starts a new step
  static trackStepStarted(stepNumber: number, stepName: string) {
    this.sendGTMEvent('gsc_step_started', {
      step_number: stepNumber,
      step_name: stepName,
      form_progress: (stepNumber / 4) * 100
    });

    this.sendGAEvent('gsc_step_started', {
      event_category: 'GSC Registration',
      event_label: `Step ${stepNumber}`,
      step_number: stepNumber,
      step_name: stepName
    });
  }

  // Track validation errors
  static trackValidationError(stepNumber: number, stepName: string, errorType: string = 'incomplete_fields') {
    this.sendGTMEvent('gsc_validation_error', {
      step_number: stepNumber,
      step_name: stepName,
      error_type: errorType
    });

    this.sendGAEvent('gsc_validation_error', {
      event_category: 'GSC Registration',
      event_label: `Step ${stepNumber}`,
      step_number: stepNumber,
      step_name: stepName,
      error_type: errorType
    });
  }

  // Track when user goes back to previous step
  static trackStepBack(fromStep: number, toStep: number, stepName: string) {
    this.sendGTMEvent('gsc_step_back', {
      from_step: fromStep,
      to_step: toStep,
      step_name: stepName
    });

    this.sendGAEvent('gsc_step_back', {
      event_category: 'GSC Registration',
      event_label: `From Step ${fromStep} to Step ${toStep}`,
      step_number: fromStep,
      previous_step: toStep
    });
  }

  // Track form submission attempt
  static trackSubmissionAttempt(childAge: string, theme: string) {
    this.sendGTMEvent('gsc_form_submit_attempt', {
      step_number: 4,
      step_name: 'Video Upload',
      child_age: childAge,
      selected_theme: theme
    });

    this.sendGAEvent('gsc_form_submit_attempt', {
      event_category: 'GSC Registration',
      event_label: 'Final Form Submission',
      step_number: 4,
      step_name: 'Video Upload'
    });
  }

  // Track successful form completion
  static trackFormCompleted(childAge: string, theme: string) {
    this.sendGTMEvent('gsc_form_completed', {
      form_completion_rate: 100,
      child_age: childAge,
      theme_selected: theme,
      completion_timestamp: new Date().toISOString()
    });

    this.sendGAEvent('gsc_form_completed', {
      event_category: 'GSC Registration',
      event_label: 'Registration Completed Successfully',
      value: 1,
      child_age: childAge,
      theme_selected: theme
    });

    // Track conversion for Google Ads (if applicable)
    this.sendGAEvent('conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion tracking ID
      value: 1.0,
      currency: 'USD'
    });
  }

  // Track form submission failure
  static trackSubmissionFailed() {
    this.sendGTMEvent('gsc_form_submit_failed', {
      step_number: 4,
      error_type: 'submission_error'
    });

    this.sendGAEvent('gsc_form_submit_failed', {
      event_category: 'GSC Registration',
      event_label: 'Form Submission Failed',
      step_number: 4
    });
  }

  // Track form abandonment (when user leaves without completing)
  static trackFormAbandoned(stepNumber: number, stepName: string) {
    this.sendGTMEvent('gsc_form_abandoned', {
      step_number: stepNumber,
      step_name: stepName,
      abandonment_point: `Step ${stepNumber}`,
      form_progress: (stepNumber / 4) * 100
    });

    this.sendGAEvent('gsc_form_abandoned', {
      event_category: 'GSC Registration',
      event_label: `Abandoned at Step ${stepNumber}`,
      step_number: stepNumber,
      step_name: stepName
    });
  }

  // Helper function to send events to Google Tag Manager
  private static sendGTMEvent(eventName: string, data: any) {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...data
      });
    }
  }

  // Helper function to send events to Google Analytics
  private static sendGAEvent(eventName: string, data: any) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, data);
    }
  }
}

// Enhanced step name helper
export const getStepName = (step: number): string => {
  switch (step) {
    case 1: return 'Parent Information';
    case 2: return 'Child Information';
    case 3: return 'Theme Selection';
    case 4: return 'Video Upload';
    default: return 'Unknown Step';
  }
};

// Form field tracking helpers
export const trackFieldInteraction = (fieldName: string, stepNumber: number) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'gsc_field_interaction',
      field_name: fieldName,
      step_number: stepNumber,
      step_name: getStepName(stepNumber)
    });
  }
};

// Track time spent on each step
export const trackStepTimeSpent = (stepNumber: number, timeSpent: number) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'gsc_step_time_spent',
      step_number: stepNumber,
      step_name: getStepName(stepNumber),
      time_spent_seconds: timeSpent
    });
  }
};
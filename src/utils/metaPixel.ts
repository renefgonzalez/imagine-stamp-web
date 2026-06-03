import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    fbq: any;
  }
}

/**
 * Tracks an event via Meta Pixel (Frontend) and Meta Conversions API (Backend via Supabase Edge Function)
 * 
 * @param eventName The standard or custom event name (e.g. 'AddToCart', 'Lead', 'Purchase')
 * @param customData Optional additional data for the event (e.g. value, currency)
 */
export const trackMetaEvent = async (eventName: string, customData?: Record<string, any>) => {
  // Generate a unique ID to deduplicate the event across Browser and Server
  const eventId = crypto.randomUUID();

  // 1. Send via Browser Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, customData, { eventID: eventId });
  }

  // 2. Send via Server (Conversions API)
  try {
    const { data, error } = await supabase.functions.invoke('meta-capi', {
      body: {
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: customData,
      }
    });

    if (error) {
      console.error('Error tracking Meta CAPI Event:', error);
    }
  } catch (err) {
    console.error('Failed to send event to Meta CAPI:', err);
  }
};

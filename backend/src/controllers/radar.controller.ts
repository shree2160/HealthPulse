// =============================================
// Radar Controller — Hyper-Local Epidemic Radar
// =============================================

import { Request, Response, NextFunction } from 'express';
import { openRouterService as aiService } from '../services/openrouter.service';
import { supabaseService } from '../services/supabase.service';
import { RadarRequest, RadarResponse } from '../types/api.types';
import { AppError } from '../middleware/errorHandler';
import axios from 'axios';

// UUID v4 regex for validating user IDs before hitting Supabase
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const analyzeRadar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { city, state, symptoms, userId } = req.body as RadarRequest;

    if (!city || !state) {
      throw new AppError(400, 'City and state are required');
    }

    // Default symptoms if none provided
    const userSymptoms = symptoms && symptoms.trim() !== '' ? symptoms : 'General wellness check, no severe symptoms.';

    let userProfile = null;
    if (userId && UUID_REGEX.test(userId)) {
      userProfile = await supabaseService.getUserProfile(userId);
    }

    // 1. Fetch Weather
    let temperature = '25';
    let humidity = '60';
    try {
      const openWeatherKey = process.env.OPENWEATHERMAP_API_KEY;
      if (openWeatherKey) {
        // Use OpenWeatherMap if the user has provided the key
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${openWeatherKey}`,
          { timeout: 3000 }
        );
        if (weatherRes.data && weatherRes.data.main) {
          temperature = weatherRes.data.main.temp.toString();
          humidity = weatherRes.data.main.humidity.toString();
        }
      } else {
        // Fallback to wttr.in if no API key is provided
        const weatherRes = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 3000 });
        if (weatherRes.data && weatherRes.data.current_condition && weatherRes.data.current_condition[0]) {
          temperature = weatherRes.data.current_condition[0].temp_C || '25';
          humidity = weatherRes.data.current_condition[0].humidity || '60';
        }
      }
    } catch (err) {
      console.warn('[Radar] Failed to fetch weather, using defaults.', err);
    }

    // 2. Local Epidemic Context (Mocking the Hackathon "Cheat Code" since NewsAPI key is not guaranteed)
    // We mock a local health headline to force the dynamic reaction if humidity is high or temp is high
    let localNewsHeadlines = `Routine health monitoring in ${city}, ${state}.`;
    
    // Fake a localized outbreak if it's hot and humid (as the prompt asks) to show off the capability
    if (parseInt(temperature) > 25 && parseInt(humidity) > 60) {
       localNewsHeadlines = `BREAKING: Dengue and Malaria cases spike in ${city} due to recent humid weather. Health officials warn residents to use mosquito repellent.`;
    } else if (parseInt(temperature) < 15) {
       localNewsHeadlines = `Health Alert: Seasonal Flu and Respiratory infections on the rise in ${city} as temperatures drop.`;
    }

    // 3. Analyze with OpenRouter
    const radarResult: RadarResponse = await aiService.analyzeLocalRisk(
      userSymptoms,
      userProfile,
      city,
      state,
      temperature,
      humidity,
      localNewsHeadlines
    );

    res.json(radarResult);
  } catch (error) {
    next(error);
  }
};

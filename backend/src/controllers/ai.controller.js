import * as aiService from '../services/ai.service.js';

export async function listLanguages(req, res, next) {
  try {
    const languages = Object.entries(aiService.AI_LANGUAGES).map(([code, meta]) => ({
      code,
      label: meta.label,
      voice: Boolean(meta.seamless || meta.whisper),
    }));
    return res.json({ data: languages });
  } catch (error) {
    return next(error);
  }
}

export async function chat(req, res, next) {
  try {
    const { message, language = 'en', history = [] } = req.body;
    const result = await aiService.chatAboutAdwa({ message, language, history });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function voice(req, res, next) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        error: { message: 'audio file is required', code: 'AUDIO_REQUIRED' },
      });
    }

    let history = [];
    if (req.body.history) {
      try {
        history = JSON.parse(req.body.history);
      } catch {
        history = [];
      }
    }

    const result = await aiService.voiceAsk({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      filename: req.file.originalname || 'voice.webm',
      language: req.body.language || 'en',
      history,
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

import api from './api';

export const AI_LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'zh', label: '中文', short: '中文' },
  { code: 'am', label: 'አማርኛ', short: 'አማ' },
  { code: 'om', label: 'Afaan Oromo', short: 'OM' },
  { code: 'ti', label: 'ትግርኛ', short: 'ትግ' },
];

export const aiService = {
  getLanguages: () => api.get('/ai/languages').then((res) => res.data?.data ?? res.data),

  chat: ({ message, language, history }) =>
    api.post('/ai/chat', { message, language, history }).then((res) => res.data),

  voice: async ({ blob, language, history }) => {
    const form = new FormData();
    form.append('audio', blob, 'voice.webm');
    form.append('language', language);
    form.append('history', JSON.stringify(history || []));

    const res = await api.post('/ai/voice', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default aiService;

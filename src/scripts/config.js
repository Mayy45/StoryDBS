const CONFIG = {
  BASE_URL:
    import.meta.env.MODE === 'development'
      ? '/v1' 
      : 'https://story-api.dicoding.dev/v1', 
};

const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export default CONFIG;
export {vapidPublicKey};



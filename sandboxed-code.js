const injectScript = require('injectScript');
const callInWindow = require('callInWindow');
const log = require('logToConsole');
const queryPermission = require('queryPermission');

const SCRIPT_URL = 'https://frontend.sentifyd.io/sentifyd-bot/gtm/sentifyd-gtm-v1.1.3.js';

const onSuccess = () => {
  // 1. Map GTM Data fields to your Component Attributes
  // Left side: The kebab-case attribute name expected by <sentifyd-bot>
  // Right side: The GTM Template field name (data.variableName)
  const config = {
    // Embedding in host
    'containerId': data.containerId,

    // Credentials
    'api-key': data.avatarApiKey,
    'avatar-id': data.avatarId,
    'token-endpoint': data.tokenEndpoint,

    // Layout
    'toggler': data.toggler,
    'compact': data.compact,
    'canvas-width': data.canvasWidth,
    'canvas-height': data.canvasHeight,
    'chatbot-height': data.chatbotHeight,
    'corner-radius': data.cornerRadius,

    // Localization
    'ui-language': data.uiLanguage,

    // Branding
    'brand-name': data.brandName,
    'brand-logo': data.brandLogo,
    'terms-href': data.termsHref,
    'privacy-href': data.privacyHref,
    'terms-accepted': data.termsAccepted,
    'avatar-background': data.avatarBackground,

    // Conversation
    'barge-in': data.bargeIn,
    'enable-captions': data.enableCaptions
  };

  // 2. Clean up undefined values (Optional but recommended)
  // This prevents setting attributes like api-key="undefined"
  const cleanConfig = {};
  for (let key in config) {
    if (config[key] !== undefined && config[key] !== null && config[key] !== '') {
      cleanConfig[key] = config[key];
    }
  }
  
  log('clean config.', cleanConfig);

  // 3. Initialize
  callInWindow('Sentifyd.init', cleanConfig);
  data.gtmOnSuccess();
};

const onFailure = () => {
  log('Sentifyd: Failed to load script.');
  data.gtmOnFailure();
};

if (queryPermission('inject_script', SCRIPT_URL)) {
  injectScript(SCRIPT_URL, onSuccess, onFailure, 'sentifyd_main');
} else {
  data.gtmOnFailure();
}

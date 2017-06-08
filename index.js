import twemoji from 'twemoji';

let singleton;
function EmojiFallback() {
  if (singleton) return singleton;

  const unsupported = [];

  // Based on Modernizr emoji detection
  // https://github.com/Modernizr/Modernizr/blob/347ddb078116cee91b25b6e897e211b023f9dcb4/feature-detects/emoji.js
  const isSupported = (emoji) => {
    const node = document.createElement('canvas');
    if (!node.getContext || !node.getContext('2d') ||
      typeof node.getContext('2d').fillText !== 'function') {
      return false;
    }
    const ctx = node.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '32px Arial';
    ctx.fillText(emoji, 0, 0);
    return ctx.getImageData(16, 16, 1, 1).data[3] !== 0;
  };

  const checkEmoji = (emoji) => {
    const toCheck = Object.prototype.toString.call(emoji) === '[object Array]' ? emoji : [emoji];

    const notSupported = toCheck
      .filter(e => !isSupported(e))
      .map(e => e.codePointAt(0).toString(16));

    // eslint-disable-next-line no-unused-expressions
    !unsupported.push(...notSupported);
  };

  const replace = () => {
    twemoji.parse(document.body, {
      callback: (icon, options) => {
        if (!unsupported.includes(icon)) return false;
        return ''.concat(options.base, options.size, '/', icon, options.ext);
      },
    });
  };

  singleton = {
    checkEmoji,
    replace,
  };

  return singleton;
}

export default EmojiFallback;

const meting = hexo.extend.tag.env.getExtension('meting');

if (meting) {
  hexo.extend.tag.env.removeExtension('meting');
  hexo.extend.tag.register('meting', function(args) {
    /** @type {string} */
    const html = meting.fn.call(hexo, args);

    if (html.trim().startsWith('<div')) {
      return (
        '<meting-js ' +
        html
          .match(/[\w-]+\="[\w-]+"/g)
          .filter((i) => i.startsWith('data-'))
          .map((i) => i.substring(5))
          .join(' ') +
        '></meting-js>'
      );
    }

    return html;
  });
}

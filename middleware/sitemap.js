const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
let sitemap;

const generate_sitemap = async (req, res, next) => {

  res.header('Content-Type', 'application/xml');

  if (sitemap) return res.status(200).send(sitemap); // If we have a cached entry send it

  let changefreq = 'weekly';

  try {

    let links = [
      { url: '', changefreq, priority: 1 },
      { url: 'about', changefreq, priority: 0.9 },
      { url: 'terms', changefreq },
      { url: 'product', changefreq },
      { url: 'register', changefreq },
      { url: 'login', changefreq },
      { url: 'privacy-policy', changefreq },
      { url: 'contact', changefreq },
      { url: 'chance-password', changefreq },
      { url: 'search', changefreq },
    ];

    // Additionally, you can do database query and add more dynamic URLs to the "links" array.

    const stream = new SitemapStream({ hostname: 'https://pixground.com', lastmodDateOnly: true })
    return streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
      sitemap = data; // Cache the generated sitemap
      stream.end();
      return res.status(200).send(data.toString())
    });

  } catch (error) {
    return res.status(500).end();
  }
}

module.exports = { generate_sitemap };
const fetch = global.fetch ?? require('node-fetch');
(async () => {
  try {
    const res = await fetch('http://localhost:4001/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'news',
        headline: 'Test',
        body: 'Test body',
        image_url: 'data:image/png;base64,iVBORw0KGgo=',
        author_email: 'test@example.com'
      })
    });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (e) {
    console.error('error', e);
  }
})();

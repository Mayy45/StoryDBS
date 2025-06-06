import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import webpush from 'web-push';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const vapidKeys = {
  publicKey: 'BFzzf_IE_1FpOG0b0h1TTYIA08Hc8R0p9jiytkQEulrsiGDcVKYVv1PocW186wG0aVBjq3kfwS_c4_y4FIDdEBg',
  privateKey: '7V7iTpPqRHrbjvGo1o1UMyC8oVDbFzLR6q33VQIi72Y'
};

webpush.setVapidDetails(
  'mailto:your@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions = [];

app.post('/notifications/subscribe', (req, res) => {
  const subscription = req.body;
  const isExist = subscriptions.find(sub => sub.endpoint === subscription.endpoint);

  if (!isExist) {
    subscriptions.push(subscription);
    console.log('✅ Subscription diterima:', subscription.endpoint);
  }

  res.status(201).json({ error: false, message: 'Subscription tersimpan' });
});

app.post('/stories', async (req, res) => {
  const { title, description } = req.body;

  console.log(`📘 Story baru disimpan: ${title} - ${description}`);

  const payload = JSON.stringify({
  title: 'Story berhasil dibuat!',
  options: {
    body: `Judul: ${title}\nDeskripsi: ${description}`,
    data: { url: '/' }
  }
});

  const failedEndpoints = [];

  await Promise.all(subscriptions.map(async (sub, index) => {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (error) {
      console.error(' Gagal kirim ke', sub.endpoint, error.statusCode);

      if (error.statusCode === 410 || error.statusCode === 404) {
        failedEndpoints.push(index);
      }
    }
  }));

  failedEndpoints.reverse().forEach(index => {
    subscriptions.splice(index, 1);
  });

  res.status(201).json({
    error: false,
    message: `Story dibuat dan notifikasi dikirim ke ${subscriptions.length} subscriber.`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

app.get('/push-test', async (req, res) => {
  const payload = JSON.stringify({
    title: 'Tes Push Manual',
    options: {
      body: 'Ini adalah notifikasi percobaan manual.',
      data: { url: '/' }
    }
  });

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (err) {
        console.error('Gagal kirim notifikasi tes:', err);
      }
    })
  );

  res.send('Push test dikirim.');
});

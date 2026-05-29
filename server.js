require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;

// Helper to simulate a real-time typing animation in the console
const typeMessage = (text, delay = 15) => {
  return new Promise((resolve) => {
    let index = 0;
    const interval = setInterval(() => {
      process.stdout.write(text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        process.stdout.write('\n');
        resolve();
      }
    }, delay);
  });
};

const startServer = async () => {
  console.clear();
  
  await typeMessage(`🚀 Connecting to database...`, 10);

  // Connect to Database
  await connectDB();

  // Run Startup Slugs Backfill Migrations
  try {
    const Member = require('./models/member.model');
    const membersWithoutSlug = await Member.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    if (membersWithoutSlug.length > 0) {
      console.log(`[Migration] Found ${membersWithoutSlug.length} members without slugs. Migrating...`);
      for (const m of membersWithoutSlug) {
        await m.save();
      }
      console.log(`[Migration] Backfilled slugs for ${membersWithoutSlug.length} members.`);
    }

    const Committee = require('./models/committee.model');
    const committeeWithoutSlug = await Committee.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    if (committeeWithoutSlug.length > 0) {
      console.log(`[Migration] Found ${committeeWithoutSlug.length} committee members without slugs. Migrating...`);
      for (const c of committeeWithoutSlug) {
        await c.save();
      }
      console.log(`[Migration] Backfilled slugs for ${committeeWithoutSlug.length} committee members.`);
    }
  } catch (migErr) {
    console.error(`[Migration] Error backfilling slugs:`, migErr.message);
  }

  const server = http.createServer(app);

  // Initialize Sockets
  initSocket(server);

  server.listen(PORT, async () => {
    // Creative terminal UI with typing effect
    await typeMessage('\n==================================================================');
    await typeMessage('  🚀 PRACTON ALUMNI ASSOCIATION PLATFORM (প্রাক্তন পরিষদ)  ');
    await typeMessage('==================================================================');
    await typeMessage(`  [✓] DB Connected successfully`);
    await typeMessage(`  [✓] Server running on PORT: ${PORT}`);
    await typeMessage(`  [✓] WebSocket Sockets channels active`);
    await typeMessage('  ----------------------------------------------------------------');
    await typeMessage('  🔥 Developed by: Salah Uddin Kader (Dpian)');
    await typeMessage('==================================================================\n');
  });
};

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
});

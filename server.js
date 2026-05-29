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
    const color = {
      cyan: '\x1b[36m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      red: '\x1b[31m',
      brightGreen: '\x1b[92m',
      brightBlue: '\x1b[94m',
      brightCyan: '\x1b[96m',
      bold: '\x1b[1m',
      reset: '\x1b[0m'
    };

    const asciiBanner = `
${color.brightCyan}${color.bold}  ____  ____    _    ____ _____ ___  _   _ 
 |  _ \\|  _ \\  / \\  / ___|_   _/ _ \\| \\ | |
 | |_) | |_) |/ _ \\| |     | || | | |  \\| |
 |  __/|  _ < / ___ \\ |___  | || |_| | |\\  |
 |_|   |_| \\_/_/   \\_\\____| |_| \\___/|_| \\_|
${color.brightBlue}${color.bold}      /\\   | |   | |  | |  |  \\/  |  | \\ | | |_   _|
     /  \\  | |   | |  | |  | \\  / |  |  \\| |   | |  
    / /\\ \\ | |   | |  | |  | |\\/| |  | . \` |   | |  
   / ____ \\| |___| |__| |  | |  | |  | |\\  |  _| |_ 
  /_/    \\_\\______\\____/   |_|  |_|  |_| \\_| |_____|${color.reset}
`;

    console.log(asciiBanner);
    await typeMessage(`${color.yellow}${color.bold}==================================================================${color.reset}`);
    await typeMessage(`  🚀 ${color.brightCyan}${color.bold}PRACTON ALUMNI ASSOCIATION PLATFORM${color.reset} (প্রাক্তন শিক্ষার্থী পরিষদ)`);
    await typeMessage(`${color.yellow}${color.bold}==================================================================${color.reset}`);
    await typeMessage(`  ${color.brightGreen}[✓]${color.green} DB Connected successfully${color.reset}`);
    await typeMessage(`  ${color.brightGreen}[✓]${color.green} Server running on PORT: ${color.brightCyan}${PORT}${color.reset}`);
    await typeMessage(`  ${color.brightGreen}[✓]${color.green} WebSocket Sockets channels active${color.reset}`);
    await typeMessage(`${color.yellow}  ----------------------------------------------------------------${color.reset}`);
    await typeMessage(`  🔥 ${color.magenta}Developed by: ${color.brightCyan}${color.bold}Salah Uddin Kader (Dpian)${color.reset}`);
    await typeMessage(`${color.yellow}${color.bold}==================================================================${color.reset}\n`);
  });
};

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
});

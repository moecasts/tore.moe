#!/usr/bin/env node

/**
 * Theme initialization script
 * Helps users quickly set up the theme with their preferences
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m',
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

async function init() {
  log('🎨 Welcome to Astro Theme Tore Setup!\n', 'info');

  // Get user preferences
  const siteName = await question('Site name (default: Astro Theme Tore): ');
  const siteUrl = await question('Site URL (default: https://your-site.com): ');
  const authorName = await question('Author name (default: Your Name): ');
  const authorEmail = await question('Author email (default: your.email@example.com): ');
  const language = await question('Default language (en-US/zh-CN, default: en-US): ');

  const cleanExamples = await question(
    '\nRemove example content? (y/n, default: n): '
  );

  rl.close();

  log('\n📝 Updating configuration...', 'info');

  // Update config file
  const configPath = path.join(rootDir, 'src/config/index.ts');
  let configContent = fs.readFileSync(configPath, 'utf-8');

  if (siteName) {
    configContent = configContent.replace(
      /title: 'Astro Theme Tore'/,
      `title: '${siteName}'`
    );
  }

  if (siteUrl) {
    configContent = configContent.replace(
      /url: 'https:\/\/your-site\.com'/,
      `url: '${siteUrl}'`
    );
  }

  if (authorName) {
    configContent = configContent.replace(
      /author: 'Your Name'/g,
      `author: '${authorName}'`
    );
    configContent = configContent.replace(
      /name: 'Your Name'/g,
      `name: '${authorName}'`
    );
  }

  if (authorEmail) {
    configContent = configContent.replace(
      /email: 'your\.email@example\.com'/,
      `email: '${authorEmail}'`
    );
  }

  if (language && (language === 'en-US' || language === 'zh-CN')) {
    configContent = configContent.replace(
      /language: 'en-US'/,
      `language: '${language}'`
    );
  }

  fs.writeFileSync(configPath, configContent);
  log('✅ Configuration updated!', 'success');

  // Clean example content if requested
  if (cleanExamples?.toLowerCase() === 'y') {
    log('\n🧹 Cleaning example content...', 'info');

    const postsDir = path.join(rootDir, 'src/content/posts');
    const portfoliosDir = path.join(rootDir, 'src/content/portfolios');

    // Remove example posts
    if (fs.existsSync(postsDir)) {
      const posts = fs.readdirSync(postsDir);
      posts.forEach((post) => {
        if (post.endsWith('.md')) {
          fs.unlinkSync(path.join(postsDir, post));
        }
      });
      log('  ✓ Removed example posts', 'success');
    }

    // Remove example portfolios
    if (fs.existsSync(portfoliosDir)) {
      const portfolios = fs.readdirSync(portfoliosDir);
      portfolios.forEach((portfolio) => {
        if (portfolio.endsWith('.md')) {
          fs.unlinkSync(path.join(portfoliosDir, portfolio));
        }
      });
      log('  ✓ Removed example portfolios', 'success');
    }
  }

  // Create .env file if it doesn't exist
  const envPath = path.join(rootDir, '.env');
  const envExamplePath = path.join(rootDir, '.env.example');

  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    log('\n📄 Creating .env file...', 'info');
    let envContent = fs.readFileSync(envExamplePath, 'utf-8');

    if (siteUrl) {
      envContent = envContent.replace(
        /PUBLIC_SITE_URL=https:\/\/your-site\.com/,
        `PUBLIC_SITE_URL=${siteUrl}`
      );
    }

    fs.writeFileSync(envPath, envContent);
    log('✅ .env file created!', 'success');
  }

  log('\n🎉 Theme initialization complete!', 'success');
  log('\n📚 Next steps:', 'info');
  log('  1. Review and customize src/config/index.ts', 'info');
  log('  2. Update public/images/placeholder.svg with your avatar', 'info');
  log('  3. Replace public/images/favicon.ico with your favicon', 'info');
  log('  4. Start creating content in src/content/posts/', 'info');
  log('  5. Run "pnpm dev" to start the development server\n', 'info');
}

init().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'error');
  process.exit(1);
});

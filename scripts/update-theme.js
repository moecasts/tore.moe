#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const THEME_REPO = "https://github.com/moecasts/astro-theme-tore.git";

async function main() {
  try {
    // Create temporary directory
    const tempDir = await fs.promises.mkdtemp(path.join(tmpdir(), 'theme-update-'));
    console.log(`📁 Temporary directory: ${tempDir}`);

    // Clone theme to temporary directory
    console.log('📥 Cloning theme...');
    await execCommand('git', ['clone', '--depth', '1', THEME_REPO, tempDir]);

    // Define directories and files to copy
    const copyOperations = [
      { src: 'src/components/', dest: 'src/components/', delete: true },
      { src: 'src/config/theme.ts', dest: 'src/config/theme.ts', delete: false },
      { src: 'src/hooks/', dest: 'src/hooks/', delete: true },
      { src: 'src/content/config.ts', dest: 'src/content/config.ts', delete: false },
      { src: 'src/layouts/', dest: 'src/layouts/', delete: true },
      { src: 'src/lib/', dest: 'src/lib/', delete: true },
      { src: 'src/pages/', dest: 'src/pages/', delete: true },
      { src: 'src/scripts/', dest: 'src/scripts/', delete: true },
      { src: 'src/styles/', dest: 'src/styles/', delete: true },
      { src: 'src/types/', dest: 'src/types/', delete: true },
      { src: 'scripts/', dest: 'scripts/', delete: true },
      { src: 'package.json', dest: 'package.json', delete: false },
      { src: 'pnpm-lock.yaml', dest: 'pnpm-lock.yaml', delete: false }
    ];

    // Execute copy operations
    for (const op of copyOperations) {
      const srcPath = path.join(tempDir, op.src);
      const destPath = path.join(process.cwd(), op.dest);
      
      if (await exists(srcPath)) {
        if (op.delete && await exists(destPath)) {
          await fs.promises.rm(destPath, { recursive: true, force: true });
        }
        
        if (await isDirectory(srcPath)) {
          await copyDirectory(srcPath, destPath);
        } else {
          // Special handling for package.json to preserve custom fields
          if (op.src === 'package.json') {
            await mergePackageJson(srcPath, destPath);
          } else {
            await copyFile(srcPath, destPath);
          }
        }
        console.log(`✅ Updated: ${op.dest}`);
      } else {
        console.log(`⚠️  Skipped: ${op.src} (source file does not exist)`);
      }
    }

    // Clean up temporary directory
    await fs.promises.rm(tempDir, { recursive: true, force: true });
    
    console.log('✅ Theme update successful!');
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    process.exit(1);
  }
}

// Helper function to execute commands
function execCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command execution failed: ${command} ${args.join(' ')}`));
      }
    });
    
    child.on('error', reject);
  });
}

// Check if file/directory exists
async function exists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Check if path is a directory
async function isDirectory(filePath) {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

// Copy file
async function copyFile(src, dest) {
  // Ensure destination directory exists
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.copyFile(src, dest);
}

// Copy directory
async function copyDirectory(src, dest) {
  // Ensure destination directory exists
  await fs.promises.mkdir(dest, { recursive: true });
  
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

// Merge package.json, preserving custom fields
async function mergePackageJson(srcPath, destPath) {
  try {
    // Read source and destination package.json
    const srcContent = await fs.promises.readFile(srcPath, 'utf8');
    const destContent = await fs.promises.readFile(destPath, 'utf8');
    
    const srcPackage = JSON.parse(srcContent);
    const destPackage = JSON.parse(destContent);
    
    // Define custom fields to preserve
    const preservedFields = [
      'name',
      'description', 
      'author',
      'repository',
      'keywords'
    ];
    
    // Create merged package.json
    const mergedPackage = { ...srcPackage };
    
    // Preserve custom fields
    for (const field of preservedFields) {
      if (destPackage[field] !== undefined) {
        mergedPackage[field] = destPackage[field];
      }
    }
    
    // Write merged package.json
    await fs.promises.writeFile(
      destPath, 
      JSON.stringify(mergedPackage, null, 2) + '\n',
      'utf8'
    );
    
    console.log('✅ package.json merged and updated');
  } catch (error) {
    console.error('❌ Failed to merge package.json:', error.message);
    // If merge fails, fall back to direct copy
    await copyFile(srcPath, destPath);
  }
}

// Get current file URL and path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If this script is run directly
if (process.argv[1] === __filename) {
  main();
}

export default main;
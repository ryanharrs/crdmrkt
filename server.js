import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// Railway typically uses port 8080 as default
const port = process.env.PORT || 8080;

console.log('🔍 Environment check:');
console.log('PORT env var:', process.env.PORT);
console.log('Using port:', port);

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle React Router (return index.html for all non-API routes)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Frontend server running on port ${port}`);
});

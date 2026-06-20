const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const inputDir = path.join(__dirname, 'public', 'images')
const files = fs.readdirSync(inputDir).filter(f => !f.startsWith('temp-'))

async function compressAll() {
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue

    const filePath = path.join(inputDir, file)
    const tempPath = path.join(inputDir, `temp-${file}`)

    try {
      await sharp(filePath)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .toFormat(ext === '.png' ? 'png' : 'jpeg', { quality: 75 })
        .toFile(tempPath)

      fs.unlinkSync(filePath)
      fs.renameSync(tempPath, filePath)
      console.log(`✅ Compressed: ${file}`)
    } catch (err) {
      console.log(`❌ FAILED: ${file} — ${err.message}`)
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
    }
  }
  console.log('Done!')
}

compressAll()
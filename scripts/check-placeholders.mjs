// Lists every remaining owner placeholder with file and line.
// Exit code 1 when FAIL_ON_PLACEHOLDERS=1 and any remain (production builds), otherwise warn only.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = new URL('../src/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const PATTERNS = [/\[CONFIRM[^\]]*\]/g, /\[(YEARS IN BUSINESS|NUMBER OF CLIENTS|CLIENT LOGOS|TESTIMONIALS|LEADERSHIP NAMES|ACCREDITATIONS[^\]]*)\]/g]
const EXT = new Set(['.ts', '.tsx', '.css', '.md', '.json'])

const hits = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (EXT.has(extname(p)) && !p.endsWith('routeTree.gen.ts')) {
      readFileSync(p, 'utf8')
        .split(/\r?\n/)
        .forEach((line, i) => {
          for (const re of PATTERNS) {
            re.lastIndex = 0
            for (const m of line.matchAll(re)) hits.push(`${p.replace(ROOT, 'src/')}:${i + 1}  ${m[0]}`)
          }
        })
    }
  }
}
walk(ROOT)

if (hits.length === 0) {
  console.log('check:placeholders  no owner placeholders remain.')
} else {
  console.log(`check:placeholders  ${hits.length} owner placeholder(s) remain:`)
  hits.forEach((h) => console.log('  ' + h))
  if (process.env.FAIL_ON_PLACEHOLDERS === '1' || process.argv.includes('--strict')) {
    console.error('Release build refused: owner placeholders remain (see the list above).')
    process.exit(1)
  }
}

import fs from 'fs';
import path from 'path';

const ICONS_BASE_PATH = path.resolve(process.cwd(), 'src/icons');
export function iconExists(iconPath: string) {
  const fullPath = path.join(ICONS_BASE_PATH, `${iconPath}.svg`);
  return fs.existsSync(fullPath);
}

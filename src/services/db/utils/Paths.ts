import path from 'path'
import fs from 'fs';

export class Paths {
  static createPath(dir: string): string {
    const dbPath = path.join('c:\\', dir);
    const existes = fs.existsSync(dbPath);

    if (!existes) {
      let temp = 'c:\\';
      const pathArr = dir.split('/');

      for (let i = 0; i < pathArr.length; i++) {
        temp = path.join(temp.trim(), pathArr[i].trim());
        if (!fs.existsSync(temp)) {
          fs.mkdirSync(temp);
        }
      }
    }
    return dbPath;
  }
}
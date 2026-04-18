import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PORTRAITS } from '../src/data/portraits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public', 'portraits');
const markdownPath = path.join(rootDir, 'PORTRAIT_CANDIDATES.md');

function buildApiUrl(fileTitle) {
  const url = new URL('https://attackontitan.fandom.com/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', `File:${fileTitle}`);
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url');
  url.searchParams.set('format', 'json');
  return url;
}

async function resolveImageUrl(fileTitle) {
  const response = await fetch(buildApiUrl(fileTitle));
  if (!response.ok) {
    throw new Error(`无法查询图片元数据: ${fileTitle}`);
  }

  const payload = await response.json();
  const page = Object.values(payload?.query?.pages ?? {})[0];
  const imageUrl = page?.imageinfo?.[0]?.url;

  if (!imageUrl) {
    throw new Error(`未找到图片地址: ${fileTitle}`);
  }

  return imageUrl;
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载失败: ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await writeFile(outputPath, Buffer.from(arrayBuffer));
}

function buildMarkdown(rows) {
  const lines = [];
  lines.push('# 头像候选清单');
  lines.push('');
  lines.push('说明：');
  lines.push('- 当前结果页仍默认使用占位，等你确认编号后，我再把选中的本地图正式挂上去。');
  lines.push('- 所有候选图都已下载到仓库本地，网页后续只使用本地图，不走外链。');
  lines.push('- 每个角色的编号都从 1 开始，你直接回复“角色名 + 编号”即可。');
  lines.push('');

  rows.forEach(({ name, recommended, candidates }) => {
    lines.push(`## ${name}`);
    lines.push(`- 推荐：${recommended.join('、')}`);
    candidates.forEach((candidate) => {
      lines.push(`- ${candidate.id}. 本地文件：${candidate.localFile}`);
      lines.push(`  来源文件：${candidate.fileTitle}`);
      lines.push(`  原始来源：${candidate.sourceUrl}`);
      lines.push(`  说明：${candidate.note}`);
    });
    lines.push('');
  });

  return `${lines.join('\n')}\n`;
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  const markdownRows = [];

  for (const [name, portrait] of Object.entries(PORTRAITS)) {
    const completedCandidates = [];

    for (const candidate of portrait.candidates) {
      const imageUrl = await resolveImageUrl(candidate.fileTitle);
      const outputPath = path.join(rootDir, 'public', candidate.src.replace(/^\//, ''));
      await mkdir(path.dirname(outputPath), { recursive: true });
      await downloadFile(imageUrl, outputPath);

      completedCandidates.push({
        ...candidate,
        localFile: path.relative(rootDir, outputPath).replace(/\\/g, '/'),
        sourceUrl: `https://attackontitan.fandom.com/wiki/File:${candidate.fileTitle}`,
      });
    }

    markdownRows.push({
      name,
      recommended: portrait.recommended,
      candidates: completedCandidates,
    });
  }

  await writeFile(markdownPath, buildMarkdown(markdownRows), 'utf8');
  console.log(`头像下载完成，共处理 ${markdownRows.length} 个角色。`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
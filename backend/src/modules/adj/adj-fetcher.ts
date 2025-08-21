import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../logger';

const owner = 'HyperloopUPV-H8';
const repo = 'adj';
const outputDir = './adj';

/**
 * TODO: Refactor this file
 * 
 * - Use an env variable for the repo url
 * - Handle errors with the either pattern
 * - Logs with pino logger
 */

function githubApiRequest(apiPath: string): Promise<any> {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${owner}/${repo}/contents/${apiPath}`,
        headers: {
            'User-Agent': 'node.js',
            Accept: 'application/vnd.github.v3+json',
        },
    };

    return new Promise((resolve, reject) => {
        https
        .get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                resolve(JSON.parse(data));
            } else {
                reject(new Error(`GitHub API error ${res.statusCode}: ${data}`));
            }
            });
        }).on('error', reject);
    });
}

function downloadFile(url: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
        https
        .get(url, (res) => {
            if (res.statusCode !== 200) {
            reject(new Error(`Failed to download file: ${res.statusCode}`));
            return;
            }

            const fileStream = fs.createWriteStream(destination);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
        }).on('error', reject);
    });
}

async function processPath(apiPath: string, localPath: string): Promise<void> {
    const items = await githubApiRequest(apiPath);

    if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
    }

    for (const item of items) {
        const itemPath = path.join(localPath, item.name);
        if (item.type === 'file') {
            logger.info(`Descargando archivo: ${item.path}`);
            await downloadFile(item.download_url, itemPath);
        } else if (item.type === 'dir') {
            await processPath(item.path, itemPath); // Recursividad
        }
    }
}

export async function main() {
    logger.info(`📥 Descargando repo "${owner}/${repo}"...`);
    await processPath('', outputDir);
    logger.info('✅ Descarga completa.');
}

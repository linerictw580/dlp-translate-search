#! /usr/bin/env node

const yargs = require('yargs');
const utils = require('./utils');
const glob = require('glob');
const fs = require('fs');
const ncp = require('copy-paste');

const usage = '\n使用方式： trans <專案路徑> <程式名稱>';
const options = yargs
  .usage(usage)
  // .option('l', {
  //   alias: 'languages',
  //   describe: 'List all supported languages.',
  //   type: 'boolean',
  //   demandOption: false,
  // })
  .help(true).argv;

const args = yargs.argv._;
if (args[0] == null) {
  utils.showHelp();
} else {
  searchTargetFiles();
}

function searchTargetFiles() {
  const projectPath = args[0];
  const serviceName = args[1];
  // console.log(`專案路徑：${projectPath} 程式名稱：${serviceName}`);

  const pattern = `${projectPath.replace(
    /\\/g,
    '/'
  )}/DLP.Web/DLP.Web.AppPortal/ClientApp/src/app/views/*/dg/**/${serviceName}*.{html,ts}`;
  // console.log(pattern);

  // 找出要檢查的檔案清單
  glob(pattern, (err, files) => {
    if (err) throw err;
    // console.log(files);
    searchPatternInFiles(files);
  });
}

/**
 *
 * @param {string[]} files
 */
function searchPatternInFiles(files) {
  const matchInfos = [];
  let allMatches = [];
  files.forEach((file, index) => {
    const data = fs.readFileSync(file);
    let fileMatches = [];
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      const lineMatches = line.match(/('|`)([^('|`)]*)[\u4E00-\u9FFF]+([^('|`)]*)('|`)/g);
      if (lineMatches) {
        // console.log(lineMatches);
        fileMatches = [...fileMatches, ...lineMatches];
      }
    });

    if (fileMatches.length > 0) {
      matchInfos.push({
        file: file,
        matchCounts: fileMatches.length,
      });
    }

    allMatches = [...allMatches, ...fileMatches];

    // 去除重複值
    allMatches = Array.from(new Set(allMatches));
    if (index === files.length - 1) {
      matchInfos.forEach(({ file, matchCounts }) => {
        console.log(`${file} has ${matchCounts} matches.`);
      });

      const copyStr = allMatches.join('\n');
      console.log(`\nMatching results:\n${copyStr}`);
      ncp.copy(copyStr, () => {
        console.log(
          `\nTotal of ${allMatches.length} matches (no duplicates).\nCopied matching results to clipboard. You can directly paste it to excel.`
        );
      });
    }
  });
}

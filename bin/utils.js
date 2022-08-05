module.exports = { showHelp: showHelp };
const usage = '\n使用方式： trans <專案路徑> <程式名稱>';
function showHelp() {
  console.log(usage);
  console.log('\nOptions:\r');
  console.log('\t--version\t      ' + 'Show version number.' + '\t\t' + '[boolean]\r');
  console.log('\t--help\t\t      ' + 'Show help.' + '\t\t\t' + '[boolean]\n');
}

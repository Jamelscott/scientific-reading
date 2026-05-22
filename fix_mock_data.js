const fs = require('fs');

const filePath = './mockData/answers.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace answers templates with correct evaluation-specific templates
// Pattern: unitDataId: X, required: true, answers: answersYY
// Should be: unitDataId: X, required: true, answers: evalX_YY

const replacements = [
  { unitDataId: 4, pattern: /unitDataId: 4, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 4, required: true, answers: eval4_$1' },
  { unitDataId: 5, pattern: /unitDataId: 5, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 5, required: true, answers: eval5_$1' },
  { unitDataId: 6, pattern: /unitDataId: 6, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 6, required: true, answers: eval6_$1' },
  { unitDataId: 7, pattern: /unitDataId: 7, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 7, required: true, answers: eval7_$1' },
  { unitDataId: 8, pattern: /unitDataId: 8, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 8, required: true, answers: eval8_$1' },
  { unitDataId: 9, pattern: /unitDataId: 9, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 9, required: true, answers: eval9_$1' },
  { unitDataId: 10, pattern: /unitDataId: 10, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 10, required: true, answers: eval10_$1' },
  { unitDataId: 11, pattern: /unitDataId: 11, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 11, required: true, answers: eval11_$1' },
  { unitDataId: 12, pattern: /unitDataId: 12, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 12, required: true, answers: eval12_$1' },
  { unitDataId: 13, pattern: /unitDataId: 13, required: true, answers: answers(\d+)/g, replacement: 'unitDataId: 13, required: true, answers: eval13_$1' },
];

let changeCount = 0;
replacements.forEach(({ unitDataId, pattern, replacement }) => {
  const matches = content.match(pattern);
  if (matches) {
    changeCount += matches.length;
    content = content.replace(pattern, replacement);
    console.log(`Fixed ${matches.length} entries for unitDataId: ${unitDataId}`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nTotal changes made: ${changeCount}`);
console.log('Mock data file updated successfully!');

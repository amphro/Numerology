var fs = require('fs')
var convert = require('./Numerology').convertWord;

fs.readFile('/usr/share/dict/words', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var words = data.split('\n'), indexMap = {}, singleIndexMap = {};
  
  for (var i = 0; i < words.length; i++) {
      var word = words[i];
      
      var key = convert(word, true)
      if (!indexMap[key]) {
        indexMap[key] = [];
      }
      indexMap[key].push(word);
      
      key = convert(word, false);
      if (!singleIndexMap[key]) {
          singleIndexMap[key] = [];
      }
      singleIndexMap[key].push(word);
  }
  
  fs.writeFile('./multiDigitIndex.json', JSON.stringify(indexMap));
  fs.writeFile('./singleDigitIndex.json', JSON.stringify(singleIndexMap));
});

(function() {
    var TITLE = 'Numerology';
    
    //Private app functions
    
    //TODO I should look at the performance of how I'm manipulating localstorage, but
    //for now I can't imagine anyone storing a lot of these until I make a better way
    //to manage them.
    var ResultsLocalStorage = function() {
        function get() {
            if (!localStorage.savedConversions) {
                localStorage.savedConversions = JSON.stringify([]);
            }
            return JSON.parse(localStorage.savedConversions);
        }
        
        function save(newResultsList) {
            localStorage.savedConversions = JSON.stringify(newResultsList);
        }
        
        return {
            getSavedResults : get,
            addSavedResult : function(result) {
                var savedResults = get();
                for (var i = 0; i < savedResults.length; i++) {
                    if (savedResults[i].word === result.word) {
                        return savedResults;
                    }
                }
                savedResults.push(result);
                save(savedResults);
                return savedResults;
            }
        }
    }();
    
    var Charts = {
        default : {
            keys : {
                a : 1, b : 2, c : 3, d : 4, e : 5, f : 6, g : 7, h : 8, i : 9,
        	    j : 1, k : 2, l : 3, m : 4, n : 5, o : 6, p : 7, q : 8, r : 9,
        	    s : 1, t : 2, u : 3, v : 4, w : 5, x : 6, y : 7, z : 8
    	    },
    	    maxRowLength : 9,
    	    rows : [9, 9, 8]
        },
        defaultInverse : {
            keys : {
                a : 1, b : 2, c : 3, d : 4, e : 5, f : 6, g : 7, h : 8, i : 9,
        	    j : 1, k : 2, l : 3, m : 4, n : 5, o : 6, p : 7, q : 8, r : 9,
        	    s : 1, t : 2, u : 3, v : 4, w : 5, x : 6, y : 7, z : 8
    	    },
    	    maxRowLength : 9,
    	    rows : [9, 9, 8]
        },
        pythagorean : {
            keys : {
                a : 1, b : 2, c : 3, d : 4, e : 5, f : 6, g : 7, h : 8, i : 9,
        	    j : 1, B1: 0, l : 3, m : 4, n : 5, o : 6, p : 7, q : 8, r : 9,
        	    s : 1, t : 2, u : 3, B2: 0, w : 5, x : 6, y : 7, z : 8, B3: 0,
        	    k : 11, v : 22
    	    },
    	    maxRowLength : 9,
    	    rows : [9, 8, 7, 2]
        }
    }
    var currentNumberChart = Charts.default;
    
    function convertNumberToSingleDigit(number) {
    	var numWord = number + '';
    	log += ' = ' + numWord;

    	if (numWord.length > 1) {
    		var newNum = 0;
    		for (var i = 0; i < numWord.length; i++) {
    			newNum += parseInt(numWord[i]);
    		}
    		return convertNumberToSingleDigit(newNum);
    	}
    	return number;
    }
    
    var log = "";
    function convertWord(word, multiDigit) {
        var number = 0;
        log = "";

    	var numbers = [], charValues = currentNumberChart.keys;
    	for (var i = 0; i < word.length; i++) {
    		var letter = word[i].toLowerCase();
    		if (charValues[letter]) {
    			number += charValues[letter];
    			numbers.push(charValues[letter]);
    		}
    	}

    	log = numbers.join(' + ');
        return multiDigit ? number : convertNumberToSingleDigit(number);
    }
    
    //For NodeJS
    if (typeof exports !== 'undefined') {
        exports.convertWord = convertWord;
    } 
    //For Angular
    else {

    //Public controllers
    var app = angular.module(TITLE, []);
    
    app.controller('Global', function($scope) {
        $scope.title = TITLE;
    });
    
    app.controller('NumberChart', function($scope, $log) {
        $scope.current = currentNumberChart;
        
        $scope.getRows = function() {
            currentNumberChart
        }
        
        //TODO Placeholder to select new charts
        $scope.getCharts = function() {
            
        };
    });
    
    app.controller('WordsToNumber', function($scope, $log) {
        $scope.input = '';
        $scope.number = '0';
        $scope.caculation = '';
        //TODO Would probably be good to do these on the server
        $scope.savedConversions = ResultsLocalStorage.getSavedResults();
        
        $scope.convertWord = function() {
        	var word = $scope.input;
        	$scope.number = convertWord(word);
        	$scope.caculation = word + (!!word ? ' = ' + log : '');
        };
        
        //TODO I should add a way to remove saved results
        
        $scope.saveResult = function() {
        	if ($scope.input) {
        	    $scope.savedConversions = ResultsLocalStorage.addSavedResult({
        	        word : $scope.input,
        	        number : $scope.number,
        	        caculation : $scope.calculation
        	    });
        	}
        };
        
        var cur = currentNumberChart;
        $scope.valueChartRows = function() {
            var rows = [];
            var indexMap = {}, index = 0;
            
            for (var key in cur.keys) {
                indexMap[index++] = {key : key, value : cur.keys[key]};
            }
            
            for (var rowIndex = 0; rowIndex < cur.rows.length; rowIndex++) {
                var row = [];
                for (var i = 0; i < cur.maxRowLength; i++) {
                    var keyObj = indexMap[rowIndex * cur.maxRowLength + i];
                    if (keyObj && keyObj.key && keyObj.key.indexOf('B') !== 0) {
                        row.push(keyObj.key + ' : ' + keyObj.value);
                    } else {
                        row.push('');
                    }
                }
                rows.push(row);
            }
            return rows;
        }();
    });
    }
})();
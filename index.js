"use strict";
/**
 * RULES
 * 	1. 	functional programs should be immutable. 
 * 		create new data structures instead of modifying ones that already exist
 * 		
 *  2.  functional programs should be stateless, which basically means they should 
 *  	perform every task as if for the first time, with no knowledge of 
 *  	what may or may not have happened earlier in the program’s execution
 */
let fs = require('fs');
 
class CSVToJson {
	constructor(){
		this.fileData;
		this.newJsonObject;
		this.csvRowTitles;
	}

	readFile(file){

		var data = fs.readFileSync(file, 'utf8');
		if(data.length){
			return new Promise(function(resolve,reject){
				resolve(data);
			});
		} 
	}

	createArrayRows(data){
		var row = data.split('\n');
		return new Promise(function(resolve,reject){
			resolve(row);
		});
	}

	createArrayKeyValue(data){
		function createValueObject(data){
			var arr;
			var obj = {};
			var arrVal = [];
			var arrKey = [];
		 	 
			data.forEach(function(item,index,array){
				if(index === 0 ){
					arr = item.split(',');
					arrKey.push(arr);
				} else {
					arr = item.split(',');
					arrVal.push(arr);
				}
			}); 
			return { arrKey, arrVal }; 
		}
		return new Promise(function(resolve){
			resolve(createValueObject(data));
		});
	} 
  
	updateCSVRowTItles(data){
		function sendValue(key,val){
			var obj;
			var arr = [];
			val.forEach((item,i,array) => {
				obj = {};
				item.forEach(function(elem,index,array){
					obj[key[index]] = elem;	
				});
				arr.push(obj);
			});
			return arr;
		}

		return new Promise(function(resolve){
			var key = data.arrKey[0];
			var val = data.arrVal;
			resolve(sendValue(key,val));
		});
	}

	read(path,fun){

		/**
		 * TO DO LIST
		 * 2. Create a array of the keys from the csv of the first line.
		 * 3. Create a new empty array to hold our csv row
		 * 4. Create a array of the row containing the value
		 * 5. Create a object for each row
		 * 5. For each array item in our key row we will create a key value pair between the row title
		 *    item and the row data
		 */
		 this.readFile(path)
		.then(this.createArrayRows)
		.then(this.createArrayKeyValue)
		.then(this.updateCSVRowTItles)
		.then(function(data){ 
			 fun(data);
		});
		
	}

	extend(obj1,obj2){
	  var obj3 = {};
	  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
	  return obj3;
	}

	strip(str){
	  var regEx = /"|'(?=\w)/g; 
	  var obj;
	  str.map(function(item){
	  	for(obj in item){
	  		console.log(item[obj]);
	  		item[obj] = item[obj].replace(regEx,"");
	  	}
	  });
	//   var outputArr = [];  
	//   var foo = str.map(function(item){
	//     var arr = [];
	//     item.map(function(elem){
	//        arr.push(elem.match(regEx)[0]);
	//     });
	//     return arr;
	// }); 
	   return str;
	}

	write(data,option){
		var defaults = {
			stripComma : false
		};
		var defaults = this.extend(defaults,option || {});
		if(defaults.stripComma){
			data = this.strip(data);
		}

		fs.writeFile("output.json", JSON.stringify(data,null, 4), function(err) {
    		if(err) {
        		return console.log(err);
    		}
    		console.log("The file was saved!");
		}); 
	}
} 

let csvToJson = new CSVToJson();

var path = 'example.csv';

csvToJson.read(path,(file) => {
	csvToJson.write(file,{
		stripComma : true
	});
});
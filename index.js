"use strict";
let fs = require('fs');
 
class CSVToJson {
	constructor(){
		this.fileData;
		this.newJsonObject;
		this.csvRowTitles;
	}

	readFile(file){	
		return new Promise(function(resolve,reject){
			fs.readFile(file,'utf8',(err, data) => {
	  			if (err) throw err;
		  			resolve(data);	
			});
		});
	}
 	/**
 	 * Split each row in the CSV into an Array
 	 * @param  {[type]} data from csv
 	 * @return {[type]}      [Promise
 	 */
	createArrayRows(data){
		var row = data.split('\n');

		function removeEmpy(array){
		  var _indexOf;
		  var _arr = [];
		  for(var i = 0; i < array.length; i++){
		    if(array[i] !== ''){
		     _arr.push(array[i]);
		    }
		  }
		  return _arr;
		}
		return removeEmpy(row);
	}
  
	createArrayKeyValue(data){
		function createValueObject(data){
			var arr;  
			var obj = {};
			var arrVal = [];
			var arrKey = [];
			//var regEx = /(\d+\.\d+|[A-Z]\d+)+|(([0-9]+\/{1})+\d+)|([A-Z]\/.|[A-Za-z]+)|(\d+\.\d+|[0-9]+)|(\-\w+)\.(\d+)(|\w+)|("(.*?)")+/g;
		 	var regEx = /("(.*?)")|([^,\s][^,]*)/g;
			data.forEach(function(item,index,array){
				if(index === 0 ){
					arr = item.split(',');
					arrKey.push(arr);
				} else {
					arr = item.match(regEx); 
					arrVal.push(arr);
				}
			}); 
			return { arrKey, arrVal }; 
		}
		return createValueObject(data); 
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
		return sendValue(data.arrKey[0],data.arrVal);	
	}

	read(path,fun){
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
	  		item[obj] = item[obj].replace(regEx,"");
	  	}
	  });
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

/**
 * Usage: Create a new object
 */
let csvToJson = new CSVToJson();

/**
 * File pathto csv file
 */
var path = 'example.csv';

/**
 * @param  path string Path to CSV file
 * @param  object JSON object converted from CSV file
 */
csvToJson.read(path,(file) => {
	csvToJson.write(file,{
		stripComma : true
	});
});
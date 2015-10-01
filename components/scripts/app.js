//dependency injection
//manage the lifecycle of the services




import angular from 'angular';

import '../sass/main.scss';

let angulatorModule = angular.module('angulator', []);

    angulatorModule.controller('calCtr', function($scope) {
        $scope.formular = "";
        $scope.result = "";
        var lastChar = "",
            fArr = [];
        
        var isaNumber = function(str){
            var ifNum = new RegExp(/^\d+$/),
                ifDeci = new RegExp(/^\d+(?:\.\d+)?$/),
                ifDeciHalf = new RegExp(/^\d+(?:\.)?$/);
                
            if(ifNum.test(str) || ifDeci.test(str) || ifDeciHalf.test(str)){
                return true;
            }
            else{
                return false;
            }
        };
        
        var search = function(arr, val){
            var keys = [];
            for (let i = 0; i<arr.length; i++){
                if(arr[i].charCodeAt(0) === val  && arr[i].length===1){
                    keys.push(i);
                }
            }
            return keys;
        };
        
        var searchTwo = function(arr, code1, name1, code2, name2){
            var temp = arr;
            var one = search(temp, code1);
            var two = search(temp, code2);
            var result = [];
            var key1 = 0,
                key2 = 0;
                
            while(key1<one.length && key2<two.length){
                if(one[key1]<two[key2]){
                    result.push({
                       key:one[key1],
                       op: name1
                    });
                    key1++;
                }
                else{
                    result.push({
                       key:two[key2],
                       op: name2
                    });
                    key2++;
                }
            }
            for(key1; key1<one.length; key1++){
                result.push({
                    key:one[key1],
                    op: name1
                });
            }
            for(key2; key2<two.length; key2++){
                result.push({
                    key:two[key2],
                    op: name2
                });
            }
            
            return result;
        };
        
        var parseSqrt = function(arr){
            var temp = arr;
            var sqrt = search(temp, 8730);
    
            for(let i = 0; i<sqrt.length; i++){
                var key = sqrt[i];
                if(key !== temp.length-1){

                    temp[key+1] = (Math.sqrt(parseFloat(temp[key+1]))).toString();
                    temp[key] = "";
                }
                else{
                    temp.splice(temp.length-1);
                }
            }
            while(temp.indexOf("")!==-1){
                temp.splice(temp.indexOf(""),1);
            }
            return temp;
        };
        
        var parseTimesAndDivide = function(arr){
            var temp = arr;
            var td = searchTwo(temp, 215, "time", 247, "divide");
            
            for(let i = 0; i<td.length;i++){
                var key = td[i].key,
                    op = td[i].op,
                    value;
                    

                if(key !== temp.length-1){
                    if(op==="time"){
                        value = parseFloat(temp[key-1]) * parseFloat(temp[key+1]);
                    }
                    else if(op === "divide"){
                        value = parseFloat(temp[key-1]) / parseFloat(temp[key+1]);
                    }
                    temp[key-1] = "";
                    temp[key] = "";
                    temp[key+1] = value.toString();
                }
            }
            
            while(temp.indexOf("")!==-1){
                temp.splice(temp.indexOf(""),1);
            }
            
            return temp;
        };
        
        
        var parsePlusAndMinus = function(arr){
            var temp = arr,
                pm = searchTwo(temp,43,"plus",8722,"minus");
            

            for(let i = 0; i<pm.length;i++){
                var key = pm[i].key,
                    op = pm[i].op;

                if(key !== temp.length-1){
                    
                    if(op==="plus"){
                        temp[key+1] = (parseFloat(temp[key+1]) + parseFloat(temp[key-1])).toString();
                        temp[key] = "";
                        temp[key-1] = "";
                    }
                    else if(op === "minus"){
                        if(key===0){
                            temp[key+1] = (0 - parseFloat(temp[key+1])).toString();
                            temp[key] = "";
                            temp[key-1] = "";
                        }
                        else{
                            temp[key+1] = (parseFloat(temp[key-1]) - parseFloat(temp[key+1])).toString();
                            temp[key] = "";
                            temp[key-1] = "";
                        }
                    }
                }
                
            }
            
            while(temp.indexOf("")!==-1){
                temp.splice(temp.indexOf(""),1);
            }
            
            return temp;
        };
        
        
        var parseNegtive = function(arr){
            var temp = arr,
                ng = search(temp, 8722);


            for(let i = 0; i<ng.length; i++){
                var key = ng[i];
                
                if( (!isaNumber(temp[key-1]) || key===0) && key!==temp.length-1){
                    temp[key+1] = (-parseFloat(temp[key+1])).toString();
                    temp[key] = "";
                }
            }
            
            while(temp.indexOf("")!==-1){
                temp.splice(temp.indexOf(""),1);
            }
            
            return temp;
        };
        
        
        
        var calculate = function(arr){
            var temp =  [];

            
            for(let i = 0; i< arr.length; i++){
                temp.push(arr[i]);
            }

            while(temp.length>1 && !isaNumber(temp[temp.length-1])  ){
                temp.splice(temp.length-1,1);
            }
            
            temp = parseSqrt(temp);
            temp = parseNegtive(temp);

            temp = parseTimesAndDivide(temp);
            temp = parsePlusAndMinus(temp);
            

            
            
            return temp.join("");
        };
        
        $scope.formularAdd = function(event) {
            var val = event.target.innerText,
                unicode = val.charCodeAt(0),
                lastUnicode = lastChar.charCodeAt(0);
                
            var ifNum = new RegExp(/^\d+$/);

            if(ifNum.test(val)){
                if(ifNum.test(lastChar) || lastChar=="." ){
                    fArr[fArr.length-1]+=val;
                    lastChar = val;
                }
                else{
                    fArr.push(val);
                    lastChar = val;
                } 
            }
            else if(val==="."){
                if( ifNum.test(fArr[fArr.length-1])){
                    fArr[fArr.length-1]+=val;
                    lastChar = val;
                }
            }
            
            
            else if( ((unicode === 43 || unicode === 215 || unicode === 247) && ifNum.test(lastChar) ) ||
            (unicode === 8722 && (lastUnicode === 215 || lastUnicode === 247 || lastChar==="" || ifNum.test(lastChar))) ||
            (unicode === 8730 && (lastChar ==="" || lastUnicode === 215 || lastUnicode === 247 || lastUnicode === 43 || lastUnicode === 8722)) 
            ){
                fArr.push(val);
                lastChar = val;
            }
            
            
            $scope.formular  = fArr.join("");
            $scope.result = calculate(fArr);
            
            // console.log(fArr);
            // console.log(lastChar);
            
        };
        
        $scope.clear = function(){
            $scope.formular = "";
            $scope.result = "";
            lastChar = "";
            fArr = [];
        };
        
        $scope.equal = function(){
            $scope.formular = $scope.result;
            $scope.result = "";
            if($scope.formular.length>0){
                lastChar = $scope.formular[$scope.formular.length-1];
            }
            fArr = [$scope.formular];

        };
    });
     

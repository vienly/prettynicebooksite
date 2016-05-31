var ar = [5,4,3,7,6,5,3,2,1,8,7,6,6];

//finds most frequent item in array
mostFrequent = function(anArray){
  //if property does not exist, return null
  if(anArray.length == 0){
    return null;
  }
  //Declare an object to hold frequencies, var for most frequent item, and how many times it occured
  var itemAndItsCount = {};
  var mostFreqItem = 0;
  var mostFreqItemCount = 0;
  anArray.forEach(function(arrItem){
    if(arrItem.volumeInfo.publisher){
    //if array item does not exist yet in object holder, add it in
      if(itemAndItsCount[arrItem.volumeInfo.publisher] == null){
        itemAndItsCount[arrItem.volumeInfo.publisher] = 1;
        //if it already exists, increase its count
      }else{
        itemAndItsCount[arrItem.volumeInfo.publisher]++;
      }
      //if array item exceeds the previous most occuring item, reestablish this one as the most frequent one
      if(itemAndItsCount[arrItem.volumeInfo.publisher] > mostFreqItemCount){
        mostFreqItem = arrItem.volumeInfo.publisher;
        mostFreqItemCount = itemAndItsCount[arrItem.volumeInfo.publisher];
        // console.log(itemAndItsCount);
      }
    }
  });
  return mostFreqItem;
};

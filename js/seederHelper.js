function dataArray(attributes, data) {
    var array = [];
    for (var i=0; i<data[0].length; i++){
        var obj = {};
        for (var j in attributes) {
            obj[attributes[j]] = data[j][i];
        }
        array.push(obj);
    }
    return array;
}

module.exports.dataArray = dataArray;

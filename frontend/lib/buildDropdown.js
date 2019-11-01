export const buildDropdown = function(availableStock, unit, zero = false) {
    var arr = [];
    for (let i = zero ? 0 : 1; i <= availableStock; i++) {
        arr.push(<option key={i} value={i}>{i} of {unit}</option>)
    }

    return arr; 
}
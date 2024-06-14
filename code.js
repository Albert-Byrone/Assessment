function flattenArray(arr) {
  let result = [];

  const flatten = function (element) {
    if (Array.isArray(element)) {
      element.forEach(flatten);
    } else {
      result.push(element);
    }
  };

  arr.forEach(flatten);
  return result;
}

// Example usage:
const multiDimensionalArray = [[[1, 2], [3]], [4, [5, [6]]]];
console.log(flattenArray(multiDimensionalArray)); // Output: [1, 2, 3, 4, 5, 6]
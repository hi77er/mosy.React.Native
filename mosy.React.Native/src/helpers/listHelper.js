const listEqualsIgnoreOrder = (array1, array2) => (array1 == null && array2 == null)
  || ((array1 && array2) && array1.every((x) => array2.includes(x)) && array2.every((x) => array1.includes(x)));

export const listHelper = {
  listEqualsIgnoreOrder,
};
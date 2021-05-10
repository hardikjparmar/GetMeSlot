export const getDateString = (date: Date) => {
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  return [
    (dd > 9 ? '' : '0') + dd,
    (mm > 9 ? '' : '0') + mm,
    date.getFullYear(),
  ].join('-');
};

export const today = (): string => {
  let date: Date = new Date();
  const dateString = getDateString(date);
  return dateString;
};

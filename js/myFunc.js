module.exports = {
  
  formatDate: arg => {
    // if arg is an empty array
    if (arg.length === 0) return arg;
    // if arg is a not empty array
    else if (arg.length > 0) {
      return arg.map(loan => 
        loan = {
          ...loan.dataValues,
          loaned_on: loan.loaned_on.substring(0, 10),
          return_by: loan.return_by.substring(0, 10),
          returned_on: (loan.returned_on === null) ? null : loan.returned_on.substring(0, 10),
      })
    } 
    else {
    // if not array, assume arg is an object
      return {
        ...arg.dataValues,
        loaned_on: arg.loaned_on.substring(0, 10),
        return_by: arg.return_by.substring(0, 10),
        returned_on: (arg.returned_on === null) ? null : arg.returned_on.substring(0, 10),
      }
    }
  },

  log: (data, message) => {
    const m = message || 'Data logged: ';
    console.log(`\n${m}\n`, data);
    return data;
  }
}
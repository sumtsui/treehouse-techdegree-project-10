module.exports = {
  
  formatDate: arg => {
    if (arg.length === 0) return arg; // if arg is an empty array
    return ((arg.length > 0) ? // if arg is a not empty array
      arg.map(loan => 
        loan = {
          ...loan.dataValues,
          loaned_on: loan.loaned_on.slice(0, 10),
          return_by: loan.return_by.slice(0, 10),
          returned_on: (loan.returned_on === null) ? null : loan.returned_on.slice(0, 10),
      })
      :
      // if arg is an object
      {
        ...arg.dataValues,
        loaned_on: arg.loaned_on.slice(0, 10),
        return_by: arg.return_by.slice(0, 10),
        returned_on: (arg.returned_on === null) ? null : arg.returned_on.slice(0, 10),
      }
    )
  },

  log: (data, message) => {
    const m = message || 'Data logged:';
    console.log(`\n${m}\n`, data);
    return data;
  },
}
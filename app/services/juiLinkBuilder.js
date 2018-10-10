
module.exports = (req, caseId, tab) => {

  const juiUrl =
    req.protocol + '://' +
    req.get('Host').replace('4000', '3000') +
    `/jurisdiction/IA/casetype/Asylum/viewcase/${caseId}/${tab}`;

  return juiUrl;
};

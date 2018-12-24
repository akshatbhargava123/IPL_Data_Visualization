export default [
  {
    message: 'convertToJSON',
    func: (csv) => {
      const rows = csv.split('\n'),
        headers = rows.splice(0, 1)[0].split(','),
        json = [];

      rows.forEach(row => {
        const obj = {};
        const cols = row.split(',');
        headers.forEach((header, j) => {
          obj[header] = cols[j];
        });
        json.push(obj);
      });
      return json;
    }
  }
];
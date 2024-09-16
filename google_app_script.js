function sendDataToMongoDB() {
  const url = "https://db-to-googlesheet.onrender.com/add-to-mongo"; // Replace with your actual API endpoint

  // Get the active sheet and its data
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();
  
  // Transform data into an array of objects
  const headers = data[0]; // Assume first row is header
  const payloadData = data.slice(1).map(row => {
    let obj = {};
    row.forEach((cell, index) => {
      obj[headers[index]] = cell;
    });
    return obj;
  });

  // Prepare the payload to send to MongoDB
  const payload = {
    "data": payloadData // Transformed data from Google Sheets
  };

  // Set the request options
  const options = {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  // Send the data to MongoDB via API
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText()); // Log the response from the API
  } catch (error) {
    Logger.log("Error: " + error.message); // Log the error
  }
}
// function sendDataToMongoDB(){}
function updateGoogleSheetFromMongoDB() {
  // MongoDB API endpoint
  const url = "https://db-to-googlesheet.onrender.com/get-data"; // Replace with your actual API endpoint

  try {
    // Fetch data from MongoDB
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    console.log('Fetched data:', data); // Log the fetched data

    // Check if data is empty or not an array
    if (!Array.isArray(data) || data.length === 0) {
      console.log('No data to update.');
      return;
    }

    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Clear existing data
    sheet.clear();

    // Prepare headers and values
    const headers = Object.keys(data[0]);
    console.log('Headers:', headers); // Log headers

    // Prepare values for rows
    const values = data.map(item => headers.map(header => item[header] || '')); // Handle missing values
    console.log('Values:', values); // Log values

    // Set headers in the first row
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Set data starting from the second row
    if (values.length > 0) {
      sheet.getRange(2, 1, values.length, headers.length).setValues(values);
    }

    console.log('Successfully updated Google Sheet.');

  } catch (error) {
    console.error('Error:', error.message);
  }
}
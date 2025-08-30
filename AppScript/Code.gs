function doOptions() {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * Logs any message to the Errors sheet with timestamp, level, message, and data.
 */
function logToSheet(level, message, data) {
  try {
    var spreadsheetId = "1K3tWDl7rTBwnHfZMdoqCbu_a3dOYju6XYSJENv5epVQ";
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var errorSheet = spreadsheet.getSheetByName("Errors");
    if (!errorSheet) {
      errorSheet = spreadsheet.insertSheet("Errors");
      errorSheet.appendRow(["Timestamp", "Level", "Message", "Data"]);
      errorSheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }
    var row = [
      new Date(),
      level,
      message,
      data !== undefined ? (typeof data === 'string' ? data : JSON.stringify(data)) : ""
    ];
    errorSheet.appendRow(row);
  } catch (err) {
    // If logging fails, at least try to log to Logger
    Logger.log("Failed to log to Errors sheet: " + err.message);
  }
}

function doPost(e) {
  logToSheet("INFO", "Entered doPost", null);
  try {
    logToSheet("INFO", "Received parameters", e.parameter);
    const params = e.parameter;
    const entity = params.university ? params.university.toString().toLowerCase() : "national";
    logToSheet("INFO", "Entity determined", entity);
    const spreadsheetId = "1K3tWDl7rTBwnHfZMdoqCbu_a3dOYju6XYSJENv5epVQ";
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet;

    switch (entity) {
      case "cc":
      case "ric":
      case "apiit":
      case "sliate":
      case "slim":
      case "iusl":
      case "ucl":
      case "kaatsu_intl_uni":
      case "slithm":
        sheet = spreadsheet.getSheetByName("cc");
        break;

      case "cs":
      case "gisl":
      case "academy_of_design":
      case "amdt":
      case "susl":
      case "open_uni":
      case "esol":
      case "st_george":
      case "bcic":
        sheet = spreadsheet.getSheetByName("cs");
        break;

      case "kandy":
      case "imperial_college":
      case "java_institute":
        sheet = spreadsheet.getSheetByName("kandy");
        break;

      case "sliit":
      case "bcas":
      case "cinec":
      case "imbs":
        sheet = spreadsheet.getSheetByName("sliit");
        break;

      case "rajarata":
      case "idm":
        sheet = spreadsheet.getSheetByName("rajarata");
        break;

      case "nibm":
      case "icc":
      case "ocbsl":
      case "nawaloka_college":
        sheet = spreadsheet.getSheetByName("nibm");
        break;

      case "nsbm":
      case "bms_campus":
        sheet = spreadsheet.getSheetByName("nsbm");
        break;

      case "cn":
      case "acbt":
      case "ncbt":
      case "nisd":
      case "mnce":
        sheet = spreadsheet.getSheetByName("cn");
        break;

      case "ruhuna":
      case "aquinas":
      case "esoft":
      case "apex":
        sheet = spreadsheet.getSheetByName("ruhuna");
        break;

      case "usj":
      case "british_council":
      case "wisdom":
      case "icbt":
      case "ecu":
        sheet = spreadsheet.getSheetByName("usj");
        break;

      case "jaffna":
        sheet = spreadsheet.getSheetByName("jaffna");
        break;

      case "vavuniya":
        sheet = spreadsheet.getSheetByName("vavuniya");
        break;

      case "wayamba":
        sheet = spreadsheet.getSheetByName("wayamba");
        break;

      case "saegis":
        sheet = spreadsheet.getSheetByName("saegis");
        break;

      case "iit":
        sheet = spreadsheet.getSheetByName("iit");
        break;

      case "eusl":
        sheet = spreadsheet.getSheetByName("eusl");
        break;

      case "sliit_ku":
        sheet = spreadsheet.getSheetByName("slitt_ku");
        break;

      case "kdu":
        sheet = spreadsheet.getSheetByName("kdu");
        break;

      case "sltc":
        sheet = spreadsheet.getSheetByName("sltc");
        break;

      case "uwu":
        sheet = spreadsheet.getSheetByName("uwu");
        break;

      case "horizon_campus":
        sheet = spreadsheet.getSheetByName("horizon")
        break;

      default:
        sheet = spreadsheet.getSheetByName("national");
        break;
    }

    if (params.utm_term && params.utm_term.includes(".")) {
      const utmParts = params.utm_term.split(".");
      params.utm_term = utmParts[0];  // First part (month)
      params.creator = utmParts[1];    // Second part (creator)
    }

    const paramToHeaderMapping = {
      "firstName" : "First Name",
      "lastName" : "Last Name",
      "email" : "Email",
      "contactNumber" : "Contact No",
      "utm_source": "UTM Source",
      "utm_medium": "UTM Medium",
      "utm_campaign" : "UTM Campaign",
      "utm_term": "UTM Term",
      "utm_content": "UTM Content",
      "creator":"Campaign Creator/Team Name",
      "leadAlignment":"Lead Alignment",
      "product":"Product"
    };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    logToSheet("INFO", "Sheet headers", headers);
    const normalizedHeaders = headers.map(header => header.toLowerCase().replace(/\s+/g, ''));
    const newRow = Array(headers.length).fill("");
    newRow[0] = new Date();
    Object.entries(params).forEach(([param, value]) => {
      const mappedHeader = paramToHeaderMapping[param];
      if (mappedHeader) {
        const headerIndex = headers.indexOf(mappedHeader);
        if (headerIndex !== -1) {
          newRow[headerIndex] = value;
        }
      }
    });
    logToSheet("INFO", "New row before append", newRow);
    sheet.appendRow(newRow);
    logToSheet("INFO", "Row appended successfully", newRow);
    logToSheet("INFO", "doPost completed successfully", null);
    return ContentService.createTextOutput("Success: Row appended.")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    logToSheet("ERROR", "Error in doPost", { error: error.message, stack: error.stack, params: e.parameter });
    // Also log to error sheet using legacy function for redundancy
    logError(e.parameter, error);
    return ContentService.createTextOutput("Error: " + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Logs errors to a dedicated error sheet
 * @param {Object} requestData - The request parameters
 * @param {Error} error - The error that occurred
 */
function logError(requestData, error) {
  try {
    const spreadsheetId = "1K3tWDl7rTBwnHfZMdoqCbu_a3dOYju6XYSJENv5epVQ";
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

    // Get or create error sheet
    let errorSheet = spreadsheet.getSheetByName("Errors");
    if (!errorSheet) {
      errorSheet = spreadsheet.insertSheet("Errors");
      errorSheet.appendRow(["Timestamp", "Request Data", "Error Message", "Error Stack"]);
      errorSheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }

    // Create error row
    const errorRow = [
      new Date(),
      JSON.stringify(requestData),
      error.message,
      error.stack
    ];

    errorSheet.appendRow(errorRow);

    // Log to console as well
    console.error("Error in doPost: ", error);
    Logger.log("Error logged to error sheet: " + error.message);

  } catch (loggingError) {
    // If we can't log to the sheet, at least log to console
    console.error("Error while logging error: ", loggingError);
    console.error("Original error: ", error);
    Logger.log("Failed to log error to sheet: " + loggingError.message);
  }
}

function testDoPost() {
  const e = {
    parameter: {
      university: 'cc',
      utm_source: 'Facebook',
      utm_medium: 'Blog',
      utm_campaign: 'GT',
      utm_term: 'January.TeamA',
      utm_content: 'story',
      id: 'LK-test'
    }
  };
  doPost(e);
}

// Test function to simulate an error condition
function testErrorHandling() {
  const e = {
    parameter: {
      university: 'fake_university',
      utm_source: 'TestError',
      utm_medium: 'ErrorTest'
    }
  };

  // Force an error by using a non-existent spreadsheet ID
  const originalSpreadsheetId = "1K3tWDl7rTBwnHfZMdoqCbu_a3dOYju6XYSJENv5epVQ";

  try {
    // This will intentionally cause an error - for testing only
    const nonExistentSheet = SpreadsheetApp.openById("non-existent-id");
  } catch (error) {
    logError(e.parameter, error);
    Logger.log("Test error logged successfully");
  }
}
function doOptions() {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
function doPost(e) {

  // Log incoming parameters
  console.log("entered do post function");
  Logger.log(e.parameter);

  const params = e.parameter;
  const entity = params.university.toString().toLowerCase() || "national";


  // Validate entity

  const spreadsheetId = "1K3tWDl7rTBwnHfZMdoqCbu_a3dOYju6XYSJENv5epVQ"; // Your spreadsheet ID
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  // Map entity to sheet
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
    case "horizon_campus":
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

    default:
      sheet = spreadsheet.getSheetByName("national");
      break;
      // return ContentService.createTextOutput("Invalid entity value.")
      //   .setMimeType(ContentService.MimeType.TEXT);
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
    // "url":"UTM Link",
    "creator":"Campaign Creator/Team Name",
        "leadAlignment":"Lead Alignment",
        "product":"Product"

  };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const normalizedHeaders = headers.map(header => header.toLowerCase().replace(/\s+/g, ''));


  // Prepopulate newRow with empty values for all columns
  const newRow = Array(headers.length).fill("");

  // Insert timestamp in the first column
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


  Logger.log("newRow before append: " + JSON.stringify(newRow));
  sheet.appendRow(newRow);

  return ContentService.createTextOutput("Success: Row appended.")
    .setMimeType(ContentService.MimeType.TEXT);
}


function testDoPost() {
  const e = {
    parameter: {
       ley: 'cc',
    utm_source: 'Facbook',
    utm_medium: 'Blog',
    utm_campaign: 'GT',
    utm_term: 'January',
    utm_content: 'story',
    id: 'LK-test'
    }
  };
  doPost(e);
}
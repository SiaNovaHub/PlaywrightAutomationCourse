const {test, expect} = require('@playwright/test');
const excelJS = require('exceljs');

async function writeExcel(searchText, replaceText, change, filePath) {
    const workbook = new excelJS.Workbook(); //creating workbook object from exceljs module
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = await readExcel(worksheet, searchText); // calling the function to read the excel file and get the row and column number of the cell that contains the value "Apple"
    const cell = worksheet.getCell(output.row, output.col + change.colChange); // getting the cell object using row and column number
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath); // writing the updated workbook back to the file aka saving the file with new content
}

async function readExcel(worksheet, searchText) {
    let output = {row:-1, col:-1};
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if(cell.value == searchText){
                output.row =  rowNumber;
                output.col = colNumber;
            }
        });
    });
    return output;
}

test('Upload download excel validation', async ({page}) => {
    const text = "Apple";
    const value = "350";
    const downloadsPath = 'C:\\Users\\nastz\\Downloads\\';
    await page.goto("https://rahulshettyacademy.com/upload-download-test/");
    const downloadPromise = page.waitForEvent('download'); // waiting for the download to complete before proceeding to the next step
    await page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    await download.saveAs(`${downloadsPath}download.xlsx`);

    writeExcel("Apple", "350", {rowChange:0, colChange:2}, `${downloadsPath}download.xlsx`);

    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles(`${downloadsPath}download.xlsx`);

    const textLocator = page.getByText(text);
    const desiredRow = page.getByRole('row').filter({ has: textLocator}); // getting the whole row that contains the text "Apple"
    await expect(desiredRow.locator("#cell-4-undefined")).toHaveText(value);

});
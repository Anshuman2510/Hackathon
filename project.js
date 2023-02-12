let minimist=require("minimist");
let args=minimist(process.argv);
let axios=require("axios");
let jsdom=require("jsdom");
let url=axios.get(args.url);
let fs=require("fs");
let excel=require("excel4node");
let XLSXChart = require ("xlsx-chart");
let xlsxchart = new XLSXChart ();
url.then(function(response)
{
    let html=response.data;
  let dom=new jsdom.JSDOM(html);
  let doc=dom.window.document;
  let document=doc.querySelectorAll("table.corona-cases-table");
  let matches=[];
  for(let i=0;i<document.length;i++)
  {
      let d=document[0].querySelectorAll("tr.corona-state");
    state(d,matches);


       
  }
  console.log(matches);
  let matchesJSON = JSON.stringify(matches); // done
    fs.writeFileSync("corona.json", matchesJSON, "utf-8");

    CreateExcelFile(matches);
    
    
})

function state(d,matches)
{
    for(let i=0;i<d.length;i++)
    {
        let states=d[i].querySelector("td").textContent;
        let totalcase=d[i].querySelectorAll("td")[1].childNodes[0].textContent.trim();
        totalcase=parseFloat(totalcase.split(',').join(''));
        let death=d[i].querySelectorAll("td")[2].childNodes[0].textContent.trim();
        death=parseFloat(death.split(',').join(''));
        let recover=d[i].querySelectorAll("td")[3].childNodes[0].textContent.trim();
        recover=parseFloat(recover.split(',').join(''));
        //match.state=states;
        matches.push(
            {
                name:states,
                data:[
                    {
                        TotalCase:totalcase,
                        TotalDeaths:death,
                        TotalRecover:recover

                    }
                ]
            }
        )


    }
}

function CreateExcelFile(matches)
{
    let wb = new excel.Workbook();
    let sheet = wb.addWorksheet("Corona Sheet");
    sheet.cell(1, 1).string("States");
    sheet.cell(1, 2).string("Total Cases");
    sheet.cell(1, 3).string("Total Deaths");
    sheet.cell(1, 4).string("Total Recovered");
let inc=2;
    for(let i=0;i<matches.length;i++)
    {
        //let sheet = wb.addWorksheet(matches[i].name);
       
        
        for (let j = 0; j < matches[i].data.length; j++) {
            sheet.cell(inc + j, 1).string(matches[i].name);
            sheet.cell(inc + j, 2).number(matches[i].data[j].TotalCase);
            sheet.cell(inc + j, 3).number(matches[i].data[j].TotalDeaths);
            sheet.cell(inc + j, 4).number(matches[i].data[j].TotalRecover);
        }
        inc=inc+1;
    }
    wb.write(args.excel);
}


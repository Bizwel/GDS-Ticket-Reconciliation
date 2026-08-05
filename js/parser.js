import {
detectHeaderRow,
detectGDS,
getTicketColumn,
getStatusColumn
} from "./detector.js";

import {normalizeTicket}
from "./normalizer.js";

export async function parseWorkbook(file){

    const extension=file.name.split(".").pop().toLowerCase();

    let rows=[];

    if(extension==="csv"){

        rows=await parseCSV(file);

    }else{

        rows=await parseExcel(file);

    }

    const headerIndex=detectHeaderRow(rows);

    const headers=rows[headerIndex];

    const gds=detectGDS(headers);

    const ticketColumn=getTicketColumn(headers);

    const statusColumn=getStatusColumn(headers);

    const data=[];

    const seen=new Set();

    let voidCount=0;

    for(let i=headerIndex+1;i<rows.length;i++){

        const row=rows[i];

        if(!row) continue;

        if(statusColumn>=0){

            const status=(row[statusColumn]||"").toString().toUpperCase();

            if(status==="VOID"){

                voidCount++;

                continue;

            }

        }

        const raw=row[ticketColumn];

        const ticket=normalizeTicket(raw);

        if(!ticket) continue;

        if(seen.has(ticket))

            continue;

        seen.add(ticket);

        data.push({

            ticket,

            row,

            gds

        });

    }

    return{

        gds,

        tickets:data,

        voidCount

    };

}

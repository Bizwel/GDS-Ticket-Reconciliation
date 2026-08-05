const ticketHeaders = [

"ticket number",
"ticket no",
"ticket #",
"ticket",
"number",
"no"

];

export function detectHeaderRow(rows){

    for(let i=0;i<20;i++){

        const row = rows[i];

        if(!row) continue;

        for(const cell of row){

            if(!cell) continue;

            const value = cell.toString().toLowerCase().trim();

            if(ticketHeaders.includes(value))

                return i;

        }

    }

    return 0;

}

export function detectGDS(headers){

    const cols = headers.map(h=>h.toLowerCase());

    if(cols.includes("ticket #"))

        return "Sabre";

    if(cols.includes("number"))

        return "Galileo";

    if(cols.includes("no"))

        return "Amadeus";

    return "Unknown";

}

export function getTicketColumn(headers){

    const possible=[

"ticket number",
"ticket no",
"ticket #",
"number",
"no"

];

    for(let i=0;i<headers.length;i++){

        const h=headers[i].toLowerCase().trim();

        if(possible.includes(h))

            return i;

    }

    return -1;

}

export function getStatusColumn(headers){

    const statusNames=[

"status",

"ticket status",

"document status"

];

    for(let i=0;i<headers.length;i++){

        const h=headers[i].toLowerCase().trim();

        if(statusNames.includes(h))

            return i;

    }

    return -1;

}

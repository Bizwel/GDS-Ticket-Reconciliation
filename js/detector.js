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

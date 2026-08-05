export function renderTickets(records){

    const tbody=document.querySelector("#resultsTable tbody");

    tbody.innerHTML="";

    records.forEach(r=>{

        tbody.innerHTML+=`

<tr>

<td>${r.ticket}</td>

<td></td>

<td></td>

<td></td>

<td></td>

<td>${r.gds}</td>

</tr>

`;

    });

}

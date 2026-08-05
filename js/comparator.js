export function compareTickets(gdsRecords, systemRecords){

    const systemSet = new Set(
        systemRecords.map(r => r.ticket)
    );

    const missing = [];

    gdsRecords.forEach(record => {

        if (!systemSet.has(record.ticket)) {

            missing.push(record);

        }

    });

    return missing;

}

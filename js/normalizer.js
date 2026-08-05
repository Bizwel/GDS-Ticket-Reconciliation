export function normalizeTicket(ticket) {

    if (!ticket) return "";

    let value = ticket.toString().trim();

    value = value.replace(/\s+/g, "");

    // Remove airline prefix e.g. 157-, 071-, 710-
    value = value.replace(/^\d{3}-/, "");
    value = value.replace(/^\d{3}/, (m) => value.includes("-") ? m : "");

    // Galileo: remove first 3 digits if length > 10
    if (/^\d{13}$/.test(value)) {
        value = value.substring(3);
    }

    // Remove exchange suffix
    value = value.replace(/-\d+$/, "");

    return value;
}

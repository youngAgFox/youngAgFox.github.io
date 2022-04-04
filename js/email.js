function sendEmail(name, email, msg) {
    const encEmail = encodeURIComponent(email);
    const encMsg = encodedURIComponent(msg);
    const encSubject = encodedURIComponent(`Portfolio message from ${name}`);
    const link = `mailto:${encEmail}?subject=${encSubject}&body=${encMsg}`;
    window.open(link, '_blank');
}
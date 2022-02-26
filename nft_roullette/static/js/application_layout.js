const connectButton = document.querySelector('.metamask.connector');
const addressField = document.querySelector('.metamask.address');
var isConnected = false;

document.addEventListener("DOMContentLoaded", function(event) {
    connect();
});

async function connect() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    isConnected = true;
    const account = accounts[0];
    connectButton.remove();
    addressField.style.display = 'inline-block';
    addressField.innerHTML = "Wallet: " + account.slice(0, 3) + "..." + account.slice(-3)
}
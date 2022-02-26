const connectButton = document.querySelector('.metamask.connector');
const addressField = document.querySelector('.metamask.address');


document.addEventListener("DOMContentLoaded", function(event) {
    connect()
  });


async function connect() {

  	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  	console.log(accounts)
  	const account = accounts[0];
  	connectButton.style.display = 'none';
  	addressField.style.display = 'inline-block';
  	addressField.innerHTML = account;
}
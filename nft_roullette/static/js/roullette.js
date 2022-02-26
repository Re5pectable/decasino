
const rollButton = document.querySelector('.roll_button')


document.addEventListener("DOMContentLoaded", function(event) {
    		itemsArrange()
    		console.log(1)
  		}
    );


async function moveRoullette(distance) {
	for (var i = distance; i > 0; i-=1) {
    	await $(".items_container").animate({
    		left: '-=' + i
    	}, (300-i*2)/2 + 100/i, "linear");
  	};
};

function toHex(number) {return '0x' + (number).toString(16)}

function itemsArrange() {
	var items = document.getElementsByClassName('item') 
		for (var i = 0; i < items.length; i++) {
			console.log(i)
			items[i].style.left = i * 100 + 'px';
		}
	}



async function roll() {
	var itemsOrder = [];
		$(".item").each(function(){
		  itemsOrder.push($(this).attr('id'));
		});
		
	rollButton.style.opacity = '0.5'
	const address = await ethereum.request({ method: 'eth_requestAccounts' })
	ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: address[0],
          to: address[0],
          value: ethers.utils.parseEther('0.02')._hex,
        },
      ],
    })
    .then((txHash) => {
    	console.log(txHash);
	    $.ajax({
	            url: '/roll',
	            type: 'POST',
              contentType: 'application/json',
	            data: JSON.stringify({
	                type: "rollRequest",
	                itemsOrder: itemsOrder,
	                address: address[0],
	                txn_hash: txHash
	            }),
	            success: function (response) {
	            	moveRoullette(response).then(
	            		rollButton.style.opacity=1);
	            	console.log(response);
	            },
	            error: function (response) {
	            	alert('Shit!')
	            }
	        });
	})
    .catch((error) => console.error);
};
const IPFS 					= require('ipfs-http-client');
const Web3 					= require('web3');
const abiDecoderRoute		= require('abi-decoder');

const nftContractBuild 		= require("../../build/contracts/PhotoNFT.json");

const web3 					= new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const abiNftContract 		= nftContractBuild.abi;

//numero de network (ver en ../../build/contracts/PhotoNFT.json) o
// console.log(nftContractBuild.networks)
const numberNetwork 		= 1633109186544;
const addresNftContract 	= nftContractBuild.networks[numberNetwork].address;
const nftContract 			= new web3.eth.Contract(abiNftContract, addresNftContract);

const listItems			 	= document.getElementById("list-items");
const listItemsLast			= document.getElementById("list-items-last");
const listItemsAll			= document.getElementById("list-items-all");
const mintNftButton		 	= document.getElementById("mint-nft");
const fileIpfs		 		= document.getElementById("file-ipfs");

var ipfs;
var account;
//iniciamos web3 en 
async function  init(){
	// console.log('ok')
	var accounts = await connect();
	// console.log('ok1')
	ipfs = await IPFS.create({host:'ipfs.infura.io', port: '5001', protocol: 'https'});
	account = accounts[0];
	// console.log('ok2')
	await getByOwner();
	// console.log('ok3')
	await getLastToken();
	// console.log('ok4')
	await getAllToken();
}

/*
* funcion para crear un nuevo nft
*/
async function mint(pathIpfs){
	var mintOptions = { 
						from: 	account,
			        	gas: 	1053150
					}

	var mint	= await nftContract.methods.mint(account, 'https://ipfs.io/ipfs/'+pathIpfs).send(mintOptions);	
}

/*
* funcion para obtener el ultimo token
*/
async function getLastToken() {
	var currentPhotoId	= await nftContract.methods.currentPhotoId().call({});

	if(currentPhotoId > 0){

		var token		= await nftContract.methods.tokenURI(currentPhotoId).call({});
		addList(token, 'last');

	}

}

/*
* obtiene todos los tokens de la cuenta conectada
*/
async function getByOwner(){
	var balanceOf	= await nftContract.methods.balanceOf(account).call({});

	if(balanceOf > 0){

		for (var i = 0; i < balanceOf; i++) {

			var tokenId		= await nftContract.methods.tokenOfOwnerByIndex(account, i).call({});
			var tokenData	= await nftContract.methods.tokenURI(tokenId).call({});
			addList(tokenData, 'owner');
		}

	}
	// console.log('totalSupply', totalSupply);

}

/*
* funcion para obtener todos los tokens
*/
async function getAllToken() {
	var currentPhotoId	= await nftContract.methods.currentPhotoId().call({});

	if(currentPhotoId > 0){

		for (var i = 1; i <= currentPhotoId; i++) {

			var tokenData	= await nftContract.methods.tokenURI(i).call({});
			addList(tokenData, 'all');
		}


	}

}
//conecta la pagina a web3
async function connect() {
	// preguntamos si el proveedor esta definido
	if(window.ethereum){
		try {

			//le decimos al proveedor de ethereum que nos traiga las cuentas del usuario
			//mientras tanto mostramos un load
		    const accounts = await window.ethereum.send('eth_requestAccounts');

		    return accounts.result;

		} catch (error) {
			alert('Ocurrio un error al obtener la cuenta.')
		}

	}else {
		alert('No se encontro un proveedor de la red ethereum.')
	}
	return false;
}

/*
* agrega una imagen la lista pasada por el parametro url.
* lastToken sirve para diferenciar que lista usar
*/
async function addList(url, lastToken = false){
	console.log(listItems)

	var li = document.createElement("li");

	li.innerHTML = '<img  width="64px" class="mt-2" src="'+url+'"/>';
	// si es el ultimo token cargado se agrega en una lista aparte
	switch (lastToken) {
  		case 'all':
			listItemsAll.append(li);

    	break;

  		case 'last':
			listItemsLast.append(li);

    	break;

  		case 'owner':
			listItems.append(li);

    	break;
	}
	if(lastToken){

	}else {


	}
}

mintNftButton.onclick = async function(event) { 

	try {
			
		if(fileIpfs.files[0] == undefined){
			alert('cargue una imagen')
		}else{

			var results = await ipfs.add(fileIpfs.files[0])
			pathIpfs = results.path;
			// console.log(ipfsFile)
			// statements
			await mint(pathIpfs);
			alert('se subio correctamente')
			location.reload();
		}
	} catch(e) {
		alert('ocurrio un error')
		// statements
		console.log(e);
	}
};

init();

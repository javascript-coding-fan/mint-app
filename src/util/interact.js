require("dotenv").config();
const { create } = require('ipfs-http-client')
const ipfsClient = create("http://167.99.110.177:5001");
// const ipfsClient = create("https://ipfs.infura.io:5001");
const contractABI = require("../contract-abi.json");
const contractAddress = "0x22fca762f136a1d4E6bFeb6835C802E0E446258d";
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/ec74d1b14a7948388274b61bbd842489');

export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const obj = {
				status: "👆🏽 Write a message in the text-field above.",
				address: addressArray[0],
			};
			return obj;
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};

export const getCurrentWalletConnected = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_accounts",
			});
			if (addressArray.length > 0) {
				return {
					address: addressArray[0],
					status: "👆🏽 Write a message in the text-field above.",
				};
			} else {
				return {
					address: "",
					status: "🦊 Connect to Metamask using the top right button.",
				};
			}
		} catch (err) {
			return {
				address: "",
				status: "😥 " + err.message,
			};
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					<p>
						{" "}
						🦊{" "}
						<a target="_blank" href={`https://metamask.io/download.html`}>
							You must install Metamask, a virtual Ethereum wallet, in your
							browser.
						</a>
					</p>
				</span>
			),
		};
	}
};

async function loadContract() {
	return new web3.eth.Contract(contractABI, contractAddress);
}

export const mintNFT = async (mintNum) => {
	if (mintNum.trim() == "") {
		return {
			success: false,
			status: "❗Please make sure field are completed before minting.",
		};
	}

	// const imageEl = metaData.image;
	// const ipfsResult = await ipfsClient.add(imageEl);
	// const ipfsImg = ipfsResult.cid.toString();
	// console.log('img hash info', ipfsImg);

	const fileDetails = [
		{
			path: "/1",
			content: JSON.stringify({
				"name": "metaData.name1",
				"description": "metaData.description1",
				"image": "ipfsImg1",
				"attributes": [
					{
						"trait_type": "trait",
						"value": "1"
					}
				]
			})
		},
		{
			path: "/2",
			content: JSON.stringify({
				"name": "metaData.name2",
				"description": "metaData.description2",
				"image": "ipfsImg2",
				"attributes": [
					{
						"trait_type": "trait",
						"value": "2"
					}
				]
			})
		},
		{
			path: "/3",
			content: JSON.stringify({
				"name": "metaData.name3",
				"description": "metaData.description3",
				"image": "ipfsImg3",
				"attributes": [
					{
						"trait_type": "trait",
						"value": "3"
					}
				]
			})
		},
		{
			path: "/4",
			content: JSON.stringify({
				"name": "metaData.name4",
				"description": "metaData.description4",
				"image": "ipfsImg4",
				"attributes": [
					{
						"trait_type": "trait",
						"value": "4"
					}
				]
			})
		},
		{
			path: "/5",
			content: JSON.stringify({
				"name": "metaData.name5",
				"description": "metaData.description5",
				"image": "ipfsImg5",
				"attributes": [
					{
						"trait_type": "trait",
						"value": "5"
					}
				]
			})
		},
	]

	const options = {
		wrapWithDirectory: true,
	}
	const result = await ipfsClient.add(fileDetails, options);
	console.log('result from ipfs', result.cid.toString());

	window.contract = new web3.eth.Contract(contractABI, contractAddress);

	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: window.ethereum.selectedAddress, // must match user's active address.
		data: window.contract.methods
			.preSale(mintNum)
			.encodeABI(),
	};

	try {
		const txHash = await window.ethereum.request({
			method: "eth_sendTransaction",
			params: [transactionParameters],
		});
		return {
			success: true,
			status:
				"✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" +
				txHash,
		};
	} catch (error) {
		return {
			success: false,
			status: "😥 Something went wrong: " + error.message,
		};
	}
};

export const getOnAmount = async () => {

	window.contract = new web3.eth.Contract(contractABI, contractAddress);

	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: window.ethereum.selectedAddress, // must match user's active address.
		data: window.contract.methods
			.getAmount()
			.encodeABI(),
	};

	try {
		const txHash = await window.ethereum.request({
			method: "eth_getAmountTransaction",
			params: [transactionParameters],
		});
		return {
			success: true,
			status:
				"✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" +
				txHash,
		};
	} catch (error) {
		return {
			success: false,
			status: "😥 Something went wrong: " + error.message,
		};
	}
};

export const handleSetPrice = async (price) => {

	window.contract = new web3.eth.Contract(contractABI, contractAddress);

	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: window.ethereum.selectedAddress, // must match user's active address.
		data: window.contract.methods
			.setPrice(price)
			.encodeABI(),
	};

	try {
		const txHash = await window.ethereum.request({
			method: "eth_setPriceTransaction",
			params: [transactionParameters],
		});
		return {
			success: true,
			status:
				"✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" +
				txHash,
		};
	} catch (error) {
		return {
			success: false,
			status: "😥 Something went wrong: " + error.message,
		};
	}
};


export const handleUpdateUri = async (tokenId, uri) => {

	window.contract = new web3.eth.Contract(contractABI, contractAddress);

	const transactionParameters = {
		to: contractAddress, // Required except during contract publications.
		from: window.ethereum.selectedAddress, // must match user's active address.
		data: window.contract.methods
			.updateMetadatauri(tokenId, uri)
			.encodeABI(),
	};

	try {
		const txHash = await window.ethereum.request({
			method: "eth_updateMetadataUriTransaction",
			params: [transactionParameters],
		});
		return {
			success: true,
			status:
				"✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" +
				txHash,
		};
	} catch (error) {
		return {
			success: false,
			status: "😥 Something went wrong: " + error.message,
		};
	}
};

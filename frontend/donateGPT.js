<script src="https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js"></script>
<script>
let selectedAmount = 0;
let selectedNetwork = 'polygon';
let currentContract = null;
let userAddress = null;
let web3 = null;
let projects = {};

const networks = {
    amoy: {
        name: "Polygon Amoy (تست‌نت)",
        usdtAddress: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
        chainId: 80002,
        explorer: "https://amoy.polygonscan.com"
    },
    polygon: {
        name: "Polygon Mainnet",
        usdtAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        chainId: 137,
        explorer: "https://polygonscan.com"
    },
    ethereum: {
        name: "Ethereum",
        usdtAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        chainId: 1,
        explorer: "https://etherscan.io"
    },
    bsc: {
        name: "Binance Smart Chain",
        usdtAddress: "0x55d398326f99059ff7754852469993b3197955e7",
        chainId: 56,
        explorer: "https://bscscan.com"
    },
    tron: {
        name: "Tron (TRC-20)",
        usdtAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
        explorer: "https://tronscan.org"
    }
};

async function loadProject() {
    const projectId = new URLSearchParams(window.location.search).get('project');
    const res = await fetch('data/Projects.json');
    const data = await res.json();

    const p = data.features.find(f => f.attributes.ProjectID === projectId);
    if (!p) return;

    projects = p.attributes;
    currentContract = projects.contractAddress;

    document.getElementById('projectTitle').innerText = projects["نام پروژه"];
    document.getElementById('projectDesc').innerText =
        `${projects.استان} - ${projects.منطقه} | ${projects["تعداد کلاس"]} کلاس`;
}

document.getElementById('customAmount').oninput = e => {
    selectedAmount = e.target.value;
};

function selectNetwork(n) {
    selectedNetwork = n;
    currentContract = (n === 'tron')
        ? projects.contractAddressTron
        : projects.contractAddress;
}

document.getElementById('connectBtn').onclick = async () => {
    if (!currentContract || selectedAmount <= 0) return;

    const net = networks[selectedNetwork];

    /* ========= TRON ========= */
    if (selectedNetwork === 'tron') {
        const tronWeb = window.tronWeb;
        if (!tronWeb) return;

        const usdt = await tronWeb.contract().at(net.usdtAddress);
        const amount = Math.floor(Number(selectedAmount) * 1_000_000);

        const tx = await usdt.transfer(currentContract, amount).send();

        document.getElementById('txHash').innerHTML =
            `<a href="${net.explorer}/transaction/${tx}" target="_blank">مشاهده تراکنش</a>`;
        return;
    }

    /* ========= EVM ========= */
    if (!window.ethereum) return;

    await ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
    userAddress = (await web3.eth.getAccounts())[0];

    const tokenABI = [
        {
            "inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],
            "name":"approve",
            "outputs":[{"name":"","type":"bool"}],
            "type":"function"
        }
    ];

    const fundABI = [
        {
            "inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],
            "name":"donate",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        }
    ];

    const token = new web3.eth.Contract(tokenABI, net.usdtAddress);
    const fund = new web3.eth.Contract(fundABI, currentContract);

    const amount = web3.utils.toBN(
        web3.utils.toWei(selectedAmount, 'mwei')
    );

    await token.methods.approve(currentContract, amount).send({ from: userAddress });

    const tx = await fund.methods
        .donate(net.usdtAddress, amount)
        .send({ from: userAddress });

    document.getElementById('txHash').innerHTML =
        `<a href="${net.explorer}/tx/${tx.transactionHash}" target="_blank">مشاهده تراکنش</a>`;
};

function isTronReady() {
    return window.tronWeb && window.tronWeb.defaultAddress.base58;
}
</script>

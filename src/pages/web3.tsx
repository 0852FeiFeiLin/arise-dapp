'use client'
import { parseEther } from "viem";
import { Button, message } from "antd";
import { http, useReadContract, useWatchContractEvent, useWriteContract } from "wagmi";
import { Mainnet, WagmiWeb3ConfigProvider, MetaMask } from '@ant-design/web3-wagmi';
import { Address, NFTCard, ConnectButton, Connector, useAccount } from "@ant-design/web3";


/*
4、【调用合约】DApp 的前端网站部分区别于传统 App 的地方在于，它需要和区块链进行交互。调用智能合约来实现区块链的交互
第 5 讲：监听事件
*/

/*
第六讲：部署、编译：npm run build、运行在本地：npm run start、如果你需要部署在你自己的服务器，那么流程是相同的，你需要在你的服务器中安装依赖、构建并通过 npm run start 或者 next start 启动你的应用。
基于 Vercel部署：Next.js 就是 Vercel 官方在做支持的框架，它提供了一个非常简单的部署方式，你只需要将你的代码上传到 Github 或者 Gitlab 等代码托管平台，然后在 Vercel 上选择你的仓库，它会自动帮你构建并部署你的应用。
*/
const CallTest = () => {
    const { account } = useAccount();
    // 调用智能合约的读方法
    const result = useReadContract({
        abi: [
            {
                type: 'function',
                name: 'balanceOf',
                stateMutability: 'view',
                inputs: [{ name: 'account', type: 'address' }],
                outputs: [{ type: 'uint256' }],
            },
        ],
        address: '0xEcd0D12E21805803f70de03B72B1C162dB0898d9',
        functionName: 'balanceOf',
        args: [account?.address as `0x${string}`],
    });
    // 调用智能合约的写方法
    const { writeContract } = useWriteContract();
    // const { watchContractEvent } = useWatchContractEvent();

    return (
        <div>
            {result.data?.toString()}
            <Button
                onClick={() => {
                    writeContract(
                        {
                            abi: [
                                {
                                    type: "function",
                                    name: "mint",
                                    stateMutability: "payable",
                                    inputs: [
                                        {
                                            internalType: "uint256",
                                            name: "quantity",
                                            type: "uint256",
                                        },
                                    ],
                                    outputs: [],
                                },
                            ],
                            address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
                            functionName: "mint",
                            args: [BigInt(1)],
                            value: parseEther("0.01"),
                        },
                        {
                            onSuccess: () => {
                                message.success("Mint Success");
                            },
                            onError: (err) => {
                                message.error(err.message);
                            },
                        }
                    );
                }}
            >
                mint
            </Button>
        </div>
    );
}

/*
1、【快速开始】展示数字藏品
2、【连接钱包】连接小狐狸钱包，连接区块链
3、【节点服务和水龙头】领取一定的免费的eth测试网络代币，然后小狐狸钱包切换成 Sepolia 测试网络
*/
export default function Web3() {
    return (
        <WagmiWeb3ConfigProvider
            chains={[Mainnet]}
            transports={{
                // [Mainnet.id]: http(),
                [Mainnet.id]: http('https://api.zan.top/node/v1/eth/mainnet/2dbbdce922804bb5b2b8534334e4986c'),
            }}
            // 代表小狐狸钱包
            wallets={[MetaMask()]}
        >
            <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
            <NFTCard
                address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
                tokenId={641}
            />
            {/* Connector：连接器，Connector 提供了一个完整的连接钱包的 UI 。 */}
            <Connector>
                {/* ConnectButton：连接区块链钱包的按钮，配合 Connector 组件一起使用。 */}
                <ConnectButton />
            </Connector>
            {/* 调用合约测试 */}
            <CallTest />
        </WagmiWeb3ConfigProvider>
    );
};
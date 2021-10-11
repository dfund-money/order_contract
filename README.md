# order_contract
按照固定价格挂单Dex。 支持wanchain主网， wanchain testnet, moonbase 测试网， moonriver主网
只支持Token， 暂不支持原生币。
不需要把token打入合约， 只需要approve即可。
合约不可升级
合约中会检查price， 确保价格不低于用户挂单价格。
当前价格高于用户挂单价格时， 以实际价格成交。
订单成交收取0.3%的原币为手续费。
暂不支持反射币。

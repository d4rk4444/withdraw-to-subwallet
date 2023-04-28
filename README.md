# withdraw-to-subwallet
A script for transferring native coins to exchanger wallets.      
        
## Description
Description of all functions of the script      

1. Withdrawal from Ethereum     
2. Withdrawal from Arbitrum     
3. Withdrawal from Optimism     
4. Withdrawal from Avalanche        
5. Withdrawal from Polygon  
6. Withdrawal from BSC  
    
## Setting
```
git clone https://github.com/d4rk4444/withdraw-to-subwallet.git
cd withdraw-to-subwallet
npm i
```

## Configuration
All the settings you need are in the .env file    
       
1. Time to pause between wallets     
2. Value in % of native coin balance to send       
    
In the private.txt file you insert the private addresses in this format:     
```
key1
key2
```

In the file subWallet.txt insert addresses for output from Ethereum in this format:      
```
address1
address2
```
    
## Launch
```
node index
```
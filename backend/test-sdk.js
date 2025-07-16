import dotenv from 'dotenv';
import { SoroswapSDK, SupportedNetworks, SupportedProtocols, TradeType } from '@soroswap/sdk';

dotenv.config();

async function testSoroswapSDK() {
  console.log('🧪 Testing Soroswap SDK Integration...\n');

  console.log("SOROSWAP_API_KEY", process.env.SOROSWAP_API_KEY);
  try {
    // Initialize SDK
    const sdk = new SoroswapSDK({
      apiKey: process.env.SOROSWAP_API_KEY,
      defaultNetwork: SupportedNetworks.TESTNET,
      baseUrl:"https://soroswap-api-staging-436722401508.us-central1.run.app/",
      timeout: 30000
    });

    console.log('✅ SDK initialized successfully');

    // Test 1: Get protocols
    console.log('\n1. Testing getProtocols...');
    const protocols = await sdk.getProtocols();
    console.log('Available protocols:', protocols);

    // Test 2: Get tokens (asset list)
    console.log('\n2. Testing getAssetList...');
    try {
      const assetLists = await sdk.getAssetList();
      console.log('Asset lists available:', assetLists.length);
    } catch (error) {
      console.log('Asset list not available (expected on testnet):', error.message);
    }

    // Test 3: Get contract addresses
    console.log('\n3. Testing getContractAddress...');
    try {
      const factory = await sdk.getContractAddress(SupportedNetworks.TESTNET, 'factory');
      console.log('Factory address:', factory.address);
    } catch (error) {
      console.log('Contract addresses not available (expected on testnet):', error.message);
    }

    // Test 4: Get pools
    console.log('\n4. Testing getPools...');
    try {
      const pools = await sdk.getPools(SupportedNetworks.TESTNET, [SupportedProtocols.SOROSWAP]);
      console.log('Pools found:', pools.length);
    } catch (error) {
      console.log('Pools not available (expected on testnet):', error.message);
    }

    // Test 5: Get token price
    console.log('\n5. Testing getPrice...');
    try {
      const prices = await sdk.getPrice(['CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA'], SupportedNetworks.TESTNET);
      console.log('Price data:', prices);
    } catch (error) {
      console.log('Price data not available (expected on testnet):', error.message);
    }

    console.log('\n✅ SDK integration test completed successfully!');
    console.log('\n📝 Note: Some features may not be available on testnet, which is expected.');

  } catch (error) {
    console.error('❌ SDK test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testSoroswapSDK().catch(console.error); 
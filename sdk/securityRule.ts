import 'dotenv/config'
import { NetworkManagementClient, SecurityRule } from '@azure/arm-network'
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity'
import { resourceGroupName, networkSecurityGroupName, securityRuleName } from '../resourceName'

//サブスクID
const subscriptionId = process.env.subscriptionId
//テナントID
const tenantId = process.env.AZURE_TENANT_ID
//　クライアントID
const clientId = process.env.AZURE_CLIENT_ID
// シークレットキー
const secretKey = process.env.AZURE_CLIENT_SECRET

//ネットワークのクラス(インターフェース)を定義
let network_client: NetworkManagementClient

const securityRuleAdd = async (resourceGroupName: string, networkSecurityGroupName: string, securityRuleName: string) => {
  const securityRuleParameter: SecurityRule = {
    type: 'Microsoft.Network/networkSecurityGroups/defaultSecurityRules',
    //ルールの説明
    description: 'practice',
    //プロトコル
    protocol: '*',
    sourcePortRange: '*',
    destinationPortRange: '*',
    sourceAddressPrefix: '*',
    sourceAddressPrefixes: [],
    destinationAddressPrefix: '*',
    destinationAddressPrefixes: [],
    sourcePortRanges: [],
    destinationPortRanges: [],
    //拒否 or 許可
    access: 'Deny',
    //優先度
    priority: 516,
    //インバウンド or アウトバウンド
    direction: 'Outbound',
  }
  // const securityGroup = network_client.securityRules.beginCreateOrUpdateAndWait(resourceGroupName, networkSecurityGroupName, securityRuleName, parameter)
  const securityRule = await network_client.securityRules.beginCreateOrUpdateAndWait(resourceGroupName, networkSecurityGroupName, securityRuleName, securityRuleParameter)
  console.log('securityRule:', securityRule)
}

const main = async () => {
  if (!!subscriptionId) {
    !!tenantId && !!clientId && !!secretKey
      ? (network_client = new NetworkManagementClient(new ClientSecretCredential(tenantId, clientId, secretKey), subscriptionId))
      : (network_client = new NetworkManagementClient(new DefaultAzureCredential(), subscriptionId))
  }
  await securityRuleAdd(resourceGroupName, networkSecurityGroupName, securityRuleName)
}

main()

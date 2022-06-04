import 'dotenv/config'
import { NetworkManagementClient, NetworkSecurityGroup, SecurityRule } from '@azure/arm-network'
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity'
import { location, networkSecurityGroupName, resourceGroupName } from '../resourceName'

//サブスクID
const subscriptionId = process.env.subscriptionId
//テナントID
const tenantId = process.env.AZURE_TENANT_ID
//　クライアントID
const clientId = process.env.AZURE_CLIENT_ID
// シークレットキー
const secretKey = process.env.AZURE_CLIENT_SECRET

let network_client: NetworkManagementClient

const createSecurityGroup = async (resourceGroupName: string, networkSecurityGroupName: string) => {
  const securityGroupParameter: NetworkSecurityGroup = {
    location: location,
  }
  const securityGroup = await network_client.networkSecurityGroups.beginCreateOrUpdateAndWait(resourceGroupName, networkSecurityGroupName, securityGroupParameter)
  console.log('securityGroup:', securityGroup)
}

async function main() {
  if (!!subscriptionId) {
    !!tenantId && !!clientId && !!secretKey
      ? (network_client = new NetworkManagementClient(new ClientSecretCredential(tenantId, clientId, secretKey), subscriptionId))
      : (network_client = new NetworkManagementClient(new DefaultAzureCredential(), subscriptionId))
  }
  await createSecurityGroup(resourceGroupName, networkSecurityGroupName)
}

main()

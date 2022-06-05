import 'dotenv/config'
import { NetworkInterface, NetworkManagementClient } from '@azure/arm-network'
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity'
import { interface_name, location, network_name, resourceGroupName, subnet_name } from '../resourceName'

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

//network_client.networkInterfaces.createOrUpdate
const createNetworkInterface = async (resourceGroupName: string, location: string, interface_name: string, subnet_name: string, network_name: string) => {
  const networkInterfaceParameter: NetworkInterface = {
    location: location,
    ipConfigurations: [
      {
        name: 'MyIpConfig',
        subnet: {
          id: '/subscriptions/' + subscriptionId + '/resourceGroups/' + resourceGroupName + '/providers/Microsoft.Network/virtualNetworks/' + network_name + '/subnets/' + subnet_name,
        },
      },
    ],
  }
  const interface_create_info = await network_client.networkInterfaces.beginCreateOrUpdateAndWait(resourceGroupName, interface_name, networkInterfaceParameter)
  console.log('interface_create_info:', interface_create_info)
}

const main = async () => {
  if (!!subscriptionId) {
    !!tenantId && !!clientId && !!secretKey
      ? (network_client = new NetworkManagementClient(new ClientSecretCredential(tenantId, clientId, secretKey), subscriptionId))
      : (network_client = new NetworkManagementClient(new DefaultAzureCredential(), subscriptionId))
  }
  await createNetworkInterface(resourceGroupName, location, interface_name, subnet_name, network_name)
}

main()

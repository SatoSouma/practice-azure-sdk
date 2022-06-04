import 'dotenv/config'
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity'
import { NetworkInterface, NetworkManagementClient, Subnet, VirtualNetwork } from '@azure/arm-network'
import { network_name, subnet_name, resourceGroupName, interface_name, location } from '../resourceName'
//サブスクID
const subscriptionId = process.env.subscriptionId
//テナントID
const tenantId = process.env.AZURE_TENANT_ID
//　クライアントID
const clientId = process.env.AZURE_CLIENT_ID
// シークレットキー
const secretKey = process.env.AZURE_CLIENT_SECRET

let network_client: NetworkManagementClient

//network_client.virtualNetworks.createOrUpdate
const createVirtualNetwork = async (resourceGroupName: string, network_name: string, subnet_name: string) => {
  const virtualNetworkParameter: VirtualNetwork = {
    location: location,
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16'],
    },
  }
  const virtualNetworks_create_info = await network_client.virtualNetworks.beginCreateOrUpdateAndWait(resourceGroupName, network_name, virtualNetworkParameter)
  console.log('virtualNetworks_create_info:', virtualNetworks_create_info)

  const subnet_parameter: Subnet = {
    addressPrefix: '10.0.0.0/24',
  }
  const subnet__create_info = await network_client.subnets.beginCreateOrUpdateAndWait(resourceGroupName, network_name, subnet_name, subnet_parameter)
  console.log('subnet__create_info:', subnet__create_info)
}

//network_client.networkInterfaces.createOrUpdate
const createNetworkInterface = async (group_name: string, location: string, interface_name: string) => {
  const parameter: NetworkInterface = {
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
  const interface_create_info = await network_client.networkInterfaces.beginCreateOrUpdateAndWait(group_name, interface_name, parameter)
  console.log('interface_create_info:', interface_create_info)
}

const main = async () => {
  if (!!subscriptionId) {
    !!tenantId && !!clientId && !!secretKey
      ? (network_client = new NetworkManagementClient(new ClientSecretCredential(tenantId, clientId, secretKey), subscriptionId))
      : (network_client = new NetworkManagementClient(new DefaultAzureCredential(), subscriptionId))
  }
  await createVirtualNetwork(resourceGroupName, network_name, subnet_name)
  await createNetworkInterface(resourceGroupName, location, interface_name)
}

main()

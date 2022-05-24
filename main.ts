import 'dotenv/config'
import { DefaultAzureCredential } from '@azure/identity'
import { NetworkInterface, NetworkManagementClient, Subnet, VirtualNetwork } from '@azure/arm-network'

const subscriptionId = process.env.subscriptionId
const credential = new DefaultAzureCredential()
const resourceGroupName = 'myjstest'
const location = 'eastus'
const subnet_name = 'subnetnamex'
const interface_name = 'interfacex'
const network_name = 'networknamex'
let network_client: NetworkManagementClient

//network_client.virtualNetworks.createOrUpdate
async function createVirtualNetwork() {
  const parameter: VirtualNetwork = {
    location: location,
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16'],
    },
  }
  const virtualNetworks_create_info = await network_client.virtualNetworks.beginCreateOrUpdateAndWait(resourceGroupName, network_name, parameter)
  console.log(virtualNetworks_create_info)

  const subnet_parameter: Subnet = {
    addressPrefix: '10.0.0.0/24',
  }
  const subnet__create_info = await network_client.subnets.beginCreateOrUpdateAndWait(resourceGroupName, network_name, subnet_name, subnet_parameter)
  console.log(subnet__create_info)
}

//network_client.networkInterfaces.createOrUpdate
async function createNetworkInterface(group_name: any, location: any, nic_name: any) {
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
  const nic_info = await network_client.networkInterfaces.beginCreateOrUpdateAndWait(group_name, nic_name, parameter)
  console.log(nic_info)
}

async function main() {
  if (!!subscriptionId) network_client = new NetworkManagementClient(credential, subscriptionId)
  await createVirtualNetwork()
  await createNetworkInterface(resourceGroupName, location, interface_name)
}

main()

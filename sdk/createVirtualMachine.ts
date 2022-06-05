import 'dotenv/config'
import { ComputeManagementClient, RunCommandInput, VirtualMachine, VirtualMachineExtension, VirtualMachineExtensionUpdate, VirtualMachineUpdate } from '@azure/arm-compute'
import { ClientSecretCredential, DefaultAzureCredential } from '@azure/identity'
import { location, resourceGroupName, interface_name, virtual_machine_name } from '../resourceName'

//サブスクID
const subscriptionId = process.env.subscriptionId
//テナントID
const tenantId = process.env.AZURE_TENANT_ID
//　クライアントID
const clientId = process.env.AZURE_CLIENT_ID
// シークレットキー
const secretKey = process.env.AZURE_CLIENT_SECRET

let compute_client: ComputeManagementClient

const createVirtualMachine = async (resourceGroupName: string, virtual_machine_name: string) => {
  const virtualMachineParameter: VirtualMachine = {
    location: location,
    // マーケットプレイスイメージを使用する場合記述
    // plan:"",
    hardwareProfile: {
      vmSize: 'Standard_B1s',
    },
    storageProfile: {
      //プラットフォームイメージを使用する場合のオプション
      imageReference: {
        sku: '2016-Datacenter',
        publisher: 'MicrosoftWindowsServer',
        version: 'latest',
        offer: 'WindowsServer',
      },
      //osのオプション
      osDisk: {
        caching: 'ReadWrite',
        managedDisk: {
          // Standard_LRS=Standard_SSD,Standard_ZRS=Standard_HDD,Premium_LRS=Premium_SSD
          storageAccountType: 'Standard_LRS',
        },
        name: 'myVMosdisk02',
        //マシン起動時のオプション　　専用のディスクを使う場合"Detach"イメージから仮想マシンを立ち上げる場合は"FormImage"を使用 プラットフォームイメージを使用する場合は"imageReference"が必須
        // マーケットプレイスイメージを使用する場合は"plan"が必須
        createOption: 'FromImage',
        //VM削除時OSディスクを削除するかしないか デフォルトはDetach
        deleteOption: 'Delete',
      },
      //データディスクを作成、既存のディスクを接続
      //   dataDisks: [
      //     {
      //       diskSizeGB: 1023,
      //       createOption: 'Empty',
      //       lun: 0,
      //     },
      //     {
      //       diskSizeGB: 1023,
      //       createOption: 'Empty',
      //       lun: 1,
      //     },
      //   ],
    },
    osProfile: {
      //管理者名
      adminUsername: 'hal',
      //仮想マシン名
      computerName: 'myVM02',
      //仮想マシンパスワード
      adminPassword: 'Halhal121212',
      windowsConfiguration: {
        //OSの自動更新 デフォルトはtrue
        enableAutomaticUpdates: true, // need automatic update for reimage
      },
    },
    networkProfile: {
      networkInterfaces: [
        {
          //サブスクID、リソースグループ、インターフェースを指定
          id: '/subscriptions/' + subscriptionId + '/resourceGroups/' + resourceGroupName + '/providers/Microsoft.Network/networkInterfaces/' + interface_name + '',
          primary: true,
        },
      ],
    },
  }
  const virtualMachines_info = await compute_client.virtualMachines.beginCreateOrUpdateAndWait(resourceGroupName, virtual_machine_name, virtualMachineParameter)
  console.log(virtualMachines_info)
}

async function main() {
  if (!!subscriptionId) {
    !!tenantId && !!clientId && !!secretKey
      ? (compute_client = new ComputeManagementClient(new ClientSecretCredential(tenantId, clientId, secretKey), subscriptionId))
      : (compute_client = new ComputeManagementClient(new DefaultAzureCredential(), subscriptionId))
  }
  await createVirtualMachine(resourceGroupName, virtual_machine_name)
}

main()

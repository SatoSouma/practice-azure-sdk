import { NetworkManagementClient, RouteTable } from '@azure/arm-network'
import 'dotenv/config'
import { resourceGroupName } from '../resourceName'

//サブスクID
const subscriptionId = process.env.subscriptionId
//テナントID
const tenantId = process.env.AZURE_TENANT_ID
//　クライアントID
const clientId = process.env.AZURE_CLIENT_ID
// シークレットキー
const secretKey = process.env.AZURE_CLIENT_SECRET
//ルートテーブル名
const routeTableName = 'practice-routeTable01'
//ネットワークのクラス(インターフェース)を定義
let network_client: NetworkManagementClient

const createRouteTable = async (ResourceGroupName: string, routeTableName: string) => {
  const routeTableParameter: RouteTable = {}

  //   const routeTable_info = await network_client.routeTables.beginCreateOrUpdateAndWait(resourceGroupName)
}

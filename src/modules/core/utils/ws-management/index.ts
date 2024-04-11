import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

export class WsManagement {
  private readonly client: ApiGatewayManagementApi;
  constructor(endpoint: string) {
    this.client = new ApiGatewayManagementApi({
      endpoint,
    });
  }
  postToConnection = async (connectionId: string, data: {}) => {
    const params = {
      ConnectionId: connectionId,
      Data: JSON.stringify(data),
    };
    await this.client.postToConnection(params);
  };
}

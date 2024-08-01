import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CLIENTS_CONNECTION, TENANT_CONNECTION } from './constants';

export const clientsConnectionProvider = {
  provide: CLIENTS_CONNECTION,
  useFactory: (connection: Connection) => connection.useDb('clients'),
  inject: [getConnectionToken()],
};

export const tenantConnectionProvider = {
  provide: TENANT_CONNECTION,
  useFactory: async (request, connection: Connection) => {
    if (!request.tenantName) {
      throw new Error('Tenant name not provided');
    }
    return connection.useDb(`tenant_${request.tenantName}`);
  },
  inject: [REQUEST, getConnectionToken()],
};

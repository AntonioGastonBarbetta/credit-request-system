// Placeholder API service layer. Implement HTTP client and endpoints here.
export const api = {
  auth: {
    login: async (data: any) => ({ status: 501, data })
  },
  creditRequests: {
    list: async () => ({ data: [] }),
    get: async (id: string) => ({ data: null }),
    create: async (payload: any) => ({ data: payload })
  }
};

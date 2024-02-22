declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Global {
      onlineUsers: Map<string, string>; // Assuming the map stores userIds mapped to socketIds
    }
  }
}

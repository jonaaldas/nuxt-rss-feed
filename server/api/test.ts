export default defineCachedEventHandler(
  async (event) => {
    return {
      message: 'Hello, world!',
      date: new Date().toISOString(),
    };
  },
  {
    maxAge: 30000, // 30 seconds
    name: 'test',
  },
);

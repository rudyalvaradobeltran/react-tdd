const asyncCallback = (cb) => {
  setTimeout(() => {
    cb(true);
  }, 1000);
};

const asyncPromise = (cb) => {
  return new Promise((resolve) => {
    resolve(true);
  });
};

describe('async code', () => {
  it('example of async with callback', (done) => {
    asyncCallback((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('example of async with promises', () => {
    return asyncPromise().then((result) => {
      expect(result).toBe(true);
    });
  });

  it('example of async with promises resolves', () => {
    return expect(asyncPromise()).resolves.toBe(true);
  });

  it('example of async with promises async await', async () => {
    const result = await asyncPromise();
    expect(result).toBe(true);
  });
});
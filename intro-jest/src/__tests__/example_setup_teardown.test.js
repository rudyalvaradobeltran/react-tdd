describe('setup and teardown example', () => {
  beforeAll(() => {
    console.log('Before all tests');
  });
  beforeEach(() => {
    console.log('Before each test');
  });
  afterAll(() => {
    console.log('After all tests');
  });
  afterEach(() => {
    console.log('After each test');
  });
  it('example 1', () => {
    expect(true).toBe(true);
  });
  it('example 2', () => {
    expect(true).toBe(true);
  });
});
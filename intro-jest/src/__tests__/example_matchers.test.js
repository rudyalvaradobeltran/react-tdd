describe('matchers', () => {
  it('to be', () => {
    expect(true).toBe(true);
  });

  it('to equal', () => {
    const data = { one: 1 };
    data['two'] = 2;
    expect(data).toEqual({ one: 1, two: 2 });

    const arr = ['one', 'two'];
    expect(arr).toEqual(['one', 'two']);
  });

  it('not', () => {
    expect(true).not.toBe(false);
  });

  it('string', () => {
    expect('team').not.toMatch(/I/);
  });
});
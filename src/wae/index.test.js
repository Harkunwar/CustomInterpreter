import { expect } from 'chai';
import { interpFromStr } from './index.js';

describe('wae', () => {
  it('simple add', () => {
    const str = "{+ 3 6}";
    expect(interpFromStr(str)).to.equal(9);
  });

  it('override identifier', () => {
    const str = "{with {x 5} {- x {with {x 3} x}}}";
    expect(interpFromStr(str)).to.equal(2);
  });
})
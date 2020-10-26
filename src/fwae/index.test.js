import { expect } from 'chai';
import {
  interpFromStr,
  // parse
} from './index';
// import { read } from '../read';

describe('wae', () => {
  it('simple add', () => {
    const str = "{+ 3 6}";
    expect(interpFromStr(str)).to.equal(9);
  });

  it('override identifier', () => {
    const str = "{with {x 5} {- x {with {x 3} x}}}";
    expect(interpFromStr(str)).to.equal(2);
  });

  it('returns funv', () => {
    const str = "{with {x {fun {b} 3}} x}";
    expect(interpFromStr(str).type).to.equal('FUNV');
  });

  it('applies function', () => {
    const str = "{{fun {x} {+ x x}} {+ 1 2}}";
    expect(interpFromStr(str)).to.equal(6);
  });

  it('apply using identifier', () => {
    const str = "{with {x {fun {b} {- b 1}}} {x 3}}";
    expect(interpFromStr(str)).to.equal(2);
  });

  it('static', () => {
    const str = "{with {x 3} {{fun {b} {- x b}} {with {x 1} 2}}}";
    expect(interpFromStr(str)).to.equal(1);
  });
});
const expect = require('chai').expect;
const loglevel = require('loglevel');
const other = require('loglevel-plugin-mock');
const sinon = require('sinon');
const prefix = require('../lib/loglevel-plugin-prefix');

const spy = sinon.spy();

describe('', () => {
  beforeEach(() => {
    /* eslint-disable no-empty */
    try {
      prefix.disable();
    } catch (ignore) {}
    try {
      other.disable();
    } catch (ignore) {}
    try {
      prefix.disable();
    } catch (ignore) {}
    /* eslint-enable no-empty */
    spy.reset();
  });

  describe('API', () => {
    it('Methods', () => {
      expect(prefix).to.have.property('apply').with.be.a('function');
      expect(prefix).to.have.property('disable').with.be.a('function');
      expect(prefix).not.to.have.property('noConflict');
    });

    it('Empty arguments', () => {
      expect(prefix.apply).to.throw(TypeError, 'Argument is not a root loglevel object');
    });

    it('Not root loglevel argument', () => {
      expect(() => prefix.apply(loglevel.getLogger('log'))).to.throw(
        TypeError,
        'Argument is not a root loglevel object'
      );
    });

    it('Disabling a not appled plugin should throw an exception', () => {
      expect(prefix.disable).to.throw(Error, "You can't disable a not appled plugin");
    });

    it('Right applying', () => {
      expect(() => prefix.apply(loglevel)).to.not.throw();
    });

    it('Right disabling', () => {
      prefix.apply(loglevel);

      expect(prefix.disable).to.not.throw();
    });

    it('Reapplying without applying other plugin', () => {
      prefix.apply(loglevel);

      expect(() => prefix.apply(loglevel)).to.not.throw();
    });

    it('Reapplying after using another plugin should throw an exception', () => {
      prefix.apply(loglevel);
      other.apply(loglevel);

      expect(() => prefix.apply(loglevel)).to.throw(
        Error,
        "You can't reassign a plugin after appling another plugin"
      );
    });

    it('Disabling after using another plugin should throw an exception', () => {
      prefix.apply(loglevel);
      other.apply(loglevel);

      expect(prefix.disable).to.throw(
        Error,
        "You can't disable a plugin after appling another plugin"
      );
    });

    it('Reapplying after disabling another plugin should not thrown an exception', () => {
      prefix.apply(loglevel);
      other.apply(loglevel);
      other.disable();

      expect(() => prefix.apply(loglevel)).to.not.throw();
    });

    it('Disabling after disabling another plugin should not thrown an exception', () => {
      prefix.apply(loglevel);
      other.apply(loglevel);
      other.disable();

      expect(prefix.disable).to.not.throw();
    });
  });

  describe('Prefix', () => {
    it('All methods of the previous plugin should be called', () => {
      other.apply(loglevel, { method: spy });
      prefix.apply(loglevel);

      loglevel.enableAll();
      loglevel.trace();
      loglevel.debug();
      loglevel.info();
      loglevel.warn();
      loglevel.error();
      expect(spy.callCount).to.equal(5);
    });

    it('The prefix must be combined with the first argument, if it is a string', () => {
      other.apply(loglevel, { method: spy });
      prefix.apply(loglevel, { template: '%l:' });

      loglevel.warn('foo %s', 'bar');
      expect(spy.calledWith('WARN: foo %s', 'bar')).to.be.true;
    });
  });
});

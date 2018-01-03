const expect = require("chai").expect;
const loglevel = require("loglevel");
const other = require("loglevel-plugin-mock");
const sinon = require("sinon");
const prefix = require("../lib/loglevel-plugin-prefix");

const spy = sinon.spy();

describe("", () => {
  beforeEach(() => {
    spy.reset();
  });

  describe("API", () => {
    it("Methods", () => {
      expect(prefix).to.have.property("apply").with.be.a("function");
      expect(prefix).not.to.have.property("noConflict");
    });

    it("Empty arguments", () => {
      expect(prefix.apply).to.throw(TypeError, "Argument is not a logger");
    });

    it("Incorrect argument", () => {
      expect(() => prefix.apply("logger")).to.throw(TypeError, "Argument is not a logger");
    });

    it("Applying", () => {
      expect(() => prefix.apply(loglevel)).to.not.throw();
    });

    it("Reapplying", () => {
      expect(() => prefix.apply(loglevel)).to.not.throw();
    });
  });

  describe("Prefix", () => {
    other.apply(loglevel, { method: spy });
    const child = loglevel.getLogger("child");
    child.enableAll();

    it("All methods of the previous plugin should be called", () => {
      prefix.apply(loglevel);

      loglevel.enableAll();
      loglevel.trace();
      loglevel.debug();
      loglevel.info();
      loglevel.warn();
      loglevel.error();
      expect(spy.callCount).to.equal(5);
    });

    it("Child logger", () => {
      prefix.apply(child, { template: "%l (%n):" });
      child.info("test");
      expect(spy.calledWith("INFO (child): test")).to.be.true;
    });

    it("Child reapplyng", () => {
      prefix.apply(child, {
        levelFormatter: function(level) {
          return level;
        }
      });
      child.info("test");
      expect(spy.calledWith("info (child): test")).to.be.true;
    });

    it("Root reapplyng", () => {
      prefix.apply(loglevel, { template: "%l (%n):" });
      loglevel.info("test");
      expect(spy.calledWith("INFO (root): test")).to.be.true;
    });

    it("The prefix must be combined with the first argument, if it is a string", () => {
      prefix.apply(loglevel, { template: "%l:" });

      loglevel.warn("foo %s", "bar");
      expect(spy.calledWith("WARN: foo %s", "bar")).to.be.true;
    });
  });
});

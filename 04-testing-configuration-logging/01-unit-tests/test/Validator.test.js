const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors1 = validator.validate({ name: 'Lalala' });
      const errors2 = validator.validate({ name: 'Lalaa;dfjkg;akdfg;nasd;jkfgnadgla' });
      const errors3 = validator.validate({ name: 'Lalaa;dfjkg;' });
      const errors4 = validator.validate({ name: '1234567891' });
      const errors5 = validator.validate({ name: '12345678911234567891' });

      expect(errors1).to.have.length(1);
      expect(errors1[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors1[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');

      expect(errors2).to.have.length(1);
      expect(errors2[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors2[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 33');

      expect(errors3).to.have.length(0);
      expect(errors4).to.have.length(0);
      expect(errors5).to.have.length(0);
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors1 = validator.validate({ age: 21 });
      const errors2 = validator.validate({ age: 9 });
      const errors3 = validator.validate({ age: 15 });
      const errors4 = validator.validate({ age: 10 });
      const errors5 = validator.validate({ age: 20 });

      expect(errors1).to.have.length(1);
      expect(errors1[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors1[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 21');

      expect(errors2).to.have.length(1);
      expect(errors2[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors2[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 9');

      expect(errors3).to.have.length(0);
      expect(errors4).to.have.length(0);
      expect(errors5).to.have.length(0);
    });

    it('валидатор проверяет типы полей', () => {
      const validator1 = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const validator2 = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 20,
        },
      });

      const errors1 = validator1.validate({ age: '21' });
      const errors2 = validator1.validate({ age: '0' });
      const errors3 = validator2.validate({ name: 323 });
      const errors4 = validator2.validate({ name: 1 });

      expect(errors1).to.have.length(1);
      expect(errors1[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors1[0]).to.have.property('error').and.to.be.equal('expect number, got string');

      expect(errors2).to.have.length(1);
      expect(errors2[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors2[0]).to.have.property('error').and.to.be.equal('expect number, got string');

      expect(errors3).to.have.length(1);
      expect(errors3[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors3[0]).to.have.property('error').and.to.be.equal('expect string, got number');

      expect(errors4).to.have.length(1);
      expect(errors4[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors4[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор проверяет объект с двумя полями', () => {
      const validator1 = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
      });

      const validator2 = new Validator({
        age: {
          type: 'string',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
      });

      const errors1 = validator1.validate({ age: 21, name: 'a' });
      const errors2 = validator1.validate({ age: 9, name: 'aaaaaaaaaaaaaaaaaaaaaa' });
      const errors3 = validator1.validate({ age: 10, name: 'aaaaa' });
      const errors4 = validator1.validate({ age: 10, name: 'aaaaaaaaaaaaaaaaaaaaaa' });
      const errors5 = validator2.validate({ age: 10, name: 'aaaaaaaaaaaaaaaaaaaaaa' });

      expect(errors1).to.have.length(2);
      expect(errors1[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors1[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 21');
      expect(errors1[1]).to.have.property('field').and.to.be.equal('name');
      expect(errors1[1]).to.have.property('error').and.to.be.equal('too short, expect 5, got 1');

      expect(errors2).to.have.length(2);
      expect(errors2[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors2[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 9');
      expect(errors2[1]).to.have.property('field').and.to.be.equal('name');
      expect(errors2[1]).to.have.property('error').and.to.be.equal('too long, expect 10, got 22');

      expect(errors3).to.have.length(0);

      expect(errors4).to.have.length(1);
      expect(errors4[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors4[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 22');

      expect(errors5).to.have.length(2);
      expect(errors5[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors5[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      expect(errors5[1]).to.have.property('field').and.to.be.equal('name');
      expect(errors5[1]).to.have.property('error').and.to.be.equal('too long, expect 10, got 22');
    });

  });
});
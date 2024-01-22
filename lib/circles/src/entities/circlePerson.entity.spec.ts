import { validate } from 'class-validator';
import { circlePersonBasicStub } from '../__test__/circlePerson.stub';

describe('CirclePerson entity', () => {
  it('should be valid', async () => {
    const circlePerson = circlePersonBasicStub();
    const errors = await validate(circlePerson);
    expect(errors.length).toEqual(0);
  });

  describe('check required fields', () => {
    it('should have a phone field', async () => {
      const circlePerson = circlePersonBasicStub({ phone: undefined });
      const errors = await validate(circlePerson);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should have a type field', async () => {
      const circlePerson = circlePersonBasicStub({ type: undefined });
      const errors = await validate(circlePerson);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should have a status field', async () => {
      const circlePerson = circlePersonBasicStub({ status: undefined });
      const errors = await validate(circlePerson);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
  describe('check phone field', () => {
    it('should be a valid phone number', async () => {
      const circlePerson = circlePersonBasicStub({ phone: 'invalid phone number' });
      const errors = await validate(circlePerson);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
  describe('check type field', () => {
    it('should be a valid status', async () => {
      const circlePerson = circlePersonBasicStub({ status: 'invalid status' as any });
      const errors = await validate(circlePerson);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('check valid type, Near', async () => {
      const circlePerson = circlePersonBasicStub({ type: 'Near' });
      const errors = await validate(circlePerson);
      expect(errors.length).toEqual(0);
    });
    it('check valid type, Mid', async () => {
      const circlePerson = circlePersonBasicStub({ type: 'Mid' });
      const errors = await validate(circlePerson);
      expect(errors.length).toEqual(0);
    });
    it('check valid type, Distant', async () => {
      const circlePerson = circlePersonBasicStub({ type: 'Distant' });
      const errors = await validate(circlePerson);
      expect(errors.length).toEqual(0);
    });
  });
  describe('check status field', () => {
    it('should be a valid status', async () => {
      const circlePerson = circlePersonBasicStub({ status: 'invalid status' as any });
      const errors = await validate(circlePerson);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('check valid status, accepted', async () => {
      const circlePerson = circlePersonBasicStub({ status: 'Accepted' });
      const errors = await validate(circlePerson);
      expect(errors.length).toEqual(0);
    });
    it('check valid status, pending', async () => {
      const circlePerson = circlePersonBasicStub({ status: 'Pending' });
      const errors = await validate(circlePerson);
      expect(errors.length).toEqual(0);
    });
  });
});

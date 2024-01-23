import { faker } from '@faker-js/faker';
import { validate } from 'class-validator';
import { callBasicStub } from 'lib/calls-history/__test__/calls.stub';

describe('Call entity', () => {
  it('should be validate', async () => {
    const u = callBasicStub();
    const errors = await validate(u);
    expect(errors.length).toBe(0);
  });

  describe('check required fields', () => {
    it('should not be validate if callee is not provided', async () => {
      const u = callBasicStub({ callee: undefined });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should not be validate if caller is not provided', async () => {
      const u = callBasicStub({ caller: undefined });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should not be validate if startDate is not provided', async () => {
      const u = callBasicStub({ startDate: undefined });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should be validate if endDate is not provided', async () => {
      const u = callBasicStub({ endDate: undefined });
      const errors = await validate(u);
      expect(errors.length).toEqual(0);
    });
    it('should not be validate if status is not provided', async () => {
      const u = callBasicStub({ status: undefined });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('check phones', () => {
    it('callee invalid phone', async () => {
      const u = callBasicStub({ callee: 'notaphone' });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('caller invalid phone', async () => {
      const u = callBasicStub({ caller: 'notaphone' });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('callee and caller same phone', async () => {
      const u = callBasicStub({});
      const u2 = callBasicStub({ caller: u.callee, callee: u.callee });
      const errors = await validate(u2);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
  describe('check status field', () => {
    it('should be a valid status', async () => {
      const u = callBasicStub({ status: 'invalid status' as any });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('check valid status, success', async () => {
      const u = callBasicStub({ status: 'Success' });
      const errors = await validate(u);
      expect(errors.length).toEqual(0);
    });
    it('check valid status, fail', async () => {
      const u = callBasicStub({ status: 'Failed' });
      const errors = await validate(u);
      expect(errors.length).toEqual(0);
    });
  });
  describe('check date', () => {
    it('startDate > endDate', async () => {
      const startDate = faker.date.recent({ days: 30 });
      const endDate = new Date(startDate.getTime() - faker.number.int({ min: 5, max: 60 }) * 60 * 1000);
      const u = callBasicStub({ startDate, endDate });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

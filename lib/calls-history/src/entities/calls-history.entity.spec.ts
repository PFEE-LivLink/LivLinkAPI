import { validate } from 'class-validator';
import { callBasicStub } from 'lib/calls-history/__test__/calls.stub';
import { CallsHistory } from './calls-history.entity';
import { TestHelper } from 'lib/utils/TestHelper';
import { Repository } from 'typeorm';

describe('Call entity', () => {
  let callsHistoryRepository: Repository<CallsHistory>;
  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
    callsHistoryRepository = await TestHelper.instance.getRepository(CallsHistory);
  });

  afterEach(async () => {
    await TestHelper.instance.dropCollections();
  });

  afterAll(async () => {
    await TestHelper.instance.teardownTestDB();
  });

  it('duplicate phone number should throw error', async () => {
    const u = callBasicStub();
    const u1 = new CallsHistory({ phone: u.callee, callsHistory: [u] });
    const u2 = new CallsHistory({ phone: u.callee, callsHistory: [u] });
    await callsHistoryRepository.save(u1);
    await expect(callsHistoryRepository.save(u2)).rejects.toThrowError();
  });

  it('should be validate', async () => {
    const u = callBasicStub();
    const ch = new CallsHistory({ phone: u.callee, callsHistory: [u] });
    const errors = await validate(ch);
    expect(errors.length).toBe(0);
  });

  describe('check required fields', () => {
    it('should not be validate if phone is not provided', async () => {
      const ch = new CallsHistory({ phone: undefined, callsHistory: [] });
      const errors = await validate(ch);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should not be validate if calls is not provided', async () => {
      const u = callBasicStub();
      const ch = new CallsHistory({ phone: u.callee, callsHistory: undefined });
      const errors = await validate(ch);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('check phones', () => {
    it('callee invalid phone', async () => {
      const u = new CallsHistory({ phone: 'notaphone', callsHistory: [] });
      const errors = await validate(u);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('check nested validation', () => {
    it('should not be validate if sub phone is not valid', async () => {
      const u = callBasicStub({ callee: 'notaphone' });
      const ch = new CallsHistory({ phone: u.caller, callsHistory: [u] });
      const errors = await validate(ch);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

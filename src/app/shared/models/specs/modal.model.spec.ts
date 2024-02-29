import { ModalDataGet } from '../modal.model';

describe('ModalDataGet', () => {
  it('should create an instance', () => {
    const modalDataGet = new ModalDataGet();
    expect(modalDataGet).toBeTruthy();
  });

  it('should initialize data property with provided data', () => {
    const data = { key: 'value' };
    const modalDataGet = new ModalDataGet(data);
    expect(modalDataGet.data).toEqual(data);
  });

  it('should initialize data property as undefined if no data is provided', () => {
    const modalDataGet = new ModalDataGet();
    expect(modalDataGet.data).toBeUndefined();
  });
});

import Digitization from '../index';

test('sum must be right', () => {
  const digi = new Digitization({workspace:'sadasdsa' , url:'sadsadasdas'});
  expect(digi.sum(2, 5)).toBe(7);
});

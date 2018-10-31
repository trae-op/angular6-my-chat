import { ChatDirective } from './chat.directive';

const elRefMock = {
  nativeElement: document.createElement('div')
};

describe('ChatDirective', () => {
  it('should create an instance', () => {
    const directive = new ChatDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});

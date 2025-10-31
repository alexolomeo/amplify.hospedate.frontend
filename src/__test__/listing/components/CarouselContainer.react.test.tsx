import CarouselContainer from '@/components/React/Common/CarouselContainer';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

describe('CarouselContainer', () => {
  afterEach(() => cleanup());
  test('does not render buttons if no overflow', () => {
    render(
      <CarouselContainer>
        <div style={{ width: '100px' }}>Item 1</div>
        <div style={{ width: '100px' }}>Item 2</div>
      </CarouselContainer>
    );

    const leftButton = screen.queryByLabelText('Scroll carousel left');
    const rightButton = screen.queryByLabelText('Scroll carousel right');

    expect(leftButton).not.toBeInTheDocument();
    expect(rightButton).not.toBeInTheDocument();
  });

  test('clicking buttons calls scrollBy', () => {
    const mockScrollBy = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
      configurable: true,
      value: mockScrollBy,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 1000,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 200,
    });

    render(
      <div style={{ width: '200px', overflow: 'hidden' }}>
        <CarouselContainer>
          <div style={{ display: 'flex', width: '1000px' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: '200px' }}>
                Item {i + 1}
              </div>
            ))}
          </div>
        </CarouselContainer>
      </div>
    );
    const rightButton = screen.getByLabelText('Scroll carousel right');
    fireEvent.click(rightButton);
    expect(mockScrollBy).toHaveBeenCalledWith({
      left: 200 * 0.5,
      behavior: 'smooth',
    });
  });

  test('renders buttons if there is overflow', () => {
    // Mockear scrollWidth > clientWidth para simular overflow
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 100,
    });

    render(
      <div style={{ width: '100px', overflow: 'hidden' }}>
        <CarouselContainer>
          <div style={{ display: 'flex', width: '200px' }}>
            <div style={{ width: '100px' }}>Item 1</div>
            <div style={{ width: '100px' }}>Item 2</div>
          </div>
        </CarouselContainer>
      </div>
    );

    const leftButton = screen.queryByLabelText('Scroll carousel left');
    const rightButton = screen.queryByLabelText('Scroll carousel right');

    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
  });

  test('left button is disabled at start', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      get: () => 0, // simulate start of scroll
    });
    render(
      <div style={{ width: '100px', overflow: 'hidden' }}>
        <CarouselContainer>
          <div style={{ display: 'flex', width: '200px' }}>
            <div style={{ width: '100px' }}>Item 1</div>
            <div style={{ width: '100px' }}>Item 2</div>
          </div>
        </CarouselContainer>
      </div>
    );
    const leftButton = screen.getByLabelText('Scroll carousel left');
    const rightButton = screen.getByLabelText('Scroll carousel right');
    expect(leftButton).toBeDisabled();
    expect(rightButton).not.toBeDisabled();
  });
});

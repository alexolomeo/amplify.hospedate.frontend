import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Guests } from '@/types/search';
import GuestCounter from '@/components/React/GuestCounter';

const mockGuestCountDecrease: Guests = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};
const mockGuestCountIncrease: Guests = {
  adults: 9,
  children: 7,
  infants: 5,
  pets: 5,
};
test('Should not allow less than 1 adult, and 0 pets, infants, children', async () => {
  render(
    <GuestCounter
      guestCount={mockGuestCountDecrease}
      subtitle=""
      onUpdate={() => {}}
      lang="es"
      maxGuests={16}
      petsAllowed={true}
      dropdownSize="w-md"
      dropdownAlign="dropdown-start"
    />
  );
  const decreaseAdults = screen.getByTestId('decrease-adults');
  const decreasePets = screen.getByTestId('decrease-pets');
  const decreaseInfants = screen.getByTestId('decrease-infants');
  const decreaseChildren = screen.getByTestId('decrease-children');

  const adultsCount = screen.getAllByTestId('adults-count')[0];
  const childrenCount = screen.getAllByTestId('children-count')[0];
  const infantsCount = screen.getAllByTestId('infants-count')[0];
  const petsCount = screen.getAllByTestId('pets-count')[0];

  await waitFor(() => {
    expect(adultsCount).toHaveTextContent('1');
  });
  fireEvent.click(decreaseAdults);
  await waitFor(() => {
    expect(adultsCount).toHaveTextContent('1');
  });

  await waitFor(() => {
    expect(petsCount).toHaveTextContent('0');
  });
  fireEvent.click(decreasePets);
  await waitFor(() => {
    expect(petsCount).toHaveTextContent('0');
  });

  await waitFor(() => {
    expect(infantsCount).toHaveTextContent('0');
  });
  fireEvent.click(decreaseInfants);
  await waitFor(() => {
    expect(infantsCount).toHaveTextContent('0');
  });

  await waitFor(() => {
    expect(childrenCount).toHaveTextContent('0');
  });
  fireEvent.click(decreaseChildren);
  await waitFor(() => {
    expect(childrenCount).toHaveTextContent('0');
  });
});

test('Should not allow more than 5 pets and infants', async () => {
  render(
    <GuestCounter
      guestCount={mockGuestCountIncrease}
      subtitle=""
      onUpdate={() => {}}
      lang="es"
      maxGuests={16}
      petsAllowed={true}
      dropdownSize="w-md"
      dropdownAlign="dropdown-start"
    />
  );
  const increasePets = screen.getByTestId('increase-pets');
  const increaseInfants = screen.getByTestId('increase-infants');
  const increaseAdults = screen.getByTestId('increase-adults');
  const increaseChildren = screen.getByTestId('increase-children');

  const adultsCount = screen.getAllByTestId('adults-count')[0];
  const childrenCount = screen.getAllByTestId('children-count')[0];
  const infantsCount = screen.getAllByTestId('infants-count')[0];
  const petsCount = screen.getAllByTestId('pets-count')[0];

  await waitFor(() => expect(infantsCount).toHaveTextContent('5'));
  await waitFor(() => expect(petsCount).toHaveTextContent('5'));

  fireEvent.click(increasePets);
  fireEvent.click(increaseInfants);

  await waitFor(() => expect(infantsCount).toHaveTextContent('5'));
  await waitFor(() => expect(petsCount).toHaveTextContent('5'));

  await waitFor(() => expect(adultsCount).toHaveTextContent('9'));
  await waitFor(() => expect(childrenCount).toHaveTextContent('7'));

  fireEvent.click(increaseAdults);
  fireEvent.click(increaseChildren);

  await waitFor(() => expect(adultsCount).toHaveTextContent('9'));
  await waitFor(() => expect(childrenCount).toHaveTextContent('7'));
});

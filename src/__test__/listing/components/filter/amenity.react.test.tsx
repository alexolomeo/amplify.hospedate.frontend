import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectAmenities from '@/components/React/Search/Filters/SelectAmenities';

jest.mock('@/components/React/Common/AppIcon', () => {
  const MockAppIcon = ({
    iconName,
    className,
  }: {
    iconName: string;
    className: string;
  }) => (
    <span data-testid={`mock-icon-${iconName}`} className={className}>
      {iconName}
    </span>
  );
  MockAppIcon.displayName = 'MockAppIcon';
  return MockAppIcon;
});

describe('SelectAmenities Component', () => {
  const mockOnUpdateAmenities = jest.fn();

  const mockAmenities = [
    { id: 'wifi', name: 'Wi-Fi', amenityGroup: 'Essentials', icon: 'wifi' },
    {
      id: 'kitchen',
      name: 'Kitchen',
      amenityGroup: 'Essentials',
      icon: 'kitchen',
    },
    { id: 'pool', name: 'Pool', amenityGroup: 'Features', icon: 'pool' },
    { id: 'gym', name: 'Gym', amenityGroup: 'Features', icon: 'gym' },
    {
      id: 'parking',
      name: 'Parking',
      amenityGroup: 'Convenience',
      icon: 'parking',
    },
    {
      id: 'Basic',
      name: 'Air Conditioning',
      amenityGroup: 'Comfort',
      icon: 'basic',
    },
  ];

  const defaultProps = {
    amenities: mockAmenities,
    selectId: [],
    lang: 'en' as const,
    onUpdateAmenities: mockOnUpdateAmenities,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. Initial Rendering ---
  describe('Initial Rendering', () => {
    it('should display the main title', () => {
      render(<SelectAmenities {...defaultProps} />);
      expect(
        screen.getByTestId('test-filter-amenities-title')
      ).toBeInTheDocument();
    });

    it('should initially show only the first amenity group and its amenities', () => {
      render(<SelectAmenities {...defaultProps} />);
      expect(
        screen.getByTestId('test-amenity-group-comfort')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-amenity-group-title-comfort')
      ).toHaveTextContent('Comfort');
      expect(
        screen.getByTestId('test-amenity-button-Basic')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('test-amenity-button-kitchen')
      ).not.toBeInTheDocument();
      // Ensure other groups are NOT in the document initially
      expect(
        screen.queryByTestId('test-amenity-group-title-features')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('test-amenity-group-title-convenience')
      ).not.toBeInTheDocument();
    });

    it('should render amenities with correct initial selected state based on selectId prop', () => {
      // Start with 'wifi' and 'pool' pre-selected
      render(<SelectAmenities {...defaultProps} selectId={['wifi', 'pool']} />);
      const showMoreLessButton = screen.getByTestId(
        'test-show-more-less-button'
      );
      fireEvent.click(showMoreLessButton);
      const wifiButton = screen.getByTestId('test-amenity-button-wifi');
      const kitchenButton = screen.getByTestId('test-amenity-button-kitchen');
      const poolButton = screen.getByTestId('test-amenity-button-pool');
      const gymButton = screen.getByTestId('test-amenity-button-gym');

      // Check selected state (btn-secondary class)
      expect(wifiButton).toHaveClass('btn-secondary'); // Selected
      expect(wifiButton).not.toHaveClass('btn-outline');

      expect(poolButton).toHaveClass('btn-secondary'); // Selected
      expect(poolButton).not.toHaveClass('btn-outline');

      // Check unselected state (btn-outline class)
      expect(kitchenButton).toHaveClass('btn-outline'); // Not selected
      expect(gymButton).toHaveClass('btn-outline'); // Not selected
    });

    it('should display the "Show More" button if there is more than one group', () => {
      render(<SelectAmenities {...defaultProps} />);
      const showMoreLessButton = screen.getByTestId(
        'test-show-more-less-button'
      );
      expect(showMoreLessButton).toBeInTheDocument();
    });

    it('should NOT display the "Show More" button if there is only one group', () => {
      const singleGroupAmenities = [
        { id: 'wifi', name: 'Wi-Fi', amenityGroup: 'Essentials', icon: 'wifi' },
        {
          id: 'kitchen',
          name: 'Kitchen',
          amenityGroup: 'Essentials',
          icon: 'kitchen',
        },
      ];
      render(
        <SelectAmenities {...defaultProps} amenities={singleGroupAmenities} />
      );
      expect(
        screen.queryByTestId('test-show-more-less-button')
      ).not.toBeInTheDocument();
    });
  });

  describe('Amenity Selection/Deselection', () => {
    it('should select an amenity when clicked and call onUpdateAmenities', async () => {
      render(<SelectAmenities {...defaultProps} />);
      const wifiButton = screen.getByTestId('test-amenity-button-Basic');
      fireEvent.click(wifiButton);
      await waitFor(() => {
        expect(wifiButton).toHaveClass('btn-secondary');
        expect(wifiButton).not.toHaveClass('btn-outline');
      });

      expect(mockOnUpdateAmenities).toHaveBeenCalledTimes(2);
      expect(mockOnUpdateAmenities).toHaveBeenCalledWith(['Basic']);
    });

    it('should deselect an amenity when clicked and call onUpdateAmenities', async () => {
      render(<SelectAmenities {...defaultProps} selectId={['wifi']} />);
      const showMoreLessButton = screen.getByTestId(
        'test-show-more-less-button'
      );
      fireEvent.click(showMoreLessButton);
      const wifiButton = screen.getByTestId('test-amenity-button-wifi');
      expect(wifiButton).toHaveClass('btn-secondary');

      fireEvent.click(wifiButton);
      expect(mockOnUpdateAmenities).toHaveBeenCalledTimes(2);
      expect(mockOnUpdateAmenities).toHaveBeenCalledWith([]);
    });
  });
});

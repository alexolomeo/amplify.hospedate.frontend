export default {
  common: {
    close: 'Close',
    mobile: 'Cellular',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    ok: 'OK',
    error: 'Error',
    deleting: 'Deleting…',
    noImageAvailable: 'No image available',
    loading: 'Loading…',
    saving: 'Saving…',
    goHome: 'Go to homepage',
    unexpectedError: 'Something went wrong.',
  },
  dateUtils: {
    fromToday: 'from Today',
  },
  paymentMethod: {
    pageTitles: 'How would you like to pay?',
    nit: 'NIT',
    business: 'Name or Business Name',
    bookListing: 'Book listing',
    cannotBookYourOwnListing: 'You cannot book your own listing',
    validation: {
      required: 'This field is required',
      nitDigits: 'NIT must be 5 to 15 digits',
      nameShort: 'Must be at least 2 characters',
    },
    titleQr: 'QR Payment',
    titleCard: 'Card Payment',
    paymentQr: 'Pay with QR',
    billingInfo: 'Billing Information',
    generateQr: 'Generate QR',
    paymentSecurity: 'Secure Payments',
    qrResult: 'Pay via QR',
    downloadQr: 'Download QR',
    instructions: 'Scan the QR code and complete the required payment.',
    instructionsTitle:
      'If the payment is successful, the QR code will be replaced by a “paid” check mark.',
    instructionsText:
      'The “Complete Reservation” button at the bottom of the page will become active, and you can proceed to your reservation page.',
    complete: 'Your payment has been confirmed!',
    completeBooking:
      'Scroll down and complete your booking by tapping the button',
    completeReserve: '"Reserve"',
  },
  earnings: {
    registerTitle: 'Your bank account',
    registerDescription:
      'Add a bank account so you can receive your payments as a host.',
    setUp: 'Set up',
    delete: 'Delete Account',
    deleting: 'Error deleting',
    financialInstitution: 'Financial Institution',
    bank: 'Credit Bank',
    accountType: 'Account Type',
    accountNumber: 'Account Number',
    holderName: 'Holder Name',
    alias: 'Save your account with an alias',
    addedSuccess: 'Your bank account has been successfully added.',
    confirmDelete: 'Do you want to delete your bank account?',
    accountAlias: 'Account alias',
    accountLast4Digits: 'Last 4 digits of the account',
    accountTypes: {
      SAVING: 'Savings account',
      CHECKING: 'Checking account',
    },
    deleteAccountTitle: 'Are you sure you want to delete your bank account?',
    deleteAccountDescription:
      'This action cannot be undone. You can add another bank account at any time.',
    cancel: 'Go Back',
    addBankAccount: 'Add your bank account',
  },
  booking: {
    pageTitles: {
      dashboard: 'Booking',
      title: 'About your trip',
    },
    error: {
      reservationPayment:
        "We couldn't create your reservation. Please try again later.",
      loadData: "We couldn't load the information. Please try again later.",
    },
    policy: {
      title: 'Cancellation Policy',
      pendingTitle: 'Pending Reservation Confirmation',
      hostAcceptance:
        'Your reservation will only be confirmed once the host accepts it (max. 24h).',
      notification:
        "We will notify you by email and in the app as soon as it's confirmed.",
      payment: 'To finalize, you can pay with QR or credit card.',
      acceptancePolicy:
        "By clicking the button below, I agree to the following policies: Host's House Rules, Basic Guest Rules, Refund Policy, and Hospédate's Booking Modification Assistance.",
      acceptance: 'I also accept the ',
      terms: 'Terms and Conditions of Use',
      privacy: 'Privacy Policy',
      goToReservation: 'Go to reservation',
      starReservation: 'Before confirming your reservation',
    },
    success: {
      stayWith: 'Stay with',
      total: 'Total',
      viewDetails: 'You can see the trip details here',
      goToMyTrips: 'Go to my trips',
      reservationConfirmed: 'Your reservation has been confirmed!',
      confirmationEmailSent: 'We have sent the confirmation to your email',
      talkToHost: 'Talk to your host',
      reservationCode: 'Reservation code',
    },
    details: {
      dates: 'Dates',
      total: 'Total',
      guests: 'Guests',
      tripDetails: 'Trip details',
      priceInformation: 'Price information',
      address: '{location}',
      reviews: 'Reviews',
      change: 'Change',
      guestsWith: 'Guests with {name}',
      edit: 'Edit',
      currency: 'BOB',
      pricePerNight: 'Price per night',
      priceDetails: {
        title: 'Price details',
        nights: '{count} nights',
        weeklyDiscountLabel: 'Weekly stay discount',
        monthlyDiscountLabel: 'Monthly stay discount',
        priceAfterDiscount: 'Price after discount',
        serviceFee: 'Service fee',
        totalPrice: 'Total price',
      },
      discountTime: '{discountTime}',
      message: 'Leave a message for the host',
      messageDescription:
        'Before we continue, could you share with {name} a little more about your experience and why you think their accommodation is a great choice?',
      cancellationText:
        'If you cancel your reservation before {date}, you will receive a full refund.',
      messagePlaceholder:
        "Example: 'Hi {name}, we want to rent this place because it's very important for us to be close to the city center.'",
    },
    verify: {
      title: 'First, verify your identity',
      description:
        'To book this property, you need to verify your identity. This step helps ensure that everyone on Hospédate is verified.',
      button: 'Verify now',
    },
  },
  hosting: {
    pageTitles: {
      dashboard: 'Host Dashboard',
      listings: 'My Listings',
      reservations: 'Reservations',
      messages: 'Messages',
      insights: 'Insights',
      earnings: 'Earnings',
      calendar: 'Calendar',
    },
  },
  checkInMethodsOptions: {
    SMART_LOCK: 'Smart lock',
    KEYPAD_LOCK: 'Keypad lock',
    LOCK_BOX: 'Lockbox with key',
    BUILDING_STAFF: 'Building staff',
    IN_PERSON: 'In-person meeting',
    OTHER: 'Other',
  },

  guestSafety: {
    items: {
      // safetyDevices
      carbonMonoxideDetector: {
        true: 'Carbon monoxide detector installed',
        false: 'No carbon monoxide detector',
      },
      smokeDetector: {
        true: 'Smoke detector installed',
        false: 'No smoke detector',
      },
      noiseMonitor: {
        true: 'Noise monitor installed',
        false: 'No noise monitor',
      },
      surveillance: {
        true: 'Security cameras or surveillance on the property',
        false: 'No cameras or surveillance',
      },

      // propertyInformation
      hasPets: {
        true: 'Owner has pets on the property',
        false: 'No owner pets on the property',
      },
      limitedAmenities: {
        true: 'Limited amenities',
        false: 'No limited amenities',
      },
      limitedParking: {
        true: 'Limited parking',
        false: 'No limited parking',
      },
      potentialNoise: {
        true: 'Potential for noise',
        false: 'No potential noise',
      },
      requiresStairs: {
        true: 'Requires stairs',
        false: 'No stairs required',
      },
      sharedSpaces: {
        true: 'Shared spaces',
        false: 'No shared spaces',
      },
      weapons: {
        true: 'Weapons on the property',
        false: 'No weapons on the property',
      },

      // safetyConsiderations
      animals: {
        true: 'Animals on or near the property',
        false: 'No animals',
      },
      climbingOrPlayStructure: {
        true: 'Climbing or play structure',
        false: 'No climbing or play structure',
      },
      heightsWithNoFence: {
        true: 'Heights with no fence',
        false: 'No heights without a fence',
      },
      lakeOrRiverOrWaterBody: {
        true: 'Near a lake, river, or other water body',
        false: 'No nearby water bodies',
      },
      poolOrJacuzziWithNoFence: {
        true: 'Pool or hot tub without a fence',
        false: 'No pool or hot tub without a fence',
      },
      noChildrenAllowed: {
        true: 'No children allowed',
        false: 'Children allowed',
      },
      noInfantsAllowed: {
        true: 'No infants allowed',
        false: 'Infants allowed',
      },
    },
  },

  more: '  · · · more',
  houseRules: {
    checkIn: 'Check-in from {start} to {end}',
    checkOut: 'Check-out until {time}',
    quietHours: 'Quiet hours from {start} to {end}',
    petsNotAllowed: 'Pets not allowed',
    petsAllowedMax: 'Pets allowed, maximum {count}',
    petsAllowed: 'Pets allowed',
    smokingAllowed: 'Smoking is allowed',
    smokingNotAllowed: 'Smoking is not allowed',
  },

  price: {
    perNight: '{amount} per night',
    perWeekend: '{amount} per weekend',
    weeklyDiscount: 'Weekly discount {percent}%',
    monthlyDiscount: 'Monthly discount {percent}%',
  },

  hostContent: {
    account: {
      title: 'Account Settings',
      greeting: 'Hello {name}',
      goToProfile: 'Go to my profile',
      personalInfoTitle: 'Personal information',
      personalInfoDesc:
        'Share your personal details and how we can contact you.',
      securityTitle: 'Login & security',
      securityDesc: 'Change your password and secure your account.',
      paymentsTitle: 'Earnings',
      paymentsDesc: 'Review coupons, and gift cards.',
      taxesTitle: 'Taxes',
      taxesDesc: 'Manage taxpayer information and tax documents.',
    },
    listingState: {
      listingStatus: 'Listing status',
      unPublished: 'Hidden',
      verifyAccountToPublish:
        'To publish your listing, you need to verify your account',
      verifyAccount: 'Verify your account',
      reviewingListing:
        'Our team is reviewing your listing to ensure it meets our quality and safety standards. We will notify you about the status of your listing.',
      notifyStatus: 'We will notify you about the status of your listing',
      approvedListing: 'Your listing has been approved, in less than',
      publishIn24h: '24 hours it will be published ',
      automatically: 'automatically',

      visibleAndBookable:
        'Your listing will appear in search results, allowing guests to make bookings.',
      hiddenAndUnavailable:
        'Your listing will not appear in search results or be available for bookings. You can choose dates to pause it.',
      reviewChanges: 'Review changes',
      reviewChangesMessage: 'We need to make some changes to your listing',
      requiredChanges: 'Required changes',
    },
    listingReasons: {
      groups: {
        titleModal:
          'Could you tell us why you no longer want to keep your listing published on Hospédate?',
        ctaLabel: 'Deactivate listing',
        DUPLICATE_LISTING: 'Duplicate listing',
        I_EXPECTED_MORE: 'Expected more',
        I_EXPECTED_TO_EARN_MORE: 'Expected to earn more money',
        LOCK_RESERVATIONS_FOR_NOW: 'Cannot host at the moment',
        I_CAN_NOT_RECEIVE_GUESTS: 'Can no longer host guests',
        I_EXPECTED_POLITE_GUESTS: 'Cannot host at the moment',
        DEFAULT: 'Other reasons',
      },
    },
    listings: {
      title: 'Your listings',
      viewList: 'View in list',
      viewGrid: 'View in cards',
      searchPlaceholder: 'Search by title or location',
      emptyTitle: 'You don’t have any listings yet.',
      emptyDescription: 'Create your first listing to start receiving guests.',
      addListing: 'Add listing',
      clear: 'Clear search',
      noResults: 'No listings found matching your search.',
      table: {
        title: 'Title',
        type: 'Type',
        location: 'Location',
        createdAt: 'Created at',
        status: 'Status',
        noInformation: 'No information',
        noTitle: 'No title',
        actions: 'Actions',
        view: 'View',
        address: 'edit address',
      },
      status: {
        PUBLISHED: 'Published',
        CHANGES_REQUESTED: 'Changes requested',
        IN_PROGRESS: 'In draft',
        UNLISTED: 'Hidden',
        APPROVED: 'Approved',
        PENDING_APPROVAL: 'Pending approval',
        BLOCKED: 'Blocked',
      },
    },
    editListing: {
      preview: {
        placeholders: {
          title: 'Untitled',
          photoGallery: 'No room/bath details',
          propertyType: 'Property type not selected',
          price: 'No prices configured',
          availability: 'Set availability',
          capacity: 'Guest count not defined',
          description: 'No description',
          amenities: 'No amenities selected',
          address: 'Address not available',
          booking: 'Booking type not configured',
          houseRules: 'No house rules defined',
          guestSafety: 'No safety items added',
          cancellation: 'Cancellation policy not selected',
          customLink: 'No custom link',
        },
      },
      commonMessages: {
        failedFetch:
          'We couldn’t load the required information. Please try again.',
        notFound:
          'We couldn’t find this listing. Check the link or go back to your listings.',
        retry: 'Retry',
        goBack: 'Back to my listings',
        saveSuccess: 'Changes saved successfully.',
        saveError: 'We couldn’t save your changes.',
        unpublishedSuccess:
          'Your listing was hidden successfully. It will not appear in searches or accept new bookings. Existing bookings remain active.',
        unpublishedError:
          'We couldn’t unpublish the listing. Please try again in a few minutes.',
        publishSuccess:
          'Your listing is now published and visible in search results. It can receive new bookings.',
        publishError:
          'We could not publish the listing. Please try again in a few minutes.',
        publishMinPhotosRequired:
          'To publish your listing, you must have at least {min} photos.',
      },
      sidebar: {
        title: 'Edit your space',
        view: 'View',
        tab: {
          place: 'Your place',
          guide: 'Arrival guide',
        },
        statusUnavailable: 'Status unavailable',
        optionsAriaLabel: 'Options',
        backAriaLabel: 'Back',
        stepTitle: 'Step',
        stepDescription: 'Step description',
        stepLabel: 'Step',
        arrivalSteps: {
          'check-in-out': 'Check-in / Check-out',
          directions: 'Directions',
          'check-in-method': 'Check-in method',
        },
        stepDisplayNames: {
          overview: 'Overview',
          'photo-gallery': 'Your photo gallery',
          title: 'Title',
          'property-type': 'Property type',
          address: 'Address',
          'edit-profile': 'About the host',
          price: 'Price',
          availability: 'Availability',
          capacity: 'Capacity',
          description: 'Description',
          amenities: 'Amenities',
          booking: 'Bookings',
          'house-rules': 'House Rules',
          'guest-safety': 'Guest Safety',
          'cancellation-policy': 'Cancellation Policies',
          'custom-link': 'Custom Link',
          preview: 'preview',
          'request-changes': 'Request changes',
        },
        preferenceSteps: {
          'listing-state': 'Listing Status',
          'traveler-requirements': 'Traveler Requirements',
          'local-legislation': 'Local Legislation',
          taxes: 'Taxes',
          'delete-listing': 'Delete Listing',
        },
        subTextPlace: {
          'photo-gallery': '1 bedroom • 1 bed • 1 bath',
          title: 'Incredible apartment in Equipetrol',
          'property-type': 'Departament',
          price: [
            {
              key: 'perNight',
              label: 'Bs 450 per night',
            },
            {
              key: 'weekly',
              label: '10% weekly discount',
            },
            {
              key: 'monthly',
              label: '20% monthly discount',
            },
          ],
          availability: [
            {
              key: 'min-max-days',
              label: 'Stays from 1 to 365 days',
            },
            {
              key: 'same-day-notice',
              label: 'Same-day notice',
            },
          ],
          capacity: '8 guests',
          description:
            'Feel at home and enjoy lots of amenities in this great apartment.',
          amenities: [
            { key: 'kitchen', label: 'Kitchen' },
            { key: 'tv', label: 'TV' },
            { key: 'wifi', label: 'Wi-Fi' },
            { key: 'more', label: '  · · · more' },
          ],
          booking: 'Bookings',
          'house-rules': [
            { key: 'checkin', label: 'El check-in es a partir de las 3:00 pm' },
            { key: 'guests', label: '8 guest' },
          ],
          'guest-safety': [
            { key: 'co', label: 'No carbon monoxide detector listed' },
            { key: 'smoke', label: '8 No smoke detector listed' },
          ],
          'cancellation-policy': 'Cancellation policy',
          'custom-link': 'Custom link',
        },
        name: {
          profileName: 'Juan Guzmán',
        },
        subTextArribals: {
          'check-in-out': 'Flexible – 7:00 pm',
          directions: 'Add information',
          'check-in-method': 'Smart lock',
        },
        subPreferences: {
          'listing-state': 'Listing Status',
          'delete-listing': 'Delete Listing',
        },
        requestChanges: {
          requestChangesTitle: 'We found issues with your listing',
          requestChangesBadge: 'Changes required',
          identityTitle:
            'We need you to verify your identity to publish your listing',
          identityBadge: 'Verify your identity',
        },
      },
      content: {
        editModeBanner: {
          visitMode: {
            strong: 'You are in view-only mode.',
            rest: 'You won’t be able to edit the listing information until it is approved.',
            restApproved:
              'You won’t be able to edit the listing information until you take the necessary actions.',
          },
        },
        noContentText: 'Select an item from the list\nto edit your space',
        changesRequested: {
          title: 'We need you to make some required changes to your listing',
          noteLabel: 'Note:',
          noteText:
            'Once you finish these changes, republish your listing so we can review it again.',
          verificationRequired: 'Verification required',
          step: 'Step',
          dniVerification: 'Confirm your account using your identity document.',
          verifyAccount: 'Verify account',
          changes: 'Changes requested',
          titleDescription:
            'We have identified the following changes that are required for your listing. Please make the necessary modifications.',
          labelDescription: 'These are the changes we identified:',
          publishAgain: 'Publish again',
          finalNote:
            'Once you finish these changes, click the "Request review" button so we can review your listing again.',
        },
        editTitle: {
          stepTitle: 'Title of your place',
          placeholder: 'Amazing apartment in Equipetrol',
          validation: {
            required: 'The title is required.',
            maxLength: 'The title can’t exceed 50 characters.',
          },
        },
        manyGuests: '{num} guests',
        editCapacity: {
          stepTitle: 'Number of guests',
          options: [
            '1 guest',
            '2 guests',
            '3 guests',
            '4 guests',
            '5 guests',
            '6 guests',
            '7 guests',
            '8 guests',
            '9 guests',
            '10 guests',
            '11 guests',
            '12 guests',
            '13 guests',
            '14 guests',
            '15 guests',
            '16 guests',
          ],
          validation: {
            required: 'Please select the number of guests.',
            min: 'Must be at least 1 guest.',
            max: 'Cannot exceed the allowed maximum.',
          },
        },
        editPropertyType: {
          stepTitle: 'Property type',
          descriptionLabel: 'How would you describe your place?',
          descriptionPlaceholder: 'Select type',
          propertyTypeLabel: 'Property type',
          propertyTypePlaceholder: 'Select type',
          floorsLabel: 'How many floors does your place have?',
          yearBuiltLabel: 'Year built',
          yearBuiltPlaceholder: 'e.g. 2015',
          sizeLabel: 'Home size',
          sizePlaceholder: 'e.g. 200',
          sizeUnitPlaceholder: 'Size unit',
          validation: {
            requiredGroup: 'Select a group',
            requiredType: 'Select a type',
            floorsMin: 'Must be at least 1',
            floorsMax: 'Cannot be greater than 300',
            yearRange: 'Invalid year',
            sizePositive: 'Must be greater than 0',
            sizeMaxTwoDecimals: 'Max 2 decimal places',
            sizeMaxIntegerDigits: 'Max 9 integer digits',
            unitRequired: 'Select the unit',
            sizeRequiredIfUnit: 'Enter a size for that unit',
          },
          groups: {
            APARTMENT: 'Apartment',
            HOUSE: 'House',
            SECONDARY_UNIT: 'Secondary unit',
            UNIQUE_SPACE: 'Unique space',
            BED_AND_BREAKFAST: 'Bed & Breakfast',
            BOUTIQUE_HOTEL: 'Boutique hotel',
          },
          types: {
            RENTAL_UNIT: 'Rental unit',
            CONDO: 'Condominium',
            SERVICED_APARTMENT: 'Serviced apartment',
            LOFT: 'Loft',
            HOME: 'Home',
            TOWNHOUSE: 'Townhouse',
            BUNGALOW: 'Bungalow',
            CABIN: 'Cabin',
            CHALET: 'Chalet',
            EARTHEN_HOME: 'Earthen home',
            HUT: 'Hut',
            LIGHTHOUSE: 'Lighthouse',
            VILLA: 'Villa',
            DOME: 'Dome',
            COTTAGE: 'Cottage',
            FARM_STAY: 'Farm stay',
            HOUSEBOAT: 'Houseboat',
            TINY_HOME: 'Tiny home',
            GUESTHOUSE: 'Guesthouse',
            GUEST_SUITE: 'Guest suite',
            BOAT: 'Boat',
            CASTLE: 'Castle',
            CAVE: 'Cave',
            ICE_DOME: 'Ice dome',
            ISLAND: 'Island',
            PLANE: 'Airplane',
            CAMPER_RV: 'Camper/RV',
            TENT: 'Tent',
            TIPI: 'Tipi',
            TRAIN: 'Train',
            TREEHOUSE: 'Treehouse',
            YURT: 'Yurt',
            OTHER: 'Other',
            BARN: 'Barn',
            CAMPSITE: 'Campsite',
            SHIPPING_CONTAINER: 'Shipping container',
            TOWER: 'Tower',
            RESORT: 'Resort',
            HOTEL: 'Hotel',
            BOUTIQUE_HOTEL: 'Boutique hotel',
            NATURE_LODGE: 'Nature lodge',
            HOSTEL: 'Hostel',
            APARTHOTEL: 'Aparthotel',
            RELIGIOUS_BUILDING: 'Religious building',
            WINDMILL: 'Windmill',
            BUS: 'Bus',
          },
          sizeUnits: {
            SQUARE_FEET: 'Square feet',
            SQUARE_METERS: 'Square meters',
          },
        },
        editDescription: {
          stepTitle: 'Description',
          charactersAvailable: 'characters left',
          spaceSection: {
            title: 'Describe your space',
            label: 'Space description',
            placeholder: 'Write your description here',
            validation: {
              required: 'This field is required.',
              max: 'Maximum 500 characters.',
            },
          },
          propertySection: {
            title: 'Your property',
            description:
              'Explain what’s in your rooms and spaces so guests know what to expect.',
            placeholder: 'Write your description here',
            validation: {
              max: 'Maximum 37.500 characters.',
            },
          },
          guestExperience: {
            title: 'Guest experience',
            access: {
              title: 'Guest access',
              description:
                'Describe which areas guests can use and that are accessible.',
              placeholder: 'Write your description here',
              validation: {
                max: 'Maximum 37.500 characters.',
              },
            },
            interaction: {
              title: 'Interaction with guests',
              description:
                'Explain how guests can contact you for assistance during their stay.',
              placeholder: 'Write your description here',
              validation: {
                max: 'Maximum 37.500 characters.',
              },
            },
            highlights: {
              title: 'Other details to highlight',
              description:
                'Add any additional information that could be useful to travelers when booking.',
              placeholder: 'Write your description here',
              validation: {
                max: 'Maximum 37.500 characters.',
              },
            },
          },
        },
        editAvailability: {
          stepTitle: 'Availability',
          description:
            'Configure minimum and maximum stay, the advance notice period, and whether you accept same-day bookings.',
          stayDuration: {
            title: 'Stay duration',
            minNights: 'Minimum nights per reservation',
            maxNights: 'Maximum nights per reservation',
          },
          noticePeriod: {
            title: 'Advance notice',
            selectLabel: 'Requires a minimum notice of:',
            cutoffLabel: 'Cutoff time for same-day bookings',
            placeholder: 'Select the advance notice…',
            cutoffPlaceholder: 'Select the cutoff time…',
          },
          sameDayToggleLabel: 'Allow same-day bookings',
          staysRange: 'Stays from {min} to {max} days',
          sameDayToggleDescription:
            'If enabled, guests can book on the same day until the defined cutoff time.',
          noticeOptions: {
            SAME_DAY: 'Same day',
            AT_LEAST_ONE_DAY: 'At least 1 day',
            AT_LEAST_TWO_DAYS: 'At least 2 days',
            AT_LEAST_THREE_DAYS: 'At least 3 days',
            AT_LEAST_SEVEN_DAYS: 'At least 7 days',
          },
          validation: {
            min: {
              required: 'Minimum nights are required.',
              atLeast1: 'Minimum stay must be at least 1 night.',
              lteMax: 'Your maximum stay is {max} nights.',
            },
            max: {
              required: 'Maximum nights are required.',
              gteMin: 'Your minimum stay is {min} nights.',
              lte730:
                'Maximum number of nights must be less than or equal to 730.',
            },
            integerOnly: 'Must be an integer number.',
            notice: {
              required: 'Select an advance notice period.',
              cutoffRequired: 'Select a cutoff time for same-day bookings.',
            },
          },
        },
        editPrice: {
          stepTitle: 'Prices',
          description:
            'This price will be shown for each night unless you customize specific dates in your calendar.',
          link: 'by tapping here.',
          nightlyTitle: 'Nightly price',
          nightlyDescription: 'Nightly price',
          weekendTitle: 'Weekend price',
          weekendToggleTitle: 'Custom weekend price',
          weekendDescription: 'Set a different price for weekends',
          discountsTitle: 'Discounts',
          discountsDescription: 'Enable or disable discounts',
          weekly: 'Weekly',
          weeklyHint: 'For 7 nights or more',
          monthly: 'Monthly',
          monthlyHint: 'For 28 nights or more',
          minNightPriceHint: 'Minimum per night: 50',
          discountsRuleHint:
            'Monthly discount cannot be lower than the weekly discount.',
          cannotComputeHint:
            'Enter a valid nightly price to preview discounted totals.',
          validation: {
            requiredNight: 'Enter a nightly price.',
            maxNightPriceHint: 'Nightly price cannot exceed 10000.',
            requiredWeekend: 'Enter a weekend price.',
            minWeekendPriceHint: 'Weekend price cannot be less than 50.',
            maxWeekendPriceHint: 'Weekend price cannot exceed 10000.',
            integerOnly: 'Use whole numbers only.',
          },
        },
        booking: {
          title: 'Booking configuration',
          instantBooking: 'Instant booking',
          instantBookingDescription:
            'Allow guests to book automatically. This often helps you get more reservations.',
          addCustomMessage:
            'Add a custom message for guests to read before booking',
          writeDescriptionHere: 'Write the description here',
          approveAllReservations: 'Approve all reservations',
          approveAllReservationsDescription:
            'Review and approve each booking request before confirming.',
          validation: {
            typeRequired: 'Select a booking type.',
            welcomeMax: 'Maximum 400 characters.',
          },
        },
        houseRules: {
          title: 'House Rules',
          description:
            'Guests are required to follow the rules; otherwise, we may expel them from Hospédate.',
          placeholder: 'Select an option',
          permissions: {
            title: 'Permissions',
            petsAllowed: 'Pets allowed',
            petsAllowedDescription:
              'Although pets are not generally allowed, guests must be permitted to stay with their service animals, provided it is reasonable.',
            maxPetsAllowed: 'Maximum number of pets allowed',
            eventsAllowed: 'Events allowed',
            smokingVapingShishaAllowed: 'Smoking, vaping, and shisha allowed',
            commercialPhotographyFilmingAllowed:
              'Commercial photography and filming allowed',
            maxPeopleAllowed: 'Maximum number of people allowed',
          },
          quietHours: {
            title: 'Quiet Hours',
            toggleLabel: 'Quiet hours',
            startTime: 'Start time',
            endTime: 'End time',
          },
          checkInOutHours: {
            title: 'Check-in and Check-out Hours',
            arrivalHour: 'Arrival time',
            departureHour: 'Departure time',
            startTime: 'Start time',
            endTime: 'End time',
            selectTime: 'Select time',
          },
          additionalRules: {
            title: 'Additional Rules',
            textAreaPlaceholder: 'Additional rules',
            description:
              'Share everything the guest should know about your accommodation.',
          },
          validation: {
            numPetsMin: 'You must allow at least 1 pet.',
            numPetsMax: 'You cannot allow more than 5 pets.',
            guestMin: 'Must be at least 1.',
            guestMax: 'Cannot be greater than 16.',
            quietStartRequired: 'Select a start time.',
            quietEndRequired: 'Select an end time.',
            checkinStartRequired: 'Select a check-in start time.',
            checkinEndBeforeStart:
              'End time cannot be earlier than start time.',
            checkoutRequired: 'Select a check-out time.',
            additionalMax: 'Maximum 1000 characters.',
            checkinEndRequired: 'Select a check-in end time.',
          },
        },
        guestSafety: {
          modalPlaceholder: 'Add the information your guest needs to know',
          title: 'Guest Safety',
          description:
            'The safety information you provide will be displayed in your space, along with details such as house rules.',
          addInformation: 'Add information',
          editInformation: 'Edit information',
          safetyConsiderations: {
            title: 'Safety Considerations',
            notGoodForKidsAge2To12: {
              label: 'Not suitable for children aged 2-12',
              description:
                'This property has features that may not be safe for children.',
            },
            notGoodForInfantsUnder2: {
              label: 'Not suitable for infants under 2',
              description:
                'This property has features that may not be safe for babies or infants.',
            },
            unfencedPoolOrHotTub: {
              label: 'Unfenced pool or hot tub',
              description:
                'Guests have access to an unprotected pool or hot tub. Check local regulations for specific requirements.',
            },
            nearBodyOfWater: {
              label: 'Near a body of water, such as a lake or river',
              description:
                'Guests have unrestricted access to a body of water, such as the ocean, a pond, a stream, or a wetland, either on or next to the property.',
            },
            structuresToClimbOrPlay: {
              label: 'Structures to climb or play on the property',
              description:
                'Guests may have access to structures such as a play area, slides, hammocks, or ropes for climbing.',
            },
            unprotectedElevatedAreas: {
              label:
                'There are elevated areas without railing or other protection',
              description:
                'Guests may have access to an area that is more than 76 centimeters (30 inches) high, such as a balcony, a roof, a terrace, or a cliff, without a railing or other type of protection.',
            },
            potentiallyDangerousAnimals: {
              label: 'Potentially dangerous animals on the property',
              description:
                'Guests and their pets will be near animals, such as horses, pumas, or farm animals, which could cause harm.',
            },
          },
          securityDevices: {
            title: 'Security Devices',
            outdoorSecurityCamera: {
              label: 'There is an outdoor security camera',
              description:
                'This property has one or more outdoor cameras that record or transmit video, images, or audio. You must disclose them if they are deactivated.',
            },
            noiseDecibelMonitor: {
              label: 'Noise decibel monitor present',
              description:
                'There are one or more devices on this property that can assess the sound level but do not record audio.',
            },
            carbonMonoxideDetector: {
              label: 'Carbon monoxide detector',
              description:
                'This property has an alarm detector that warns of the presence of carbon monoxide. Check local regulations for specific requirements.',
            },
            smokeDetector: {
              label: 'Smoke detector',
              description:
                'This property has an alarm detector that warns of the presence of smoke and fire. Check local regulations for specific requirements.',
            },
          },
          propertyInformation: {
            title: 'Property Information',
            guestsMustClimbStairs: {
              label: 'Guests must climb stairs',
              description:
                'Guests may have to go up and down stairs during their stay.',
            },
            noiseDuringStay: {
              label: 'There may be noise during stays',
              description:
                'Guests may expect to hear some noise during their stay. For example, noise from traffic, construction, or nearby businesses.',
            },
            petsLiveOnProperty: {
              label: 'Pet(s) live on the property',
              description:
                'Guests may encounter or interact with pets during their stay.',
            },
            noParkingOnProperty: {
              label: 'No parking on property',
              description:
                'This property does not have exclusive parking spaces for guests.',
            },
            commonAreas: {
              label: 'The property has common areas',
              description:
                'Guests are likely to share some areas such as the kitchen, bathroom, or patio with other people during their stay.',
            },
            limitedBasicServices: {
              label: 'Limited basic services',
              description:
                'This property does not include some basic amenities. For example, Wi-Fi, running water, or an indoor shower.',
            },
            weaponsPresent: {
              label: 'Presence of weapons on the property',
              description:
                'There is at least one weapon stored on this property. Check local regulations for specific requirements. Remember: Hospédate requires all weapons to be stored properly and securely.',
            },
          },
          validation: {
            detailsMax: 'Maximum 300 characters.',
          },
        },
        cancellationPolicy: {
          title: 'Cancellation policy',
          standardPolicy: {
            title: 'Standard Policy',
            flexible: {
              label: 'Flexible',
              description:
                'Guests will receive a full refund if they cancel up to 1 day before check-in.',
            },
            moderate: {
              label: 'Moderate',
              description:
                'Guests will receive a full refund if they cancel up to 5 days before check-in.',
            },
            firm: {
              label: 'Firm',
              description:
                'Guests will receive a full refund if they cancel up to 30 days before check-in, except in certain cases.',
            },
            strict: {
              label: 'Strict',
              description:
                'Guests will receive a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.',
            },
          },
          longTermPolicy: {
            title: 'Long-Term Stay Policy',
            firm: {
              label: 'Firm',
              description:
                'Full refund up to 30 days before check-in. After that, the first 30 days of the stay are non-refundable.',
            },
            strict: {
              label: 'Strict',
              description:
                'Full refund if cancellation occurs within 48 hours of booking and at least 28 days before check-in. After that, the first 30 days of the stay are non-refundable.',
            },
          },
          validation: {
            standardRequired: 'Select a standard policy.',
            longStayRequired: 'Select a long-stay policy.',
          },
        },
        customLink: {
          title: 'Custom Link',
          placeholder: 'hospedatebolivia.com/listing/xxxxxxx',
        },
        travelerRequirements: {
          title: 'Traveler Requirements',
          requestProfilePhoto: {
            label: 'Request a profile photo',
            description:
              'By enabling this option, guests who book your accommodation must have a profile photo. You will only be able to see it once they have confirmed the reservation.',
          },
          allGuestsMust: 'All guests must:',
          requirement1: 'Have a verified email address and phone number.',
          requirement2: 'Provide payment information.',
          requirement3: 'Accept your house rules.',
        },
        localLegislation: {
          title: 'Local Legislation',
          point1:
            'Most cities have regulations that control home-sharing. Specific rules and ordinances may be included in different legislations (zoning regulations, building codes, permits, or tax regimes).',
          point2:
            'In many places, you will need to register, obtain a permit, or get authorization before you can list your space and host guests.',
          point3:
            'Additionally, you may be responsible for collecting and paying certain taxes. In some locations, short-term rentals are completely prohibited.',
          point4:
            'Since you are solely responsible for deciding whether to list or book an accommodation, it is crucial that you familiarize yourself with the relevant rules before publishing on Hospédate.',
          disclaimer:
            'By accepting the Terms of Service and listing the accommodation, you agree to comply with applicable legislation and regulations.',
        },
        taxes: {
          title: 'Taxes',
          introQuestion: 'How do taxes work in Bolivia for temporary rentals?',
          introText:
            'In Bolivia, economic activities related to the temporary rental of space are subject to various tax obligations. These revenues, being considered a provision of services, must comply with the payment of taxes at both national and municipal levels. Below, we explain the main applicable taxes and who is responsible for paying them.',
          nationalTaxesTitle: 'Applicable National Taxes',
          iva: {
            title: 'Value Added Tax (VAT)',
            description:
              'The temporary rental of space is subject to VAT, whose rate is 13%. This tax is applied to the total amount invoiced for the rental service. Property owners offering these types of services must register with the National Tax Service (SIN) and issue legal invoices.',
          },
          it: {
            title: 'Transactions Tax (IT)',
            description:
              'In addition to VAT, commercial transactions related to temporary rental are subject to IT, with a rate of 3% on gross income generated. This tax must also be declared and paid periodically.',
          },
          iue: {
            title: 'Tax on Business Profits (IUE)',
            description:
              'If the temporary rental is managed by a company or legal entity, the net profits obtained are subject to IUE, whose rate is 25%. This tax is paid annually and is calculated on profits after deducting operating costs.',
          },
          municipalTaxesTitle: 'Applicable Municipal Taxes',
          iaem: {
            title: 'Municipal Economic Activities Tax (IAEM)',
            description:
              'Municipalities have the power to collect taxes for economic activities carried out within their jurisdiction. The IAEM applies to those offering temporary rental services, and the rate varies by municipality. Additionally, in some cases, an operating license is required.',
          },
          ipbi: {
            title: 'Real Estate Property Tax (IPBI)',
            description:
              'This tax is levied on the ownership of the space used for rental. The rate depends on the cadastral value of the property and is collected by the corresponding municipal government.',
          },
          whoPaysTitle: 'Who pays the taxes?',
          whoPaysDescription:
            'The responsibility for paying these taxes falls directly on the property owner or the company managing the temporary rental. It is mandatory to register as a taxpayer with the SIN, issue legal invoices, and declare the corresponding taxes. In the case of municipal taxes, the owner must also comply with local regulations, such as the payment of the IAEM and the IPBI.',
          taxComplianceTitle: 'Tax Compliance',
          taxComplianceDescription:
            'Compliance with these obligations is essential to avoid penalties from tax authorities. In recent years, the National Tax Service has intensified the oversight of informal economic activities, including those related to temporary rentals. Therefore, it is important to stay updated with regulations and make the corresponding declarations within established deadlines.',
          summary:
            "In summary, the temporary rental of space in Bolivia is subject to a series of taxes that must be complied with at both national and municipal levels. Complying with these obligations not only avoids legal problems but also contributes to the country's economic development.",
        },
        deleteSpace: {
          title: 'Delete a space',
          question:
            'Could you tell us why you no longer want to host on Hospédate?',
          confirmDeletion: 'Confirm deletion',
          cancel: 'Cancel',
          noLongerCanHost: {
            title: 'I can no longer host guests',
            reasons: {
              noPropertyToAnnounce:
                "At this moment, I don't have a property to list.",
              legallyCannotHost: 'Legally, I can no longer host guests.',
              neighborsDifficulty:
                'My neighbors made it difficult for guests to arrive.',
              lifestyleChange: 'Being a host no longer fits my lifestyle.',
              otherReason: 'Other reason.',
            },
          },
          cannotHost: {
            title: 'Cannot host at this moment',
            reasons: {
              hostOccasionally: 'I only host guests occasionally.',
              needToPrepareProperty:
                'I have created my space, but I need to prepare my property to receive guests.',
              renovatingOrImproving:
                'I am going to renovate my space or make improvements.',
              otherReason: 'Other reason.',
            },
          },
          expectedMoreFromHost: {
            title: 'Expected more from Hospédate',
            reasons: {
              betterService:
                'As a host, I expected to receive better customer service from Hospédate.',
              noFairTreatment:
                'I no longer trust Hospédate to treat hosts fairly.',
              moreSupportResources:
                'I wanted more support resources from Hospédate.',
              improvePolicies:
                'I believe Hospédate could improve its policies.',
              otherReason: 'Other reason.',
            },
          },
          expectedMoreFromGuests: {
            title: 'Expected more from guests',
            reasons: {
              noHouseRulesRespect: 'Guests did not respect the house rules.',
              damagedOrStoleProperty:
                'Guests damaged or stole from my property.',
              frequentCancellations:
                'Guests cancelled their reservations too frequently.',
              rudeOrDemandingGuests: 'Guests behaved rudely or made demands.',
              unfairComments: 'Guests left unfair comments.',
              otherReason: 'Other reason.',
            },
          },
          expectedToEarnMoreMoney: {
            title: 'Expected to earn more money',
            reasons: {
              propertyManagementComplicated:
                'Managing the property turned out to be more complicated than I expected.',
              taxManagementComplicated: 'Managing taxes was too complicated.',
              localRegistrationCumbersome:
                'The local registration process was too cumbersome.',
              expectedMoreBookings: 'I expected to get more bookings.',
              expectedMoreIncome:
                'I had the expectation of earning more income.',
              otherReason: 'Other reason.',
            },
          },
          duplicateSpace: {
            title: 'This is a duplicate space',
            reason: 'Yes, this is a repeated space.',
          },
        },
        editCheckInOut: {
          title: 'Check-in and check-out times',
          arrivalTitle: 'Arrival time',
          startLabel: 'Start time',
          endLabel: 'End time',
          departureTitle: 'Departure time',
          checkoutLabel: 'Select a time',
        },
        editDirections: {
          title: 'Directions',
          placeholder:
            'Let your guests know how to access your home. Don’t forget to include parking tips or how to use public transportation',
          validation: {
            max: 'Maximum 2000 characters.',
          },
        },
        editLocation: {
          title: 'Property address',
          countryLabel: 'Country',
          addressLabel: 'Address',
          addressPlaceholder: 'Enter the address...',
          aptLabel: 'Apartment / Unit',
          aptPlaceholder: 'Ex. 2B',
          cityLabel: 'City',
          cityPlaceholder: 'Enter the city...',
          stateLabel: 'State',
          statePlaceholder: 'Enter the state...',
          showExactLocationTitle: 'Show exact location',
          showExactLocationDescription:
            'Enable this to display the exact map location',
          privacyTitle: 'Address privacy',
          privacyDescription:
            'Your full address will only be shared with confirmed guests.',
          approximateLocationLabel: 'Approximate location',
          validation: {
            required: 'Required field',
            coordsRequired: 'You must select a valid location on the map',
            showExactRequired:
              'You must indicate whether to show the exact location',
            privacyRequired: 'You must set the privacy preference',
          },
        },
        editCheckInMethod: {
          title: 'Choose the check-in method',
          instructions: {
            title: 'Arrival instructions',
            subtitle: 'Provide this information 24–48 hours before check-in.',
            description:
              'Make sure guests arrive without problems. Share recommendations on how to access the property. You can also include images.',
            placeholder: 'Write the description here',
          },
          method: {
            title: 'Check-in method',
            options: {
              smartLock: {
                label: 'Smart lock',
                description:
                  'Guests will use a code or an app to access the property.',
                buttonLabel: 'Add information',
              },
              keypad: {
                label: 'Keypad lock',
                description:
                  'Guests will use a code you provide to unlock an electronic lock.',
              },
              lockbox: {
                label: 'Lockbox with key',
                description:
                  'Guests will use a code you provide to open a small lockbox that contains a key inside.',
              },
              staff: {
                label: 'Building staff',
                description: 'Someone is available 24/7 to greet guests.',
              },
              inPerson: {
                label: 'In-person meeting',
                description:
                  'Guests will meet with you or your co-host to collect the keys.',
              },
              other: {
                label: 'Other',
                description:
                  'Guests will use a method other than those mentioned.',
              },
            },
          },
          validation: {
            methodRequired: 'Select a check-in method.',
            instructionsMax: 'Maximum 2000 characters.',
          },
        },
        amenities: {
          title: 'Amenities',
          addTitle: 'Add Amenities',
          edit: 'Edit',
          groupsTitle: 'Amenity Groups',
          amenitiesInGroupTitle: 'Group Amenities',
          offeredAmenities: 'Amenities you offer',
          searchPlaceholder: 'Search here',
          allLabel: 'All',
        },
        gallery: {
          photos: 'Photos',
          title: 'Your photo gallery',
          description:
            'Manage images and add information. Visitors will only be able to see the tour if each room has a photo.',
          allPhotos: 'All photos',
          emptyGallery: 'Oops, no images yet',
          emptyGalleryDescription:
            'When you have photos here, you’ll see them in this gallery.',
          addPhotos: 'Add photos',
          addSpace: 'Add a space',
          selectRoom: 'Select a room',
          photoCount: '{count} photos',
          selectPhotosForSpace:
            'Select the photos that will be part of this space',
          photosAdded: 'You added {count} photos to the space {space}',
          selectedPhotosCount: '{count} selected photos',
          cancel: 'Cancel',
          next: 'Next',
          save: 'Save',
          done: 'Done',
          back: 'Back',
          move: 'Move',
          skipForNow: 'Skip for now',
          managePhotos: 'Manage Photos',
          moveToAnotherSpace: 'Move to another space',
          makeCoverPhoto: 'Set as cover photo',
          spaceDescription: 'Space description',
          gallery: 'Gallery',
          uploadFromDevice: 'Upload photo from your device',
          chooseFromAdditionalPhotos:
            'Choose from the selection of additional photos',
          addThesePhotosQuestion: 'Would you like to add any of these photos?',
          coverPhoto: 'Cover photo',
          additionalPhotos: '"Additional photos"',
          bedDistribution: 'Bed Distribution',
          addInformation: 'Add Information',
          amenities: 'Amenities',
          deleteListingQuestion: 'Do you want to delete this listing?',
          deleteListingWarning:
            'This deletion will be permanent; you will not be able to recover the photos and information inside it.',
          confirmDelete: 'Yes, I want to delete it',
          deletePhotoQuestion: 'Do you want to delete this photo?',
          deletePhotoWarning:
            'This is permanent: you will no longer be able to recover this image.',
          noSpacesImageAlt: 'No spaces available',
          availablePhotos: 'Available photos',
          noAvailablePhotos: 'No available photos',
          photoNotFound: 'Photo not found',
          uploadLoading: 'Uploading...',
          validation: {
            requiredCaption: 'Caption is required.',
            maxCaption: 'Maximum 255 characters.',
            cannotDeleteBelowMin:
              "You can't delete this photo: this listing must have at least {min} photos.",
            cannotDeleteBelowMinPublished:
              "You can't delete this photo: published listings must have at least {min} photos.",
          },
        },
      },
      footer: {
        title: 'Edit listing',
        save: 'Save',
        saving: 'Saving...',
        changesMade: 'Request review',
        stepTitles: {
          'request-changes': 'Once you make these changes, press the button',
          title: 'Listing title',
          'property-type': 'Property type',
          price: 'Prices',
          availability: 'Availability',
          capacity: 'Number of people',
          description: 'Description',
          address: 'Address',
          booking: 'Booking settings',
          'house-rules': 'House rules',
          'guest-safety': 'Guest safety',
          'cancellation-policy': 'Cancellation policy',
          'custom-link': 'Custom link',
          directions: 'Directions',
          'check-in-method': 'Check-in method',
          'listing-state': 'Publication status',
          'delete-listing': 'Delete listing',
        },
      },
      commonComponents: {
        dropdown: {
          placeholder: 'Select an option',
        },
        modal: {
          confirmDiscard: {
            title: 'If you leave, you will lose your changes',
            p1: 'If you leave, the progress on this screen will not be saved and you will lose your changes.',
            p2: 'Go back and save your changes.',
            keepEditing: 'Go back',
            discard: 'Leave this screen',
          },
          confirmSubmitReview: {
            title:
              'Do you confirm the requested changes have been made correctly?',
            p1: 'We want your listing to be available as soon as possible, so please make sure you have completed all the required changes.',
            p2: 'When you resubmit your listing for review, you will need to wait for our response.',
            confirm: 'Yes, submit for review',
            back: 'Go back',
          },
          confirmUnpublish: {
            title: 'Unpublish listing?',
            p1: 'Your listing will stop appearing in search results and will not accept new bookings.',
            p2: 'Existing, in-progress reservations will not be affected.',
            confirm: 'Yes, unpublish',
            back: 'Go back',
          },
          confirmPublish: {
            title: 'Publish your listing?',
            p1: 'Your listing will appear in search results and accept new bookings.',
            confirm: 'Yes, publish',
            back: 'Go back',
          },
        },
      },
    },
    calendar: {
      syncYourCalendar: 'Sync your calendar',
      night: 'night',
      night_plural: 'nights',
      today: 'Today',
      inPreparation: 'In preparation',
      blockedExternal: 'Reserved by another platform',
      pageTitle: 'Calendar',
      generalConfig: 'General Settings',
      price: 'Price',
      availability: 'Availability',
      selectListing: 'Select a listing',
      apply: 'Apply',
      save: 'Save',
      saving: 'Saving...',
      allYourListings: 'All your listings',
      // Price
      nightlyPrice: 'Nightly price',
      weekendPrice: 'Weekend prices',
      customWeekendPrice: 'Custom weekend price',
      discounts: 'Discounts',
      toggleDiscounts: 'Activate or deactivate discounts',
      weekly: 'Weekly',
      monthly: 'Monthly',
      close: 'Close',
      weeklyHint: 'For 7 nights or more',
      monthlyHint: 'For 28 nights or more',
      weeklyError:
        'The weekly discount cannot be greater than the monthly discount.',
      monthlyError:
        'The monthly discount cannot be less than the weekly discount.',
      priceError:
        'The price cannot be less than {priceMin} or greater than {priceMax}.',
      updateError: 'There was a problem updating the data.',
      // Availability
      stayDuration: 'Stay duration',
      minNights: 'Minimum number of nights',
      maxNights: 'Maximum number of nights',
      notice: 'Notice',
      noticeDescription:
        'How much advance notice do you need between booking and check-in?',
      sameDayCheckin:
        'Guests can book on the same day as check-in until this time.',
      allowSameDayRequests: 'Allow same-day requests',
      reviewAndApprove: 'You have to review and approve each booking request',
      noticeOptions: {
        SAME_DAY: 'Same day',
        AT_LEAST_ONE_DAY: 'At least 1 day',
        AT_LEAST_TWO_DAYS: 'At least 2 days',
        AT_LEAST_THREE_DAYS: 'At least 3 days',
        AT_LEAST_SEVEN_DAYS: 'At least 7 days',
      },
      // Select Dates
      open: 'Open',
      guestPrice: 'Price for the guest:',
      simulateStay: 'Simulate a stay',
      yourPrivateNotes: 'Your private notes',
      writePrivateComment: 'Write a private comment',
      writeHere: 'Write here',
      enterGuestsAndPets:
        'Enter the number of guests and pets to get the total price',
      unifyAvailabilityError:
        'You must unify the availability for the selected nights.',
      unifyPriceError: 'You must unify the price for the selected nights.',
      mixedAvailability: 'Mixed Availability',
      nightsAvailable: 'Nights available',
      nightsBlocked: 'Blocked nights',
      allOpen: 'All open',
      allClosed: 'All closed',
      closed: 'Closed',
      differentPrices: 'Different prices',
      summary: {
        basePrice: 'Base price',
        serviceFee: 'Service fee',
        guestPrice: 'Guest price (taxes not included)',
        hostEarnings: 'Host earnings',
      },
      sync: {
        syncButton: 'Synchronizations',
        syncCalendarButton: 'Sync your calendar',
        formTitle: 'Sync Hospédate calendar with other calendars',
        bidirectionalSyncDescription:
          'This bidirectional connection ensures that both calendars are automatically synchronized when a stay is reserved.',
        videoLinkText: 'we explain it here with a video.',
        step1Title: 'Step 1',
        step1Description: 'Copy and paste into other calendars such as Airbnb.',
        step2Title: 'Step 2',
        step2Description:
          'Get a link with the .ics extension from the corresponding website and add it below.',
        urlInputPlaceholder: 'Link to another website',
        calendarNameInputPlaceholder: 'Calendar name',
        addButton: 'Add Calendar',
        copyButton: 'Copy',
        copied: 'Copied',
        loading: 'Loading',
        syncFinishedTitle: 'Synchronization finished',
        syncFinishedDescription: 'Your calendar has been synchronized with: ',
        backToMyCalendarButton: 'Back to my calendar',
        syncedCalendarsTitle: 'Synced Calendars',
        syncedCalendarsDescription:
          "Here you will see all the calendars you have synchronized with this listing's calendar.",
        syncAnotherCalendarButton: 'Sync another calendar',
        deleteButton: 'Delete',
        deleteConfirmationTitle: 'Remove synchronization?',
        confirmDeleteButton: 'Yes, remove synchronization',
        deleting: 'Deleting...',
        lastUpdated: 'Last updated:',
        updateButton: 'Update',
        updatingButton: 'Updating',
        addError: 'There was a problem adding the calendar. Please try again.',
        goBack: 'Go back',
        successSync: 'The calendar has been updated',
      },
      info: {
        title: 'About calendar states',
        today: {
          title: 'Today',
          description:
            'To know which day it is, look for the box with the word “today”, which will always be at the top right of the box.',
        },
        selectCells: {
          title: 'Select cells',
          description:
            'When selecting one or more cells, a blue border will appear around them. This means you are selecting them.',
        },
        scheduledDays: {
          title: 'Scheduled days',
          description:
            'When guests make bookings, they will be shown this way on your calendar. The blue bar can cover more than one cell.',
        },
        preparationDays: {
          title: 'Preparation days',
          description:
            'Cells with this style represent the days your property is being prepared and cleaned for the next guest. This state appears after a booking ends, and you can edit the preparation time in your listing settings.',
        },
        externalPlatformBookings: {
          title: 'Bookings from other platforms',
          description:
            'Cells with this style represent days when your property is booked from another platform such as Airbnb or Google. You can set this up in your calendar settings.',
        },
        blockedDays: {
          title: 'Blocked days',
          description:
            'Fully red cells are the days blocked in your calendar. These are days you manually decided no one can book your property.',
        },
        closeInfo: 'Close information',
      },
    },
  },
  header: {
    addProperty: 'Become a host',
    hostMode: 'Host Mode',
    lang: {
      es: '🇪🇸 Español',
      en: '🇺🇸 Inglés',
    },
  },
  footer: {
    description:
      'We are an online platform that connects people looking for short- or long-term accommodation with hosts offering their spaces.',
    assistance: 'Help',
    hostMode: 'Host mode',
    legal: 'Legal',
    cancellationOptions: 'Cancellation options',
    becomeHost: 'List your space on Hospédate',
    privacy: 'Privacy',
    terms: 'Terms',
    copyright: 'All rights reserved.',
    support: 'Support',
    protectionFund: 'Protection Fund',
  },
  languageSwitcher: {
    spanish: '🇪🇸 Spanish',
    english: '🇺🇸 English',
  },
  notFoundPage: {
    title: 'Page not found',
    heading1: 'Oops,',
    heading2: "we couldn't find ",
    heading3: 'what you were looking for',
    description1: "But we're sure ",
    description2: 'we have what you need ',
    description3: 'on our homepage',
    backToHome: 'Go to the homepage',
  },
  forbiddenPage: {
    title: 'Access denied',
    heading: 'Oops, our apologies',
    description: "But you don't have permission to access this page",
    backToHome: 'Go to the homepage',
  },
  unrecoverable: {
    title: 'Server Error – Please try again later',
    heading: 'Something went wrong on the server',
    description:
      'We were unable to connect to our services at this time. Your session is still active, but the requested information cannot be displayed.',
    backToHome: 'Back to home',
  },
  auth: {
    title: 'Sign in or Register',
    welcomeTitle: 'Welcome!',
    welcomeMessage: 'We welcome you',
    welcomeHeadline: 'Welcome to Hospédate',
    welcomeSubtitle: 'Discover incredible spaces all around Bolivia!',
    email: 'Email address',
    description:
      'We’ll verify your number through a phone call or text message. Standard messaging and data rates may apply. Please review our ',
    descriptionPolicy: 'privacy policy.',
    continue: 'Continue',
    loading: 'Loading',
    continueGoogle: 'Continue with Google',
    maybe: 'Or also',
    password: 'Password',
    forgotPassword: 'I forgot my password',
    createAccount: 'Create an account',
    titleLogin: 'Enter your password',
    invalidEmail: 'Invalid email address',
    invalidPassword: 'Invalid Password',

    confirmationEmail: 'Confirm your email',
    verificationCodeSent:
      "We sent a verification code to your inbox. If you haven't received a notification, please check your spam folder.",
    verificationCode: 'Verification Code',
    resendCode: 'Resend Code',
    registerEmail: 'Register Email',
    goBack: 'Go back',
    google: {
      title: 'Sign in with Google',
      useOtherAccount: 'Use another account',
      continueApp: 'Continue with the application',
    },
    mobileLogin: {
      title: 'Authenticating',
      authenticating: 'Authenticating...',
      pleaseWait: 'Please wait a moment',
      authError: 'Authentication error',
      redirecting: 'Redirecting to login page...',
    },
    error: {
      invalidCredentials: 'Invalid Credentials',
      badRequest: 'Something went wrong. Please check your data and try again.',
      networkError: 'Connection error. Please try again later.',
      googlePopup: 'Failed to open the Google window',
      authError: 'Authorization Error',
      popupTimeout: 'The popup took too long to respond. Please try again.',
      popupClosedByUser:
        'The popup window was closed by the user before the process could complete.',
      manyRequests:
        'Too many verification codes have been requested. Please wait one minute before trying again.',
      invalidTokenResponse:
        'Your session has expired. Please log in again to continue.',
      notFoundVerificationCode: 'Verification code not valid.',
    },
  },
  forgotPassword: {
    instructions: "Enter your email and we'll send a message to your inbox.",
    emailLabel: 'Email',
    placeholder: 'youremail@example.com',
    sendButton: 'Send email',
    cta: 'I forgot my password',
    title: 'Password recovery',
    checkEmail:
      'We sent an email to your account so you can reset your password.',
    resend: "Didn't get it? Send another email",
    illustrationAlt: 'Recovery email',
    resetPage: {
      enterNewPassword: 'Enter your new password',
      passwordLabel: 'Password',
      confirmLabel: 'Repeat your password',
      showPasswords: 'Show passwords',
      passwordPlaceholder: 'Type your new password',
      confirmPlaceholder: 'Confirm your new password',
      tooShort: 'At least 8 characters.',
      mustMatch: 'Passwords must match.',
      changeAndSignIn: 'Change password',
      changedOk: 'Password changed successfully! You can now sign in.',
      invalidLinkTitle: 'Invalid or expired link',
      invalidLinkDesc: 'Please request a new password recovery link.',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      cannotBeAllNumbers: 'Password cannot be only numbers.',
      cannotBeAllLetters: 'Password cannot be only letters.',
      needsNumberOrSymbol: 'Add at least one number or symbol.',
      containsPersonalInfo: "It shouldn't contain your name or email username.",
      restoreError: {
        title: 'Error updating password',
        intro:
          'Make sure your password meets the minimum security requirements:',
        bullets: {
          minLength: 'Password must be at least 8 characters long.',
          notAllNumbers: 'The password cannot be all numbers.',
          notAllLetters: 'The password cannot be all letters.',
          numberOrSymbol:
            'Password must contain at least one number or symbol.',
          notContainUser: 'Password must not contain your username or email.',
          notCommon: 'The password is too common.',
        },
      },
    },
    resetExpiredPage: {
      title: 'Expired reset link',
      heading1: 'The link to',
      heading2: ' change your password ',
      heading3: 'has expired',
      illustrationAlt: 'Expired password reset link',
      description1: 'You can request a new password reset email,',
      description2: ' then check your inbox.',
      backToHome: 'Back to home',
    },
  },
  preview: {
    laptop: 'Laptop',
  },
  register: {
    title: 'Complete your registration',
    fullNameLabel: 'Full name',
    nameInputPlaceholder: 'First name(s) as on your ID',
    lastnameInputPlaceholder: 'Last name(s) as on your ID',
    nameNote:
      'Make sure the name matches what appears on your official ID document.',
    birthDateLabel: 'Date of birth',
    birthDateInputPlaceholder: 'Date of birth',
    emailLabel: 'Email address',
    birthDateNote:
      'You must be at least 18 years old to register. We won’t share your birthdate with other Hospédate users.',
    invalidDate: 'Please enter a valid date',
    birthDateInFuture: 'The birth date cannot be in the future',
    mustBeAdult: 'You must be over 18 years old to register',
    passwordLabel: 'Password',
    confirmPasswordPlaceholder: 'Your password again',
    termsNote: `By clicking Accept and Continue, I confirm that I have read and agree to the <a href="/terms" target="_blank" class="underline"> Terms of Service</a> and <a href="/privacy" target="_blank" class="underline">Privacy Policy</a>.`,
    acceptAndContinue: 'Accept and continue',
    EMAIL_ALREADY_EXISTS:
      'This email is already registered. Try signing in or use a different email.',
    requiredField: 'This field is required.',
    passwordsDoNotMatch: 'Passwords do not match.',
    passwordTooShort: 'Password must be at least 8 characters long.',
    passwordCannotBeAllNumbers: 'The password cannot be all numbers',
    passwordCannotBeAllLetters: 'The password cannot be all letters',
    passwordNeedsNumberOrSymbol:
      'Password must contain at least one number or symbol.',
    passwordContainsPersonalInfo:
      'Password must not contain your username or email.',
    passwordPlaceholder: 'Password',
    passwordNotCommon: 'The password must not be too common.',
  },
  userProfile: {
    loggingOut: 'Logging out...',
    logout: 'Log Out',
    signUp: 'Sign Up',
    login: 'Log In',
    helpCenter: 'Help Center',
    profile: 'Profile',
    saved: 'Saved',
    settings: 'Account settings',
    rentYourPlace: 'Become a host',
    changeLanguage: 'Change Language',
    trips: 'Trips',
    messages: 'Messages',
    hosting: 'Hosting mode',
    guest: 'Guest mode',
  },
  profile: {
    profileHost: 'Host Profile',
    profileGuest: 'Guest Profile',
    title: 'About {username}',
    about: 'About {username}',
    aboutYou: 'About you',
    visitedPlaces: 'Places visited by {username}',
    interests: '{username}’s interests',
    nextDestination: 'Next destination',
    reviews: 'Reviews by {username}',
    listings: '{username}’s listings',
    allReviews: 'Discover all reviews',
    identityVerified: 'Identity verified',
    emailVerified: 'Email verified',
    phoneVerified: 'Phone verified',

    verificationsTitle: 'Verifications',
    verificationEmailConfirmed: 'Email address',
    verificationEmailPending: 'Confirm your email address',
    verificationPhoneConfirmed: 'Phone number',
    verificationPhonePending: 'Confirm your phone number',

    uploadProfilePhoto: 'Upload your profile photo',
    looksGood: 'Looks good!',
    photoDescription:
      'This photo will allow hosts or guests to have a first impression of you.',
    photoRequirements:
      'Formats: JPG, PNG • Size: 10 KB - 5 MB • Dimensions: 400×400 - 5000×5000 px',
    personalizeAccount: 'Give personality to your account',
    editPhoto: 'Edit photo',
    addPhoto: 'Add photo',
    uploading: 'Uploading...',
    ready: 'Ready',
    uploadPhoto: 'Upload photo',
    skipForNow: 'Not now',
    changeProfilePhoto: 'Change profile photo',
    saveSuccess: 'Changes saved successfully!',
    uploadPhotoError: 'Error uploading photo. Please try again.',
    unsavedChangesWarning:
      'You have unsaved changes. Please save them before leaving this page.',

    // Empty state placeholders
    aboutPlaceholder:
      'Tell us about yourself so other guests can get to know you better.',
    aboutEmpty: 'Has not shared information about themselves.',
    experiencesPlaceholder:
      'Share your experiences and hobbies to connect with other travelers.',
    experiencesEmpty: 'Has not shared their experiences.',
    interestsPlaceholder:
      'Select your interests to find people with similar tastes.',
    interestsEmpty: 'Has not shared their interests.',

    verifyIdentity: 'Verify your identity',
    verifyIdentityDescription:
      'Before booking or hosting on Hospédate, you need to complete this step.',
    yourProfileTitle: 'Your profile',
    editProfileButton: 'Edit Profile',
    completeProfileTitle: 'Complete your profile',
    completeProfile: 'About You',
    placeholder: 'traveler, photographer, dreamer ✈️',
    titleBotton: 'Add or remove evidence',
    titleInterest: 'Add or remove interests',
    placeholderText: 'Write something fun and clever...',
    label: 'Add or remove experiences',
    labelSave: 'Save changes',
    addInformation: 'Add information to your profile',
    willBuild: 'will build more trust',
    withOther: 'with other guests and hosts.',
    cancel: 'Cancel',
    save: 'Save',
    reply: 'To answer',
    delete: 'Delete',
    edit: 'Edit',
    addAnswers: 'Add answers',
    answered: 'Answered',
    addSpecify: 'Add, specify, or remove experiences if needed',
    addInformationModal: 'Add information about this experience',
    placeholderModal: 'Write here...',
    nitPlaceholder: 'Name or Business Name',
    aboutYourExperienceTitle: 'About your experience',
    aboutShowBirthDecade: 'Your birth decade',
    addShowBirthDecade:
      'Decide whether to display your birth decade on your profile.',
    showBirthDecade: 'Show birth decade',
    selectLanguagesTitle: 'About your languages',
    selectLanguagesDescription: 'Select the languages you speak',
    selectLanguagesPlaceholder: 'Languages',
    addressTitle: 'Address privacy in case of cancellations',
    addressInformations:
      'Hide your address, last name, and phone number while guests can still cancel for free. Once that period has ended, we will send this information to the guests.',

    completeProfileDescription:
      'Your Hospédate profile plays a key role in every reservation. Complete it so other hosts and guests can get to know you better.',
    createProfileButton: 'Complete your profile',
    tripsWithUs: 'Places you visited with Hospédate',
    experiencesOwn: 'Your Experiences',
    experiencesOther: 'Experiences of {username}',
    aboutYourInterests: 'About your interests',
    selectInterestsDescription:
      'Select some interests you like and want to highlight in your profile.',
    authenticationRequired: 'Authentication required',
    notFound: 'User not found',
    idv: {
      noticeTitle: 'Verify your identity',
      noticeMessage:
        'We ask our guests and hosts to verify their identity to help keep our community safe.',
      noticeRolesEmphasis: 'guests and hosts',
      noticeCta: 'Continue',
      noticeClose: 'Close',
      noticeId: 'ID document',
      noticeImageAlt: 'ID document illustration',

      qrTitle: 'Scan the QR with your phone camera',
      qrSubtitle:
        'Scan the QR code with your phone’s camera and complete the verification.',
      qrSteps: [
        'Scan the QR with your phone.',
        'Open the link and follow the instructions.',
        'Have your ID card handy.',
        'When finished, confirm here that you completed it on your phone.',
      ],
      qrCtaDone: 'I have completed it',
      qrCancel: 'Close',
      qrHelpText: 'Can’t scan it? Continue using the link on your phone.',
      qrImageAlt: 'QR code for identity verification',
      qrError: 'We couldn’t load the QR code. Try again.',
      finishedToast: 'Thanks! We’ll update your verification status shortly.',
      closedToast: 'You can verify your identity later from your profile.',

      qrErrorGeneric: 'We couldn’t generate the code.',
      qrExpired: 'The code has expired.',
      qrRetry: 'Retry',
      qrGenerateNew: 'Generate new',

      // Enhanced verification flow
      documentFrontTitle: 'How to validate your document?',
      documentFrontInstruction:
        'Take your identity document from the front side and place it in the white frame and take a photo.',
      documentBackTitle: 'How to validate your document? - 2',
      documentBackInstruction:
        'And take a photo so it can be scanned and validated by us.',
      documentReverseTitle: 'Turn your identity document',
      documentReverseInstruction:
        'Then we will take the back of your identity document.',

      // Instructions
      instructionsTitle: 'Instructions',
      instructionsFront:
        '1. Take your identity document from the <span class="font-semibold">front side</span> and place it in the white frame and take a photo.',
      instructionsBack:
        '2. Then, take your identity document from the <span class="font-semibold">back side</span> and place it in the white frame and take a photo.',
      instructionsLighting:
        'Make sure there is good lighting and the image is in focus.',

      cameraFrontTitle: 'Scan your ID Front',
      cameraFrontInstruction:
        'Center the identity card in the white frame and take a photo.',
      cameraBackTitle: 'Scan your ID Front - check',
      cameraBackInstruction:
        'Center the card in the white frame and take a photo.',
      cameraReverseTitle: 'Scan your ID Back',
      cameraReverseInstruction:
        'Center the identity card in the white frame and take a photo.',

      faceInstructionTitle: 'Instructions to verify your Face',
      faceInstructionMessage:
        'Position your face in the white circle and take the photo for verification.',
      faceCameraTitle: 'Verify your Face',
      faceCameraInstruction:
        'Position your face in the white circle and take the photo for verification.',

      // Face instruction steps
      faceInstruction1: '1. Position your face in the white circle.',
      faceInstruction2: '2. Look directly at the camera and take a photo.',
      faceInstructionTip:
        'Make sure there is good lighting. Keep a neutral expression.',

      processingTitle: 'Processing verification',
      processingMessage:
        'We are verifying your identity. This process may take a few moments. Please do not close this window.',

      // Upload process messages
      uploadingTitle: 'Uploading documents',
      uploadingMessage:
        'We are securely uploading your documents. This process will only take a few moments.',
      uploadingProgress: 'Uploading documents...',

      successTitle: 'Verification successful!',
      successMessage:
        'Your identity has been successfully verified. You can now access all platform features.',

      errorTitle: "We couldn't verify your identity",
      errorMessage:
        "We haven't been able to verify your identity. Please try again making sure the photos are clear and the document is legible.",
      errorMessageRetry: 'try again',

      // Rate limiting
      rateLimitTitle: 'Attempt limit reached',
      rateLimitMessage:
        'You have reached the maximum limit of {maxAttempts} verification attempts. You can try again after {date}.',
      rateLimitExhausted:
        'You have exhausted all your {maxAttempts} verification attempts. Please contact our support team for help.',
      rateLimitSupport: 'contact our support team',

      // Attempt counters
      attemptsRemaining: 'Attempts remaining',
      attemptsRemainingMessage:
        'You have {remaining} of {max} verification attempts remaining.',

      // Support contact
      supportContact: 'Contact Support',
      supportMessage: 'To resolve this issue, you can contact us:',
      supportButton: 'Contact Support',

      // Processing states
      processingStatusUploading: 'Uploading documents...',
      processingStatusAnalyzing: 'Analyzing documents...',
      processingStatusVerifying: 'Verifying identity...',
      processingStatusComplete: 'Verification completed',
      processingWaitMessage: 'This process may take several minutes',
      processingDoNotClose: 'Please do not close this window',

      retryLater: 'Try later',
      retryProcess: 'Retry process',
      retryButton: 'Try again',
      continue: 'Continue',
      next: 'Next',
      useThisPhoto: 'Use this photo',
      takeAnother: 'Take another',
      verifyFace: 'Verify my face',
      startButton: 'Start',

      // Camera capture buttons
      retakePhoto: 'Retake',
      confirmPhoto: 'Confirm',

      // Camera titles and instructions
      documentFrontCameraTitle: 'Document Front',
      documentBackCameraTitle: 'Document Back',
      documentCameraInstruction:
        'Center your document in the white frame and take a photo.',
      documentCameraSuggestion:
        'Make sure the photo is sharp, has good lighting, and shows the complete content without cropping and legible.',
      faceVerificationTitle: 'Verify your Face',
      faceVerificationInstruction:
        'Position your face in the white circle and take the photo for verification.',
      faceVerificationSuggestion:
        'Make sure the photo is sharp, has good lighting, and your face is completely within the circle.',

      // Documents submitted for manual review
      documentsSubmittedTitle: 'Documents Submitted!',
      documentsSubmittedMessage:
        'Your documents have been successfully submitted. The Hospédate team will review your information and notify you of the result.',
      documentsSubmittedNotification:
        'You will receive an email notification once the review is complete.',
      documentsSubmittedInfoTitle: 'Processing Time',
      documentsSubmittedInfoMessage:
        'Manual review can take 1 to 3 business days. We will contact you if we need additional documents.',
      documentsSubmittedButton: 'Got it',
    },
  },
  commonComponents: {
    loadingSpinner: {
      defaultMessage: 'Loading content, please wait...',
    },
    modal: {
      close: 'Cancel',
      skipForNow: 'Omit for Now',
    },
    messageModal: {
      talkToHost: 'Talk to the host',
      talkToGuest: 'Talk to the guest',
      descriptionHost: '{name} is here to answer all your questions',
      descriptionGuest: '{name} is here to ask all their questions',
      placeHolder: 'Hello {name}, i want to know more about...',
      sendMessage: 'Send message',
      sending: 'Sending...',
      disabledReason: 'Please enter a message to enable the send button.',
    },
  },
  listings: {
    noListingAvailable: 'No listings available',
    nightlyPrice: '{price} {currency} night',
    title: '{type} in {location}',
    continueExploring: 'Continue exploring more listings',
    loadMore: 'Show More',
    loading: 'Loading...',
    listingsFound: 'Listings Found',
    resultsInMapArea: 'in the map area',
  },
  search: {
    where: 'Where',
    arrival: 'Arrival',
    addDate: 'Add date',
    departure: 'Departure',
    who: 'Who',
    howMany: 'How many?',
    guestsAndCount: 'Who and how many?',
    search: 'Search',
    close: 'Close',
    startSearch: 'Start searching',
    when: 'When',
    addGuests: 'Add Guests',
    whereDoYouWantToGo: 'Where do you want to go?',
    searching: 'Searching...',
    loading: 'Loading...',
    searchResults: 'Search results',
    noResultsFound: 'No results found',
    adjustFilters: 'Try adjusting the filters or search in another location.',
    goHome: 'Go back to home',
    guest: '{count} guest',
    guest_plural: '{count} guests',
    recentSearch: 'Recent Search',
    noRecentSearchesMessage: 'Your recent searches will appear here.',
    destination: {
      destination: 'Destination',
      exploreDestinations: 'Explore destinations',
      recentSearches: 'Recent Searches',
      suggestedDestinations: 'Suggested Destinations',
      Anywhere: 'Anywhere in Bolivia',
    },
    guests: {
      guest: '{count} guest',
      guest_plural: '{count} guests',
      adults: 'Adults',
      adultsAge: 'Age: 13 years or older',
      children: 'Children',
      childrenAge: 'Ages 2 - 12',
      infants: 'Infants',
      infant: '{count} infant',
      infant_plural: '{count} infants',
      infantsAge: 'Under 2 years',
      pets: 'Pets',
      pet: '{count} pet',
      pet_plural: '{count} pets',
      serviceAnimal: 'Bringing a Service Animal',
    },
    dates: {
      dates: 'Dates',
      months: 'Months',
      flexible: 'Flexible',
      whenIsYourTrip: 'When is your trip?',
      howLongStay: 'How long do you want to stay?',
      week: 'Weekly',
      weekend: 'Weekend',
      month: 'Monthly',
      monthCount: '{count} month',
      monthCount_plural: '{count} months',
    },
  },
  filter: {
    title: 'Filters',
    priceRange: 'Price Range',
    min: 'Minimum',
    max: 'Maximum',
    roomsAndBeds: 'Rooms and Beds',
    bedrooms: 'Bedrooms',
    beds: 'Beds',
    baths: 'Bathrooms',
    amenities: 'Amenities',
    reservationOptions: 'Reservation Options',
    propertyType: 'Property Type',
    showMore: 'Show more',
    showLess: 'Show less',
    clearData: 'Clear filters',
    showResults: 'Show results',
  },
  calendar: {
    reset: 'Reset',
    goToToday: 'Go to today',
    arrivalDay: 'Arrival day',
    departureDay: 'Departure day',
    preparationDay: 'Preparation day',
    noCheckout: 'Checkout not allowed',
    noCheckIn: 'Check-in not allowed',
    selectArrivalDate: 'Select arrival date',
    addTravelDates: 'Add your travel dates to get exact prices',
    minDay: 'Minimum {count} night',
    minDay_plural: 'Minimum {count} nights',
    maxDay: 'Maximum {count} night',
    maxDay_plural: 'Maximum {count} nights',
    removeDates: 'Remove dates',
  },
  listingDetail: {
    save_button: 'Save',
    share_button: 'Share',
    saved_state: 'Saved',
    capacity: {
      guest: '{count} guest',
      guest_plural: '{count} guests',
      room: '{count} bedroom',
      room_plural: '{count} bedrooms',
      bathroom: '{count} bathroom',
      bathroom_plural: '{count} bathrooms',
      bed: '{count} bed',
      bed_plural: '{count} beds',
    },
    host: {
      title: 'Meet Your Host',
      subtitle: 'Communicate with the host',
      subtitleSuperHost: '{name} is a Superhost',
      descriptionSuperHost:
        'Superhosts are highly experienced, have excellent reviews, and go above and beyond to offer guests amazing stays.',
      superhost: 'Superhost',
      regularhost: 'Host',
      guest: 'Guest',
      reviews: 'Reviews',
      score: 'Rating',
      trips: 'Trips',
      becameHostAt: 'hosting since',
      becameUserAt: 'on Hospédate',
      livesIn: 'Lives in',
      responseTime: {
        lessThanHour: 'Responds in less than an hour',
        lessThanDay: 'Responds in less than a day',
        moreThanDay: 'Responds in more than a day',
      },
      duration: {
        years: '{count} year',
        years_plural: '{count} years',
        months: '{count} month',
        months_plural: '{count} months',
      },
      responseRate: 'Response rate',
      info: {
        work: 'I work as',
        travelDream: 'A place I’ve always wanted to visit',
        pets: 'Pets',
        school: 'Where I studied',
        funFact: 'Fun fact',
        uselessSkill: 'My least useful skill',
        wastedTime: 'What I spend too much time on',
        favoriteSong: 'My favorite song',
        biographyTitle: 'Title of my biography',
        obsession: 'I love',
        languages: 'I speak',
        birthDecade: 'Birth decade',
        showBirthDecade: 'Birth decade',
      },
      moreInfo: 'Learn more',
      contact: 'Message the host',
      message: 'Hi {hostName}, I have some questions about your listing...',
      sending: 'Sending',
      errorMessage: 'Failed to send message. Please try again.',
    },
    description: {
      title: 'Learn more about the place',
      showMore: 'Show more',
      aboutSpace: 'About this space',
    },
    booking: {
      reserve: 'Book now',
      perNight: '/night',
      monthly: 'monthly',
      perNights: 'per {nights} night', //TODO: ver para quitar
      night: 'night',
      night_plural: 'nights',
      total: 'Total',
      priceDetails: 'Price Details',
      monthlyDiscount: 'Discount for monthly stay:',
      weeklyDiscount: 'Discount for weekly stay:',
      priceAfterDiscount: 'Price after discount:',
      additionalGuest: 'Additional Guest',
      cleaningRate: 'Cleaning Rate',
      petRate: 'Pet Rate',
      hospedateService: 'Hospédate Service',
      serviceFee: 'Service fee',
      inactiveDates: 'These dates are inactive and cannot be used',
      tryChangingDates: 'Try again by changing the dates',
      tapHere: 'tap here',
      guestLimitExceeded: 'This number of guests is not allowed',
      tryLowerGuests: 'Try again by lowering the number of guests',
      checkAvailability: 'Check Availability',
      goToBookingData: 'Go to Booking Data',
      blockedComponent: 'Functionality blocked on preview',
    },
    amenities: {
      title: 'Benefits of the place',
      noContent: 'Content not available',
      showAll: 'Show more services',
      titleModal: 'Learn more about the place',
    },
    calendar: {
      title: '{count} night in {location}',
      title_plural: '{count} nights in {location}',
    },
    review: {
      title: 'What do guests think?',
      review: 'Reviews',
      noReviews: 'No reviews available yet.',
      showAll: 'Discover all the reviews',
      allReviews: 'Discover all the reviews',
      sortTypes: {
        HIGHEST_RATED: 'Highest rated',
        LOWEST_RATED: 'Lowest rated',
        MOST_RECENT: 'Most recent',
      },
    },
    rating: {
      notAvailable: 'Not available',
      title: "Travelers' favorite",
      description:
        'This place is highly rated by guests based on ratings, reviews and reliability',
      overall: 'Overall Rating',
      categories: {
        overall: 'Overall Rating',
        cleanliness: 'cleanliness',
        accuracy: 'accuracy',
        checkIn: 'checkIn',
        communication: 'communication',
        location: 'location',
        value: 'value',
      },
    },
    map: {
      title: 'Where you’ll go',
      exactLocationAfterReservation:
        'You will know the exact location after making the reservation',
      locationUnavailableMessage:
        'Location information is not available for this property.',
    },
    photo: {
      showAllPhotos: 'Show all photos',
      noPhotos: 'No photos available',
      goBack: 'Go back',
    },
    sleepingArrangements: {
      title: 'Where are you going to sleep?',
      types: {
        AIR_MATTRESS: 'Air mattress',
        BUNK_BED: 'Bunk bed',
        COUCH: 'Couch',
        CRIB: 'Crib',
        DOUBLE: 'Double bed',
        FLOOR_MATTRESS: 'Floor mattress',
        HAMMOCK: 'Hammock',
        KING: 'King bed',
        QUEEN: 'Queen bed',
        SINGLE: 'Single bed',
        SMALL_DOUBLE: 'Small double bed',
        SOFA_BED: 'Sofa bed',
        TODDLER_BED: 'Toddler bed',
        WATER_BED: 'Water bed',
      },
    },
    thingsToKnow: {
      title: 'Things to Know',
      knowMore: 'Learn More',
      houseRules: {
        title: 'House Rules',
        description:
          "You'll be staying in someone’s home, so please treat it with care and respect.",
        checkInOut: {
          title: 'Check-in and Check-out',
          startEnd: 'Check-in time is from {start} to {end}',
          checkout: 'Check-out is before {checkout}',
          flexibleCheckIn: 'Flexible check-in',
          checkInFrom: 'Check-in is from {start}',
        },
        duringStay: {
          title: 'During your stay',
          guestNumber: '{count} guests maximum',
          pets: {
            yes: 'Pets are allowed',
            no: 'Pets are not allowed',
          },
          smoking: {
            yes: 'Smoking is allowed',
            no: 'Smoking is not allowed',
          },
          events: {
            yes: 'Parties or events are allowed',
            no: 'Parties or events are not allowed',
          },
          commercialPhotography: {
            yes: 'Commercial photography is allowed',
            no: 'Commercial photography is not allowed',
          },
          quietHours: 'Quiet hours',
        },
        beforeLeave: {
          title: 'Before you leave',
          additionalRules: 'Additional rules',
        },
      },

      safetyProperty: {
        title: 'Safety and Property',
        description:
          "To avoid surprises, review these key aspects about your host's property.",
        safetyConsiderations: {
          title: 'Safety Considerations',
          expectationClimbingOrPlayStructure:
            'Climbing or play structure on the property',
          expectationHeightsWithNoFence:
            'Elevated areas without protective barriers',
          expectationLakeOrRiverOrWaterBody:
            'Near a lake, river, or other body of water',
          expectationPoolOrJacuzziWithNoFence:
            'Pool/jacuzzi without gates or locks',
          noChildrenAllowed: 'Not suitable for children',
          noInfantsAllowed: 'Not suitable for infants',
        },
        safetyDevices: {
          title: 'Safety Devices',
          carbonMonoxideDetector: {
            yes: 'Carbon monoxide detector is installed',
            no: 'No carbon monoxide detector installed',
          },
          smokeDetector: {
            yes: 'Smoke alarm is installed',
            no: 'No smoke alarm installed',
          },
          expectationSurveillance: 'Surveillance system on the property',
          expectationNoiseMonitor: 'Noise monitoring devices on the property',
        },
        propertyInformation: {
          title: 'Property Information',
          expectationHasPets: 'Pets on the property',
          expectationWeapons: 'There may be weapons on the property',
          expectationAnimals: 'Potentially dangerous animals may be present',
          expectationRequireStairs:
            'Stairs are required to access the property',
          expectationSharedSpaces: 'Shared spaces on the property',
          expectedLimitedAmenities: 'Limited amenities or services available',
          expectationPotencialNoise: 'Noise may be present',
          expectationLimitedParking: 'Limited parking available',
        },
      },
      cancellationPolicy: {
        title: 'Cancellation Policies',
        addDate: 'Add Dates',
        addDateMessage:
          'Add your travel dates to get the cancellation details for this stay.',
        hostPolicyMessage:
          'Review this host’s full policy for more information',
        description: 'Make sure the host’s cancellation policy works for you.',
        moreInformation: 'More information about cancellation policies',
        before: 'Before',
        after: 'After',
        full_refund: 'Full refund',
        partial_refund: 'Partial refund',
        no_refund: 'No refund',
        booking_no_refund: 'This reservation is non-refundable.',
        cancellation_policy_standard_flexible_description:
          'Guests will receive a full refund if they cancel up to one day before check-in.',
        cancellation_policy_standard_flexible_summary:
          'You can cancel up to {deadline} for a full refund. If you cancel after that, you’ll be charged for each night you stay, plus {non_refundable_nights} additional night.',
        cancellation_policy_standard_moderate_description:
          'Guests will receive a full refund if they cancel up to 5 days before check-in',
        cancellation_policy_standard_moderate_summary:
          'You can cancel before {deadline1} for a full refund. If you cancel after {deadline2}, you’ll be charged for each night you stay, plus {non_refundable_nights} additional night, and {refund_percentage}% of the cost for all remaining nights.',
        cancellation_policy_standard_firm_description:
          'Guests will receive a full refund if they cancel up to 30 days before check-in, except in certain cases.',
        cancellation_policy_standard_firm_summary:
          'To get a full refund, you must cancel before {deadline1}. If you cancel before {deadline2}, you’ll be charged {refund_percentage}% of the total cost. If you cancel after {deadline2}, you’ll be charged the full amount. You may also get a full refund if you cancel after {booking_window_hours} hours of making the reservation, if the cancellation occurs before {deadline3}.',
        cancellation_policy_standard_strict_description:
          'Guests will receive a full refund if they cancel within 48 hours of booking and at least 14 days before check-in.',
        cancellation_policy_standard_strict_summary:
          'To get a full refund, you must cancel within {booking_window_hours} hours of booking, and the cancellation must occur before {deadline1}. If you cancel before {deadline1} but not within {booking_window_hours} hours of booking, you’ll be charged {refund_percentage}% of the total cost. If you cancel before {deadline2}, you’ll be charged {refund_percentage}% of the total cost. If you cancel after {deadline2}, you’ll be charged the full amount.',

        cancellation_policy_standard_rule_flexible_full_refund:
          'You can cancel before {deadline} and receive a full refund, deducting only external expenses unrelated to Hospédate Bolivia, such as payment gateway commissions, bank costs.',
        cancellation_policy_standard_rule_flexible_partial_refund:
          'If you cancel after {deadline}, you’ll be charged for each night you stay, plus {non_refundable_nights} additional night. External expenses (payment gateways, bank costs) are non-refundable.',
        cancellation_policy_standard_rule_moderate_full_refund:
          'You can cancel before {deadline} and receive a full refund, deducting only external expenses unrelated to Hospédate Bolivia, such as payment gateway commissions, bank costs.',
        cancellation_policy_standard_rule_moderate_partial_refund:
          'If you cancel after {deadline}, you’ll be charged for each night you stay, plus {non_refundable_nights} additional night, and {refund_percentage}% of the cost of all remaining nights. External expenses (payment gateways, bank costs) are non-refundable.',
        cancellation_policy_standard_rule_firm_full_refund:
          'You can cancel before {deadline} and receive a full refund, deducting only external expenses unrelated to Hospédate Bolivia, such as payment gateway commissions, bank costs.',
        cancellation_policy_standard_rule_firm_full_refund_booking_window:
          'You can cancel within {booking_window_hours} hours of making the reservation, and before {deadline}, and receive a full refund, deducting only external expenses unrelated to Hospédate Bolivia, such as payment gateway commissions, bank costs.',
        cancellation_policy_standard_rule_firm_partial_refund:
          'If you cancel before {deadline}, you’ll be charged {refund_percentage}% of the total cost. External expenses (payment gateways, bank costs) are non-refundable.',
        cancellation_policy_standard_rule_firm_no_refund:
          'If you cancel after {deadline}, you’ll be charged the full amount. External expenses (payment gateways, bank costs) are non-refundable.',
        cancellation_policy_standard_rule_strict_full_refund:
          'You can cancel within {booking_window_hours} hours of booking, provided it is before {deadline}, and receive a full refund, deducting only external expenses unrelated to Hospédate Bolivia, such as payment gateway commissions, bank costs.',
        cancellation_policy_standard_rule_strict_partial_refund:
          'If you cancel before {deadline}, you’ll be charged {refund_percentage}% of the total cost. External expenses (payment gateways, bank costs) are non-refundable.',
        cancellation_policy_standard_rule_strict_partial_refund_booking_window:
          'If you cancel before {deadline} but not within {booking_window_hours} hours of booking, you’ll be charged {refund_percentage}% of the total cost. External expenses (payment gateways, bank costs) are non-refundable.',
        cancellation_policy_standard_rule_strict_no_refund:
          'If you cancel after {deadline}, you’ll be charged the full amount. External expenses (payment gateways, bank costs) are non-refundable.',

        cancellation_policy_long_term_stay_firm_description:
          'Full refund up to 30 days before arrival. After that date, the first 30 days of the stay are non-refundable.',
        cancellation_policy_long_term_stay_firm_summary:
          'To get a full refund, you must cancel before {deadline}. If you cancel after that, you will be charged for all nights you have spent, plus the following {non_refundable_nights} nights. If fewer than {non_refundable_nights} nights remain in the reservation, you will be charged for all remaining nights.',
        cancellation_policy_long_term_stay_strict_description:
          'Full refund if canceled within 48 hours of booking and at least 28 days before arrival. After that, the first 30 days of the stay are non-refundable.',
        cancellation_policy_long_term_stay_strict_summary:
          'To get a full refund, you must cancel within {booking_window_hours} hours of booking, and the cancellation must occur before {deadline}. If you cancel after that, you will be charged for all nights you have spent, plus the following {non_refundable_nights} nights. If fewer than {non_refundable_nights} nights remain in the reservation, you will be charged for all remaining nights.',

        cancellation_policy_long_term_stay_rule_firm_full_refund:
          'You can cancel before {deadline} and receive a full refund, deducting only external expenses unrelated to Hospédate Bolivia, such as payment gateway commissions, bank costs.',
        cancellation_policy_long_term_stay_rule_firm_partial_refund:
          'If you cancel after {deadline}, you will be charged for all nights you have spent, plus {non_refundable_nights} additional nights. If fewer than {non_refundable_nights} nights remain in the reservation, you will be charged for all remaining nights. External expenses (payment gateways, bank costs) are non-refundable.',
        cancellation_policy_long_term_stay_rule_strict_full_refund:
          'You can cancel within {booking_window_hours} hours of booking, provided it is before {deadline}, and receive a full refund, including the service fee.',
        cancellation_policy_long_term_stay_rule_strict_partial_refund:
          'If you cancel after {deadline}, you will be charged for all nights you have spent, plus the following {non_refundable_nights} nights. If fewer than {non_refundable_nights} nights remain in the reservation, you will be charged for all remaining nights. External expenses (payment gateways, bank costs) are non-refundable.',
      },
    },
  },
  menu: {
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    listings: 'Listings',
    messages: 'Conversations',
    reservations: 'Reservations',
    earnings: 'Earnings',
    insights: 'Insights',
    menu: 'Menu',
    reviews: 'Reviews',
    resourcesSupport: 'Resources and Support',
    account: {
      account: 'Account',
      profile: 'Your Profile',
      settings: 'Account settings',
      notifications: 'Notifications',
      refer: 'Refer a host',
      createListing: 'Create a new listing',
    },
    support: {
      connect: 'Connect with Hosts near you',
      resources: 'Explore hosting resources',
      helpCentre: 'Visit the Help Centre',
      safety: 'Get help with a safety issue',
    },
    settings: {
      settings: 'Settings',
      language: 'Language and translation',
      currency: '$ USD',
    },
  },
  notificationPermission: {
    title: 'Enable notifications',
    description: {
      part1: 'Receive alerts',
      part2: 'in real time about:',
      part3: 'Announcements, messages and reservations.',
      part4: "So you don't miss any important updates.",
    },
    activateNow: 'Activate Now',
    remindMeLater: 'Ask me later',
    dontAskAgain: "Don't ask again",
    imageAlt: 'Notification image',
  },
  notifications: 'Notifications',
  today: {
    welcomeMessage: 'Glad to see you again, {name}',
    reservationsHeader: 'Your reservations',
    selectListing: 'Select listing',
    viewAllReservations: 'View all reservations',
    categories: {
      cancelled: 'Cancelled',
      checkIns: 'Check-ins',
      checkouts: 'Check-outs',
      inProgress: 'In progress',
      pendingConfirmation: 'Pending Confirmation',
      pendingReviews: 'Pending Reviews',
      scheduled: 'Scheduled',
    },
    cancelledByGuest: 'Cancelled by the guest',
    flexibleCheckIn: 'Their check-in is flexible',
    checkInToday: 'Will check in today at',
    checkOutToday: 'Will check out today at',
    lodgedNow: 'Lodged right now',
    wantsToStay: 'Wants to stay in',
    mustReview: 'Must review their experience',
    willStay: 'Will stay in',
    days: 'days',
    message: 'Message',
    viewMore: 'View more',
    noEvents: 'Oops... we do not have any data to show you right now.',
    pendingApproval: 'Waiting for your approval',
    pendingPayment: 'Waiting for guest payment',
  },
  hostListing: {
    title: 'Your Listing',
  },
  table: {
    title: 'Title',
    description: 'Description',
    state: 'State',
    actions: 'Actions',
    bookings: 'Bookings',
  },
  hostReservations: {
    title: 'Reservations',
    loading: 'Loading...',
    noUpcomingReservations: 'You have no upcoming reservations',
    seeAllReservations: 'See all reservations',
    noResultsFound: 'No results found',
    tryDifferentFilter: 'Please try a different filter.',
    noReservations: 'You have no reservations',
    views: {
      upcoming: 'Upcoming',
      completed: 'Completed',
      cancelled: 'Cancelled',
      all: 'All',
    },
  },
  earning: {
    title: 'Earnings',
  },
  insights: {
    title: 'Insights',
  },
  createListing: {
    toast: {
      confirmAddress: {
        confirmAddressWarning: 'Confirm that this is the correct address',
        confirmAddressPrimary: 'This address is correct',
        confirmAddressSecondary: 'Change my address',
      },
      errors: {
        saveFailed: "We couldn't save your changes. Please try again later.",
        fetchFailed:
          "We couldn't retrieve the information. Please try again later.",
        deleteFailed: "We couldn't delete it. Please try again later.",
        updateFailed:
          'We couldn’t update the information. Please try again later.',
      },
    },
    modal: {
      confirmQuit: {
        title: 'Confirm exit without saving',
        description: 'Unsaved changes will be lost. Are you sure?',
        heading: 'Save your progress and come back later',
        saved: 'Your progress will be saved up to this step.',
        unsaved: 'Progress from your current step will not be saved.',
        backToEdit: 'Back to edit',
        saveAndExit: 'Save and exit',
      },
      published: {
        title: 'Your listing has been published',
        description: 'You can now view it in your list of published spaces.',
        welcome: 'Welcome to Hospédate',
        subtitle: 'Your space has been added to your list of spaces',
        verificationMessage:
          'You must now verify your identity to publish this and future spaces.',
        verifyButton: 'Verify my identity',
        viewSpacesButton: 'View my spaces',
      },
      registeredUserModal: {
        title: 'One last step',
        imageAlt: 'Photo of your space',
        reviewIntro: 'We’ll submit your space for review:',
        reviewDetail: {
          part1: 'Once you verify your identity,',
          bold: 'our team will review your listing',
          part2:
            'to ensure it meets our quality and safety standards. We’ll notify you about the status of your listing.',
        },
        postPublishIntro: 'Once published, you can do the following:',
        stepCalendar: 'Set up your calendar',
        stepCalendarDescription:
          'Set house rules, cancellation policy, and reservation preferences.',
        stepReadyGuest: 'Get ready for your first guest',
        stepReadyGuestDescription:
          'Make everything ready to start hosting guests with Hospédate.',
        cta: 'Submit for review',
      },
      unregisteredUserModal: {
        title: 'A couple of things are missing to publish your listing',
        imageAlt: 'Photo of the listing',
        description:
          'Before your listing goes live, these 2 things must happen:',
        identity: {
          title: 'Verify your identity',
          description:
            'For security reasons, we need to confirm your identity before reviewing your listing.',
        },
        review: {
          title: 'Listing review',
          description: {
            part1: 'Once your identity is verified,',
            bold: 'our team will review your listing',
            part2:
              'to ensure it meets our quality and safety standards. We’ll notify you about the status of your publication.',
          },
        },
        ctaPrimary: 'Verify my identity now',
        ctaSecondary: 'Verify my identity later',
      },
      common: {
        close: 'Close',
        finalizationFailed: 'Failed to finalize the process, try again',
      },
    },
    wizardHeader: {
      title: 'Create your listing',
      save: 'Save and quit',
      quit: 'Quit',
      invalidSaveAttempt:
        'Invalid data, you will exit without saving your changes',
    },
    wizardFooter: {
      start: 'Start',
      back: 'Back',
      next: 'Next',
      publish: 'Publish',
    },
    wizardStepContent: {
      loadingListing: 'Loading your listing, please wait...',
      noCoordinates: 'Coordinates have not been defined',
      stepNotConfigured: 'Step {step} not configured.',
      createListingCover: {
        headingStart: 'Getting started with',
        headingMiddle: 'Hospédate',
        headingEnd: 'is very',
        headingHighlight: 'easy',
        firstTitle: 'Describe your space',
        firstDescription:
          'Provide basic information such as the address and the maximum number of guests allowed in the accommodation.',
        secondTitle: 'Enhance it with details',
        secondDescription:
          'Include at least five images, an attractive title, and a description. We’re here to help you.',
        thirdTitle: 'Finish and publish',
        thirdDescription:
          'Set a starting price, review a few details, and publish your listing.',
      },
      placeInformationCover: {
        stepLabel: 'Step 1',
        title: 'Describe your property',
        description:
          'We’ll ask you what kind of place you have. Then, let us know the location and how many guests can stay.',
      },
      placeInformationPlaceType: {
        title: 'Which of these best describes your place?',
        noPlaceTypesAvailable: 'No place types available',
      },
      placeInformationSearchLocation: {
        title: 'Place the marker where your listing is located',
        description:
          'Type your address in the search bar or drag the pin to place it exactly where your listing is located. We’ll only share your address with guests who have a confirmed reservation.',
        placeholder: 'Enter your address...',
        manualEntry: 'Enter address manually',
        useCurrentLocation: 'Use current location',
        currentLocationNotFound: 'Could not get your current location',
        orAlternative: 'Or alternatively',
        noSuggestionsFound: 'No suggestions found for this search',
        permissionDenied:
          'Your browser blocked location access. Enable location permission to use “Use current location”.',
        outsideBoliviaError:
          'Your location is outside Bolivia. Please enter your address manually.',
        notFound: 'Location not found. Please enter your address manually.',
      },
      placeInformationConfirmLocation: {
        title: 'Confirm your address',
        subtitle:
          'We’ll only share your address with guests who have made a reservation.',
        countryLabel: 'Country / Region',
        addressLabel: 'Address',
        addressPlaceholder: 'Street and number',
        aptLabel: 'Apartment / Floor / Building (if applicable)',
        aptPlaceholder: 'E.g. Floor 3, Apt B',
        cityLabel: 'City / Municipality',
        cityPlaceholder: 'E.g. La Paz',
        stateLabel: 'Province / State',
        statePlaceholder: 'E.g. Murillo',
        showExactLocationTitle: 'Show exact location',
        showExactLocationDescription:
          'Make sure to inform guests about your place’s location. We’ll only share your address after they make a reservation.',
        moreDetails: 'More details.',
        approximateLocationLabel: 'We’ll share your approximate location',
      },
      placeInformationReviewLocation: {
        title: 'Is the marker in the correct location?',
        description:
          'We’ll only share your address with guests who have made a reservation.',
        markerTooFar:
          'The marker cannot be more than {meters} meters away. Move it closer to the location to continue.',
        markerLabel: 'Drag the marker to the exact location of your place',
      },
      placeInformationCapacity: {
        title: 'Add some basic details about your place',
        description:
          'You’ll be able to add more details about other areas of your home later.',
        guestNumber: 'Guests',
        roomNumber: 'Rooms',
        bedNumber: 'Beds',
        bathNumber: 'Bathrooms',
        bathNumberCaption: 'Note: "0.5" means a bathroom without a shower.',
      },
      placeFeaturesCover: {
        stepLabel: 'Step 2',
        title: 'Enhance it with details',
        description:
          'At this stage, you’ll need to include several of your property’s features, at least five photos, and then write a title and a short description.',
      },
      placeFeaturesAmenity: {
        title: 'Let guests know all the great features your place offers.',
        description: 'You can add more amenities after your listing goes live.',
        groups: {
          Preferred: 'Preferred',
          Standout: 'Standout',
          Safety: 'Safety',
          description: {
            Preferred:
              'These are amenities guests typically prefer. Do you have them?',
            Standout: 'Do you have any standout features to highlight?',
            Safety: 'Do you offer any of these safety devices?',
          },
        },
        noAmenitiesAvailable: 'No amenities available',
      },

      placeFeaturesUploadPhotos: {
        title:
          'Include a <span class="font-semibold">minimum of 5 photos</span> for your listing.',
        description:
          'You’ll need five photos to start. Later, you can add more or make changes.',
        addPhotosButton: 'Add photos',
      },
      placeFeaturesGallery: {
        titleWithPhotos: 'Wow. How does it look?',
        descriptionWithPhotos: 'You can drag photos to rearrange them.',
        titleWithoutPhotos: 'Include some photos of your space',
        descriptionWithoutPhotos:
          'You’ll need five photos to start. You can add more or make changes later.',
        addPhoto: 'Add photo',
        coverPhoto: 'Cover photo',
        editCaptionTitle: 'Edit caption',
        editCaptionSave: 'Save',
        captionPlaceholder: 'Write a description of this photo',
        deleteConfirmTitle: 'Do you want to delete this photo?',
        deleteConfirmText: 'Once deleted, you won’t be able to recover it.',
        deleteButton: 'Yes, delete it',
        menuEdit: 'Edit',
        menuDelete: 'Delete',
        saving: 'Saving...',
        deleting: 'Deleting...',
        deleteErrorMessage: 'Error deleting photo',
      },
      placeFeaturesTitle: {
        title: 'Now, give your place a title',
        description:
          'Short titles tend to perform better. Don’t worry, you can change it later.',
        label: 'Title:',
        placeholder: 'Write the title of your apartment',
        characterCount: '{count}/{max} characters',
      },
      placeFeaturesDescription: {
        title: 'Write an appealing description of your place',
        description: 'Highlight the features that make your place special.',
        label: 'Description:',
        placeholder:
          'Take your time and think about the most attractive way to describe your place to guests.',
        characterCount: '{count}/{max} characters',
      },
      placeSetupCover: {
        stepLabel: 'Step 3',
        title: 'Finish and publish',
        description:
          'Finally, you’ll configure the booking settings, set your price, and publish your listing.',
      },
      placeSetupPricing: {
        title: 'Now, set your price',
        description: 'You can change this anytime.',
        currencyLabel: 'BOB',
        pricePlaceholder: '0',
        error: 'The price must be between BOB 50 and BOB 10,000.',
      },
      placeSetupDiscount: {
        title: 'Add discounts',
        description:
          'Stand out and get your first bookings and reviews faster by offering discounts.',
        weeklyLabel: 'Weekly discount',
        weeklyDescription: 'For stays of 7 nights or more',
        monthlyLabel: 'Monthly discount',
        monthlyDescription: 'For stays of 28 nights or more',
        warning: 'Monthly discount must be greater than weekly discount.',
      },
      uploadPhotosModal: {
        title: 'Upload your photos',
        subtitle_intro: 'Drag or tap the button to add photos.',
        subtitle_meta:
          'Formats: {formats} • Size: {minSizeKB} KB - {maxSizeMB} MB • Dimensions: {minRes} - {maxRes} px',
        uploadButton: 'Upload {count} photo(s)',
        emptyContent: {
          noSelection: 'You didn’t select any item.',
          instruction: 'Upload photos',
          dropHint: 'or drag and drop here',
          formatsHint: '{formats} (max. {size}MB)',
        },
        validation: {
          invalidFormat: 'Invalid format',
          tooSmall: 'Less than {minSize} KB',
          tooLarge: 'Exceeds {maxSize} MB',
          tooSmallDimensions:
            'The image dimensions are too small. Minimum: {minWidth}x{minHeight} px.',
          tooLargeDimensions:
            'The image dimensions are too large. Maximum: {maxWidth}x{maxHeight} px.',
          couldNotLoad: 'Could not load the image',
          uploadFailed: 'Failed to upload the image',
        },
        successTitle: 'Upload successful!',
        successMessage_one: 'You have uploaded 1 photo successfully',
        successMessage_other: 'You have uploaded {count} photos successfully',

        uploadResultExplanation: 'This is what happened with your photos',
        uploadResultMessage_partial_one:
          'You have successfully uploaded 1 photo',
        uploadResultMessage_partial_other:
          'You have successfully uploaded {count} photos',
        uploadResultMessage_partialFailed_one: '1 photo failed to upload',
        uploadResultMessage_partialFailed_other:
          '{count} photos failed to upload',

        uploadResultMessage_error_one: 'Sorry, we couldn’t upload your photo',
        uploadResultMessage_error_other:
          'Sorry, we couldn’t upload your photos',
        okButton: 'OK',
        failedButton: 'Check what failed',
      },
    },
  },
  contentSwitcher: {
    map: 'View on Map',
    list: 'View in List',
    card: {
      title: '{type} in {location}',
      perNights_one: 'for {count} night',
      perNights_other: 'for {count} nights',
      notAvailable: 'Not available',
    },
  },
  placeTypes: {
    home: 'Home',
    hotel: 'Hotel',
    house: 'House',
    apartment: 'Apartment',
    cabin: 'Cabin',
    dome: 'Dome',
    Home: 'Home',
    Hotel: 'Hotel',
    House: 'House',
    Apartment: 'Apartment',
    Cabin: 'Cabin',
    Dome: 'Dome',
  },
  amenities: {
    'air-conditioning': 'Air conditioning',
    'arcade-games': 'Arcade games',
    'baby-bath': 'Baby bath',
    'baby-monitor': 'Baby monitor',
    'baby-safety-gates': 'Baby safety gates',
    'babysitter-recommendations': 'Babysitter recommendations',
    backyard: 'Backyard',
    'baking-sheet': 'Baking sheet',
    'barbecue-utensils': 'Barbecue utensils',
    bathtub: 'Bathtub',
    'batting-cage': 'Batting cage',
    'bbq-grill': 'BBQ grill',
    'beach-access': 'Beach access',
    'beach-essentials': 'Beach essentials',
    'bed-linens': 'Bed linens',
    bidet: 'Bidet',
    bikes: 'Bikes',
    blender: 'Blender',
    'board-games': 'Board games',
    'boat-slip': 'Boat slip',
    'body-soap': 'Body soap',
    'books-and-reading-material': 'Books and reading material',
    'bowling-alley': 'Bowling alley',
    'bread-maker': 'Bread maker',
    breakfast: 'Breakfast',
    'carbon-monoxide-detector': 'Carbon monoxide detector',
    'ceiling-fan': 'Ceiling fan',
    'changing-table': 'Changing table',
    'childrens-bikes': 'Childrens bikes',
    'childrens-books-and-toys': 'Childrens books and toys',
    'childrens-dinnerware': 'Childrens dinnerware',
    'childrens-playroom': 'Childrens playroom',
    'cleaning-available-during-stay': 'Cleaning available during stay',
    'cleaning-products': 'Cleaning products',
    'climbing-wall': 'Climbing wall',
    'clothing-storage': 'Clothing storage',
    coffee: 'Coffee',
    'coffee-maker': 'Coffee maker',
    conditioner: 'Conditioner',
    'cooking-basics': 'Cooking basics',
    crib: 'Crib',
    'dedicated-workspace': 'Dedicated workspace',
    'dining-table': 'Dining table',
    'dishes-and-silverware': 'Dishes and silverware',
    dishwasher: 'Dishwasher',
    dryer: 'Dryer',
    'drying-rack-for-clothing': 'Drying rack for clothing',
    elevator: 'Elevator',
    essentials: 'Essentials',
    'ethernet-connection': 'Ethernet connection',
    'ev-charger': 'Ev charger',
    'exercise-equipment': 'Exercise equipment',
    'extra-pillows-and-blankets': 'Extra pillows and blankets',
    'fire-extinguisher': 'Fire extinguisher',
    'fire-pit': 'Fire pit',
    'fire-screen': 'Fire screen',
    'first-aid-kit': 'First aid kit',
    'free-parking-on-premises': 'Free parking on premises',
    'free-street-parking': 'Free street parking',
    freezer: 'Freezer',
    'game-console': 'Game console',
    gym: 'Gym',
    'hair-dryer': 'Hair dryer',
    hammock: 'Hammock',
    hangers: 'Hangers',
    heating: 'Heating',
    'high-chair': 'High chair',
    'hockey-rink': 'Hockey rink',
    'hot-tub': 'Hot tub',
    'hot-water': 'Hot water',
    'hot-water-kettle': 'Hot water kettle',
    'indoor-fireplace': 'Indoor fireplace',
    iron: 'Iron',
    kayak: 'Kayak',
    kitchen: 'Kitchen',
    kitchenette: 'Kitchenette',
    'lake-access': 'Lake access',
    'laser-tag': 'Laser tag',
    'laundromat-nearby': 'Laundromat nearby',
    'life-size-games': 'Life size games',
    'long-term-stays-allowed': 'Long term stays allowed',
    'luggage-dropoff-allowed': 'Luggage dropoff allowed',
    microwave: 'Microwave',
    'mini-fridge': 'Mini fridge',
    'mini-golf': 'Mini golf',
    'mosquito-net': 'Mosquito net',
    'movie-theater': 'Movie theater',
    'outdoor-playground': 'Outdoor playground',
    'outdoor-dining-area': 'Outdoor dining area',
    'outdoor-furniture': 'Outdoor furniture',
    'outdoor-kitchen': 'Outdoor kitchen',
    'outdoor-shower': 'Outdoor shower',
    'outlet-covers': 'Outlet covers',
    oven: 'Oven',
    'packn-play-travel-crib': 'Packn play travel crib',
    'paid-parking-off-premises': 'Paid parking off premises',
    'paid-parking-on-premises': 'Paid parking on premises',
    'patio-or-balcony': 'Patio or balcony',
    piano: 'Piano',
    'ping-pong-table': 'Ping pong table',
    'pocket-wifi': 'Pocket wifi',
    pool: 'Pool',
    'pool-table': 'Pool table',
    'portable-fans': 'Portable fans',
    'private-entrance': 'Private entrance',
    'private-living-room': 'Private living room',
    'record-player': 'Record player',
    refrigerator: 'Refrigerator',
    'resort-access': 'Resort access',
    'rice-maker': 'Rice maker',
    'room-darkening-shades': 'Room darkening shades',
    safe: 'Safe',
    sauna: 'Sauna',
    shampoo: 'Shampoo',
    'shower-gel': 'Shower gel',
    'single-level-home': 'Single level home',
    'skate-ramp': 'Skate ramp',
    'ski-in-ski-out': 'Ski in ski out',
    'smoke-detector': 'Smoke detector',
    'sound-system': 'Sound system',
    stove: 'Stove',
    'sun-loungers': 'Sun loungers',
    'table-corner-guards': 'Table corner guards',
    'theme-room': 'Theme room',
    toaster: 'Toaster',
    'trash-compactor': 'Trash compactor',
    tv: 'Tv',
    washer: 'Washer',
    waterfront: 'Waterfront',
    wifi: 'Wifi',
    'window-guards': 'Window guards',
    'wine-glasses': 'Wine glasses',
  },
  reservationOptions: {
    'instant-book': 'Instant Book',
    'self-check-in': 'Self Check-in',
    'allowed-pets': 'Pets Allowed',
  },
  amenityGroups: {
    Basic: 'Basic',
    Bathroom: 'Bathroom',
    'Bedroom and laundry': 'Bedroom and Laundry',
    Entertainment: 'Entertainment',
    Family: 'Family',
    'Heating and cooling': 'Heating and Cooling',
    'Home safety': 'Home Safety',
    'Internet and office': 'Internet and Office',
    'Kitchen and dining': 'Kitchen and Dining',
    'Location features': 'Location Features',
    Outdoor: 'Outdoor',
    'Parking and facilities': 'Parking and Facilities',
    Services: 'Services',
    Preferred: 'Preferred',
    Standout: 'Standout',
    Safety: 'Safety',
    Popular: 'Popular',
    Essentials: 'Essentials',
    Features: 'Features',
  },
  spaceTypes: {
    'Additional photos': 'photos',
    'Art Studio': 'Art Studio',
    Backyard: 'Backyard',
    Balcony: 'Balcony',
    Bedroom: 'Bedroom',
    'Bowling alley': 'Bowling alley',
    'Children room': 'Children room',
    Courtyard: 'Courtyard',
    Darkroom: 'Darkroom',
    Deck: 'Deck',
    'Dining area': 'Dining area',
    'Event room': 'Event room',
    Exterior: 'Exterior',
    'Front yard': 'Front yard',
    'Full bathroom': 'Full bathroom',
    'Full kitchen': 'Full kitchen',
    'Game room': 'Game room',
    Garage: 'Garage',
    Garden: 'Garden',
    Gym: 'Gym',
    'Half bathroom': 'Half bathroom',
    'Hot tub': 'Hot tub',
    Kitchenette: 'Kitchenette',
    'Laundry area': 'Laundry area',
    Library: 'Library',
    'Living room': 'Living room',
    'Movie theater': 'Movie theater',
    'Music studio': 'Music studio',
    Office: 'Office',
    Patio: 'Patio',
    'Photography studio': 'Photography studio',
    Pool: 'Pool',
    Porch: 'Porch',
    Rooftop: 'Rooftop',
    Sunroom: 'Sunroom',
    Terrace: 'Terrace',
    'Theme room': 'Theme room',
    'Wine cellar': 'Wine cellar',
    Woodshop: 'Woodshop',
    Workshop: 'Workshop',
    Workspace: 'Workspace',
  },
  users: {
    personalInfoTitle: 'Personal Information',
    time: {
      lastUpdated: 'Last updated: {time}',
      justNow: 'just now',
      minute: 'a minute ago',
      minutes: '{count} minutes ago',
      hour: 'an hour ago',
      hours: '{count} hours ago',
      day: 'a day ago',
      days: '{count} days ago',
      month: 'one month ago',
      months: '{count} months ago',
      year: 'a year ago',
      years: '{count} years ago',
    },
    personalInfoBreadcrumbAccount: 'Account',
    personalInfoBreadcrumbCurrent: 'Personal Information',
    loginTitle: 'Login',
    passwordTitle: 'Password',
    lastUpdatedOneMonthAgo: 'Last updated: One month ago',
    edit: 'Edit',
    socialAccountsTitle: 'Social Accounts',
    facebookTitle: 'Facebook',
    notConnected: 'Not connected',
    accountTitle: 'Account',
    deactivate: 'Deactivate',
    deactivateAccount: 'Deactivate account',
    changePasswordTitle: 'Change your password',
    cancel: 'Cancel',
    verify: 'Verify',
    enterOldPasswordNote: 'Enter your current password',
    oldPasswordLabel: 'Current password',
    enterNewPasswordNote: 'Enter your new password',
    newPasswordLabel: 'New password',
    repeatPasswordLabel: 'Repeat password',
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    recommendationIntro:
      'We recommend including the following characters to improve security:',
    recommendationNumbers: 'Numbers',
    recommendationSymbols: 'Special characters (!#$)',
    recommendationUppercase: 'Uppercase letters',
    passwordChangedSuccess: 'Your password has been successfully changed',
    confirmButton: 'Done',
    loginAndPrivacyTitle: 'Login and Privacy',
    loginAndPrivacyBreadcrumbAccount: 'Account',
    loginAndPrivacyBreadcrumbCurrent: 'Login and Privacy',
    nameSection: 'Name',
    legalNameTitle: 'Legal name',
    legalNamePlaceholder: 'Juan Ignacio Guzmán Palenque',
    preferredNameTitle: 'Preferred name',
    preferredNamePlaceholder: 'Not provided',
    contactSection: 'Contact',
    emailAddressTitle: 'Email address',
    notFound: 'User data not found',
    emailAddressPlaceholder: 'j*****x@gmail.com',
    phoneNumberTitle: 'Phone number',
    phoneNumberDescription:
      'Include a number so that guests with confirmed reservations and Hospédate can contact you. You can also add other numbers and decide how to use them.',
    platformRegistrationSection: 'Platform Registration',
    identityVerificationTitle: 'Identity verification',
    identityVerificationDescription:
      'Verify yourself to be able to rent your spaces on our platform.',
    addButton: 'Add',
    // Legal Name Modal
    addOrModifyLegalNameTitle: 'Add or modify legal name',
    legalNameModalDescription:
      'Make sure it matches the name that appears on your official identity document.',
    firstNameLabel: 'First name that appears on the identity document',
    firstNamePlaceholder: 'Juan Ignacio',
    lastNameLabel: 'Last names that appear on the identity document',
    lastNamePlaceholder: 'Guzmán Palenque',
    save: 'Save',
    invalidCharactersError:
      'Names cannot contain numbers or special characters',
    // Preferred Name Modal
    addOrModifyPreferredNameTitle: 'Add or modify preferred name',
    preferredNameModalDescription:
      'This is how your name will appear to hosts and guests.',
    preferredNameLabel: 'Preferred name (optional)',
    preferredNamePlaceholderText: 'Juanguz',
    // Email Modal
    addOrModifyEmailTitle: 'Add or modify email',
    emailModalDescription: 'Use an address you will always have access to.',
    emailLabel: 'Email address',
    emailPlaceholderText: 'user@example.com',
    invalidEmailError: 'Please enter a valid email address',
    // Phone Modal
    addOrModifyPhoneTitle: 'Add or modify phone number',
    phoneModalDescription: 'Enter a new phone number',
    phoneLabel: 'Phone number',
    phonePlaceholderText: '+591 76349200',
    invalidPhoneError: 'Please enter a valid phone number',
    phoneVerificationTitle: 'Add or modify phone number',
    phoneVerificationDescription: 'Enter the verification code for your number',
    verificationCodeLabel: 'Verification code',
    verificationCodePlaceholder: 'H34GK2',
    resendCode: 'Resend code',
    invalidCodeError: 'Please enter a valid verification code',
    phoneVerifiedSuccess:
      'Your number {phoneNumber} has been successfully verified.',
    ready: 'Ready',
    modal: {
      deactivateAccountTitle: 'Deactivate your account',
      deactivateAccountDescription:
        'Are you sure you want to deactivate your account? This action cannot be undone.',
      deactivateAccountConfirm: 'Yes, deactivate my account',
      goBack: 'Go back',
      deactivating: 'Deactivating...',
    },
  },
  trips: {
    pageTitle: 'Your Trips',
    tabs: {
      current: 'Current',
      past: 'Past',
      cancelled: 'Cancelled',
      rejected: 'Rejected',
    },
    content: {
      current: 'Current trips will be shown here.',
      past: 'Past trips will be shown here.',
      cancelled: 'Cancelled trips will be shown here.',
      rejected: 'Rejected trips will be shown here.',
    },
    status: {
      checkedInNow: 'Checked in right now',
      checkingInToday: 'Check-in in today',
      checkingInDays: 'Check-in in {days} days',
      pendingApproval: 'Pending approval',
      rejectedByGuest: 'Cancelled by guest',
      rejectedByHost: 'Cancelled by host',
      cancelled: 'Cancelled',
      rejected: 'Rejected',
    },
    actions: {
      leaveReview: 'Leave your review',
    },
    timeline: {
      noMoreReservations: 'No more reservations',
    },
    // Reservation Data translations
    reservationData: 'Reservation data',
    guests: 'Guests',
    adultOne: 'adult',
    adultOther: 'adults',
    childOne: 'child',
    childOther: 'children',
    pets: 'pets',
    peopleOne: 'person',
    peopleOther: 'people',
    petOne: 'pet',
    and: 'and',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    dayOne: 'day',
    dayOther: 'days',
    nights: 'nights',
    nightsUnit: 'days',
    days: 'days',
    bookingDays: 'Booking days',
    totalAmount: 'Total amount',
    openCalendar: 'Open calendar',
    // Payment translations
    payment: 'Guest payment',
    guestPayment: 'Guest charge',
    guestFee: 'Guest fee',
    occupancyTax: 'Occupancy tax',
    serviceFee: 'Service fee',
    cleaningFee: 'Cleaning fee',
    weeklyDiscount: 'Weekly discount',
    monthlyDiscount: 'Monthly discount',
    total: 'Total',
    // Host profit translations
    hostProfit: 'Host profit',
    yourEarnings: 'Your earnings',
    grossEarnings: 'Charge for {nights} nights',
    processingFee: 'Processing fee',
    hostFee: 'Host fee',
    netEarnings: 'Net earnings',
    // Private notes translations
    privateNotes: 'Private notes',
    privateNotesDescription:
      'Add private notes about this reservation (only you can see them)',
    privateNotesPlaceholder: 'Add your private notes here...',
    // House cover translations
    houseCover: 'House cover',
    houseCoverDescription: 'Information about property coverage and protection',
  },
  tripDetail: {
    pageTitle: 'Trip Details',
    title: 'Booking Details',
    propertyTitle: 'Beautiful room with balcony, excellent location',
    status: {
      host: {
        wantCheckInDays: 'Wants to check in in {days} days',
        checkingInDays: 'Will check in in {days} days',
        checkedInNow: 'Currently checked in',
        checkingInToday: 'Will check in today at {time}',
        checkingOutToday: 'Will check out today at {time}',
        leaveReview: 'Needs to leave a review of their experience',
        cancelled: 'Cancelled',
        cancelledByHost: 'The host cancelled the reservation at {time}',
        cancelledByGuest: 'The guest cancelled the reservation at {time}',
        pendingApproval: 'Waiting for your approval',
        pendingPayment: 'Waiting for guest payment',
      },
      pendingApproval: 'Waiting for host approval',
      pendingPayment: 'Waiting for your payment',
      checkingInDays: 'You will stay in {days} days',
      checkedInNow: 'Currently Checked In',
      checkingInToday: 'Will check in today at {time}',
      checkingOutToday: 'Will check out today at {time}',
      leaveReview: 'Leave your review',
      cancelled: 'Cancelled',
      rejected: 'Rejected',
    },
    actions: {
      save: 'Save',
      share: 'Share',
      showAllPhotos: 'Show all photos',
      viewHostProfile: 'View host profile',
      viewGuestProfile: 'View guest profile',
      viewConversation: 'View conversation',
      paymentDetails: 'Payment details',
      downloadReceipt: 'Download receipt',
      viewMore: 'View more',
      emailHost: 'Email the host',
      cancelReservation: 'Cancel reservation',
      reportHost: 'Report host',
      reportProblem: 'Report a problem',
      approveRequest: 'Approve request',
      rejectRequest: 'Reject request',
    },
    host: {
      hostedBy: 'Hosted by',
      about: 'About {hostName}',
      verified: 'Identity verified',
      noVerified: 'Identity not verified',
      reviews: '{count} reviews',
      noReviews: 'No reviews',
      joinedIn: 'Joined in {year}',
      livesIn: 'Lives in {location}',
      livesInCityCountry: 'Lives in {city}, {country}',
      ratingAndReviews: '{rating} points ({count} reviews)',
    },
    booking: {
      title: 'Booking data',
      howMany: 'How many',
      guests: '{count} guests and {pets} pet',
      guestsOnly: '{count} guests',
      checkIn: 'Check In',
      checkOut: 'Check Out',
    },
    payment: {
      title: 'Payment information',
      totalPaid: 'Total paid:',
      currency: 'Bs {amount}',
      reservationCode: 'Reservation code',
    },
    paymentRequest: {
      haveBeenApproved: 'You have been approved by the host',
      payToReserve: 'Now pay to reserve',
      goToPayment: 'Go to pay for the reservation',
    },
    houseRules: {
      title: 'House rules',
      checkInTime: 'Check in starts at {time}',
      checkoutTime: 'Check out ends at {time}',
      maxGuests: '{count} guests',
    },
    security: {
      title: 'Security and property',
      noDetector: 'No {type} detector',
      carbonMonoxide: 'carbon monoxide',
      smoke: 'smoke',
    },
    cancellation: {
      title: 'Cancellation policy',
      policy:
        '{type} cancellation: {percentage}% refund up to {days} days before.',
      reasonTitle: 'Reason for cancellation',
      policyTitle: 'Policy information',
      dataTitle: 'Cancellation data',
      cancelledBy: 'Cancelled by',
      CANCELLED_BY_HOST: 'Host',
      CANCELLED_BY_GUEST: 'Guest',
      CANCELLED_WITH_PENALTY: 'Cancelled with penalty',
      CANCELLED_WITHOUT_PENALTY: 'Cancelled without penalty',
      cancelledBySystem: 'System',
      cancellationDate: 'Cancellation date',
      status: 'Status',
      statusConfirmed: 'Confirmed',
      statusPending: 'Pending',
      statusProcessing: 'Processing',
      policyApplication: 'Policy application',
      flexible: 'Flexible',
      flexibleDescription: 'Full refund 1 day prior to arrival',
      moderate: 'Moderate',
      moderateDescription: 'Full refund 5 days prior to arrival',
      strict: 'Strict',
      strictDescription: 'Full refund 14 days prior to arrival',
      guestPaymentBefore: 'Guest payment before cancellation',
      hospedateFee: 'Hospédate Fee (if applicable)',
      totalRefundGuest: 'Full refund to the guest (if applicable)',
      amountPaidHost: 'Amount paid to the host (if applicable)',
      penaltyDescription: 'Penalty description',
      notApplicable: 'Not applicable',
      noPenalty: 'No penalty applied',
      refundedNights: 'Refunded nights',
      refundedNightsValue: '{nights} nights (BOB {amount})',
      seeMore: 'See more',
      cancelStatus: {
        CANCELLED_WITH_PENALTY: 'With penalty',
        CANCELLED_WITHOUT_PENALTY: 'Without penalty',
      },
    },
    support: {
      title: 'Support',
      emailHost: 'Email the host',
      cancelReservation: 'Cancel reservation',
      reportHost: 'Report host',
      reportProblem: 'Report a problem',
      emailGuest: 'Email the guest',
      reportGuest: 'Report guest',
    },
    experience: {
      leaveReview: {
        title: 'How was your experience?',
        subtitle: 'Tell the world what it is like to stay at this listing.',
        button: 'Leave your review',
        qualifyGuest: 'Rate guest',
        requestQualify: 'Ask the guest to rate me',
      },
      revisit: {
        title: 'Revisit this experience',
        subtitle: 'Go back to where you were happy, book this listing again.',
        button: 'Check availability',
      },
    },
    review: {
      title: 'How was your experience?',
      subtitle: 'Write your review about the experience you had at {host}',
      talkAbout: 'Tell us about your experience',
      placeholder: 'Write the description here',
      registerButton: 'Submit review',
      ratings: {
        limpieza: 'Cleanliness',
        exactitud: 'Accuracy',
        checkin: 'Check In',
        comunicacion: 'Communication',
        ubicacion: 'Location',
        precio: 'Price',
      },
      success: {
        title: '¡Muchas gracias!',
        subtitle:
          'We have sent your review so other travelers can take it into account.',
        closeButton: 'Close',
      },
    },
    modal: {
      approveRequest: 'Approve request',
      areYouSureApprove:
        'Are you sure you want to approve this booking approval request?',
      yesToApprove: 'Yes, I want to approve the request',
      rejectRequest: 'Reject request',
      areYouSureReject:
        'Are you sure you want to reject this request? This action is irreversible.',
      yesToReject: 'Yes, I want to cancel the request',
      goBack: 'Go back',
      requestApproved: 'Request approved',
      youApprovedRequest: 'You have approved this booking',
      goBackActivities: 'Go back to my activities',
      watchDetails: 'View booking details',
      loading: 'Processing...',
      approveRequestError: 'Error approving the request. Please try again.',
      rejectRequestError: 'Error rejecting the request. Please try again.',
    },
  },
  error: {
    defaultTitle: 'Something went wrong',
    loadTrips: 'Error loading trips. Please try again.',
    retry: 'Retry',
    retrying: 'Retrying...',
    general: 'Something went wrong. Please try again later.',
  },
  messages: {
    title: 'Messages',
    filter: {
      all: 'All',
      unread: 'Unread',
      favorites: 'Favorites',
    },
    searchBar: {
      title: 'Search here',
    },
    averageResponseTime: 'Average response time: {hours} hours',
    inputMessagePlaceholder: 'Write your message here',
    delivered: 'Delivered',
    seen: 'Seen',
    sent: 'Sent',
    startConversation: 'Start a conversation now!',
    selectConversation: 'Select a conversation to start chatting.',
    backToConversations: '← Back to conversation',
    andXMore: 'and {count} more',
    attachImage: 'Attach images',
    sendMessage: 'Send message',
    removeImage: 'Remove image',
    maxCharsError: 'Maximum character length',
    maxImagesError: 'You can only attach up to {maxImages} images',
    showTripDetails: 'Details',
    houseRules: {
      title: 'House rules',
      checkInStartTime: 'Check-in starts at {time}',
      guests: '{count} guests',
      petsAllowed: 'Pets allowed',
      petsNotAllowed: 'No pets allowed',
      smokingAllowed: 'Smoking allowed',
      smokingNotAllowed: 'No smoking allowed',
      partiesAllowed: 'Parties allowed',
      partiesNotAllowed: 'No parties allowed',
      seeMore: 'See more',
      seeLess: 'See less',
    },
    security: {
      title: 'Security and property',
      carbonMonoxideDetector: 'No carbon monoxide detector',
      smokeDetector: 'No smoke detector',
      seeMore: 'See more',
      seeLess: 'See less',
    },
    host: {
      hostedBy: 'Hosted by',
      aboutHost: 'About {hostName}',
      verified: 'Verified identity',
      reviews: '{count} reviews',
      joined: 'Joined in {year}',
      livesIn: 'Lives in {location}',
      viewProfile: 'View host profile',
      call: 'Call',
    },
    reservation: {
      title: 'Reservation details',
      howManyTitle: 'How many',
      howMany: '{guestCount} {guestLabel}{pets}',
      guestSingular: 'guest',
      guestPlural: 'guests',
      petSingular: ' and {petCount} pet',
      petPlural: ' and {petCount} pets',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
    },
    payment: {
      title: 'Payment information',
      totalPaid: 'Total paid',
      details: 'Payment details',
      downloadReceipt: 'Download receipt',
    },
    support: {
      title: 'Support',
      emailHost: 'Email the host',
      cancel: 'Cancel reservation',
      report: 'Report host',
    },
    seenAt: 'Seen at {hour}',
    errors: {
      failLoad: 'Could not load',
      retry: 'Try again',
      couldNotSend: 'Could not send',
      couldNotOpenConversation: "We couldn't open this conversation.",
    },
    listing: {
      label: 'Your place',
    },
    you: 'You',
    photo: '📸 Photo',
    goToBottom: 'Go to bottom',
    goToBottomWithCount_one: 'Go to bottom • {count} new message',
    goToBottomWithCount_other: 'Go to bottom • {count} new messages',
    noConversations: 'Conversation list is empty',
    guest: {
      reservedBy: 'Guest',
      aboutGuest: 'About {guestName}',
      verified: 'Identity verified',
      reviews: '{count} reviews',
      joined: 'Member since {year}',
      livesIn: 'Lives in {location}',
      viewProfile: 'View profile',
    },
    invalidImageFormat: 'Invalid image format. Use {allowed}.',
    imageTooSmall: 'The image is too small: minimum {minW}×{minH}px.',
    imageTooLarge: 'The image is too large: maximum {maxW}×{maxH}px.',
    imageValidationError:
      'Couldn’t validate the image. Please try another one.',
    systemMessage: '[System message]',
    viewImage: 'View image',
    photoAlt: 'Photo',
    photoBy: 'Photo by {name}',
    imagePreviewAlt: 'Image preview',
  },
  unauthorized: {
    title: 'Access Denied',
    description: 'You do not have permission to view this page.',
    goBack: 'Go back',
  },
  interests: {
    'Adrenaline sports': 'Adrenaline sports',
    'American football': 'American football',
    Animals: 'Animals',
    Anime: 'Anime',
    Archery: 'Archery',
    Architecture: 'Architecture',
    Art: 'Art',
    'Artisanal crafts': 'Artisanal crafts',
    Aviation: 'Aviation',
    Badminton: 'Badminton',
    Baseball: 'Baseball',
    Basketball: 'Basketball',
    'Basque pelota': 'Basque pelota',
    Billiards: 'Billiards',
    'Board games': 'Board games',
    Bobsledding: 'Bobsledding',
    'Bocce ball': 'Bocce ball',
    Bowling: 'Bowling',
    Boxing: 'Boxing',
    Bridge: 'Bridge',
    'Building things': 'Building things',
    Camping: 'Camping',
    Canoeing: 'Canoeing',
    'Card games': 'Card games',
    Cars: 'Cars',
    Charreria: 'Charreria',
    Cheerleading: 'Cheerleading',
    Chess: 'Chess',
    Climbing: 'Climbing',
    Cocktails: 'Cocktails',
    Coffee: 'Coffee',
    Comedy: 'Comedy',
    'Content creation': 'Content creation',
    Cooking: 'Cooking',
    Crafting: 'Crafting',
    Cricket: 'Cricket',
    'Cultural heritage': 'Cultural heritage',
    Curling: 'Curling',
    Cycling: 'Cycling',
    Dance: 'Dance',
    Darts: 'Darts',
    Diving: 'Diving',
    Dodgeball: 'Dodgeball',
    'Equestrian sports': 'Equestrian sports',
    'Fantasy sports': 'Fantasy sports',
    Fashion: 'Fashion',
    Fencing: 'Fencing',
    'Figure skating': 'Figure skating',
    Films: 'Films',
    Fishing: 'Fishing',
    Fitness: 'Fitness',
    Food: 'Food',
    Football: 'Football',
    Gardening: 'Gardening',
    Golf: 'Golf',
    Gymnastics: 'Gymnastics',
    Hair: 'Hair',
    Handball: 'Handball',
    Hiking: 'Hiking',
    History: 'History',
    'Home improvement': 'Home improvement',
    'Horse racing': 'Horse racing',
    'Ice hockey': 'Ice hockey',
    Judo: 'Judo',
    Karaoke: 'Karaoke',
    Kayaking: 'Kayaking',
    Kickboxing: 'Kickboxing',
    'Kung fu': 'Kung fu',
    Lacrosse: 'Lacrosse',
    'Live music': 'Live music',
    'Live sports': 'Live sports',
    'Local culture': 'Local culture',
    Luge: 'Luge',
    'Make-up': 'Make-up',
    Meditation: 'Meditation',
    'Motor sports': 'Motor sports',
    Museums: 'Museums',
    Netball: 'Netball',
    Nightlife: 'Nightlife',
    Outdoors: 'Outdoors',
    Padel: 'Padel',
    Pentathlon: 'Pentathlon',
    Photography: 'Photography',
    Pickleball: 'Pickleball',
    Plants: 'Plants',
    'Playing music': 'Playing music',
    Podcasts: 'Podcasts',
    Poker: 'Poker',
    Polo: 'Polo',
    Puzzles: 'Puzzles',
    Racquetball: 'Racquetball',
    Reading: 'Reading',
    Rodeo: 'Rodeo',
    'Roller skating': 'Roller skating',
    Rowing: 'Rowing',
    Rugby: 'Rugby',
    Running: 'Running',
    Sailing: 'Sailing',
    'Self-care': 'Self-care',
    'Shooting sports': 'Shooting sports',
    Shopping: 'Shopping',
    Singing: 'Singing',
    Skateboarding: 'Skateboarding',
    Skiing: 'Skiing',
    Snorkeling: 'Snorkeling',
    Snowboarding: 'Snowboarding',
    'Social activism': 'Social activism',
    Spa: 'Spa',
    Squash: 'Squash',
    'Sumo wrestling': 'Sumo wrestling',
    Surfing: 'Surfing',
    Sustainability: 'Sustainability',
    Swimming: 'Swimming',
    'Table tennis': 'Table tennis',
    Taekwondo: 'Taekwondo',
    'Tai chi': 'Tai chi',
    Technology: 'Technology',
    Tennis: 'Tennis',
    Theater: 'Theater',
    'Track and field': 'Track and field',
    Travel: 'Travel',
    TV: 'TV',
    'Ultimate frisbee': 'Ultimate frisbee',
    'Video games': 'Video games',
    Volleyball: 'Volleyball',
    Volunteering: 'Volunteering',
    Walking: 'Walking',
    'Water polo': 'Water polo',
    'Water sports': 'Water sports',
    Weightlifting: 'Weightlifting',
    Wine: 'Wine',
    Wrestling: 'Wrestling',
    Writing: 'Writing',
    Yoga: 'Yoga',
  },
  supportPage: {
    pageTitle: 'Support - Hospédate Bolivia',
    title: {
      doubts: 'Questions?',
      weAnswer: 'We answer them all',
    },
    tabs: {
      host: 'Host',
      guest: 'Guest',
    },
    faq: {
      guest: [
        {
          question: 'How can I pay for my reservation?',
          answer: `With debit/credit card and QR Simple. Everything is 
processed securely through authorized gateways.`,
        },
        {
          question:
            'What benefits do I have when booking on Hospédate Bolivia?',
          answer: `- Payments in national currency. <br>
- More local properties available. <br>
- Direct WhatsApp support.`,
        },
        {
          question: 'What happens if I need to cancel a reservation?',
          answer: `The refund depends on the host's cancellation policy: <br>
- Flexible: up to 24 h before. <br>
- Moderate: up to 5 days before. <br>
- Firm: up to 30 days before. <br>
- Strict: up to 14 days before. <br>
Always deducting third-party costs (gateways, banks, etc.).`,
        },
        {
          question:
            'How can I contact technical support to resolve my questions?',
          answer: `To contact technical support and resolve your questions, 
        you can send us a message or call us directly 
        through WhatsApp for faster assistance. 
        Simply send your inquiry to the number 
        <a href="https://wa.me/59175321619" target="_blank" 
           class="text-success font-semibold underline">
           +591 75321619
        </a> and we will respond as soon as possible.`,
        },
      ],
      host: [
        {
          question: 'What is Hospédate Bolivia?',
          answer: `It is a short-term rental platform by nights, that 
connects hosts with guests, acting as a digital intermediary. 
It does not own, manage or rent properties.`,
        },
        {
          question: 'What commission does Hospédate Bolivia charge?',
          answer: `3% to the host (automatically deducted from each confirmed reservation).<br>
Launch benefit: the first 100 registered hosts will have 
0% commission for 3 months`,
        },
        {
          question: 'How and when do I receive my payments?',
          answer: `The net payment is transferred to your registered bank account 24 hours 
after check-in, on business days. If the guest checks in on a Friday, the payment will be processed on Monday.`,
        },
        {
          question: 'What obligations do I have as a host?',
          answer: `- Guarantee access, cleanliness and basic services. <br>
- Handle incidents directly with the guest. <br>
- Comply with safety and habitability standards.`,
        },
        {
          question: 'What is the Protection Fund?',
          answer: `It is a free backup funded by Hospédate Bolivia that covers mild 
or moderate accidental damage (furniture, appliances, bedding). <br>
Requirements: minimum 3 completed stays, check-in/out with photos and claim 
within 48 h.`,
        },
        {
          question: 'What happens if I need to cancel a reservation?',
          answer: `You can do it, but the guest has the right to a refund according to the 
cancellation policy you chose (Flexible, Moderate, Firm or Strict). 
Additionally, your listing may receive sanctions or suspension.`,
        },
        {
          question: 'Do I have to pay taxes on my income?',
          answer: `Rental income is your exclusive fiscal responsibility. 
Hospédate only invoices its commission.`,
        },
        {
          question:
            'How can I contact technical support to resolve my questions?',
          answer: `To contact technical support and resolve your questions, 
        you can send us a message or call us directly 
        through WhatsApp for faster assistance. 
        Simply send your inquiry to the number 
        <a href="https://wa.me/59175321619" target="_blank" 
           class="text-success font-semibold underline">
           +591 75321619
        </a> and we will respond as soon as possible.`,
        },
      ],
    },
  },

  languages: {
    English: 'English',
    Afrikaans: 'Afrikaans',
    Albanian: 'Albanian',
    'American Sign Language': 'American Sign Language',
    Arabic: 'Arabic',
    Armenian: 'Armenian',
    Azerbaijani: 'Azerbaijani',
    Basque: 'Basque',
    Belarusian: 'Belarusian',
    Bengali: 'Bengali',
    Bosnian: 'Bosnian',
    'Brazilian Sign Language': 'Brazilian Sign Language',
    'British Sign Language': 'British Sign Language',
    Bulgarian: 'Bulgarian',
    Burmese: 'Burmese',
    Catalan: 'Catalan',
    Chinese: 'Chinese',
    Croatian: 'Croatian',
    Czech: 'Czech',
    Danish: 'Danish',
    Dutch: 'Dutch',
    Estonian: 'Estonian',
    Filipino: 'Filipino',
    Finnish: 'Finnish',
    French: 'French',
    'French Sign Language': 'French Sign Language',
    Galician: 'Galician',
    Georgian: 'Georgian',
    German: 'German',
    Greek: 'Greek',
    Gujarati: 'Gujarati',
    Haitian: 'Haitian',
    Hebrew: 'Hebrew',
    Hindi: 'Hindi',
    Hungarian: 'Hungarian',
    Icelandic: 'Icelandic',
    Indonesian: 'Indonesian',
    Irish: 'Irish',
    Italian: 'Italian',
    Japanese: 'Japanese',
    Kannada: 'Kannada',
    Khmer: 'Khmer',
    Korean: 'Korean',
    Kyrgiz: 'Kyrgiz',
    Lao: 'Lao',
    Latvian: 'Latvian',
    Lithuanian: 'Lithuanian',
    Macedonian: 'Macedonian',
    Malay: 'Malay',
    Maltese: 'Maltese',
    Marathi: 'Marathi',
    Norwegian: 'Norwegian',
    Persian: 'Persian',
    Polish: 'Polish',
    Portuguese: 'Portuguese',
    Punjabi: 'Punjabi',
    Romanian: 'Romanian',
    Russian: 'Russian',
    Serbian: 'Serbian',
    'Sign Language': 'Sign Language',
    Slovak: 'Slovak',
    Slovenian: 'Slovenian',
    Spanish: 'Spanish',
    'Spanish Sign Language': 'Spanish Sign Language',
    Swahili: 'Swahili',
    Swedish: 'Swedish',
    Tagalog: 'Tagalog',
    Tamil: 'Tamil',
    Telugu: 'Telugu',
    Thai: 'Thai',
    Turkish: 'Turkish',
    Ukrainian: 'Ukrainian',
    Urdu: 'Urdu',
    Vietnamese: 'Vietnamese',
    Xhosa: 'Xhosa',
    Zulu: 'Zulu',
  },
};

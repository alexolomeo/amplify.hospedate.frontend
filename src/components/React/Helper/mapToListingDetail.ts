// import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
// import type { ListingDetail } from '@/types/listing/listing';

// export function mapToListingDetail(values: ListingEditorValues, listingId: number): ListingDetail {
//   const yp = values?.yourPlace ?? {};

//   return {
//     id: listingId,
//     title: yp.titleSection?.listingTitle ?? 'Sin título',
//     description: yp.descriptionSection?.generalDescription?.listingDescription ?? '',

//     host: {
//       id: 1,
//       username: 'Host demo',
//       score: 4.8,
//       profilePicture: {
//         original: 'string',
//         srcsetWebp: "string",
//         srcsetAvif: 'string',
//       },
//       responseRate: '',
//       responseTime: '',
//       becameHostAt: '',
//       isSuperHost: false
//     },

//     location: {
//       country: yp.locationSection?.locationData?.country?.value ?? '',
//       state: yp.locationSection?.locationData?.country?.value ?? '',
//       city: yp.locationSection?.locationData?.city ?? '',
//       address: yp.locationSection?.locationData?.address ?? '',
//       apt: yp.locationSection?.locationData?.apartmentNumber ?? '',
//       coordinates: {
//         latitude: yp.locationSection?.locationData?.coordinates?.latitude ?? 0,
//         longitude: yp.locationSection?.locationData?.coordinates?.longitude ?? 0,
//       },
//     },

//     amenities: (yp.amenitiesSection?.amenities?.values ?? []).map((id: number) => ({
//       id,
//       name: `Amenity ${id}`,
//     })),

//     spaces: yp.gallerySection?.spaces ?? [],

//     pricing: {
//       total: yp.pricesSection?.perNight?.price ?? 0,
//       subtotalBeforeServiceFee: 0,
//       subtotal: 0,
//       currency: '',
//       serviceFee: 0,
//       weeklyDiscountAmount: 0,
//       monthlyDiscountAmount: 0
//     },

//     rating: undefined, // ⚠️ no viene en JSON
//     reviews: undefined, // ⚠️ no viene en JSON

//     houseRules: {
//       checkInStartTime: yp.houseRulesSection?.checkInOut?.checkInStartTime?.value ?? 15,
//       checkInEndTime: yp.houseRulesSection?.checkInOut?.checkInEndTime?.value ?? 22,
//       checkoutTime: yp.houseRulesSection?.checkInOut?.checkoutTime?.value ?? 11,
//       guestNumber: yp.houseRulesSection?.permissions?.guestNumber ?? yp.peopleNumberSection?.peopleNumber ?? 1,
//       petsAllowed: yp.houseRulesSection?.permissions?.petsAllowed ?? false,
//       eventsAllowed: yp.houseRulesSection?.permissions?.eventsAllowed ?? false,
//       smokingAllowed: yp.houseRulesSection?.permissions?.smokingAllowed ?? false,
//       commercialPhotographyAllowed: yp.houseRulesSection?.permissions?.commercialPhotographyAllowed ?? false,
//     },

//     safetyProperty: yp.guestSecuritySection ?? {},

//     placeInfo: {
//       placeType: 'Departamento', // ⚠️ default
//       guestNumber: yp.peopleNumberSection?.peopleNumber ?? 1,
//       roomNumber: yp.gallerySection?.placeInfo?.roomNumber ?? 0,
//       bedNumber: yp.gallerySection?.placeInfo?.bedNumber ?? 0,
//       bathNumber: yp.gallerySection?.placeInfo?.bathNumber ?? 0,
//     },

//     showSpecificLocation: yp.locationSection?.displaySpecificLocation ?? false,
//     wishlisted: false, // ⚠️ no viene en JSON
//     calendar: yp.calendar ?? {},
//   };
// }

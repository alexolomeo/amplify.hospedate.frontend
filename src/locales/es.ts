export default {
  common: {
    close: 'Cerrar',
    mobile: 'Celular',
    save: 'Guardar',
    cancel: 'Cancelar',
    back: 'Atrás',
    ok: 'Aceptar',
    error: 'Error',
    deleting: 'Eliminando…',
    noImageAvailable: 'No hay imagen disponible',
    loading: 'Cargando…',
    saving: 'Guardando…',
    goHome: 'Ir al inicio',
    unexpectedError: 'Ha ocurrido un error.',
  },
  dateUtils: {
    fromToday: 'desde hoy',
  },
  paymentMethod: {
    pageTitles: '¿Cómo quieres pagar?',
    nit: 'Nit',
    business: 'Nombre o razón social',
    bookListing: 'Reservar anuncio',
    cannotBookYourOwnListing: 'No puedes reservar tu propio anuncio',
    validation: {
      required: 'Este campo es requerido',
      nitDigits: 'El NIT debe tener entre 5 y 15 dígitos',
      nameShort: 'Debe tener al menos 2 caracteres',
    },
    titleQr: 'Pago con QR',
    titleCard: 'Pago con Tarjeta',
    paymentQr: 'Paga con QR',
    billingInfo: 'Datos de facturación',
    generateQr: 'Generar QR',
    paymentSecurity: 'Pagos seguros',
    qrResult: 'Paga mediante qr',
    downloadQr: 'Descargar QR',
    instructions: 'Escanea el código QR y realiza el pago correspondiente.',
    instructionsTitle:
      'Si el pago es correcto, el QR se reemplazará por un check de pagado.',
    instructionsText:
      'El botón de "Finalizar reserva" al final de la página se activará y podrás ir a tu página de reservado.',
    complete: '¡Tu pago ha sido confirmado!',
    completeBooking: 'Ve abajo y finaliza tu reserva tocando el botón ',
    completeReserve: '"Reserva"',
  },
  earnings: {
    registerTitle: 'Tu cuenta bancaria',
    registerDescription:
      'Agrega una cuenta bancaria para que puedas recibir tus cobros como anfitrión.',
    setUp: 'Configurar',
    delete: 'Eliminar Cuenta',
    deleting: 'Error al eliminar',
    financialInstitution: 'Institución financiera',
    bank: 'Banco de Crédito',
    accountType: 'Tipo de cuenta',
    accountNumber: 'Número de cuenta',
    holderName: 'Nombre de titular',
    alias: 'Guarda tu cuenta con un alias',
    addedSuccess: 'Tu cuenta bancaria ha sido agregada con éxito.',
    confirmDelete: '¿Quieres eliminar tu cuenta bancaria?',
    accountAlias: 'Alias de la cuenta',
    accountLast4Digits: 'Últimos 4 dígitos de la cuenta',
    accountTypes: {
      SAVING: 'Caja de ahorro',
      CHECKING: 'Cuenta corriente',
    },
    deleteAccountTitle: '¿Estás seguro de querer eliminar tu cuenta bancaria?',
    deleteAccountDescription:
      'Esta acción ya no tendrá retorno. Podrás agregar otra cuenta bancaria en cualquier momento.',
    cancel: 'Volver Atrás',
    addBankAccount: 'Agrega tu cuenta bancaria',
  },
  booking: {
    pageTitles: {
      dashboard: 'Reserva',
      title: 'Sobre tu viaje',
    },
    error: {
      reservationPayment:
        'No pudimos crear tu reserva. Por favor, inténtalo de nuevo más tarde.',
      loadData:
        'No pudimos cargar la información. Por favor, inténtalo de nuevo más tarde.',
    },
    policy: {
      title: 'Politica de Cancelacion',
      pendingTitle: 'Confirmación de Reserva Pendiente',
      hostAcceptance:
        'Tu reserva quedará confirmada solo cuando el anfitrión la acepte (máx. 24h).',
      notification:
        'Te avisaremos por correo y en la app en cuanto se confirme.',
      payment: 'Para finalizar, podrás pagar con QR o tarjeta.',
      acceptancePolicy:
        'Al pulsar el botón a continuación, acepto las siguientes políticas: Normas del anfitrión, Reglas básicas para los huéspedes, Política de reembolso y asistencia para modificaciones en la reserva de Hospédate.',
      acceptance: 'También acepto los ',
      terms: 'Términos y Condiciones de Uso',
      privacy: 'Política de Privacidad',
      goToReservation: 'Ir a la reserva',
      starReservation: 'Antes de confirmar tu reserva',
    },
    success: {
      stayWith: 'Hospédate con',
      total: 'Total',
      viewDetails: 'Puedes ver los detalles del viaje aquí',
      goToMyTrips: 'Ir a mis viajes',
      reservationConfirmed: '¡Tu reservación ha sido confirmada!',
      confirmationEmailSent: 'Te hemos enviado la confirmación a tu correo',
      talkToHost: 'Habla con tu anfitrión',
      reservationCode: 'Código de reserva',
    },
    details: {
      dates: 'Fechas',
      total: 'Total',
      guests: 'Huéspedes',
      tripDetails: 'Detalles del viaje',
      priceInformation: 'Información de precios',
      address: '{location}',
      reviews: 'Reseñas',
      change: 'Cambiar',
      guestsWith: 'Huéspedes con {name}',
      edit: 'Editar',
      currency: 'Bs.',
      pricePerNight: 'Precio por noche',
      priceDetails: {
        title: 'Detalles del precio',
        nights: '{count} noches',
        weeklyDiscountLabel: 'Descuento por estadía semanal',
        monthlyDiscountLabel: 'Descuento por estadía mensual',
        priceAfterDiscount: 'Precio después del descuento',
        totalPrice: 'Precio total',
        serviceFee: 'Tarifa de servicio',
      },
      discountTime: '{discountTime}',
      message: 'Déjale un mensaje al anfitrión',
      messageDescription:
        'Antes de seguir, ¿podrías compartirle a {name} un poco más sobre tu experiencia y por qué crees que su alojamiento es una excelente elección?',
      cancellationText:
        'Si cancelas la reservación antes del {date}, recibirás un reembolso total.', // Coma tras la condición
      messagePlaceholder:
        'Ejemplo: “Hola {name}, queremos alquilar este lugar porque nos importa mucho estar cerca del centro”.',
    },
    verify: {
      title: 'Primero verifícate',
      description:
        'Para poder reservar la propiedad, es esencial que verifiques tu identidad. Este paso asegura que todos los usuarios de Hospédate sean personas verificadas.',
      button: 'Verifícame ahora',
    },
  },

  hosting: {
    pageTitles: {
      dashboard: 'Panel de anfitrión',
      listings: 'Mis anuncios',
      reservations: 'Reservas',
      messages: 'Mensajes',
      insights: 'Estadísticas',
      earnings: 'Ganancias',
      calendar: 'Calendario',
    },
  },

  checkInMethodsOptions: {
    SMART_LOCK: 'Cerradura inteligente',
    KEYPAD_LOCK: 'Cerradura con teclado',
    LOCK_BOX: 'Caja de seguridad con llave',
    BUILDING_STAFF: 'Personal del edificio',
    IN_PERSON: 'Encuentro en persona',
    OTHER: 'Otro',
  },

  guestSafety: {
    items: {
      // safetyDevices
      carbonMonoxideDetector: {
        true: 'Detector de monóxido de carbono instalado',
        false: 'No hay detector de monóxido de carbono',
      },
      smokeDetector: {
        true: 'Detector de humo instalado',
        false: 'No hay detector de humo',
      },
      noiseMonitor: {
        true: 'Monitor de ruido instalado',
        false: 'No hay monitor de ruido',
      },
      surveillance: {
        true: 'Cámaras o vigilancia en la propiedad',
        false: 'No hay cámaras ni vigilancia',
      },

      // propertyInformation
      hasPets: {
        true: 'Hay mascotas de los dueños en la propiedad',
        false: 'No hay mascotas de los dueños en la propiedad',
      },
      limitedAmenities: {
        true: 'Amenidades limitadas',
        false: 'No hay amenidades limitadas',
      },
      limitedParking: {
        true: 'Estacionamiento limitado',
        false: 'No hay estacionamiento limitado',
      },
      potentialNoise: {
        true: 'Puede haber ruido',
        false: 'No hay ruido potencial',
      },
      requiresStairs: {
        true: 'Se requieren escaleras',
        false: 'No se requieren escaleras',
      },
      sharedSpaces: {
        true: 'Espacios compartidos',
        false: 'No hay espacios compartidos',
      },
      weapons: {
        true: 'Hay armas en la propiedad',
        false: 'No hay armas en la propiedad',
      },

      // safetyConsiderations
      animals: {
        true: 'Puede haber animales en o cerca de la propiedad',
        false: 'No hay animales',
      },
      climbingOrPlayStructure: {
        true: 'Estructuras para trepar o jugar',
        false: 'No hay estructuras para trepar o jugar',
      },
      heightsWithNoFence: {
        true: 'Alturas sin baranda o cerramiento',
        false: 'No hay alturas sin baranda',
      },
      lakeOrRiverOrWaterBody: {
        true: 'Cerca de lago, río u otro cuerpo de agua',
        false: 'No hay cuerpos de agua cercanos',
      },
      poolOrJacuzziWithNoFence: {
        true: 'Piscina o jacuzzi sin cercado',
        false: 'No hay piscina o jacuzzi sin cercado',
      },
      noChildrenAllowed: {
        true: 'No se permiten niños',
        false: 'Se permiten niños',
      },
      noInfantsAllowed: {
        true: 'No se permiten bebés',
        false: 'Se permiten bebés',
      },
    },
  },

  more: '  · · · más',

  houseRules: {
    checkIn: 'El check-in es a partir de las {start} a las {end}',
    checkOut: 'El check-out es hasta las {time}',
    quietHours: 'Horas de silencio desde {start} hasta {end}',
    petsNotAllowed: 'Mascotas no permitidas',
    petsAllowedMax: 'Mascotas permitidas, máximo {count}',
    petsAllowed: 'Mascotas permitidas',
    smokingAllowed: 'Fumar está permitido',
    smokingNotAllowed: 'Fumar no está permitido',
  },

  price: {
    perNight: '{amount} por noche',
    perWeekend: '{amount} por fin de semana',
    weeklyDiscount: 'Descuento semanal {percent}%',
    monthlyDiscount: 'Descuento mensual {percent}%',
  },

  hostContent: {
    account: {
      title: 'Configuración de la cuenta',
      greeting: 'Hola {name}',
      goToProfile: 'Ir a mi perfil',
      personalInfoTitle: 'Información personal',
      personalInfoDesc:
        'Comparte tus datos personales y cuéntanos cómo podemos contactarte.',
      securityTitle: 'Inicio de sesión y seguridad',
      securityDesc: 'Cambia tu contraseña y asegura tu cuenta.',
      paymentsTitle: 'Cobros',
      paymentsDesc: 'Verifica los ingresos, cupones y tarjetas de regalo.',
      taxesTitle: 'Impuestos',
      taxesDesc:
        'Gestiona la información y los documentos fiscales de los contribuyentes.',
    },
    listingState: {
      listingStatus: 'Estado del anuncio',
      unPublished: 'Oculto',
      verifyAccountToPublish:
        'Para poder publicar tu anuncio, tienes que verificar tu cuenta',
      verifyAccount: 'Verificar tu cuenta',
      reviewingListing:
        'Nuestro equipo está revisando tu anuncio para asegurarse de que cumple con nuestros estándares de calidad y seguridad. ',
      notifyStatus: 'Te notificaremos sobre el estado de tu publicación',
      approvedListing: 'Tu anuncio fue aprobado, en menos de',
      publishIn24h: '24 horas estará publicado ',
      automatically: 'automáticamente',

      visibleAndBookable:
        'Tu anuncio se mostrará en los resultados de búsqueda, permitiendo que los huéspedes realicen reservas.',
      hiddenAndUnavailable:
        'Tu anuncio no aparecerá en los resultados de búsqueda ni estará disponible para reservas. Puedes elegir fechas para pausarlo.',
      reviewChanges: 'Revisar cambios',
      reviewChangesMessage:
        'Necesitamos que hagas algunos cambios necesarios en tu anuncio',
      requiredChanges: 'Cambios requeridos',
    },
    listingReasons: {
      groups: {
        titleModal:
          '¿Podrías contarnos porqué ya no quieres dejar publicado tu anuncio en Hospédate?',
        ctaLabel: 'Desactivar anuncio',
        DUPLICATE_LISTING: 'Anuncio duplicado',
        I_EXPECTED_TO_EARN_MORE: 'Esperaba ganar más dinero',
        I_EXPECTED_MORE: 'Esperaba ganar más',
        LOCK_RESERVATIONS_FOR_NOW: 'No puedo anfitrionar en este momento',
        I_CAN_NOT_RECEIVE_GUESTS: 'Ya no puedo recibir huéspedes',
        I_EXPECTED_POLITE_GUESTS: 'No puedo anfitrionar en este momento',
        DEFAULT: 'Otros motivos',
      },
    },
    listings: {
      title: 'Tus anuncios',
      viewList: 'Ver en lista',
      viewGrid: 'Ver en tarjetas',
      searchPlaceholder: 'Buscar por título o ubicación',
      emptyTitle: 'Aún no tienes anuncios.',
      emptyDescription:
        'Crea tu primer anuncio para comenzar a recibir huéspedes.',
      addListing: 'Agregar anuncio',
      noResults: 'No se encontraron anuncios que coincidan con tu búsqueda.',
      clear: 'Limpiar búsqueda',
      table: {
        title: 'Título',
        type: 'Tipo',
        location: 'Ubicación',
        createdAt: 'Fecha',
        status: 'Estado',
        noInformation: 'Sin información',
        noTitle: 'Sin título',
        actions: 'Acciones',
        view: 'Ver',
        address: 'Editar direccion',
      },
      status: {
        PUBLISHED: 'Publicado',
        CHANGES_REQUESTED: 'Cambios requeridos',
        IN_PROGRESS: 'En borrador',
        UNLISTED: 'Oculto',
        APPROVED: 'Aprobado',
        PENDING_APPROVAL: 'En revisión',
        BLOCKED: 'Bloqueado',
      },
    },
    editListing: {
      preview: {
        placeholders: {
          title: 'Sin título',
          photoGallery: 'Sin detalles de habitaciones/baños',
          propertyType: 'Tipo de propiedad no seleccionado',
          price: 'Sin precios configurados',
          availability: 'Configura la disponibilidad',
          capacity: 'Número de huéspedes no definido',
          description: 'Sin descripción',
          amenities: 'Sin servicios seleccionados',
          address: 'Dirección no disponible',
          booking: 'Tipo de reserva no configurado',
          houseRules: 'No se han definido reglas de la casa',
          guestSafety: 'No se han agregado elementos de seguridad',
          cancellation: 'Política de cancelación no seleccionada',
          customLink: 'Sin enlace personalizado',
        },
      },
      commonMessages: {
        failedFetch:
          'No se pudo cargar la información necesaria, inténtalo de nuevo.',
        notFound:
          'No pudimos encontrar este anuncio. Verifica el enlace o vuelve a tu listado de anuncios.',
        retry: 'Reintentar',
        goBack: 'Volver a mis anuncios',
        saveSuccess: 'Cambios realizados exitosamente.',
        saveError: 'No hemos podido realizar los cambios.',
        unpublishedSuccess:
          'Tu anuncio ha sido ocultado. No aparecerá en búsquedas ni aceptará nuevas reservas. Las reservas en curso siguen vigentes.',
        unpublishedError:
          'No pudimos despublicar el anuncio. Intenta nuevamente en unos minutos.',
        publishSuccess:
          'Tu anuncio fue publicado y ahora es visible en búsquedas. Ya puede recibir nuevas reservas.',
        publishError:
          'No pudimos publicar el anuncio. Intenta nuevamente en unos minutos.',
        publishMinPhotosRequired:
          'Para publicar tu anuncio, debes tener al menos {min} fotos.',
      },
      sidebar: {
        title: 'Edita tu espacio',
        view: 'Ver',
        tab: {
          place: 'Tu lugar',
          guide: 'Guía de llegada',
        },
        statusUnavailable: 'Estado no disponible',
        optionsAriaLabel: 'Opciones',
        backAriaLabel: 'Volver',
        stepTitle: 'Paso',
        stepDescription: 'Descripción del paso',
        stepLabel: 'Paso',
        arrivalSteps: {
          'check-in-out': 'Check-in / Check-out',
          directions: 'Indicaciones',
          'check-in-method': 'Método de check-in',
        },
        stepDisplayNames: {
          overview: 'Resumen',
          'photo-gallery': 'Tu galería de fotos',
          title: 'Título',
          address: 'Ubicación',
          'edit-profile': 'Sobre el anfitrión',
          'property-type': 'Tipo de propiedad',
          price: 'Precio',
          availability: 'Disponibilidad',
          capacity: 'Capacidad',
          description: 'Descripción',
          amenities: 'Comodidades',
          booking: 'Configuración de las reservaciones',
          'house-rules': 'Reglas de la casa',
          'guest-safety': 'Seguridad del Huésped',
          'cancellation-policy': 'Políticas de Cancelación',
          'custom-link': 'Enlace Personalizado',
          preview: 'Vista previa',
          'request-changes': 'Solicitar cambios',
        },
        preferenceSteps: {
          'listing-state': 'Estado de anuncio',
          'traveler-requirements': 'Requisitos para los viajeros',
          'local-legislation': 'Legislación local',
          taxes: 'Impuestos',
          'delete-listing': 'Eliminar anuncio',
        },
        subTextPlace: {
          'photo-gallery': '1 habitación • 1 cama • 1 baño',
          title: 'Increíble departamento en Equipetrol',
          'property-type': 'Departamento',
          price: [
            {
              key: 'perNight',
              label: 'Bs 450 por noche',
            },
            {
              key: 'weekly',
              label: 'Descuento semanal 10%',
            },
            {
              key: 'monthly',
              label: 'Descuento mensual 20%',
            },
          ],
          availability: [
            {
              key: 'min-max-days',
              label: 'Estadías de 1 a 365 días',
            },
            {
              key: 'same-day-notice',
              label: 'Preaviso para el mismo día',
            },
          ],
          capacity: '8 huéspedes',
          description:
            'Siéntete cómodo en casa y disfruta de un montón de anuncio en este gran depa.',
          amenities: [
            { key: 'kitchen', label: 'Cocina' },
            { key: 'tv', label: 'TV' },
            { key: 'wifi', label: 'Wifi' },
            {
              key: 'more',
              label: '  · · ·   más',
            },
          ],
          address: 'C.Capuri 0, Santa Cruz de la Sierra, Bolivia',
          'edit-profile': 'Empezó a anfitrionar en 2025',
          booking: 'Uso de reservación inmediata activado',
          'house-rules': [
            { key: 'checkin', label: 'El check-in es a partir de las 3:00 pm' },
            { key: 'guests', label: '8 huéspedes' },
          ],
          'guest-safety': [
            {
              key: 'co',
              label: 'No consta que tenga detector de monóxido de carbono',
            },
            { key: 'smoke', label: '8 No consta que tenga detector de humo' },
          ],
          'cancellation-policy': 'Flexible',
          'custom-link': 'Agrega información',
        },
        name: {
          profileName: 'Juan Guzmán',
        },
        subTextArribals: {
          'check-in-out': 'Flexible-19:00pm',
          directions: 'Agrega información',
          'check-in-method': 'Cerradura inteligente',
        },
        subPreferences: {
          'listing-state': 'Estado de anuncio',
          'delete-listing': 'Eliminar anuncio',
        },
        requestChanges: {
          requestChangesTitle: 'Observamos problemas en tu anuncio',
          requestChangesBadge: 'Cambios requeridos',
          identityTitle:
            'Necesitamos que verifiques tu identidad para publicar tu anuncio',
          identityBadge: 'Verificar tu identidad',
        },
      },
      content: {
        editModeBanner: {
          visitMode: {
            strong: 'Estás en modo visita.',
            rest: 'No podrás editar la información del anuncio hasta que se apruebe.',
            restApproved:
              'No podrás editar la información del anuncio hasta que realices las acciones necesarias.',
          },
        },
        noContentText:
          'Selecciona un elemento de la lista\npara editar tu espacio',
        changesRequested: {
          title:
            'Necesitamos que hagas algunos cambios necesarios en tu anuncio',
          noteLabel: 'Nota:',
          noteText:
            'Al finalizar estos cambios, vuelve a publicar tu anuncio para que lo volvamos a revisar.',
          verificationRequired: 'Verificación requerida',
          step: 'Paso',
          dniVerification:
            'Confirma tu cuenta utilizando tu documento de identidad.',
          verifyAccount: 'Verificar cuenta',
          changes: 'Cambios requeridos',
          titleDescription:
            'Hemos identificado los siguientes cambios necesarios para tu anuncio. Por favor, realiza las modificaciones pertinentes.',
          labelDescription: 'Estos son los cambios que vimos pertinentes:',
          publishAgain: 'Publicar nuevamente',
          finalNote:
            'Al finalizar estos cambios, dale click al botón "Mandar a revisión" para que volvamos a revisar tu anuncio.',
        },
        editTitle: {
          stepTitle: 'Título de tu anuncio',
          placeholder: 'Departamento increíble en Equipetrol',
          validation: {
            required: 'El título es obligatorio.',
            maxLength: 'El título no puede superar los 50 caracteres.',
          },
        },
        manyGuests: '{num} personas',
        editCapacity: {
          stepTitle: 'Número de personas',
          options: [
            '1 persona',
            '2 personas',
            '3 personas',
            '4 personas',
            '5 personas',
            '6 personas',
            '7 personas',
            '8 personas',
            '9 personas',
            '10 personas',
            '11 personas',
            '12 personas',
            '13 personas',
            '14 personas',
            '15 personas',
            '16 personas',
          ],
          validation: {
            required: 'Selecciona el número de personas.',
            min: 'Debe ser al menos 1 persona.',
            max: 'No puede superar el máximo permitido.',
          },
        },
        editPropertyType: {
          stepTitle: 'Tipo de propiedad',
          descriptionLabel: '¿Cómo describes tu vivienda?',
          descriptionPlaceholder: 'Selecciona tipo',
          propertyTypeLabel: 'Tipo de propiedad',
          propertyTypePlaceholder: 'Selecciona tipo',
          floorsLabel: '¿Cuántos pisos tiene tu vivienda?',
          yearBuiltLabel: 'Año de construcción',
          yearBuiltPlaceholder: 'Ej. 2015',
          sizeLabel: 'Tamaño de la vivienda',
          sizePlaceholder: 'Ej. 200',
          sizeUnitPlaceholder: 'Unidad de vivienda',
          validation: {
            requiredGroup: 'Selecciona un grupo de propiedad',
            requiredType: 'Selecciona un tipo de propiedad',
            floorsMin: 'Debe ser al menos 1',
            floorsMax: 'No puede ser mayor a 300',
            yearRange: 'Año inválido',
            sizePositive: 'Debe ser mayor a 0',
            sizeMaxTwoDecimals: 'Máximo 2 decimales',
            sizeMaxIntegerDigits: 'Máximo 9 dígitos enteros',
            unitRequired: 'Selecciona la unidad',
            sizeRequiredIfUnit: 'Ingresa un tamaño para esa unidad',
          },
          groups: {
            APARTMENT: 'Departamento',
            HOUSE: 'Casa',
            SECONDARY_UNIT: 'Unidad secundaria',
            UNIQUE_SPACE: 'Espacio único',
            BED_AND_BREAKFAST: 'Bed & Breakfast',
            BOUTIQUE_HOTEL: 'Hotel boutique',
          },
          types: {
            RENTAL_UNIT: 'Unidad en alquiler',
            CONDO: 'Condominio',
            SERVICED_APARTMENT: 'Departamento con servicios',
            LOFT: 'Loft',
            HOME: 'Casa',
            TOWNHOUSE: 'Casa adosada',
            BUNGALOW: 'Bungalow',
            CABIN: 'Cabaña',
            CHALET: 'Chalet',
            EARTHEN_HOME: 'Casa de tierra',
            HUT: 'Cabaña rústica',
            LIGHTHOUSE: 'Faro',
            VILLA: 'Villa',
            DOME: 'Domo',
            COTTAGE: 'Cabaña acogedora',
            FARM_STAY: 'Estancia en granja',
            HOUSEBOAT: 'Casa flotante',
            TINY_HOME: 'Mini casa',
            GUESTHOUSE: 'Casa de huéspedes',
            GUEST_SUITE: 'Suite de invitados',
            BOAT: 'Barco',
            CASTLE: 'Castillo',
            CAVE: 'Cueva',
            ICE_DOME: 'Domo de hielo',
            ISLAND: 'Isla',
            PLANE: 'Avión',
            CAMPER_RV: 'Casa rodante',
            TENT: 'Tienda de campaña',
            TIPI: 'Tipi',
            TRAIN: 'Tren',
            TREEHOUSE: 'Casa en el árbol',
            YURT: 'Yurta',
            OTHER: 'Otro',
            BARN: 'Granero',
            CAMPSITE: 'Campamento',
            SHIPPING_CONTAINER: 'Contenedor',
            TOWER: 'Torre',
            RESORT: 'Resort',
            HOTEL: 'Hotel',
            BOUTIQUE_HOTEL: 'Hotel boutique',
            NATURE_LODGE: 'Lodge natural',
            HOSTEL: 'Hostal',
            APARTHOTEL: 'Apartahotel',
            RELIGIOUS_BUILDING: 'Edificio religioso',
            WINDMILL: 'Molino de viento',
            BUS: 'Autobús',
          },
          sizeUnits: {
            SQUARE_FEET: 'Pies cuadrados',
            SQUARE_METERS: 'Metros cuadrados',
          },
        },
        editDescription: {
          stepTitle: 'Descripción',
          charactersAvailable: 'caracteres disponibles',
          spaceSection: {
            title: 'Describe tu espacio',
            label: 'Descripción',
            spaceSection: 'Descripción del espacio',
            placeholder: 'Escribe la descripción aquí',
            validation: {
              required: 'Este campo es obligatorio.',
              max: 'Máximo 500 caracteres.',
            },
          },
          propertySection: {
            title: 'Tu propiedad',
            description:
              'Explaya que hay en tus habitaciones y espacios para que los huéspedes sepan que encontrarán',
            placeholder: 'Escribe la descripción aquí',
            validation: {
              max: 'Máximo 37.500 caracteres.',
            },
          },
          guestExperience: {
            title: 'Experiencia de los huéspedes',
            access: {
              title: 'Acceso a huéspedes',
              description:
                'Redacta sobre las áreas que pueden usar accesibles del anuncio.',
              placeholder: 'Escribe la descripción aquí',
              validation: {
                max: 'Máximo 37.500 caracteres.',
              },
            },
            interaction: {
              title: 'Interacción con los huéspedes',
              description:
                'Explica cómo contactarte para asistencia durante su estancia.',
              placeholder: 'Escribe la descripción aquí',
              validation: {
                max: 'Máximo 37.500 caracteres.',
              },
            },
            highlights: {
              title: 'Otros detalles a destacar',
              description:
                'Agrega información adicional que consideres útil para los viajeros al reservar tu anuncio.',
              placeholder: 'Escribe la descripción aquí',
              validation: {
                max: 'Máximo 37.500 caracteres.',
              },
            },
          },
        },
        editAvailability: {
          stepTitle: 'Disponibilidad',
          description:
            'Configura la duración mínima y máxima, el tiempo de preaviso y si aceptas reservas para el mismo día.',
          stayDuration: {
            title: 'Duración del alojamiento',
            minNights: 'Noches mínimas por reserva',
            maxNights: 'Noches máximas por reserva',
          },
          noticePeriod: {
            title: 'Tiempo de preaviso',
            selectLabel: 'Requiere un preaviso mínimo de:',
            cutoffLabel: 'Hora límite para reservas del mismo día',
            placeholder: 'Selecciona el tiempo de preaviso…',
            cutoffPlaceholder: 'Selecciona la hora límite…',
          },
          sameDayToggleLabel: 'Permitir reservas para el mismo día',
          staysRange: 'Estadías de {min} a {max} días',
          sameDayToggleDescription:
            'Si está activado, los huéspedes podrán reservar el mismo día hasta la hora límite definida.',
          noticeOptions: {
            SAME_DAY: 'Mismo día',
            AT_LEAST_ONE_DAY: 'Al menos 1 día',
            AT_LEAST_TWO_DAYS: 'Al menos 2 días',
            AT_LEAST_THREE_DAYS: 'Al menos 3 días',
            AT_LEAST_SEVEN_DAYS: 'Al menos 7 días',
          },
          validation: {
            min: {
              required: 'El mínimo de noches es obligatorio.',
              atLeast1: 'La estadía mínima debe ser al menos 1 noche.',
              lteMax: 'Tu estadía máxima es de {max} noches.',
            },
            max: {
              required: 'El máximo de noches es obligatorio.',
              gteMin: 'Tu estadía mínima es de {min} noches.',
              lte730:
                'El número máximo de noches debe ser inferior o igual a 730.',
            },
            integerOnly: 'Debe ser un número entero.',
            notice: {
              required: 'Selecciona un tiempo de preaviso.',
              cutoffRequired: 'Selecciona la hora límite para el mismo día.',
            },
          },
        },
        editPrice: {
          stepTitle: 'Precios',
          description:
            'Esta opción se mostrará cada noche, a menos que decidas personalizarla por fecha yendo a tu calendario y seleccionando una fecha en particular.',
          link: 'tocando aquí.',
          nightlyTitle: 'Precio por noche',
          nightlyDescription: 'Precio por noche',
          weekendTitle: 'Precio por fin de semana',
          weekendToggleTitle: 'Precio personalizado para el fin de semana',
          weekendDescription:
            'Establece un precio diferente para fines de semana',
          discountsTitle: 'Descuentos',
          discountsDescription: 'Activa o desactiva los descuentos',
          weekly: 'Semanal',
          weeklyHint: 'Por 7 noches o más',
          monthly: 'Mensual',
          monthlyHint: 'Por 28 noches o más',
          minNightPriceHint: 'Mínimo por noche: 50 Bs',
          discountsRuleHint:
            'El descuento mensual no puede ser menor que el semanal.',
          cannotComputeHint:
            'Ingresa un precio por noche válido para ver los totales con descuento.',
          validation: {
            requiredNight: 'Ingresa un precio por noche.',
            maxNightPriceHint: 'El precio por noche no puede superar 10000.',
            requiredWeekend: 'Ingresa un precio de fin de semana.',
            minWeekendPriceHint:
              'El precio de fin de semana no puede ser menor a 50.',
            maxWeekendPriceHint:
              'El precio de fin de semana no puede superar 10000.',
            integerOnly: 'Usa solo números enteros.',
          },
        },
        booking: {
          title: 'Configuración de reservaciones',
          instantBooking: 'Reservación inmediata',
          instantBookingDescription:
            'Permite que los huéspedes reserven automáticamente. Suele ayudar a conseguir más reservas.',
          addCustomMessage:
            'Agrega un mensaje personalizado para que los huéspedes lo lean antes de reservar',
          writeDescriptionHere: 'Escribe la descripción aquí',
          approveAllReservations: 'Aprueba todas las reservas',
          approveAllReservationsDescription:
            'Revisa y aprueba cada solicitud de reserva antes de confirmarla.',
          validation: {
            typeRequired: 'Selecciona un tipo de reservación.',
            welcomeMax: 'Máximo 400 caracteres.',
          },
        },
        houseRules: {
          title: 'Reglas de la casa',
          description:
            'Se requiere que los huéspedes sigan las normas, de lo contrario, podríamos expulsarlos de Hospédate.',
          placeholder: 'Selecciona una opción',
          permissions: {
            title: 'Permisiones',
            petsAllowed: 'Se admiten mascotas',
            petsAllowedDescription:
              'Aunque no se admiten mascotas, se debe permitir que los huéspedes se queden con sus animales de servicio, siempre que sea razonable.',
            maxPetsAllowed: 'Número máximo de mascotas permitidas',
            eventsAllowed: 'Eventos permitidos',
            smokingVapingShishaAllowed:
              'Está permitido fumar, vapear y shishear',
            commercialPhotographyFilmingAllowed:
              'Se permite la fotografía y la filmación de comerciales',
            maxPeopleAllowed: 'Número de personas permitidas',
          },
          quietHours: {
            title: 'Horas de silencio',
            toggleLabel: 'Horas de silencio',
            startTime: 'Hora de inicio',
            endTime: 'Hora de finalización',
          },
          checkInOutHours: {
            title: 'Horas del Check in y Check Out',
            arrivalHour: 'Hora de llegada',
            departureHour: 'Hora de salida',
            startTime: 'Hora de inicio',
            endTime: 'Hora de finalización',
            selectTime: 'Selecciona la hora',
          },
          additionalRules: {
            title: 'Reglas adicionales',
            textAreaPlaceholder: 'Reglas adicionales',
            description:
              'Comparte todo lo que el huésped debería saber de tu vivienda.',
          },
          validation: {
            numPetsMin: 'Debes indicar al menos 1 mascota.',
            numPetsMax: 'No puedes permitir más de 5 mascotas.',
            guestMin: 'Debe ser al menos 1.',
            guestMax: 'No puede ser mayor a 16.',
            quietStartRequired: 'Selecciona la hora de inicio.',
            quietEndRequired: 'Selecciona la hora de finalización.',
            checkinStartRequired: 'Selecciona la hora de inicio del check-in.',
            checkinEndBeforeStart:
              'La hora de fin no puede ser anterior a la de inicio.',
            checkoutRequired: 'Selecciona la hora de check-out.',
            additionalMax: 'Máximo 1000 caracteres.',
            checkinEndRequired: 'Selecciona la hora de fin.',
          },
        },
        guestSafety: {
          modalPlaceholder:
            'Agrega la información que tu huésped necesita saber',
          title: 'Seguridad para el huésped',
          description:
            'La información que proporciones sobre la seguridad se mostrará en tu espacio, junto con detalles como las normas de la casa.',
          addInformation: 'Agregar información',
          editInformation: 'Editar información',
          safetyConsiderations: {
            title: 'Consideraciones de seguridad',
            notGoodForKidsAge2To12: {
              label: 'No es una buena opción para niños de 2 a 12 años',
              description:
                'Esta propiedad tiene características que podrían no ser seguras para niños.',
            },
            notGoodForInfantsUnder2: {
              label: 'No es una buena opción para bebés menores de 2 años',
              description:
                'Esta propiedad tiene características que podrían no ser seguras para bebés o infantes.',
            },
            unfencedPoolOrHotTub: {
              label:
                'La piscina o el jacuzzi no tienen baranda ni puerta con candado',
              description:
                'Los huéspedes tienen acceso a una pisicina o un jacuzzi sin protecciones. Comprueba el reglamento local para saber cuáles son los requisitos específicos.',
            },
            nearBodyOfWater: {
              label: 'Cerca de un cuerpo de agua, como un lago o un río',
              description:
                'Los huéspedes tienen acceso ilimitado a un cuerpo de agua, como el océano, un estanque, un arroyo o un humedal, justo en la propiedad o junto a ella.',
            },
            structuresToClimbOrPlay: {
              label: 'Estructuras para trepar o jugar en la propiedad',
              description:
                'Los huéspedes podrán acceder a estructuras como una zona de juegos, toboganes, hamacas o cuerdas para trepar.',
            },
            unprotectedElevatedAreas: {
              label:
                'Hay zonas elevadas sin baranda ni protección de otro tipo',
              description:
                'Los huéspedes podrán acceder a una zona que tiene más de 76 centímetros de altura, como un balcón, un techo, una terraza o un acantilado, sin baranda u otro tipo de protección.',
            },
            potentiallyDangerousAnimals: {
              label: 'Animales potencialmente peligrosos en la propiedad',
              description:
                'Los huéspedes y sus mascotas estarán cerca de animales, como caballos, pumas o animales de granja, que podrían causar daños.',
            },
          },
          securityDevices: {
            title: 'Dispositivos de seguridad',
            outdoorSecurityCamera: {
              label: 'Hay una cámara de seguridad exterior',
              description:
                'En esta propiedad hay una o más cámaras exteriores que graban o transmiten videos, imágenes o audio. Debes revelarlas si están desactivadas.',
            },
            noiseDecibelMonitor: {
              label: 'Monitor de decibeles de ruido presente',
              description:
                'Hay uno o más dispositivos en esta propiedad que pueden evaluar el nivel de sonido, pero no graban audio.',
            },
            carbonMonoxideDetector: {
              label: 'Detector de monóxido de carbono',
              description:
                'Esta propiedad tiene un detector con alarma que advierte sobre la presencia de monóxido de carbono. Comprueba el reglamento local para saber cuáles son los requisitos específicos.',
            },
            smokeDetector: {
              label: 'Detector de humo',
              description:
                'Esta propiedad tiene un detector con alarma que advierte sobre la presencia de humo y fuego. Comprueba el reglamento local para saber cuáles son los requisitos específicos.',
            },
          },
          propertyInformation: {
            title: 'Información de la propiedad',
            guestsMustClimbStairs: {
              label: 'Los huéspedes tienen que subir escaleras',
              description:
                'Los huéspedes podrían subir y bajar escaleras durante la estadía.',
            },
            noiseDuringStay: {
              label: 'Puede haber ruido durante las estadías',
              description:
                'Los huéspedes podrían esperar escuchar algo de ruido durante la estadía. Por ejemplo, ruido procedente del tráfico, obras o negocios cercanos.',
            },
            petsLiveOnProperty: {
              label: 'Hay mascota(s) que viven en la propiedad',
              description:
                'Es posible que los huéspedes se encuentren con mascotas durante su estadía o interactúen con ellas.',
            },
            noParkingOnProperty: {
              label: 'No hay estacionamiento en la propiedad',
              description:
                'En esta propiedad no hay lugares de estacionamiento exclusivos para los huéspedes.',
            },
            commonAreas: {
              label: 'La propiedad tiene zonas comunes',
              description:
                'Es probable que durante su estadía los huéspedes compartan algunas zonas como la cocina, el baño o el patio con otras personas.',
            },
            limitedBasicServices: {
              label: 'Servicios básicos limitados',
              description:
                'Esta propiedad no incluye algunos elementos básicos. Por ejemplo, wifi, agua corriente o una ducha interior.',
            },
            weaponsPresent: {
              label: 'Presencia de armas en la propiedad',
              description:
                'Hay al menos un arma guardada en esta propiedad. Comprueba el reglamento local para saber cuáles son los requisitos específicos. Recuerda: Hospédate requiere que todas las armas se guarden adecuadamente de forma segura.',
            },
          },
          validation: {
            detailsMax: 'Máximo 300 caracteres.',
          },
        },
        cancellationPolicy: {
          title: 'Política de cancelación',
          standardPolicy: {
            title: 'Política estándar',
            flexible: {
              label: 'Flexible',
              description:
                'Los huéspedes recibirán un reembolso completo si cancelan hasta un día antes del check-in.',
            },
            moderate: {
              label: 'Moderada',
              description:
                'Los huéspedes recibirán un reembolso completo si cancelan hasta 5 días antes del check-in.',
            },
            firm: {
              label: 'Firme',
              description:
                'Los huéspedes recibirán un reembolso completo si cancelan hasta 30 días antes del check-in, excepto en ciertos casos.',
            },
            strict: {
              label: 'Estricta',
              description:
                'Los huéspedes recibirán un reembolso completo si cancelan dentro de las 48 horas posteriores a la reservación y al menos 14 días antes del check-in.',
            },
          },
          longTermPolicy: {
            title: 'Política para estadías largas',
            firm: {
              label: 'Firme',
              description:
                'Reembolso total hasta 30 días antes del check-in. Después de ese plazo, los primeros 30 días de la estadía no son reembolsables.',
            },
            strict: {
              label: 'Estricta',
              description:
                'Reembolso total si la cancelación ocurre dentro de las 48 horas después de reservar y por lo menos 28 días antes del check-in. Después de ese plazo, los primeros 30 días de la estadía no son reembolsables.',
            },
          },
          validation: {
            standardRequired: 'Selecciona una política estándar.',
            longStayRequired: 'Selecciona una política para estadías largas.',
          },
        },
        customLink: {
          title: 'Enlace Personalizado',
          placeholder: 'hospedatebolivia.com/listing/xxxxxxx',
        },
        travelerRequirements: {
          title: 'Requisitos para los viajeros',
          requestProfilePhoto: {
            label: 'Solicita una foto de perfil',
            description:
              'Al activar esta opción, los huéspedes que hagan una reserva en tu anuncio deberán tener una foto de perfil. Solo podrás verla una vez que hayan confirmado la reserva.',
          },
          allGuestsMust: 'Todos los huéspedes deben:',
          requirement1:
            'Es necesario tener una dirección de correo electrónico y un número de teléfono verificados.',
          requirement2: 'Proporcionar la información de pago.',
          requirement3: 'Aceptar las normas de tu vivienda.',
        },
        localLegislation: {
          title: 'Legislación local',
          point1:
            'La mayoría de las ciudades tienen regulaciones que controlan el uso compartido de viviendas. Las normas y ordenanzas específicas pueden estar incluidas en diferentes legislaciones (reglamentos sobre zonas, edificaciones, permisos o regímenes fiscales).',
          point2:
            'En muchos lugares, necesitarás registrarte, obtener un permiso o una autorización antes de poder publicar tu espacio y recibir huéspedes.',
          point3:
            'Además, es posible que debas encargarte de recaudar y pagar ciertos impuestos. En algunos lugares, el alquiler de corta duración está completamente prohibido.',
          point4:
            'Dado que eres el único responsable de decidir si anunciar o reservar un alojamiento, es crucial que te familiarices con las normas pertinentes antes de publicar en Hospédate.',
          disclaimer:
            'Al aceptar los Términos de servicio y publicar el alojamiento, te comprometes a cumplir con la legislación y la normativa aplicable.',
        },
        taxes: {
          title: 'Impuestos',
          introQuestion:
            '¿Cómo funcionan los impuestos en Bolivia para alquileres temporales?',
          introText:
            'En Bolivia, las actividades económicas relacionadas con el alquiler temporal de espacio están sujetas a diversas obligaciones tributarias. Estas rentas, al ser consideradas una prestación de servicios, deben cumplir con el pago de impuestos tanto a nivel nacional como municipal. A continuación, te explicamos los principales impuestos que aplican y quién es responsable de pagarlos.',
          nationalTaxesTitle: 'Impuestos nacionales aplicables',
          iva: {
            title: 'Impuesto al Valor Agregado (IVA)',
            description:
              'El alquiler temporal de espacio está gravado con el IVA, cuya alícuota es del 13%. Este impuesto se aplica sobre el monto total facturado por el servicio de alquiler. Los propietarios que ofrecen este tipo de servicios deben registrarse en el Servicio de Impuestos Nacionales (SIN) y emitir facturas legales.',
          },
          it: {
            title: 'Impuesto a las Transacciones (IT)',
            description:
              'Además del IVA, las transacciones comerciales relacionadas con el alquiler temporal están sujetas al IT, con una tasa del 3% sobre los ingresos brutos generados. Este impuesto también debe ser declarado y pagado periódicamente.',
          },
          iue: {
            title: 'Impuesto sobre las Utilidades de las Empresas (IUE)',
            description:
              'Si el alquiler temporal es gestionado por una empresa o persona jurídica, las utilidades netas obtenidas están gravadas con el IUE, cuya tasa es del 25%. Este impuesto se paga anualmente y se calcula sobre las ganancias después de deducir los costos operativos.',
          },
          municipalTaxesTitle: 'Impuestos municipales aplicables',
          iaem: {
            title: 'Impuesto a las Actividades Económicas Municipales (IAEM)',
            description:
              'Los municipios tienen la facultad de cobrar impuestos por las actividades económicas realizadas en su jurisdicción. El IAEM aplica a quienes ofrecen servicios de alquiler temporal, y la alícuota varía según el municipio. Además, en algunos casos, se requiere una licencia de funcionamiento.',
          },
          ipbi: {
            title: 'Impuesto a la Propiedad de Bienes Inmuebles (IPBI)',
            description:
              'Este impuesto grava la propiedad del espacio utilizado para el alquiler. La tasa depende del valor catastral del bien y es recaudada por el gobierno municipal correspondiente.',
          },
          whoPaysTitle: '¿Quién paga los impuestos?',
          whoPaysDescription:
            'La responsabilidad de pagar estos impuestos recae directamente sobre el propietario del espacio o la empresa que gestiona el alquiler temporal. Es obligatorio registrarse como contribuyente en el SIN, emitir facturas legales y declarar los impuestos correspondientes. En el caso de los impuestos municipales, el propietario también debe cumplir con las normativas locales, como el pago del IAEM y el IPBI.',
          taxComplianceTitle: 'Cumplimiento tributario',
          taxComplianceDescription:
            'El cumplimiento de estas obligaciones es fundamental para evitar sanciones por parte de las autoridades tributarias. En los últimos años, el Servicio de Impuestos Nacionales ha intensificado la fiscalización de actividades económicas informales, incluidas las relacionadas con alquileres temporales. Por ello, es importante mantenerse al día con las normativas y realizar las declaraciones correspondientes en los plazos establecidos.',
          summary:
            'En resumen, el alquiler temporal de espacio en Bolivia está sujeto a una serie de impuestos que deben ser cumplidos tanto a nivel nacional como municipal. Cumplir con estas obligaciones no solo evita problemas legales, sino que también contribuye al desarrollo económico del país.',
        },
        deleteSpace: {
          title: 'Eliminar un espacio',
          question:
            '¿Podrías contarnos porqué ya no quieres anfitrionar en Hospédate?',
          confirmDeletion: 'Confirmar eliminación',
          cancel: 'Cancelar',
          noLongerCanHost: {
            title: 'Ya no puedo recibir huéspedes',
            reasons: {
              noPropertyToAnnounce:
                'En este momento, no tengo una propiedad para anunciar.',
              legallyCannotHost: 'Legalmente, ya no puedo recibir huéspedes.',
              neighborsDifficulty:
                'Mis vecinos dificultaron la llegada de huéspedes.',
              lifestyleChange:
                'Ser anfitrión ya no se adapta a mi estilo de vida.',
              otherReason: 'Otra causa.',
            },
          },
          cannotHost: {
            title: 'No puedo anfitrionar en este momento',
            reasons: {
              hostOccasionally: 'Solo recibo huéspedes de vez en cuando.',
              needToPrepareProperty:
                'He creado mi espacio, pero necesito preparar mi propiedad para recibir a los huéspedes.',
              renovatingOrImproving:
                'Voy a renovar mi espacio o hacer mejoras.',
              otherReason: 'Otra causa.',
            },
          },
          expectedMoreFromHost: {
            title: 'Esperaba más de Hospédate',
            reasons: {
              betterService:
                'Como anfitrión, esperaba recibir un mejor servicio de atención de Hospédate.',
              noFairTreatment:
                'Ya no confío en que Hospédate trate a los anfitriones de manera justa.',
              moreSupportResources:
                'Deseaba más recursos de apoyo de Hospédate.',
              improvePolicies:
                'Considero que Hospédate podría mejorar sus políticas.',
              otherReason: 'Otra causa.',
            },
          },
          expectedMoreFromGuests: {
            title: 'Esperaba más de los huéspedes',
            reasons: {
              noHouseRulesRespect:
                'Los huéspedes no respetaron las normas de la casa.',
              damagedOrStoleProperty:
                'Los huéspedes dañaron o robaron en mi propiedad.',
              frequentCancellations:
                'Los huéspedes cancelaron sus reservas con demasiada frecuencia.',
              rudeOrDemandingGuests:
                'Los huéspedes se comportaron de manera grosera o me hicieron exigencias.',
              unfairComments: 'Los huéspedes dejaron comentarios injustos.',
              otherReason: 'Otra causa.',
            },
          },
          expectedToEarnMoreMoney: {
            title: 'Esperaba ganar más dinero',
            reasons: {
              propertyManagementComplicated:
                'Gestionar la propiedad resultó ser más complicado de lo que esperaba.',
              taxManagementComplicated:
                'Manejar los impuestos era demasiado complicado.',
              localRegistrationCumbersome:
                'El proceso de registro local fue demasiado engorroso.',
              expectedMoreBookings: 'Esperaba obtener más reservas.',
              expectedMoreIncome: 'Tenía la expectativa de ganar más ingresos.',
              otherReason: 'Otra causa.',
            },
          },
          duplicateSpace: {
            title: 'Este es un espacio duplicado',
            reason: 'Sí, este es un espacio repetido.',
          },
        },
        editCheckInOut: {
          title: 'Horas del Check in y Check Out',
          arrivalTitle: 'Hora de llegada',
          startLabel: 'Hora de inicio',
          endLabel: 'Hora de finalización',
          departureTitle: 'Hora de salida',
          checkoutLabel: 'Selecciona la hora',
        },
        editDirections: {
          title: 'Indicaciones',
          placeholder:
            'Informa a tus huéspedes sobre cómo acceder a tu vivienda. No olvides incluir recomendaciones sobre el estacionamiento o el uso del transporte público',
          validation: {
            max: 'Máximo 2000 caracteres.',
          },
        },
        editLocation: {
          title: 'Dirección del alojamiento',
          countryLabel: 'País',
          addressLabel: 'Dirección',
          addressPlaceholder: 'Escribe la dirección...',
          aptLabel: 'Departamento / Nro. apto',
          aptPlaceholder: 'Ej. 2B',
          cityLabel: 'Ciudad',
          cityPlaceholder: 'Escribe la ciudad...',
          stateLabel: 'Estado/Departamento',
          statePlaceholder: 'Escribe el estado...',
          showExactLocationTitle: 'Mostrar ubicación exacta',
          showExactLocationDescription:
            'Activa esta opción para mostrar la ubicación precisa en el mapa',
          privacyTitle: 'Privacidad de la dirección',
          privacyDescription:
            'Tu dirección completa solo se compartirá con los huéspedes confirmados.',
          approximateLocationLabel: 'Ubicación aproximada',
          validation: {
            required: 'Campo requerido',
            coordsRequired: 'Debes seleccionar una ubicación válida en el mapa',
            showExactRequired: 'Debes indicar si mostrar la ubicación exacta',
            privacyRequired: 'Debes indicar la preferencia de privacidad',
          },
        },
        editCheckInMethod: {
          title: 'Elige el método check in',
          instructions: {
            title: 'Instrucciones para la llegada',
            subtitle:
              'Provee información 24–48 horas antes de hacer el check in.',
            description:
              'Asegúrate de que los huéspedes lleguen sin problemas. Comparte recomendaciones sobre cómo acceder. También puedes incluir imágenes.',
            placeholder: 'Escribe la descripción aquí',
          },
          method: {
            title: 'Método de llegada',
            options: {
              buttonLabel: 'Agregar información',
              smartLock: {
                label: 'Cerradura inteligente',
                description:
                  'Los huéspedes utilizarán un código o una aplicación para acceder a la propiedad.',
                buttonLabel: 'Agregar información',
              },
              keypad: {
                label: 'Cerradura con teclado',
                description:
                  'Los huéspedes emplearán un código que tú proporcionaste para desbloquear una cerradura electrónica.',
              },
              lockbox: {
                label: 'Caja de seguridad con llave',
                description:
                  'Los huéspedes usarán un código que tú proporcionaste para abrir una pequeña caja fuerte que contiene una llave en su interior.',
              },
              staff: {
                label: 'Personal del edificio',
                description:
                  'Hay alguien disponible las 24 horas para recibir a los huéspedes.',
              },
              inPerson: {
                label: 'Encuentro en persona',
                description:
                  'Los huéspedes se encontrarán contigo o con tu coanfitrión para recoger las llaves.',
              },
              other: {
                label: 'Otro',
                description:
                  'Los huéspedes emplearán un método distinto a los mencionados.',
              },
            },
          },
          validation: {
            methodRequired: 'Selecciona un método de llegada.',
            instructionsMax: 'Máximo 2000 caracteres.',
          },
        },
        amenities: {
          title: 'Comodidades',
          addTitle: 'Añadir comodidades',
          edit: 'Editar',
          groupsTitle: 'Grupos de Comodidades',
          amenitiesInGroupTitle: 'Comodidades del Grupo',
          offeredAmenities: 'Comodidades que ofreces',
          searchPlaceholder: 'Busca aqui',
          allLabel: 'Todas',
        },
        gallery: {
          photos: 'Fotos',
          title: 'Tu galería de fotos',
          description:
            'Gestiona las imágenes y añade información. Los visitantes solo podrán ver el recorrido si cada habitación cuenta con una foto.',
          allPhotos: 'Todas las fotos',
          emptyGallery: 'Ups, aún no hay imágenes',
          emptyGalleryDescription:
            'Cuando tengas fotografías aquí, las verás en esta galería.',
          addPhotos: 'Agregar fotos',
          addSpace: 'Agregar un espacio',
          selectRoom: 'Selecciona una habitación',
          photoCount: '{count} fotos',
          selectPhotosForSpace:
            'Selecciona las fotos que serán parte de este espacio',
          photosAdded: 'Has añadido {count} fotos al espacio {space}',
          selectedPhotosCount: '{count} fotos seleccionadas',
          cancel: 'Cancelar',
          next: 'Siguiente',
          save: 'Guardar',
          done: 'Listo',
          back: 'Volver',
          move: 'Mover',
          skipForNow: 'Omitir por ahora',
          managePhotos: 'Administrar Fotos',
          moveToAnotherSpace: 'Mover a otro espacio',
          makeCoverPhoto: 'Hacerla foto de portada',
          spaceDescription: 'Descripción del espacio',
          gallery: 'Galería',
          uploadFromDevice: 'Sube foto desde tu dispositivo',
          chooseFromAdditionalPhotos:
            'Elige una de la selección de fotos adicionales',
          addThesePhotosQuestion: '¿Quieres agregar alguna de estas fotos?',
          coverPhoto: 'Foto de portada',
          additionalPhotos: '"Fotos adicionales"',
          bedDistribution: 'Distribución de camas',
          addInformation: 'Agregar información',
          amenities: 'Comodidades',
          deleteListingQuestion: '¿Quieres eliminar este anuncio?',
          deleteListingWarning:
            'Esta eliminación será permanente; no podrás recuperar las fotos e información dentro de ella.',
          confirmDelete: 'Sí, lo quiero eliminar',
          deletePhotoQuestion: '¿Quieres eliminar esta foto?',
          deletePhotoWarning:
            'Esto es permanente: ya no podrás recuperar esta imagen.',
          noSpacesImageAlt: 'No hay espacios disponibles',
          availablePhotos: 'Fotos disponibles',
          noAvailablePhotos: 'No hay fotos disponibles',
          photoNotFound: 'Foto no encontrada',
          uploadLoading: 'Subiendo...',
          validation: {
            requiredCaption: 'La descripción es requerida.',
            maxCaption: 'Máximo 255 caracteres.',
            cannotDeleteBelowMin:
              'No puedes eliminar esta foto: este anuncio debe tener al menos {min} foto(s).',
            cannotDeleteBelowMinPublished:
              'No puedes eliminar esta foto: los anuncios publicados deben tener al menos {min} foto(s).',
          },
        },
      },
      footer: {
        title: 'Editar anuncio',
        save: 'Guardar',
        saving: 'Guardando...',
        changesMade: 'Mandar a revisión',
        stepTitles: {
          'request-changes': 'Una vez hechos los cambios click al botón',
          title: 'Título del anuncio',
          'property-type': 'Tipo de propiedad',
          price: 'Precios',
          availability: 'Disponibilidad',
          capacity: 'Número de personas',
          description: 'Descripción',
          address: 'Dirección',
          booking: 'Configuración de las reservaciones',
          'house-rules': 'Reglas de la casa',
          'guest-safety': 'Seguridad de la casa',
          'cancellation-policy': 'Política de cancelación',
          'custom-link': 'Enlace personalizado',
          directions: 'Indicaciones',
          'check-in-method': 'Métodos del check in',
          'listing-state': 'Estado del anuncio',
          'delete-listing': 'Eliminar anuncio',
        },
      },
      commonComponents: {
        dropdown: {
          placeholder: 'Seleccione una opción',
        },
        modal: {
          confirmDiscard: {
            title: 'Si te vas perderás tus cambios',
            p1: 'Si te vas, el avance en esta pantalla no se guardará y perderás los cambios.',
            p2: 'Vuelve atrás y guarda tus cambios.',
            keepEditing: 'Volver atrás',
            discard: 'Salir de la pantalla',
          },
          confirmSubmitReview: {
            title:
              '¿Confirmas que se han realizado correctamente los cambios solicitados?',
            p1: 'Queremos que tu anuncio esté disponible lo antes posible, así que asegúrate de haber realizado todos los cambios necesarios.',
            p2: 'Al reenviar tu anuncio para revisión, deberás esperar nuestra respuesta.',
            confirm: 'Sí, enviar para revisión',
            back: 'Volver atrás',
          },
          confirmUnpublish: {
            title: '¿Seguro que deseas despublicar tu anuncio?',
            p1: 'Tu anuncio dejará de aparecer en los resultados de búsqueda y no aceptará nuevas reservas.',
            p2: 'Las reservas en curso no se verán afectadas y seguirán vigentes.',
            confirm: 'Sí, despublicar',
            back: 'Volver atrás',
          },
          confirmPublish: {
            title: '¿Publicar tu anuncio?',
            p1: 'Tu anuncio se mostrará en los resultados de búsqueda y permitirá nuevas reservas.',
            confirm: 'Sí, publicar',
            back: 'Volver atrás',
          },
        },
      },
    },
    calendar: {
      syncYourCalendar: 'Sincroniza tu calendario',
      night: 'noche',
      night_plural: 'noches',
      today: 'Hoy',
      inPreparation: 'En Preparación',
      blockedExternal: 'Reservado por otra plataforma',
      pageTitle: 'Calendario',
      generalConfig: 'Configuración General',
      price: 'Precio',
      availability: 'Disponibilidad',
      selectListing: 'Selecciona un anuncio',
      apply: 'Aplicar',
      save: 'Guardar',
      saving: 'Guardando...',
      allYourListings: 'Todos tus anuncios',
      // Price
      nightlyPrice: 'Precio por noche',
      weekendPrice: 'Precios por fin de semana',
      customWeekendPrice: 'Precio personalizado para el fin de semana',
      discounts: 'Descuentos',
      toggleDiscounts: 'Activa o desactiva los descuentos',
      weekly: 'Semanal',
      monthly: 'Mensual',
      close: 'Cerrar',
      weeklyHint: 'Por 7 noches o más',
      monthlyHint: 'Por 28 noches o más',
      weeklyError:
        'El descuento semanal no puede ser mayor que el descuento mensual.',
      monthlyError:
        'El descuento mensual no puede ser menor que el descuento semanal.',
      priceError:
        'El precio no puede ser menor a {priceMin} o mayor a {priceMax}',
      updateError: 'Hubo un problema al actualizar los datos.',
      // Availability
      stayDuration: 'Duración de alojamiento',
      minNights: 'Número mínimo de noches',
      maxNights: 'Número máximo de noches',
      notice: 'Preaviso',
      noticeDescription:
        '¿Cuánto tiempo de anticipación necesitas entre la reservación y el check-in?',
      sameDayCheckin:
        'Los huéspedes pueden reservar el mismo día del check-in hasta esta hora.',
      allowSameDayRequests: 'Permite solicitudes el mismo día',
      reviewAndApprove:
        'Tienes que revisar y aprobar cada solicitud de reservación',
      noticeOptions: {
        SAME_DAY: 'Mismo día',
        AT_LEAST_ONE_DAY: 'Al menos 1 día',
        AT_LEAST_TWO_DAYS: 'Al menos 2 días',
        AT_LEAST_THREE_DAYS: 'Al menos 3 días',
        AT_LEAST_SEVEN_DAYS: 'Al menos 7 días',
      },
      // select dates
      open: 'Abierto',
      guestPrice: 'Precio para el huésped:',
      simulateStay: 'Simula una estadía',
      yourPrivateNotes: 'Tus notas privadas',
      writePrivateComment: 'Escribe un comentario privado',
      writeHere: 'Escribe aquí',
      enterGuestsAndPets:
        'Introduce la cantidad de huéspedes y mascotas para obtener el precio total',
      unifyAvailabilityError:
        'Debe unificar la disponibilidad de las noches seleccionadas.',
      unifyPriceError: 'Debe unificar el precio de las noches seleccionadas.',
      mixedAvailability: 'Disponibilidad Mixta',
      nightsAvailable: 'Noches abiertas',
      nightsBlocked: 'Noches bloqueadas',
      allOpen: 'Todos abiertos',
      allClosed: 'Todos Cerrados',
      closed: 'Cerrado',
      differentPrices: 'Diferentes precios',
      summary: {
        basePrice: 'Precio base',
        serviceFee: 'Tarifa por servicio',
        guestPrice: 'Precio para el huésped (impuestos no incluidos)',
        hostEarnings: 'Ganancia',
      },
      sync: {
        syncButton: 'Sincronizaciones',
        syncCalendarButton: 'Sincroniza tu calendario',
        formTitle:
          'Sincroniza el calendario de Hospédate con otros calendarios',
        bidirectionalSyncDescription:
          'Esta conexión bidireccional asegura que ambos calendarios se sincronicen automáticamente al reservar una estancia.',
        videoLinkText: 'aquí te lo explicamos con un video.',
        step1Title: 'Paso 1',
        step1Description: 'Copia y pega en otros calendario como el de Airbnb.',
        step2Title: 'Paso 2',
        step2Description:
          'Consigue un enlace con la extensión .ics del sitio web correspondiente y añádelo aquí abajo.',
        urlInputPlaceholder: 'Enlace a otro sitio web',
        calendarNameInputPlaceholder: 'Nombre del calendario',
        addButton: 'Agregar Calendario',
        copyButton: 'Copiar',
        copied: 'Copied',
        loading: 'Cargando',
        syncFinishedTitle: 'Sincronización finalizada',
        syncFinishedDescription: 'Tu calendario ha sido sincronizado con: ',
        backToMyCalendarButton: 'Volver a mi calendario',
        syncedCalendarsTitle: 'Calendarios sincronizados',
        syncedCalendarsDescription:
          'Aquí verás todos los calendarios que has sincronizado con el calendario de este anuncio.',
        syncAnotherCalendarButton: 'Sincronizar otro calendario',
        deleteButton: 'Eliminar',
        deleteConfirmationTitle: '¿Eliminar sincronización?',
        confirmDeleteButton: 'Si, eliminar sincronización',
        deleting: 'Eliminando...',
        lastUpdated: 'Última actualización:',
        updateButton: 'Actualizar',
        updatingButton: 'Actualizando...',
        addError:
          'Hubo un problema al agregar el calendario. Inténtalo de nuevo.',
        goBack: 'Volver atrás',
        successSync: 'El calendario ha sido actualizado',
      },
      info: {
        title: 'Sobre los estados del calendario',
        today: {
          title: 'Hoy día',
          description:
            'Para saber qué día es, busca la casilla con la palabra “hoy”, que siempre estará en la parte superior derecha de la casilla.',
        },
        selectCells: {
          title: 'Seleccionar casillas',
          description:
            'Al seleccionar una o más casillas, aparecerá un borde azul alrededor de ellas. Esto significa que las estás seleccionando.',
        },
        scheduledDays: {
          title: 'Días agendados',
          description:
            'Cuando los huéspedes realicen reservas, se mostrarán de esta manera en tu calendario. La franja azul puede abarcar más de una celda.',
        },
        preparationDays: {
          title: 'Días en preparación',
          description:
            'Las celdas con este estilo representan los días en los que tu propiedad está en preparación y limpieza para el próximo huésped. Este estado aparece después de que finaliza una reserva y puedes editar el tiempo de preparación en la configuración de tu anuncio.',
        },
        externalPlatformBookings: {
          title: 'Reservas en otras plataformas',
          description:
            'Las celdas con este estilo representan los días en que tu propiedad está reservada desde otra plataforma como Airbnb o Google. Puedes configurar esto en los ajustes de tu calendario.',
        },
        blockedDays: {
          title: 'Días bloqueados',
          description:
            'Las celdas completamente rojas son los días bloqueados en tu calendario. Son los días que decidiste manualmente que nadie puede reservar tu propiedad.',
        },
        closeInfo: 'Cerrar información',
      },
    },
  },
  header: {
    addProperty: 'Conviértete en anfitrión',
    hostMode: 'Modo Anfitrión',
    lang: {
      es: '🇪🇸 Español',
      en: '🇺🇸 Inglés',
    },
  },
  footer: {
    description:
      'Somos una plataforma en línea que conecta a personas que buscan alojamiento a corto o largo plazo con anfitriones que ofrecen sus anuncios.',
    assistance: 'Asistencia',
    hostMode: 'Modo anfitrión',
    legal: 'Legales',
    cancellationOptions: 'Opciones de cancelación',
    becomeHost: 'Pon tu espacio en Hospédate',
    privacy: 'Privacidad',
    terms: 'Términos',
    copyright: 'Todos los derechos reservados.',
    support: 'Soporte',
    protectionFund: 'Fondo de Protección',
  },
  languageSwitcher: {
    spanish: '🇪🇸 Español',
    english: '🇺🇸 Inglés',
  },
  notFoundPage: {
    title: 'Página no encontrada',
    heading1: 'Uups,',
    heading2: 'no encontramos ',
    heading3: 'lo que buscabas',
    description1: 'Pero de seguro ',
    description2: 'tenemos lo que necesitas ',
    description3: 'en nuestra página principal',
    backToHome: 'Ir a la página principal',
  },
  forbiddenPage: {
    title: 'Acceso denegado',
    heading: 'Uups, discúlpanos',
    description: 'Pero no tienes permiso en entrar a esta página',
    backToHome: 'Ir a la página principal',
  },
  unrecoverable: {
    title: 'Error del servidor – Inténtalo más tarde',
    heading: 'Algo salió mal en el servidor',
    description:
      'No pudimos conectar con nuestros servicios en este momento. Tu sesión sigue activa, pero no es posible mostrar la información solicitada. ',
    backToHome: 'Volver al inicio',
  },
  commonComponents: {
    loadingSpinner: {
      defaultMessage: 'Cargando contenido, espere por favor...',
    },
    modal: {
      close: 'Cancelar',
      skipForNow: 'Omitir por Ahora',
    },
    messageModal: {
      talkToHost: 'Hablar con tu anfitrión',
      talkToGuest: 'Hablar con tu huésped',
      descriptionHost: '{name} está aquí para responder todas tus dudas',
      descriptionGuest: '{name} está aquí para resolver todas sus dudas',
      placeHolder: 'Hola {name}, quiero saber más sobre...',
      sendMessage: 'Enviar mensaje',
      sending: 'Enviando...',
      disabledReason: 'Por favor, ingresa un mensaje para enviarlo',
    },
  },
  auth: {
    title: 'Inicia sesión o regístrate',
    welcomeTitle: '¡Bienvenido!',
    welcomeMessage: 'Te damos la bienvenida',
    welcomeHeadline: 'Bienvenido a Hospédate',
    welcomeSubtitle: '¡Descubre anuncios increíbles alrededor de toda Bolivia!',
    email: 'Correo electrónico',
    description:
      'Te confirmaremos el número a través de una llamada telefónica o un mensaje de texto. Esto está sujeto a las tarifas estándar de mensajes y datos. Consulta nuestra ',
    descriptionPolicy: 'política de privacidad.',
    continue: 'Continuar',
    loading: 'Cargando',
    continueGoogle: 'Continuar con Google',
    maybe: 'O también',
    password: 'Contraseña',
    forgotPassword: 'He olvidado mi contraseña',
    createAccount: 'Crea una cuenta',
    titleLogin: 'Ingresa tu contraseña',
    invalidEmail: 'Correo electrónico inválido',
    invalidPassword: 'Contraseña invalida',

    confirmationEmail: 'Confirma tu correo',
    verificationCodeSent:
      'Te enviamos un código de verificación a tu bandeja de mensajes. Si no te ha llegado una notificación, revisa tu bandeja de spam.',
    verificationCode: 'Código de verificación',
    resendCode: 'Reenviar código',
    registerEmail: 'Registrar correo',
    goBack: 'Volver atrás',
    google: {
      title: 'Ingresa con tu cuenta de Google',
      useOtherAccount: 'Usar otra cuenta',
      continueApp: 'Continuar con la aplicación',
    },
    mobileLogin: {
      title: 'Autenticando',
      authenticating: 'Autenticando...',
      pleaseWait: 'Por favor espera un momento',
      authError: 'Error de autenticación',
      redirecting: 'Redirigiendo a la página de inicio de sesión...',
    },
    error: {
      invalidCredentials: 'Credenciales Invalidas',
      badRequest:
        'Algo salió mal. Por favor, verifica tus datos e inténtalo nuevamente.',
      networkError: 'Error de conexión. Por favor, inténtalo más tarde.',
      googlePopup: 'No se pudo abrir la ventana de Google',
      authError: 'Error de Authorizacion',
      popupTimeout:
        'La ventana emergente ha tardado demasiado en responder. Por favor, inténtalo de nuevo.',
      popupClosedByUser:
        'La ventana emergente fue cerrada por el usuario antes de completar el proceso.',
      manyRequests:
        'Se ha solicitado demasiados codigos de verificacion. Por favor, espera un minuto antes de intentar de nuevo.',
      invalidTokenResponse:
        'Tu sesión ha caducado. Vuelve a iniciar sesión para continuar.',
      notFoundVerificationCode: 'Código de verificación no válido.',
    },
  },
  forgotPassword: {
    instructions:
      'Escribe tu correo para enviarte un correo a tu bandeja de entrada.',
    emailLabel: 'Correo electrónico',
    placeholder: 'tucorreo@ejemplo.com',
    sendButton: 'Enviar correo',
    cta: 'He olvidado mi contraseña',
    title: 'Recuperación de contraseña',
    checkEmail:
      'Hemos enviado un correo a tu cuenta para que puedas restablecer tu contraseña.',
    resend: '¿No te llegó aún? Enviar otro correo',
    illustrationAlt: 'Correo de recuperación',
    resetPage: {
      enterNewPassword: 'Ingresa tu nueva contraseña',
      passwordLabel: 'Contraseña',
      confirmLabel: 'Tu contraseña de nuevo',
      showPasswords: 'Mostrar contraseñas',
      passwordPlaceholder: 'Escribe tu nueva contraseña',
      confirmPlaceholder: 'Confirma tu nueva contraseña',
      tooShort: 'Mínimo 8 caracteres.',
      mustMatch: 'Las contraseñas deben coincidir.',
      changeAndSignIn: 'Cambiar contraseña',
      changedOk:
        '¡Contraseña cambiada con éxito! Inicie sesión para continuar.',
      invalidLinkTitle: 'Enlace inválido o expirado',
      invalidLinkDesc: 'Solicita nuevamente la recuperación de contraseña.',
      showPassword: 'Mostrar contraseña',
      hidePassword: 'Ocultar contraseña',
      cannotBeAllNumbers: 'La contraseña no puede ser solo números.',
      cannotBeAllLetters: 'La contraseña no puede ser solo letras.',
      needsNumberOrSymbol: 'Agrega al menos un número o símbolo.',
      containsPersonalInfo:
        'No debe contener tu nombre ni tu usuario de correo.',
      restoreError: {
        title: 'Error al actualizar la contraseña',
        intro:
          'Revisa que la contraseña cumpla con las siguientes condiciones mínimas de seguridad:',
        bullets: {
          minLength: 'La contraseña debe tener al menos 8 caracteres.',
          notAllNumbers: 'La contraseña no puede ser solo números.',
          notAllLetters: 'La contraseña no puede ser solo letras.',
          numberOrSymbol: 'Debe contener al menos un número o símbolo.',
          notContainUser: 'No debe contener tu usuario o correo electrónico.',
          notCommon: 'La contraseña no debe ser demasiado común.',
        },
      },
    },
    resetExpiredPage: {
      title: 'Enlace de restablecimiento vencido',
      heading1: 'El enlace para',
      heading2: ' cambiar tu contraseña ',
      heading3: 'ha vencido',
      illustrationAlt: 'Enlace de restablecimiento vencido',
      description1:
        'Puedes solicitar un nuevo correo de restablecimiento de contraseña,',
      description2: ' luego revisa tu bandeja de entrada.',
      backToHome: 'Ir al inicio',
    },
  },
  preview: {
    laptop: 'Laptop',
  },
  register: {
    title: 'Finaliza tu registro',
    fullNameLabel: 'Nombre completo',
    nameInputPlaceholder: 'Nombres de tu Documento de Identidad',
    lastnameInputPlaceholder: 'Apellidos de tu Documento de Identidad',
    nameNote:
      'Verifica que el nombre coincida con el que figura en tu documento de identidad oficial.',
    birthDateLabel: 'Fecha de nacimiento',
    birthDateInputPlaceholder: 'Fecha de nacimiento',
    emailLabel: 'Correo electrónico',
    birthDateNote:
      'Para poder registrarte debes tener al menos 18 años. No compartiremos la fecha de tu nacimiento con otros usuarios de Hospédate.',
    invalidDate: 'Por favor ingresa una fecha válida',
    birthDateInFuture: 'La fecha de nacimiento no puede ser en el futuro',
    mustBeAdult: 'Debes ser mayor de 18 años para registrarte',
    passwordLabel: 'Contraseña',
    confirmPasswordPlaceholder: 'Tu contraseña de nuevo',
    termsNote:
      'Al hacer clic en Acepto y continuar, confirmo que he leído y acepto los <a href="/terms" target="_blank" class="underline">Términos de servicio</a> y la <a href="/privacy" target="_blank" class="underline">Política de privacidad</a>.',
    acceptAndContinue: 'Aceptar y continuar',
    EMAIL_ALREADY_EXISTS:
      'Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.',
    requiredField: 'Este campo es obligatorio.',
    passwordsDoNotMatch: 'Las contraseñas no coinciden.',
    passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
    passwordCannotBeAllNumbers: 'La contraseña no puede ser solo números',
    passwordCannotBeAllLetters: 'La contraseña no puede ser solo letras.',
    passwordNeedsNumberOrSymbol:
      'La contraseña debe contener al menos un número o símbolo.',
    passwordContainsPersonalInfo:
      'La contraseña no debe contener tu nombre de usuario o correo.',
    passwordNotCommon: 'La contraseña no debe ser demasiado común.',
    passwordPlaceholder: 'Contraseña',
  },
  userProfile: {
    loggingOut: 'Cerrando sesión...',
    logout: 'Cerrar Sesión',
    signUp: 'Regístrate',
    login: 'Iniciar Sesión',
    helpCenter: 'Centro de ayuda',
    profile: 'Perfil',
    saved: 'Guardados',
    settings: 'Configuración de cuenta',
    rentYourPlace: 'Conviértete en anfitrión',
    changeLanguage: 'Cambiar Lenguaje',
    trips: 'Viajes',
    messages: 'Mensajes',
    hosting: 'Modo anfitrión',
    guest: 'Modo Huésped',
  },
  profile: {
    profileHost: 'Perfil del Anfitrión',
    profileGuest: 'Perfil del Huésped',
    title: 'Acerca de {username}',
    about: 'Sobre {username}',
    aboutYou: 'Sobre ti',
    visitedPlaces: 'Lugares visitados por {username}',
    interests: 'Intereses de {username}',
    nextDestination: 'Próximo destino',
    reviews: 'Reseñas de {username}',
    listings: 'Publicaciones de {username}',
    allReviews: 'Mostrar todas las reseñas',
    identityVerified: 'Identidad verificada',
    emailVerified: 'Email verificada',
    phoneVerified: 'Teléfono verificado',

    verificationsTitle: 'Confirmaciones',
    verificationEmailConfirmed: 'Dirección de correo electrónico',
    verificationEmailPending: 'Confirma tu correo electrónico',
    verificationPhoneConfirmed: 'Número de celular',
    verificationPhonePending: 'Confirma tu número de celular',

    uploadProfilePhoto: 'Sube tu foto de perfil',
    looksGood: '¡Se ve bien!',
    photoDescription:
      'Esta foto permitirá que los anfitriones o huéspedes tengan una primera impresión de ti.',
    photoRequirements:
      'Formatos: JPG, PNG • Tamaño: 10 KB - 5 MB • Dimensiones: 400×400 - 5000×5000 px',
    personalizeAccount: 'Dale personalidad a tu cuenta',
    editPhoto: 'Editar foto',
    addPhoto: 'Agregar foto',
    uploading: 'Subiendo...',
    ready: 'Listo',
    uploadPhoto: 'Subir foto',
    skipForNow: 'Por ahora no',
    changeProfilePhoto: 'Cambiar foto de perfil',
    saveSuccess: '¡Cambios guardados exitosamente!',
    uploadPhotoError: 'Error al subir la foto. Por favor, inténtalo de nuevo.',
    unsavedChangesWarning:
      'Tienes cambios sin guardar. Por favor guárdalos antes de abandonar esta página.',

    // Empty state placeholders
    aboutPlaceholder:
      'Cuéntanos sobre ti para que otros huéspedes te conozcan mejor.',
    aboutEmpty: 'No ha compartido información sobre sí mismo.',
    experiencesPlaceholder:
      'Comparte tus experiencias y pasatiempos para conectar con otros viajeros.',
    experiencesEmpty: 'No ha compartido sus experiencias.',
    interestsPlaceholder:
      'Selecciona tus intereses para encontrar personas con gustos similares.',
    interestsEmpty: 'No ha compartido sus intereses.',

    verifyIdentity: 'Verifica tu identidad',
    verifyIdentityDescription:
      'Antes de hacer una reserva o ser anfitrión en Hospédate, es necesario que completes este paso.',
    yourProfileTitle: 'Tu perfil',
    editProfileButton: 'Editar Perfil',
    completeProfileTitle: 'Completa tu perfil',
    completeProfile: 'Sobre ti',
    placeholder: 'Viajero, fotógrafo, soñador ✈️',
    titleBotton: 'Agregar o eliminar evidencias',
    titleInterest: 'Agregar o eliminar intereses',
    placeholderText: 'Escribe algo divertido e ingenioso.',
    label: 'Agregar o eliminar vivencias',
    labelSave: 'Guardar cambios',
    save: 'Guardar',
    addInformation: 'Agregar información a tu perfil ',
    willBuild: 'generará más confianza ',
    withOther: 'a otros huéspedes y anfitriones.',
    cancel: 'Cancelar',
    reply: 'Por responder',
    delete: 'Eliminar',
    edit: 'Editar',
    addAnswers: 'Agregar respuestas',
    answered: 'Respondidas',
    addSpecify: 'Agrega, especifica o elimina vivencias si así lo requieres',
    addInformationModal: 'Agrega información sobre esta vivencia',
    placeholderModal: 'Escribe aqui...',
    nitPlaceholder: 'Nombre o Razón Social',
    aboutYourExperienceTitle: 'Sobre tu vivencia',
    aboutShowBirthDecade: 'Tu década de nacimiento',
    addShowBirthDecade:
      'Decide si mostrar tu década de nacimiento en tu perfil.',
    showBirthDecade: 'Mostrar década de nacimiento',
    selectLanguagesTitle: 'Sobre tus idiomas',
    selectLanguagesDescription: 'Selecciona los idiomas que hablas',
    selectLanguagesPlaceholder: 'Idiomas',
    addressTitle: 'Privacidad de la dirección en caso de cancelaciones',
    addressInformations:
      'Oculta tu dirección, apellido y número de teléfono mientras los huéspedes pueden cancelar de forma gratuita. Una vez que dicho período haya terminado, les enviaremos esta información a los huéspedes.',

    completeProfileDescription:
      'Tu perfil en Hospédate juega un papel crucial en cada reserva. Completa el tuyo para que otros anfitriones y huéspedes puedan conocerte mejor.',
    createProfileButton: 'Completa tu perfil',
    tripsWithUs: 'Lugares que visitaste con Hospédate',
    experiencesOwn: 'Tus vivencias',
    experiencesOther: 'Vivencias de {username}',
    aboutYourInterests: 'Sobre tus intereses',
    selectInterestsDescription:
      'Selecciona algunos intereses que te gusten y que desees destacar en tu perfil.',
    authenticationRequired: 'Autenticación requerida',
    notFound: 'Perfil no encontrado',
    idv: {
      noticeTitle: 'Verifica tu identidad',
      noticeMessage:
        'Solicitamos a nuestros huéspedes y anfitriones que se verifiquen para contribuir a la seguridad de nuestra comunidad.',
      noticeRolesEmphasis: 'huéspedes y anfitriones',
      noticeCta: 'Continuar',
      noticeClose: 'Cerrar',
      noticeId: 'Documento de identidad',
      noticeImageAlt: 'Ilustración de documento de identidad',

      qrTitle: 'Escanea el QR con la cámara de tu celular',
      qrSubtitle:
        'Escanea el código QR con la cámara de tu teléfono y realiza la verificación.',
      qrSteps: [
        'Escanea el QR con tu celular.',
        'Abre el enlace y sigue las instrucciones.',
        'Asegúrate de tener a mano tu carnet de identidad.',
        'Finalizado, confirma desde aquí que has sido validado desde el celular.',
      ],
      qrCtaDone: 'Confirmo que me he validado',
      qrCancel: 'Cerrar',
      qrHelpText:
        '¿No puedes escanear? Continúa con el enlace que verás en tu teléfono.',
      qrImageAlt: 'Código QR para verificación de identidad',
      qrError: 'No pudimos cargar el código QR. Intenta nuevamente.',
      finishedToast:
        '¡Gracias! Actualizaremos tu estado de verificación en breve.',
      closedToast: 'Puedes verificar tu identidad más tarde desde tu perfil.',

      qrErrorGeneric: 'No pudimos generar el código.',
      qrExpired: 'El código expiró.',
      qrRetry: 'Reintentar',
      qrGenerateNew: 'Generar nuevo',

      // Enhanced verification flow
      documentFrontTitle: '¿Cómo validar tu documento?',
      documentFrontInstruction:
        'Toma tu Documento de identidad del lado Anverso y colócalo en el marco blanco y toma una foto.',
      documentBackTitle: '¿Cómo validar tu documento? - 2',
      documentBackInstruction:
        'Y toma una foto para que sea escaneado y luego validado por nosotros.',
      documentReverseTitle: 'Dale la vuelta a tu documento',
      documentReverseInstruction:
        'Luego sacaremos el reverso de tu documento de identidad.',

      // Instructions
      instructionsTitle: 'Instrucciones',
      instructionsFront:
        '1. Toma tu documento de identidad del lado <span class="font-semibold">Anverso</span> y colócalo en el recuadro blanco y toma una foto.',
      instructionsBack:
        '2. Luego, toma tu documento de identidad del lado <span class="font-semibold">Reverso</span> y colócalo en el recuadro blanco y toma una foto.',
      instructionsLighting:
        'Asegúrate de que haya buena iluminación y la imagen esté enfocada.',

      cameraFrontTitle: 'Escanea tu CI Anverso',
      cameraFrontInstruction:
        'Centra el Carnet de identidad en el marco blanco y toma una foto.',
      cameraBackTitle: 'Escanea tu CI Anverso - check',
      cameraBackInstruction:
        'Centra el carnet en el marco blanco y toma una foto.',
      cameraReverseTitle: 'Escanea tu CI Reverso',
      cameraReverseInstruction:
        'Centra el Carnet de identidad en el marco blanco y toma una foto.',

      faceInstructionTitle: 'Instrucciones para verificar tu Rostro',
      faceInstructionMessage:
        'Sitúa tu rostro en el círculo blanco y toma la foto para la verificación.',
      faceCameraTitle: 'Verifica tu Rostro',
      faceCameraInstruction:
        'Sitúa tu rostro en el círculo blanco y toma la foto para la verificación.',

      // Face instruction steps
      faceInstruction1: '1. Sitúa tu rostro en el círculo blanco.',
      faceInstruction2: '2. Mira directamente a la cámara y toma una foto.',
      faceInstructionTip:
        'Asegúrate de que haya buena iluminación. Mantén una expresión neutra.',

      processingTitle: 'Procesando verificación',
      processingMessage:
        'Estamos verificando tu identidad. Este proceso puede tomar unos momentos. Por favor, no cierres esta ventana.',

      // Upload process messages
      uploadingTitle: 'Subiendo documentos',
      uploadingMessage:
        'Estamos subiendo tus documentos de forma segura. Este proceso tomará solo unos momentos.',
      uploadingProgress: 'Subiendo documentos...',

      successTitle: '¡Verificación exitosa!',
      successMessage:
        'Tu identidad ha sido verificada correctamente. Ahora puedes acceder a todas las funcionalidades de la plataforma.',

      errorTitle: 'No pudimos verificar tu identidad',
      errorMessage:
        'No hemos logrado verificar tu identidad. Por favor, intenta nuevamente asegurándote de que las fotos sean claras y el documento esté legible.',
      errorMessageRetry: 'intenta nuevamente',

      // Rate limiting
      rateLimitTitle: 'Límite de intentos alcanzado',
      rateLimitMessage:
        'Has alcanzado el límite máximo de {maxAttempts} intentos de verificación. Podrás intentar nuevamente después del {date}.',
      rateLimitExhausted:
        'Has agotado todos tus {maxAttempts} intentos de verificación. Por favor, contacta con nuestro equipo de soporte para obtener ayuda.',
      rateLimitSupport: 'contacta con nuestro equipo de soporte',

      // Attempt counters
      attemptsRemaining: 'Intentos restantes',
      attemptsRemainingMessage:
        'Te quedan {remaining} de {max} intentos de verificación.',

      // Support contact
      supportContact: 'Contacta con Soporte',
      supportMessage: 'Para resolver este problema, puedes contactarnos:',
      supportButton: 'Contactar Soporte',

      // Processing states
      processingStatusUploading: 'Subiendo documentos...',
      processingStatusAnalyzing: 'Analizando documentos...',
      processingStatusVerifying: 'Verificando identidad...',
      processingStatusComplete: 'Verificación completada',
      processingWaitMessage: 'Este proceso puede tomar varios minutos',
      processingDoNotClose: 'Por favor, no cierres esta ventana',

      retryLater: 'Intentar más tarde',
      retryProcess: 'Reintentar proceso',
      retryButton: 'Intentar de nuevo',
      continue: 'Continuar',
      next: 'Siguiente',
      useThisPhoto: 'Usar esta foto',
      takeAnother: 'Tomar otra',
      verifyFace: 'Verificar mi rostro',
      startButton: 'Comenzar',

      // Camera capture buttons
      retakePhoto: 'Repetir',
      confirmPhoto: 'Confirmar',

      // Camera titles and instructions
      documentFrontCameraTitle: 'Documento Anverso',
      documentBackCameraTitle: 'Documento Reverso',
      documentCameraInstruction:
        'Centra tu documento en el marco blanco y toma una foto.',
      documentCameraSuggestion:
        'Asegúrate de que la foto sea nítida, cuente con buena iluminación y muestre el contenido completo, sin recortes y legible.',
      faceVerificationTitle: 'Verifica tu Rostro',
      faceVerificationInstruction:
        'Sitúa tu rostro en el círculo blanco y toma la foto para la verificación.',
      faceVerificationSuggestion:
        'Asegúrate de que la foto sea nítida, tenga buena iluminación y que tu rostro quede completamente dentro del círculo.',

      // Documents submitted for manual review
      documentsSubmittedTitle: '¡Documentos enviados!',
      documentsSubmittedMessage:
        'Tus documentos han sido enviados exitosamente. El equipo de Hospédate revisará tu información y te notificaremos el resultado.',
      documentsSubmittedNotification:
        'Recibirás una notificación por correo electrónico una vez que la revisión esté completa.',
      documentsSubmittedInfoTitle: 'Tiempo de procesamiento',
      documentsSubmittedInfoMessage:
        'La revisión manual puede tomar entre 1 a 3 días hábiles. Te contactaremos si necesitamos documentos adicionales.',
      documentsSubmittedButton: 'Entendido',
    },
  },
  listings: {
    noListingAvailable: 'No hay propiedades disponibles',
    nightlyPrice: '{price} {currency} noche',
    title: '{type} en {location}',
    continueExploring: 'Continuar explorando más propiedades',
    loadMore: 'Mostrar Más',
    loading: 'Cargando...',
    listingsFound: 'Alojamientos encontrados',
    resultsInMapArea: 'dentro de la zona del mapa',
  },
  search: {
    where: 'Donde',
    arrival: 'Llegada',
    when: 'Cuando',
    who: 'Quién',
    howMany: '¿Cuántos?',
    guestsAndCount: '¿Quiénes y cuántos?',
    addDate: 'Agregar fecha',
    departure: 'Salida',
    search: 'Buscar',
    close: 'Cerrar',
    startSearch: 'Empieza la busqueda',
    addGuests: 'Agregar Huéspedes',
    whereDoYouWantToGo: '¿A dónde quieres ir?',
    searching: 'Buscando...',
    loading: 'Cargando...',
    searchResults: 'Resultados de la Busqueda',
    noResultsFound: 'No se encontraron los resultados',
    adjustFilters: 'Intenta ajustar los filtros o buscar en otra ubicación.',
    goHome: 'Volver al inicio',
    guest: '{count} huésped',
    guest_plural: '{count} huéspedes',
    recentSearch: 'Busquedas Recientes',
    noRecentSearchesMessage: 'Tus búsquedas recientes aparecerán aquí.',
    destination: {
      destination: 'Destino',
      exploreDestinations: 'Explora destinos',
      recentSearches: 'Busquedas Recientes',
      suggestedDestinations: 'Destinos Sugeridos',
      Anywhere: 'En cualquier lugar de Bolivia',
    },
    guests: {
      guest: '{count} huésped',
      guest_plural: '{count} huéspedes',
      adults: 'Adultos',
      adultsAge: 'Edad: 13 años o más',
      children: 'Niños',
      childrenAge: 'Edades 2 - 12',
      infants: 'Bebés',
      infant: '{count} bebé',
      infant_plural: '{count} bebés',
      infantsAge: 'Menos de 2 años',
      pets: 'Mascotas',
      pet: '{count} mascota',
      pet_plural: '{count} mascotas',
      serviceAnimal: 'Trae un Animal de Servicio',
    },
    dates: {
      dates: 'Fechas',
      months: 'Meses',
      flexible: 'Flexible',
      whenIsYourTrip: '¿Cuándo es tu viaje?',
      howLongStay: '¿Cuánto tiempo quieres quedarte?',
      week: 'Semanal',
      weekend: 'Fin de semana',
      month: 'Mensual',
      monthCount: '{count} mes',
      monthCount_plural: '{count} meses',
    },
  },
  filter: {
    title: 'Filtros',
    priceRange: 'Rango de precios',
    min: 'Mínimo',
    max: 'Máximo',
    roomsAndBeds: 'Habitaciones y camas',
    bedrooms: 'Habitaciones',
    beds: 'Camas',
    baths: 'Baños',
    amenities: 'Servicios',
    reservationOptions: 'Opciones de reservaciones',
    propertyType: 'Tipo de propiedad',
    showMore: 'Mostrar más',
    showLess: 'Mostrar menos',
    clearData: 'Limpiar datos',
    showResults: 'Mostrar los resultados',
  },
  calendar: {
    reset: 'Reiniciar',
    goToToday: 'Ir a Hoy',
    arrivalDay: 'Día de llegada',
    departureDay: 'Día de salida',
    preparationDay: 'Día de preparacion',
    noCheckout: 'No se puede hacer checkout',
    noCheckIn: 'No se puede hacer check-in',
    selectArrivalDate: 'Selecciona la fecha de llegada',
    addTravelDates: 'Agrega las fechas de viaje para obtener precios exactos',
    minDay: 'Mínimo {count} noche',
    minDay_plural: 'Minimo {count} noches',
    maxDay: 'Máximo {count} noche',
    maxDay_plural: 'Maximo {count} noches',
    removeDates: 'Borrar fechas',
  },
  listingDetail: {
    save_button: 'Guardar',
    share_button: 'Compartir',
    saved_state: 'Guardado',
    capacity: {
      guest: '{count} huésped',
      guest_plural: '{count} huéspedes',
      room: '{count} habitación',
      room_plural: '{count} habitaciones',
      bathroom: '{count} baño',
      bathroom_plural: '{count} baños',
      bed: '{count} cama',
      bed_plural: '{count} camas',
    },
    host: {
      title: 'Conoce a tu anfitrión',
      subtitle: 'Comunícate con el anfitrión',
      subtitleSuperHost: '{name} es superanfitrión',
      new: 'nuevo',
      descriptionSuperHost:
        'Los Superanfitriones tienen mucha experiencia, tienen valoraciones excelentes y se esfuerzan al máximo para ofrecerles a los huéspedes estadías maravillosas',
      superhost: 'Superanfitrión',
      regularhost: 'Anfitrión',
      guest: 'Huésped',
      reviews: 'Reseñas',
      score: 'Calificación',
      trips: 'Viajes',
      becameHostAt: 'anfitrionando',
      becameUserAt: 'en Hospédate',
      livesIn: 'Vive en',
      responseTime: {
        lessThanHour: 'Responde en menos de una hora',
        lessThanDay: 'Responde en menos de un día',
        moreThanDay: 'Responde en más de un día',
      },
      duration: {
        years: '{count} año',
        years_plural: '{count} años',
        months: '{count} mes',
        months_plural: '{count} meses',
      },
      responseRate: 'Índice de respuesta',
      info: {
        work: 'Me dedico a',
        travelDream: 'A donde siempre quise ir',
        pets: 'Mascotas',
        school: 'Donde estudie ',
        funFact: 'Dato curioso',
        uselessSkill: 'Mi habilidad menos útil',
        wastedTime: 'A qué le dedico mucho tiempo',
        favoriteSong: 'Mi cancion Favorita',
        biographyTitle: 'Título de mi biografía',
        obsession: 'Amo',
        languages: 'hablo',
        birthDecade: 'Década de nacimiento',
        showBirthDecade: 'Década de nacimiento',
      },
      moreInfo: 'Conoce más',
      contact: 'Mensaje al anfitrión',
      message: 'Hola {hostName}, tengo algunas dudas sobre tu anuncio...',
      sending: 'Enviando',
      errorMessage: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
    },

    description: {
      title: 'Conoce más del lugar',
      showMore: 'Mostrar más',
      aboutSpace: 'Acerca de este espacio',
    },
    booking: {
      reserve: 'Reservar',
      perNight: '/noche',
      monthly: 'mensual',
      perNights: 'por {nights} noches', //TODO: ver para quitar
      night: 'noche',
      night_plural: 'noches',
      total: 'Total',
      priceDetails: 'Detalles de precio',
      monthlyDiscount: 'Descuento por estadía mensual:',
      weeklyDiscount: 'Descuento por estadía semanal:',
      priceAfterDiscount: 'Precio después del descuento:',
      additionalGuest: 'Huésped adicional',
      cleaningRate: 'Tarifa de Limpieza',
      petRate: 'Tarifa por mascota',
      hospedateService: 'Servicio Hospédate',
      serviceFee: 'Cargo por Servicio',
      inactiveDates: 'Estas fechas están inactivas y no se pueden utilizar',
      tryChangingDates: 'Intenta de nuevo cambiando las fechas',
      tapHere: 'tocando aquí',
      guestLimitExceeded: 'Esta cantidad de huéspedes no está permitida',
      tryLowerGuests: 'Intenta de nuevo bajando la cantidad de huéspedes',
      checkAvailability: 'Comprobar disponibilidad',
      goToBookingData: 'Ir a datos de Reserva',
      blockedComponent: 'Funcionalidad bloqueada en la vista previa',
    },
    amenities: {
      title: 'Beneficios del lugar',
      noContent: 'Contenido no disponible',
      showAll: 'Mostrar más servicios',
      titleModal: 'Conoce más del lugar',
    },
    calendar: {
      title: '{count} noche en {location}',
      title_plural: '{count} noches en {location}',
    },
    review: {
      title: '¿Qué opinan los huéspedes?',
      review: 'Reseñas',
      noReviews: 'Aún no hay opiniones disponibles.',
      showAll: 'Descubre todas las reseñas',
      allReviews: 'Todas las Opiniones',
      sortTypes: {
        HIGHEST_RATED: 'Mejor valorados',
        LOWEST_RATED: 'Peor valorados',
        MOST_RECENT: 'Más recientes',
      },
    },
    rating: {
      notAvailable: 'No disponible',
      title: 'Favorito entre viajeros',
      description:
        'Este lugar es muy apreciado por los visitantes, basado en sus calificaciones, comentarios y confiabilidad',
      overall: 'Valoración General',
      categories: {
        cleanliness: 'limpieza',
        accuracy: 'precision',
        checkIn: 'registro',
        communication: 'comunicacion',
        location: 'ubicacion',
        value: 'valor',
      },
    },
    map: {
      title: 'A dónde irás',
      exactLocationAfterReservation:
        'Conocerás la ubicación exacta después de hacer la reservación',
      locationUnavailableMessage:
        'La información de ubicación no está disponible para esta propiedad',
    },
    photo: {
      showAllPhotos: 'Mostrar todas las fotos',
      noPhotos: 'No hay imágenes disponibles',
      goBack: 'Volver atras',
    },
    sleepingArrangements: {
      title: '¿Dónde vas a dormir?',
      types: {
        AIR_MATTRESS: 'Colchón inflable',
        BUNK_BED: 'Litera',
        COUCH: 'Sofá',
        CRIB: 'Cuna',
        DOUBLE: 'Cama doble',
        FLOOR_MATTRESS: 'Colchón en el suelo',
        HAMMOCK: 'Hamaca',
        KING: 'Cama king',
        QUEEN: 'Cama queen',
        SINGLE: 'Cama individual',
        SMALL_DOUBLE: 'Cama doble pequeña',
        SOFA_BED: 'Sofá cama',
        TODDLER_BED: 'Cama para niño pequeño',
        WATER_BED: 'Cama de agua',
      },
    },
    thingsToKnow: {
      title: 'Lo que debes saber',
      knowMore: 'Saber más',
      houseRules: {
        title: 'Reglas de la casa',
        description:
          'Estarás en la vivienda de alguien más, así que asegúrate de tratarla con consideración y respeto.',
        checkInOut: {
          title: 'Check-in y check-out',
          startEnd: 'El horario de check-in es de las {start} a las {end}',
          checkout: 'La salida es antes de las {checkout}',
          flexibleCheckIn: 'Check-in flexible',
          checkInFrom: 'Check-in es a partir de las {start}',
        },
        duringStay: {
          title: 'Durante tu estadía',
          guestNumber: '{count} viajeros como maximo',
          pets: {
            yes: 'Se admiten mascotas',
            no: 'No se admiten mascotas',
          },
          smoking: {
            yes: 'Se permite fumar',
            no: 'No se permite fumar',
          },
          events: {
            yes: 'Se permiten fiestas o eventos',
            no: 'Está prohibido hacer fiestas o eventos',
          },
          commercialPhotography: {
            yes: 'Fotografía comercial permitida',
            no: 'Fotografía comercial no permitida',
          },
          quietHours: 'Hora de silencio',
        },
        beforeLeave: {
          title: 'Antes de que te vayas',
          additionalRules: 'Reglas adicionales',
        },
      },

      safetyProperty: {
        title: 'Seguridad y Propiedad',
        description:
          'Para no llevarte sorpresas, revisa estos aspectos clave sobre la propiedad de tu anfitrión.',
        safetyConsiderations: {
          title: 'Consideraciones de seguridad',
          expectationClimbingOrPlayStructure:
            'Estructura para escalar o para jugar',
          expectationHeightsWithNoFence: 'Áreas elevadas sin protección',
          expectationLakeOrRiverOrWaterBody:
            'Cerca de un lago, un río u otro cuerpo de agua',
          expectationPoolOrJacuzziWithNoFence:
            'Piscina/jacuzzi sin puertas ni cerraduras',
          noChildrenAllowed: 'No apto para niños',
          noInfantsAllowed: 'No apto para bebés',
        },
        safetyDevices: {
          title: 'Dispositivos de seguridad',
          carbonMonoxideDetector: {
            yes: 'Hay detector de monóxido de carbono',
            no: 'No hay detector de monóxido de carbono',
          },
          smokeDetector: {
            yes: 'Hay alarma de humo',
            no: 'No hay alarma de humo',
          },
          expectationSurveillance: 'Sistema de videovigilancia en la propiedad',
          expectationNoiseMonitor: 'Monitores de ruido en la propiedad',
        },
        propertyInformation: {
          title: 'Información de la Propiedad',
          expectationWeapons: 'Puede que se encuentren armas',
          expectationHasPets: 'Hay mascotas en la propiedad',
          expectationAnimals:
            'Puede que se encuentren animales potencialmente peligrosos',
          expectationRequireStairs: 'Es necesario subir escaleras',
          expectationSharedSpaces: 'Hay espacios compartidos',
          expectedLimitedAmenities: 'Servicios o comodidades limitadas',
          expectationPotencialNoise: 'Puede haber ruido',
          expectationLimitedParking: 'Estacionamiento limitado',
        },
      },
      cancellationPolicy: {
        title: 'Políticas de cancelación',
        addDate: 'Agregar Fechas',
        addDateMessage:
          'Agrega las fechas de tu viaje para obtener los detalles de cancelación de esta estadía.',
        hostPolicyMessage:
          'Revisa la política completa de este anfitrión para más información',
        description:
          'Asegúrate de que la política de cancelación del anfitrión te convenga.',
        moreInformation: 'Más información sobre las políticas de cancelación',
        before: 'Antes de',
        after: 'Después de',
        full_refund: 'Reembolso total',
        partial_refund: 'Reembolso parcial',
        no_refund: 'Sin reembolso',
        booking_no_refund: 'Esta reservación no es reembolsable.',
        cancellation_policy_standard_flexible_description:
          'Los huéspedes recibirán un reembolso completo si cancelan hasta un día antes del check-in.',
        cancellation_policy_standard_flexible_summary:
          'Puedes cancelar hasta el {deadline} para obtener un reembolso completo. Si cancelas después de eso, se te cobrará por cada noche que te quedes, más {non_refundable_nights} noche adicional',
        cancellation_policy_standard_moderate_description:
          'Los huéspedes recibirán un reembolso completo si cancelan hasta 5 días antes del check-in',
        cancellation_policy_standard_moderate_summary:
          'Puedes cancelar antes del {deadline1} para obtener un reembolso completo. Si cancelas después del {deadline2}, se te cobrará por cada noche que te quedes, más {non_refundable_nights} noche adicional, y el {refund_percentage}% del costo de todas las noches restantes.',
        cancellation_policy_standard_firm_description:
          'Los huéspedes recibirán un reembolso completo si cancelan hasta 30 días antes del check-in, excepto en ciertos casos.',
        cancellation_policy_standard_firm_summary:
          'Para obtener un reembolso completo, debes cancelar antes del {deadline1}. Si cancelas antes del {deadline2}, se te cobrará el {refund_percentage}% del costo total. Si cancelas después del {deadline2}, se te cobrará el monto total. También puedes obtener un reembolso completo si cancelas después de {booking_window_hours} horas de realizada la reserva, si la cancelación ocurre antes del {deadline3}.',
        cancellation_policy_standard_strict_description:
          'Los huéspedes recibirán un reembolso completo si cancelan dentro de las 48 horas posteriores a la reserva y al menos 14 días antes del check-in.',
        cancellation_policy_standard_strict_summary:
          'Para obtener un reembolso completo, debes cancelar dentro de las {booking_window_hours} horas posteriores a la reserva, y la cancelación debe ocurrir antes del {deadline1}. Si cancelas antes del {deadline1} pero no dentro de las {booking_window_hours} horas posteriores a la reserva, se te cobrará el {refund_percentage}% del costo total. Si cancelas antes del {deadline2}, se te cobrará el {refund_percentage}% del costo total. Si cancelas después del {deadline2}, se te cobrará el monto total.',

        cancellation_policy_standard_rule_flexible_full_refund:
          'Puedes cancelar antes del {deadline} y recibir un reembolso completo, descontando únicamente los gastos externos ajenos a Hospédate Bolivia, tales como comisiones de pasarelas de pago, costos bancarios.',
        cancellation_policy_standard_rule_flexible_partial_refund:
          'Si cancelas después del {deadline}, se te cobrará por cada noche que te quedes, más {non_refundable_nights} noche adicional. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',
        cancellation_policy_standard_rule_moderate_full_refund:
          'Puedes cancelar antes del {deadline} y recibir un reembolso completo, descontando únicamente los gastos externos ajenos a Hospédate Bolivia, tales como comisiones de pasarelas de pago, costos bancarios.',
        cancellation_policy_standard_rule_moderate_partial_refund:
          'Si cancelas después del {deadline}, se te cobrará por cada noche que te quedes, más {non_refundable_nights} noche adicional, y el {refund_percentage}% del costo de todas las noches restantes. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',
        cancellation_policy_standard_rule_firm_full_refund:
          'Puedes cancelar antes del {deadline} y recibir un reembolso completo, descontando únicamente los gastos externos ajenos a Hospédate Bolivia, tales como comisiones de pasarelas de pago, costos bancarios.',
        cancellation_policy_standard_rule_firm_full_refund_booking_window:
          'Puedes cancelar dentro de las {booking_window_hours} horas de realizada la reserva, y antes del {deadline} y recibir un reembolso completo, descontando únicamente los gastos externos ajenos a Hospédate Bolivia, tales como comisiones de pasarelas de pago, costos bancarios.',
        cancellation_policy_standard_rule_firm_partial_refund:
          'Si cancelas antes del {deadline}, se te cobrará el {refund_percentage}% del costo total. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',
        cancellation_policy_standard_rule_firm_no_refund:
          'Si cancelas después del {deadline}, se te cobrará el monto total. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',
        cancellation_policy_standard_rule_strict_full_refund:
          'Puedes cancelar dentro de las {booking_window_hours} horas posteriores a la reserva, siempre que sea antes del {deadline}, y recibir un reembolso completo, descontando únicamente los gastos externos ajenos a Hospédate Bolivia, tales como comisiones de pasarelas de pago, costos bancarios.',
        cancellation_policy_standard_rule_strict_partial_refund:
          'Si cancelas antes del {deadline}, se te cobrará el {refund_percentage}% del costo total. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',
        cancellation_policy_standard_rule_strict_partial_refund_booking_window:
          'Si cancelas antes de {deadline} pero no dentro de las {booking_window_hours} horas posteriores a la reserva, se te cobrará el {refund_percentage}% del costo total. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',
        cancellation_policy_standard_rule_strict_no_refund:
          'Si cancelas después del {deadline}, se te cobrará el monto total. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',

        cancellation_policy_long_term_stay_firm_description:
          'Reembolso completo hasta 30 días antes de la llegada. Después de esa fecha, los primeros 30 días de estancia no son reembolsables.',
        cancellation_policy_long_term_stay_firm_summary:
          'Para obtener un reembolso completo, debes cancelar antes del {deadline}. Si cancelas después de eso, se te cobrará por todas las noches que hayas pasado, más {non_refundable_nights} noches adicionales. Si quedan menos de {non_refundable_nights} noches en la reserva, se te cobrará por todas las noches restantes.',
        cancellation_policy_long_term_stay_strict_description:
          'Reembolso completo si se cancela dentro de las 48 horas posteriores a la reserva y al menos 28 días antes de la llegada. Después de eso, los primeros 30 días de la estancia no son reembolsables.',
        cancellation_policy_long_term_stay_strict_summary:
          'Para obtener un reembolso completo, debes cancelar dentro de las {booking_window_hours} horas posteriores a la reserva, y la cancelación debe ocurrir antes del {deadline}. Si cancelas después de eso, se te cobrará por todas las noches que hayas pasado, más las siguientes {non_refundable_nights} noches. Si quedan menos de {non_refundable_nights} noches en la reserva, se te cobrará por todas las noches restantes.',

        cancellation_policy_long_term_stay_rule_firm_full_refund:
          'Puedes cancelar antes del {deadline} y recibir un reembolso completo, descontando únicamente los gastos externos ajenos a Hospédate Bolivia, tales como comisiones de pasarelas de pago, costos bancarios.',
        cancellation_policy_long_term_stay_rule_firm_partial_refund:
          'Si cancelas después del {deadline}, se te cobrará por todas las noches que hayas pasado, más {non_refundable_nights} noches adicionales. Si quedan menos de {non_refundable_nights} noches en la reserva, se te cobrará por todas las noches restantes. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',
        cancellation_policy_long_term_stay_rule_strict_full_refund:
          'Puedes cancelar dentro de las {booking_window_hours} horas posteriores a la reserva, siempre que sea antes del {deadline}, y recibir un reembolso completo, incluyendo la tarifa de servicio.',
        cancellation_policy_long_term_stay_rule_strict_partial_refund:
          'Si cancelas después del {deadline}, se te cobrará por todas las noches que hayas pasado, más las siguientes {non_refundable_nights} noches. Si quedan menos de {non_refundable_nights} noches en la reserva, se te cobrará por todas las noches restantes. Los gastos externos (pasarelas de pago, costos bancarios) no son reembolsables.',
      },
    },
  },
  menu: {
    dashboard: 'Dashboard',
    calendar: 'Calendario',
    listings: 'Anuncios',
    messages: 'Conversaciones',
    reservations: 'Reservaciones',
    earnings: 'Ganancias',
    insights: 'Estadisticas',
    menu: 'Menú',
    reviews: 'Reseñas',
    resourcesSupport: 'Recursos y Soporte',
    account: {
      account: 'Cuenta',
      profile: 'Tu Perfil',
      settings: 'Configuración de la cuenta',
      notifications: 'Notificaciones',
      refer: 'Recomendar un anfitrión',
      createListing: 'Crear un nuevo anuncio',
    },
    support: {
      connect: 'Conéctate con anfitriones cercanos',
      resources: 'Explorar recursos para anfitriones',
      helpCentre: 'Visitar el Centro de Ayuda',
      safety: 'Obtener ayuda con un problema de seguridad',
    },
    settings: {
      settings: 'Configuración',
      language: 'Idioma y traducción',
      currency: '$ USD',
    },
  },
  notificationPermission: {
    title: 'Activa las notificaciones',
    description: {
      part1: 'Recibe alertas',
      part2: 'en tiempo real sobre:',
      part3: 'Anuncios, mensajes y reservas.',
      part4: 'Así no te perderás ninguna actualización importante.',
    },
    activateNow: 'Activarlas ahora',
    remindMeLater: 'Preguntar después',
    dontAskAgain: 'No preguntar de nuevo',
    imageAlt: 'Imagen de notificación',
  },
  notifications: 'Notificaciones',
  today: {
    welcomeMessage: 'Me alegra verte de nuevo, {name}',
    reservationsHeader: 'Tus reservaciones',
    selectListing: 'Seleccionar anuncio',
    viewAllReservations: 'Ver todas las reservaciones',
    categories: {
      cancelled: 'Cancelados',
      checkIns: 'Check-ins',
      checkouts: 'Check-outs',
      inProgress: 'En progreso',
      pendingConfirmation: 'Pendiente Confirmación',
      pendingReviews: 'Pendiente Reseñas',
      scheduled: 'Programados',
    },
    cancelledByGuest: 'Cancelado por el huésped',
    flexibleCheckIn: 'Su checkin es flexible',
    checkInToday: 'Hará checkin hoy a las',
    checkOutToday: 'Hará check out hoy a las',
    lodgedNow: 'Alojado ahora mismo',
    wantsToStay: 'Quiere alojarse en',
    mustReview: 'Debe reseña de su experiencia',
    willStay: 'Se alojará en',
    days: 'dias',
    message: 'Mensajear',
    viewMore: 'Ver mas',
    noEvents: 'Uuups...  por ahora no tenemos datos para mostrarte',
    pendingApproval: 'Esperando tu aprobación',
    pendingPayment: 'Esperando pago del huésped',
  },
  hostListing: {
    title: 'Tus anuncios',
  },
  table: {
    title: 'Título',
    description: 'Descripción',
    estado: 'Estado',
    acciones: 'Acciones',
    bookings: 'Reservas',
  },
  hostReservations: {
    title: 'Reservas',
    loading: 'Cargando...',
    noUpcomingReservations: 'No tienes reservas próximas',
    seeAllReservations: 'Ver todas las reservas',
    noResultsFound: 'No se encontraron resultados',
    tryDifferentFilter: 'Por favor, prueba con un filtro diferente.',
    noReservations: 'No tienes reservas',
    views: {
      upcoming: 'Próximas',
      completed: 'Completadas',
      cancelled: 'Canceladas',
      all: 'Todas',
    },
  },
  earning: {
    title: 'Ganancias',
  },
  insights: {
    title: 'Estadisticas',
  },
  createListing: {
    toast: {
      confirmAddress: {
        confirmAddressWarning:
          'Confirmar que se trata de la dirección correcta',
        confirmAddressPrimary: 'Está correcta mi dirección',
        confirmAddressSecondary: 'Cambiar mi dirección',
      },
      errors: {
        saveFailed:
          'No se pudieron guardar los cambios. Vuelva a intentarlo más tarde.',
        fetchFailed:
          'No se pudo obtener la información. Vuelva a intentarlo más tarde.',
        deleteFailed: 'No se pudo eliminar. Vuelva a intentarlo más tarde.',
        updateFailed:
          'No se pudo actualizar la información. Vuelva a intentarlo más tarde.',
      },
    },
    modal: {
      confirmQuit: {
        title: 'Confirmar salida sin guardar',
        description: 'Se perderán los cambios no guardados. ¿Estás seguro?',
        heading: 'Guarda tu avance y vuelve luego',
        saved: 'Tu avance se guardará hasta este paso actual.',
        unsaved: 'El avance de tu paso actual no se guardará.',
        backToEdit: 'Volver a editar',
        saveAndExit: 'Guardar y salir',
      },
      published: {
        title: 'Tu anuncio fue publicado',
        description:
          'Ahora puedes consultarlo en tu lista de anuncios publicados.',
        welcome: 'Bienvenido a hospédate',
        subtitle: 'Tu anuncio ha sido agregado a tu lista de anuncios',
        verificationMessage:
          'Ahora debes verificarte para dar de alta este y otros anuncios futuros.',
        verifyButton: 'Verificar mi identidad',
        viewSpacesButton: 'Ver mis anuncios',
      },
      registeredUserModal: {
        title: 'Falta un último paso',
        imageAlt: 'Foto de tu espacio',
        reviewIntro: 'Mandaremos a revisión tu espacio:',
        reviewDetail: {
          part1: 'Una vez que verifiques tu identidad,',
          bold: 'nuestro equipo revisará tu anuncio',
          part2:
            'para asegurarse de que cumple con nuestros estándares de calidad y seguridad. Te notificaremos sobre el estado de tu publicación.',
        },
        postPublishIntro: 'Una vez publicado, puedes hacer lo siguiente:',
        stepCalendar: 'Configura el calendario',
        stepCalendarDescription:
          'Establece reglas de la casa, política de cancelación y preferencias de reserva.',
        stepReadyGuest: 'Prepárate para tu primer huésped',
        stepReadyGuestDescription:
          'Ten todo listo para comenzar a ganar huéspedes con Hospédate.',
        cta: 'Enviar a revisión',
      },
      unregisteredUserModal: {
        title: 'Falta un par de cosas para publicar tu anuncio',
        imageAlt: 'Foto del anuncio',
        description:
          'Para que tu anuncio se publique, deben pasar estas 2 cosas:',
        identity: {
          title: 'Verifica tu identidad',
          description:
            'Por seguridad, necesitamos confirmar tu identidad antes de revisar tu anuncio.',
        },
        review: {
          title: 'Revisión de tu anuncio',
          description: {
            part1: 'Una vez que verifiques tu identidad,',
            bold: 'nuestro equipo revisará tu anuncio',
            part2:
              'para asegurarse de que cumple con nuestros estándares de calidad y seguridad. Te notificaremos sobre el estado de tu publicación.',
          },
        },
        ctaPrimary: 'Verificar mi identidad ahora',
        ctaSecondary: 'Verificar mi identidad después',
      },
      common: {
        close: 'Cerrar',
        finalizationFailed:
          'No se pudo finalizar el proceso, inténtalo de nuevo',
      },
    },
    wizardHeader: {
      title: 'Crear un nuevo anuncio',
      save: 'Guardar y salir',
      quit: 'Salir',
      invalidSaveAttempt: 'Datos inválidos, se saldrá sin guardar sus cambios',
    },
    wizardFooter: {
      start: 'Comenzar',
      back: 'Atrás',
      next: 'Siguiente',
      publish: 'Publicar',
    },
    wizardStepContent: {
      loadingListing: 'Cargando el anuncio, espere por favor...',
      noCoordinates: 'No se han definido coordenadas',
      stepNotConfigured: 'Paso {step} no configurado.',
      createListingCover: {
        headingStart: 'Empezar a utilizar',
        headingMiddle: 'Hospédate',
        headingEnd: 'es muy',
        headingHighlight: 'fácil',
        firstTitle: 'Describe tu espacio',
        firstDescription:
          'Proporciona información básica, como la dirección y la capacidad máxima de huéspedes en el anuncio.',
        secondTitle: 'Destácalo con información',
        secondDescription:
          'Incluye al menos cinco imágenes, un título atractivo y una descripción. Estamos aquí para ayudarte.',
        thirdTitle: 'Finalizar y publicar',
        thirdDescription:
          'Selecciona un precio inicial, revisa algunos detalles y publica tu anuncio.',
      },

      placeInformationCover: {
        stepLabel: 'Paso 1',
        title: 'Describe tu espacio',
        description:
          'Te preguntaremos qué tipo de propiedad posees. Luego, indícanos la ubicación y cuántos huéspedes pueden alojarse.',
      },
      placeInformationPlaceType: {
        title: '¿Cuál de estas opciones describe mejor tu espacio?',
        noPlaceTypesAvailable: 'No hay tipos de propiedades disponibles',
      },
      placeInformationSearchLocation: {
        title: 'Coloca el marcador en donde se ubica tu anuncio',
        description:
          'Escribe en el buscador tu dirección o arrastra el pin hasta colocarlo exactamente donde se encuentra tu anuncio. Solo compartiremos tu dirección con huéspedes que tengan una reservación confirmada.',
        placeholder: 'Ingresa tu dirección...',
        manualEntry: 'Ingresar dirección manualmente',
        useCurrentLocation: 'Usar ubicación actual',
        currentLocationNotFound: 'No se pudo obtener la ubicación actual',
        orAlternative: 'O, alternativamente',
        noSuggestionsFound: 'No se encontraron sugerencias para esta búsqueda',
        permissionDenied:
          'Tu navegador bloqueó el acceso a la ubicación. Activa el permiso de ubicación para poder usar “Usar ubicación actual”.',
        outsideBoliviaError:
          'La ubicación ingresada debe estar dentro de Bolivia',
        notFound: 'No se encontró la ubicación, inténtalo de nuevo',
      },
      placeInformationConfirmLocation: {
        title: 'Dirección',
        subtitle:
          'Solo compartiremos tu dirección con los huéspedes que hayan hecho una reservación.',
        countryLabel: 'País / Región',
        addressLabel: 'Dirección',
        addressPlaceholder: 'Ej. Centro, Calle Aroma',
        aptLabel: 'Apartamento / Piso / Edificio (si corresponde)',
        aptPlaceholder: 'Ej.  n° 25',
        cityLabel: 'Ciudad / Municipio',
        cityPlaceholder: 'Ej. Santa Cruz de la Sierra',
        stateLabel: 'Provincia / Estado',
        statePlaceholder: 'Ej. Departamento de Santa Cruz',
        showExactLocationTitle: 'Mostrar la ubicación exacta',
        showExactLocationDescription:
          'Asegúrate de informar a los huéspedes sobre la ubicación de tu inmueble. Solo compartiremos tu dirección después de que realicen la reserva.',
        moreDetails: 'Más detalles.',
        approximateLocationLabel: 'Compartiremos tu ubicación aproximada',
      },
      placeInformationReviewLocation: {
        title: '¿Está el marcador en la ubicación adecuada?',
        description:
          'Solo compartiremos tu dirección con los huéspedes que hayan hecho una reservación.',
        markerTooFar:
          'El marcador no puede alejarse más de {meters} metros. Mueve el marcador más cerca de la ubicación para continuar',
        markerLabel:
          'Si lo requieres, mueve el pin hacia donde esté tu espacio',
      },
      placeInformationCapacity: {
        title: 'Agrega algunos datos básicos sobre tu inmueble',
        description:
          'Después podrás agregar más información sobre otros espacios de tu vivienda.',
        guestNumber: 'Huéspedes',
        roomNumber: 'Habitaciones',
        bedNumber: 'Camas',
        bathNumber: 'Baños',
        bathNumberCaption: 'Nota: "0.5" significa un baño sin ducha.',
      },
      placeFeaturesCover: {
        stepLabel: 'Paso 2',
        title: 'Destácalo con información',
        description:
          'En esta etapa, tendrás que incluir varias de las características que brinda tu espacio, así como al menos cinco imágenes. Después, deberás elaborar un título y una breve descripción.',
      },
      placeFeaturesAmenity: {
        title:
          'Informa a los visitantes sobre todas las maravillas que tu espacio ofrece.',
        description:
          'Puedes incluir más servicios una vez que tu espacio esté activo.',
        groups: {
          Preferred: 'Preferidos',
          Standout: 'Destacados',
          Safety: 'Seguridad',
          description: {
            Preferred:
              'Estas son las comodidades que los huéspedes suelen preferir. ¿Dispones de ellas?',
            Standout: '¿Tienes alguna característica especial que destacar?',
            Safety: '¿Posees alguno de estos dispositivos de seguridad?',
          },
        },
        noAmenitiesAvailable: 'No hay servicios disponibles',
      },

      placeFeaturesUploadPhotos: {
        title:
          'Incluye <span class="font-bold">mínimo 5 fotografías</span> para tu anuncio.',
        description:
          'Primero, necesitarás cinco fotos. Después podrás agregar más o hacer cambios.',
        addPhotosButton: 'Agregar fotos',
      },
      placeFeaturesGallery: {
        titleWithPhotos: 'Woow. ¿Qué tal lo ves?',
        descriptionWithPhotos:
          'Puedes arrastrar las imágenes para cambiarlas de lugar.',
        titleWithoutPhotos: 'Incluye algunas imágenes de tu espacio',
        descriptionWithoutPhotos:
          'Primero, necesitarás cinco fotos. Después podrás agregar más o hacer cambios.',
        addPhoto: 'Agregar foto',
        coverPhoto: 'Foto de portada',
        editCaptionTitle: 'Editar pie de foto',
        editCaptionSave: 'Guardar',
        captionPlaceholder: 'Escribe una descripción de esta fotografía',
        deleteConfirmTitle: '¿Deseas eliminar esta foto?',
        deleteConfirmText:
          'Esto es permanente: ya no podrás recuperar esta imagen.',
        deleteButton: 'Sí, eliminar',
        menuEdit: 'Editar',
        menuDelete: 'Eliminar',
        saving: 'Guardando...',
        deleting: 'Eliminando...',
        deleteErrorMessage: 'Error al eliminar la foto',
      },
      placeFeaturesTitle: {
        title: 'Ahora, dale un nombre a tu espacio',
        description:
          'Los títulos concisos suelen tener mejor impacto. No te preocupes, podrás modificarlo más tarde.',
        label: 'Título:',
        placeholder: 'Escribe el título de tu departamento',
        characterCount: '{count}/{max} caracteres',
      },
      placeFeaturesDescription: {
        title: 'Crea una presentación atractiva de tu espacio',
        description:
          'Destaca las características que hacen especial a tu lugar.',
        label: 'Descripción:',
        placeholder:
          'Tómate tu tiempo y analiza cuál sería la descripción más atractiva posible para tus huéspedes.',
        characterCount: '{count}/{max} caracteres',
      },
      placeSetupCover: {
        stepLabel: 'Paso 3',
        title: 'Terminar y publicar',
        description:
          'Finalmente, seleccionarás la configuración de las reservas, fijarás el precio y publicarás tu anuncio.',
      },
      placeSetupPricing: {
        title: 'Ahora, establece el precio',
        description: 'Puedes modificarlo cuando desees.',
        currencyLabel: 'BOB',
        pricePlaceholder: '0',
        error: 'El precio debe ser entre BOB 50 y BOB 10.000.',
      },
      placeSetupDiscount: {
        title: 'Añade los descuentos',
        description:
          'Destaca tu anuncio para conseguir reservas más rápido y obtener tus primeras opiniones.',
        weeklyLabel: 'Descuento semanal',
        weeklyDescription: 'Para estadías de 7 noches o más',
        monthlyLabel: 'Descuento mensual',
        monthlyDescription: 'Para estadías de 28 noches o más',
        warning: 'El descuento mensual debe ser superior al descuento semanal.',
      },
      uploadPhotosModal: {
        title: 'Sube tus fotos',
        subtitle_intro: 'Arrastra o toca el botón para agregar fotos.',
        subtitle_meta:
          'Formatos: {formats} • Tamaño: {minSizeKB} KB - {maxSizeMB} MB • Dimensiones: {minRes} - {maxRes} px',
        uploadButton: 'Subir {count} foto(s)',
        emptyContent: {
          noSelection: 'No seleccionaste ningún elemento.',
          instruction: 'Sube fotos',
          dropHint: 'o arrastra y suelta aquí',
          formatsHint: '{formats} (max. {size}MB)',
        },
        validation: {
          invalidFormat: 'Formato no válido',
          tooSmall: 'Menos de {minSize} KB',
          tooLarge: 'Límite de {maxSize} MB',
          tooSmallDimensions:
            'La imagen es demasiado pequeña. Mínimo: {minWidth}x{minHeight} px.',
          tooLargeDimensions:
            'La imagen es demasiado grande. Máximo: {maxWidth}x{maxHeight} px.',
          couldNotLoad: 'No se pudo cargar la imagen',
          uploadFailed: 'Error al subir la imagen',
        },
        successTitle: '¡Carga exitosa!',
        successMessage_one: 'Has subido 1 foto exitosamente',
        successMessage_other: 'Has subido {count} fotos exitosamente',

        uploadResultExplanation: 'Esto es lo que pasó con tus fotos',
        uploadResultMessage_partial_one: '1 foto se subió exitosamente',
        uploadResultMessage_partial_other:
          '{count} fotos se subieron exitosamente',
        uploadResultMessage_partialFailed_one: '1 foto no se pudo subir',
        uploadResultMessage_partialFailed_other:
          '{count} fotos no se pudieron subir',

        uploadResultMessage_error_one: 'Lo sentimos, no pudimos subir tu foto',
        uploadResultMessage_error_other:
          'Lo sentimos, no pudimos subir tus fotos',
        okButton: 'Listo',
        failedButton: 'Revisar que falló',
      },
    },
  },
  contentSwitcher: {
    map: 'Ver en mapa',
    list: 'Ver en lista',
    card: {
      title: '{type} en {location}',
      perNights_one: 'por {count} noche',
      perNights_other: 'por {count} noches',
      notAvailable: 'No disponible',
    },
  },
  placeTypes: {
    home: 'Casa',
    hotel: 'Hotel',
    house: 'Casa',
    apartment: 'Departamento',
    cabin: 'Cabaña',
    dome: 'Domo',
    Home: 'Casa',
    Hotel: 'Hotel',
    House: 'Casa',
    Apartment: 'Departamento',
    Cabin: 'Cabaña',
    Dome: 'Domo',
  },
  amenities: {
    'air-conditioning': 'Aire acondicionado',
    'arcade-games': 'Juegos arcade',
    'baby-bath': 'Bañera para bebés',
    'baby-monitor': 'Monitor para bebés',
    'baby-safety-gates': 'Puertas de seguridad para bebés',
    'babysitter-recommendations': 'Recomendaciones de niñera',
    backyard: 'Patio trasero',
    'baking-sheet': 'Bandeja para hornear',
    'barbecue-utensils': 'Utensilios para barbacoa',
    bathtub: 'Bañera',
    'batting-cage': 'Jaula de bateo',
    'bbq-grill': 'Parrilla',
    'beach-access': 'Acceso a la playa',
    'beach-essentials': 'Artículos de playa',
    'bed-linens': 'Ropa de cama',
    bidet: 'Bidet',
    bikes: 'Bicicletas',
    blender: 'Licuadora',
    'board-games': 'Juegos de mesa',
    'boat-slip': 'Embarcadero',
    'body-soap': 'Jabón corporal',
    'books-and-reading-material': 'Libros y material de lectura',
    'bowling-alley': 'Bolera',
    'bread-maker': 'Panificadora',
    breakfast: 'Desayuno',
    'carbon-monoxide-detector': 'Detector de monóxido de carbono',
    'ceiling-fan': 'Ventilador de techo',
    'changing-table': 'Cambiador',
    'childrens-bikes': 'Bicicletas para niños',
    'childrens-books-and-toys': 'Libros y juguetes para niños',
    'childrens-dinnerware': 'Vajilla infantil',
    'childrens-playroom': 'Sala de juegos para niños',
    'cleaning-available-during-stay': 'Limpieza disponible durante la estadía',
    'cleaning-products': 'Productos de limpieza',
    'climbing-wall': 'Muro de escalada',
    'clothing-storage': 'Almacenamiento de ropa',
    coffee: 'Café',
    'coffee-maker': 'Cafetera',
    conditioner: 'Acondicionador',
    'cooking-basics': 'Utensilios básicos de cocina',
    crib: 'Cuna',
    'dedicated-workspace': 'Espacio de trabajo dedicado',
    'dining-table': 'Mesa de comedor',
    'dishes-and-silverware': 'Vajilla y cubiertos',
    dishwasher: 'Lavavajillas',
    dryer: 'Secadora',
    'drying-rack-for-clothing': 'Tendedero',
    elevator: 'Ascensor',
    essentials: 'Elementos esenciales',
    'ethernet-connection': 'Conexión Ethernet',
    'ev-charger': 'Cargador EV',
    'exercise-equipment': 'Equipo de ejercicio',
    'extra-pillows-and-blankets': 'Almohadas y mantas adicionales',
    'fire-extinguisher': 'Extintor de incendios',
    'fire-pit': 'Fogata',
    'fire-screen': 'Pantalla para chimenea',
    'first-aid-kit': 'Botiquín de primeros auxilios',
    'free-parking-on-premises': 'Estacionamiento gratuito en el lugar',
    'free-street-parking': 'Estacionamiento gratuito en la calle',
    freezer: 'Congelador',
    'game-console': 'Consola de videojuegos',
    gym: 'Gimnasio',
    'hair-dryer': 'Secador de pelo',
    hammock: 'Hamaca',
    hangers: 'Perchas',
    heating: 'Calefacción',
    'high-chair': 'Silla alta',
    'hockey-rink': 'Pista de hockey',
    'hot-tub': 'Jacuzzi',
    'hot-water': 'Agua caliente',
    'hot-water-kettle': 'Hervidor de agua',
    'indoor-fireplace': 'Chimenea interior',
    iron: 'Plancha',
    kayak: 'Kayak',
    kitchen: 'Cocina',
    kitchenette: 'Cocineta',
    'lake-access': 'Acceso al lago',
    'laser-tag': 'Laser tag',
    'laundromat-nearby': 'Lavandería cercana',
    'life-size-games': 'Juegos de tamaño real',
    'long-term-stays-allowed': 'Estancias largas permitidas',
    'luggage-dropoff-allowed': 'Permite dejar equipaje',
    microwave: 'Microondas',
    'mini-fridge': 'Mininevera',
    'mini-golf': 'Mini golf',
    'mosquito-net': 'Mosquitero',
    'movie-theater': 'Cine',
    'outdoor-playground': 'Patio de juegos exterior',
    'outdoor-dining-area': 'Comedor exterior',
    'outdoor-furniture': 'Mobiliario exterior',
    'outdoor-kitchen': 'Cocina exterior',
    'outdoor-shower': 'Ducha exterior',
    'outlet-covers': 'Cubiertas de enchufes',
    oven: 'Horno',
    'packn-play-travel-crib': 'Cuna de viaje',
    'paid-parking-off-premises': 'Estacionamiento de pago fuera del lugar',
    'paid-parking-on-premises': 'Estacionamiento de pago en el lugar',
    'patio-or-balcony': 'Patio o balcón',
    piano: 'Piano',
    'ping-pong-table': 'Mesa de ping pong',
    'pocket-wifi': 'Wifi portátil',
    pool: 'Piscina',
    'pool-table': 'Mesa de billar',
    'portable-fans': 'Ventiladores portátiles',
    'private-entrance': 'Entrada privada',
    'private-living-room': 'Sala de estar privada',
    'record-player': 'Tocadiscos',
    refrigerator: 'Refrigerador',
    'resort-access': 'Acceso al resort',
    'rice-maker': 'Arrocera',
    'room-darkening-shades': 'Cortinas opacas',
    safe: 'Caja fuerte',
    sauna: 'Sauna',
    shampoo: 'Champú',
    'shower-gel': 'Gel de ducha',
    'single-level-home': 'Casa de un solo nivel',
    'skate-ramp': 'Rampa de skate',
    'ski-in-ski-out': 'Acceso directo a pistas',
    'smoke-detector': 'Detector de humo',
    'sound-system': 'Sistema de sonido',
    stove: 'Estufa',
    'sun-loungers': 'Reposeras',
    'table-corner-guards': 'Protecciones de esquinas',
    'theme-room': 'Habitación temática',
    toaster: 'Tostadora',
    'trash-compactor': 'Compactador de basura',
    tv: 'TV',
    washer: 'Lavadora',
    waterfront: 'Frente al agua',
    wifi: 'Wifi',
    'window-guards': 'Protectores de ventanas',
    'wine-glasses': 'Copas de vino',
  },
  reservationOptions: {
    'instant-book': 'Reserva instantánea',
    'self-check-in': 'Auto check-in',
    'allowed-pets': 'Se permiten mascotas',
  },
  amenityGroups: {
    Basic: 'Básico',
    Bathroom: 'Baño',
    'Bedroom and laundry': 'Dormitorio y lavandería',
    Entertainment: 'Entretenimiento',
    Family: 'Familia',
    'Heating and cooling': 'Calefacción y aire acondicionado',
    'Home safety': 'Seguridad del hogar',
    'Internet and office': 'Internet y oficina',
    'Kitchen and dining': 'Cocina y comedor',
    'Location features': 'Características de la ubicación',
    Outdoor: 'Exterior',
    'Parking and facilities': 'Estacionamiento e instalaciones',
    Services: 'Servicios',
    Preferred: 'Preferido',
    Standout: 'Destacado',
    Safety: 'Seguridad',
    Popular: 'Popular',
    Essentials: 'Elementos esenciales',
    Features: 'Características',
  },
  spaceTypes: {
    'Additional photos': 'Fotos',
    'Art Studio': 'Estudio de arte',
    Backyard: 'Patio trasero',
    Balcony: 'Balcón',
    Bedroom: 'Dormitorio',
    'Bowling alley': 'Bolera',
    'Children room': 'Cuarto de niños',
    Courtyard: 'Patio interior',
    Darkroom: 'Cuarto oscuro',
    Deck: 'Terraza de madera',
    'Dining area': 'Comedor',
    'Event room': 'Sala de eventos',
    Exterior: 'Exterior',
    'Front yard': 'Jardín delantero',
    'Full bathroom': 'Baño completo',
    'Full kitchen': 'Cocina completa',
    'Game room': 'Sala de juegos',
    Garage: 'Garaje',
    Garden: 'Jardín',
    Gym: 'Gimnasio',
    'Half bathroom': 'Medio baño',
    'Hot tub': 'Jacuzzi',
    Kitchenette: 'Cocineta',
    'Laundry area': 'Área de lavandería',
    Library: 'Biblioteca',
    'Living room': 'Sala de estar',
    'Movie theater': 'Sala de cine',
    'Music studio': 'Estudio de música',
    Office: 'Oficina',
    Patio: 'Patio',
    'Photography studio': 'Estudio fotográfico',
    Pool: 'Piscina',
    Porch: 'Porche',
    Rooftop: 'Azotea',
    Sunroom: 'Sala de sol',
    Terrace: 'Terraza',
    'Theme room': 'Cuarto temático',
    'Wine cellar': 'Bodega de vinos',
    Woodshop: 'Taller de carpintería',
    Workshop: 'Taller',
    Workspace: 'Espacio de trabajo',
  },
  users: {
    personalInfoTitle: 'Información personal',
    time: {
      lastUpdated: 'Última actualización: {time}',
      justNow: 'justo ahora',
      minute: 'hace un minuto',
      minutes: 'hace {count} minutos',
      hour: 'hace una hora',
      hours: 'hace {count} horas',
      day: 'hace un día',
      days: 'hace {count} días',
      month: 'hace un mes',
      months: 'hace {count} meses',
      year: 'hace un año',
      years: 'hace {count} años',
    },
    personalInfoBreadcrumbAccount: 'Cuenta',
    personalInfoBreadcrumbCurrent: 'Información personal',
    loginTitle: 'Inicio de sesión',
    passwordTitle: 'Contraseña',
    lastUpdatedOneMonthAgo: 'Última actualización: Hace un mes',
    edit: 'Editar',
    socialAccountsTitle: 'Cuentas en redes sociales',
    facebookTitle: 'Facebook',
    notConnected: 'Sin conexión',
    accountTitle: 'Cuenta',
    deactivate: 'Desactivar',
    deactivateAccount: 'Desactiva la cuenta',
    changePasswordTitle: 'Cambia tu contraseña',
    cancel: 'Cancelar',
    verify: 'Verificar',
    enterOldPasswordNote: 'Escribe tu contraseña anterior',
    oldPasswordLabel: 'Contraseña anterior',
    enterNewPasswordNote: 'Escribe tu contraseña nueva',
    newPasswordLabel: 'Contraseña nueva',
    repeatPasswordLabel: 'Repite la contraseña',
    hidePassword: 'Ocultar contraseña',
    showPassword: 'Mostrar contraseña',
    recommendationIntro:
      'Te recomendamos agregar los siguientes caracteres para agregar más seguridad:',
    recommendationNumbers: 'Números',
    recommendationSymbols: 'Caracteres especiales (!#$)',
    recommendationUppercase: 'Mayúsculas',
    passwordChangedSuccess: 'Tu contraseña ha sido cambiada con éxito',
    confirmButton: 'Listo',
    loginAndPrivacyTitle: 'Inicio de sesión y privacidad',
    loginAndPrivacyBreadcrumbAccount: 'Cuenta',
    loginAndPrivacyBreadcrumbCurrent: 'Inicio de sesión y privacidad',
    nameSection: 'Nombre',
    legalNameTitle: 'Nombre legal',
    legalNamePlaceholder: 'Juan Ignacio Guzmán Palenque',
    preferredNameTitle: 'Nombre preferido',
    preferredNamePlaceholder: 'No proporcionado',
    contactSection: 'Contacto',
    emailAddressTitle: 'Dirección de correo electrónico',
    notFound: 'Datos de usuario no encontrados',
    emailAddressPlaceholder: 'j*****x@gmail.com',
    phoneNumberTitle: 'Número de celular',
    phoneNumberDescription:
      'Incluye un número para que los huéspedes con reservas confirmadas y Hospédate puedan comunicarse contigo. También puedes añadir otros números y decidir cómo utilizarlos.',
    platformRegistrationSection: 'Darse de alta en la plataforma',
    identityVerificationTitle: 'Verificación de identidad',
    identityVerificationDescription:
      'Verifícate para poder alquilar tus anuncios en nuestra plataforma.',
    addButton: 'Agregar',
    // Legal Name Modal
    addOrModifyLegalNameTitle: 'Agregar o modificar el nombre legal',
    legalNameModalDescription:
      'Asegúrate de que coincide con el nombre que aparece en tu documento de identidad oficial.',
    firstNameLabel: 'Nombre que aparece en el documento de identidad',
    firstNamePlaceholder: 'Juan Ignacio',
    lastNameLabel: 'Apellidos que aparecen en el documento de identidad',
    lastNamePlaceholder: 'Guzmán Palenque',
    save: 'Guardar',
    invalidCharactersError:
      'Los nombres no pueden contener números o caracteres especiales',
    // Preferred Name Modal
    addOrModifyPreferredNameTitle: 'Agregar o modificar el nombre preferido',
    preferredNameModalDescription:
      'Así es como aparecerá tu nombre ante los anfitriones y huéspedes.',
    preferredNameLabel: 'Nombre que prefieras (opcional)',
    preferredNamePlaceholderText: 'Juanguz',
    // Email Modal
    addOrModifyEmailTitle: 'Agregar o modificar correo electrónico',
    emailModalDescription:
      'Utiliza una dirección a la que siempre tendrás acceso.',
    emailLabel: 'Dirección de correo electrónico',
    emailPlaceholderText: 'usuario@ejemplo.com',
    invalidEmailError:
      'Por favor ingresa una dirección de correo electrónico válida',
    // Phone Modal
    addOrModifyPhoneTitle: 'Agregar o modificar el celular',
    phoneModalDescription: 'Ingresa un número de teléfono nuevo',
    phoneLabel: 'Número de celular',
    phonePlaceholderText: '+591 76349200',
    invalidPhoneError: 'Por favor ingresa un número de teléfono válido',
    phoneVerificationTitle: 'Agregar o modificar el celular',
    phoneVerificationDescription:
      'Ingresa el código de verificación de tu número',
    verificationCodeLabel: 'Código de verificación',
    verificationCodePlaceholder: 'H34GK2',
    resendCode: 'Reenviar código',
    invalidCodeError: 'Por favor ingresa un código de verificación válido',
    phoneVerifiedSuccess:
      'Tu número {phoneNumber} ha sido verificado con éxito.',
    ready: 'Listo',
    modal: {
      deactivateAccountTitle: 'Desactivar tu cuenta',
      deactivateAccountDescription:
        '¿Estás seguro de que quieres desactivar tu cuenta? Esta acción es irreversible.',
      deactivateAccountConfirm: 'Sí, quiero desactivar mi cuenta',
      goBack: 'Volver atrás',
      deactivating: 'Desactivando...',
    },
  },
  trips: {
    pageTitle: 'Tus viajes',
    tabs: {
      current: 'Actuales',
      past: 'Pasados',
      cancelled: 'Cancelados',
      rejected: 'Rechazados',
    },
    content: {
      current: 'Tus viajes actuales aparecerán aquí.',
      past: 'Tus viajes pasados aparecerán aquí.',
      cancelled: 'Tus viajes cancelados aparecerán aquí.',
      rejected: 'Tus viajes rechazados aparecerán aquí.',
    },
    status: {
      checkedInNow: 'Alojado ahora mismo',
      checkingInToday: 'Te alojarás hoy',
      checkingInDays: 'Te alojarás en {days} días',
      pendingApproval: 'Por aprobar',
      rejectedByGuest: 'Cancelado por ti',
      rejectedByHost: 'Cancelado por el host',
      cancelled: 'Cancelado',
      rejected: 'Rechazado',
    },
    actions: {
      leaveReview: 'Deja tu reseña',
    },
    timeline: {
      noMoreReservations: 'No hay más reservas',
    },
    error: {
      defaultTitle: 'Algo salió mal',
      loadTrips: 'Error al cargar los viajes. Por favor, inténtalo de nuevo.',
      retry: 'Reintentar',
      retrying: 'Reintentando...',
      general: 'Algo salió mal. Por favor, inténtalo más tarde.',
    },
    // Reservation Data translations
    reservationData: 'Datos de la reserva',
    guests: 'Huéspedes',
    adultOne: 'adulto',
    adultOther: 'adultos',
    childOne: 'niño',
    childOther: 'niños',
    pets: 'mascotas',
    peopleOne: 'persona',
    peopleOther: 'personas',
    petOne: 'mascota',
    and: 'y',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    dayOne: 'día',
    dayOther: 'días',
    nights: 'noches',
    nightsUnit: 'días',
    days: 'días',
    bookingDays: 'Días de reserva',
    totalAmount: 'Monto total',
    openCalendar: 'Abrir calendario',
    // Payment translations
    payment: 'Pago del huésped',
    guestPayment: 'Cobro al huésped',
    guestFee: 'Tarifa al huésped',
    occupancyTax: 'impuestos de ocupación',
    serviceFee: 'Tarifa de servicio',
    cleaningFee: 'Tarifa de limpieza',
    weeklyDiscount: 'Descuento semanal',
    monthlyDiscount: 'Descuento mensual',
    total: 'Total',
    // Host profit translations
    hostProfit: 'Ganancia del anfitrión',
    yourEarnings: 'Tus ganancias',
    grossEarnings: 'Tarifa por {nights} noches',
    processingFee: 'Tarifa de procesamiento',
    hostFee: 'Tarifa de host',
    netEarnings: 'Ganancias netas',
    // Private notes translations
    privateNotes: 'Notas privadas',
    privateNotesDescription:
      'Agrega notas privadas sobre esta reserva (solo tú puedes verlas)',
    privateNotesPlaceholder: 'Agrega tus notas privadas aquí...',
    // House cover translations
    houseCover: 'Cobertura de la casa',
    houseCoverDescription:
      'Información sobre la cobertura y protección de la propiedad',
  },
  tripDetail: {
    pageTitle: 'Detalles del viaje',
    title: 'Detalles de la reservación',
    propertyTitle: 'Hermosa habitación con balcón, excelente ubicación',
    status: {
      host: {
        wantCheckInDays: 'Quiere alojarse en {days} días',
        checkingInDays: 'Se alojará en {days} días',
        checkedInNow: 'Alojado ahora mismo',
        checkingInToday: 'Hará check in hoy a las {time}',
        checkingOutToday: 'Hará check out hoy a las {time}',
        leaveReview: 'Debe reseña de su experiencia',
        cancelled: 'Cancelado',
        cancelledByHost: 'El anfitrión canceló la reserva a las {time}',
        cancelledByGuest: 'El huésped canceló la reserva a las {time}',
        pendingApproval: 'Esperando tu aprobación',
        pendingPayment: 'Esperando pago del huésped',
      },
      pendingApproval: 'Esperando aprobación',
      pendingPayment: 'Esperando tu pago',
      checkingInDays: 'Te alojarás en {days} días',
      checkedInNow: 'Alojado ahora mismo',
      checkingInToday: 'Hará check in hoy a las {time}',
      checkingOutToday: 'Hará check out hoy a las {time}',
      leaveReview: 'Deja tu reseña',
      cancelled: 'Cancelado',
      rejected: 'Rechazado',
    },
    actions: {
      save: 'Guardar',
      share: 'Compartir',
      showAllPhotos: 'Mostrar todas las fotos',
      viewHostProfile: 'Ver perfil del Host',
      viewGuestProfile: 'Ver perfil del huésped',
      viewConversation: 'Ver conversación',
      paymentDetails: 'Detalles del pago',
      downloadReceipt: 'Descargar recibo',
      viewMore: 'Ver más',
      emailHost: 'Enviar correo al host',
      cancelReservation: 'Cancelar reservación',
      reportHost: 'Reportar al host',
      reportProblem: 'Reportar un problema',
      approveRequest: 'Aprobar solicitud',
      rejectRequest: 'Rechazar solicitud',
    },
    host: {
      hostedBy: 'Hosteado por',
      about: 'Sobre {hostName}',
      verified: 'Identidad verificada',
      noVerified: 'Identidad no verificada',
      reviews: '{count} reseñas',
      noReviews: 'No tiene reseñas',
      joinedIn: 'Creó su cuenta en {year}',
      livesIn: 'Vive en {location}',
      livesInCityCountry: 'Vive en {city}, {country}',
      ratingAndReviews: '{rating} puntuación ({count} reseñas)',
    },
    booking: {
      title: 'Datos de la reserva',
      howMany: 'Cuántos son',
      guests: '{count} personas y {pets} mascota',
      guestsOnly: '{count} personas',
      checkIn: 'Check In',
      checkOut: 'Check Out',
    },
    payment: {
      title: 'Información de pago',
      totalPaid: 'Total pagado:',
      currency: 'Bs {amount}',
      reservationCode: 'Código de reserva',
    },
    paymentRequest: {
      haveBeenApproved: 'Has sido aprobado/a por el anfitrión',
      payToReserve: 'Ahora paga para reservar',
      goToPayment: 'Ir a pagar la reserva',
    },
    houseRules: {
      title: 'Reglas de la casa',
      checkInTime: 'El check in es a partir de las {time}',
      checkoutTime: 'El check out es a las {time}',
      maxGuests: '{count} huéspedes',
    },
    security: {
      title: 'Seguridad y propiedad',
      noDetector: 'No consta que tenga un detector de {type}',
      carbonMonoxide: 'monóxido de carbono',
      smoke: 'humo',
    },
    cancellation: {
      title: 'Política de cancelación',
      policy:
        'Cancelación {type}: Reembolso del {percentage}% hasta {days} días antes.',
      reasonTitle: 'Motivo de la cancelación',
      policyTitle: 'Información de la política',
      dataTitle: 'Datos de la cancelación',
      cancelledBy: 'Cancelado por',
      CANCELLED_BY_HOST: 'Anfitrión',
      CANCELLED_BY_GUEST: 'Huésped',
      CANCELLED_WITH_PENALTY: 'Cancelado con penalización',
      CANCELLED_WITHOUT_PENALTY: 'Cancelado sin penalización',
      cancelledBySystem: 'Sistema',
      cancellationDate: 'Fecha de cancelación',
      status: 'Estado',
      statusConfirmed: 'Confirmado',
      statusPending: 'Pendiente',
      statusProcessing: 'En proceso',
      policyApplication: 'Aplicación de política',
      flexible: 'Flexible',
      flexibleDescription: 'Reembolso completo 1 día antes de la llegada',
      moderate: 'Moderada',
      moderateDescription: 'Reembolso completo 5 días antes de la llegada',
      strict: 'Estricta',
      strictDescription: 'Reembolso completo 14 días antes de la llegada',
      guestPaymentBefore: 'Pago del huésped antes de la cancelación',
      hospedateFee: 'Fee de Hospédate (si es que aplica)',
      totalRefundGuest: 'Reembolso total al huésped (si es que aplica)',
      amountPaidHost: 'Monto pagado al host (si es que aplica)',
      penaltyDescription: 'Descripción de penalización',
      notApplicable: 'No aplica',
      noPenalty: 'Sin penalización',
      refundedNights: 'Noches reembolsadas',
      refundedNightsValue: '{nights} noches (Bs {amount})',
      seeMore: 'Ver más',
      cancelStatus: {
        CANCELLED_WITH_PENALTY: 'Con penalización',
        CANCELLED_WITHOUT_PENALTY: 'Sin penalización',
      },
    },
    support: {
      title: 'Soporte',
      emailHost: 'Enviar correo al host',
      cancelReservation: 'Cancelar reservación',
      reportHost: 'Reportar al host',
      reportProblem: 'Reportar un problema',
      emailGuest: 'Enviar correo al huésped',
      reportGuest: 'Reportar al huésped',
    },
    experience: {
      leaveReview: {
        title: '¿Qué tal fue tu experiencia?',
        subtitle: 'Cuéntale al mundo qué tal es alojarse en este anuncio.',
        button: 'Deja tu reseña',
        qualifyGuest: 'Calificar huésped',
        requestQualify: 'Pedir al huésped que me califique',
      },
      revisit: {
        title: 'Revisita esta experiencia',
        subtitle: 'Vuelve a donde fuiste feliz, agenda de nuevo este anuncio.',
        button: 'Ver disponibilidad',
      },
    },
    review: {
      title: '¿Cómo estuvo tu experiencia?',
      subtitle:
        'Crea tu reseña sobre la experiencia que tuviste en el espacio de {host}',
      talkAbout: 'Háblanos de tu vivencia',
      placeholder: 'Escribe la descripción aquí',
      registerButton: 'Registrar experiencia',
      ratings: {
        limpieza: 'Limpieza',
        exactitud: 'Exactitud',
        checkin: 'Check In',
        comunicacion: 'Comunicación',
        ubicacion: 'Ubicación',
        precio: 'Precio',
      },
      success: {
        title: '¡Muchas gracias!',
        subtitle:
          'Hemos enviado tu reseña para que otros viajeros la tomen en cuenta.',
        closeButton: 'Cerrar',
      },
    },
    modal: {
      approveRequest: 'Aprobar solicitud',
      areYouSureApprove:
        '¿Estás seguro que deseas aprobar esta solicitud de aprobación de reserva?',
      yesToApprove: 'Sí, quiero aprobar la solicitud',
      rejectRequest: 'Rechazar solicitud',
      areYouSureReject:
        '¿Estás seguro que deseas rechazar esta solicitud? Esta accion es irreversible.',
      yesToReject: 'Sí, quiero cancelar la solicitud',
      goBack: 'Volver atras',
      requestApproved: 'Solicitud aprobada',
      youApprovedRequest: 'Has aprobado esta reserva',
      goBackActivities: 'Volver a ver mis actividades',
      watchDetails: 'Ver detalles de la reserva',
      loading: 'Procesando...',
      approveRequestError: 'Error al aprobar la solicitud. Intenta de nuevo.',
      rejectRequestError: 'Error al rechazar la solicitud. Intenta de nuevo.',
    },
  },
  messages: {
    title: 'Mensajes',
    filter: {
      all: 'Todos',
      unread: 'No leídos',
      favorites: 'Favoritos',
    },
    searchBar: {
      title: 'Busca aquí',
    },
    averageResponseTime: 'Tiempo de respuesta típico: {hours} horas',
    inputMessagePlaceholder: 'Mensajea aquí',
    delivered: 'Entregado',
    seen: 'Visto',
    sent: 'Enviado',
    startConversation: '¡Empieza una conversación ahora!',
    selectConversation: 'Selecciona una conversación para comenzar a chatear.',
    backToConversations: '← Volver a conversaciones',
    andXMore: 'y {count} más',
    attachImage: 'Adjuntar imágenes',
    sendMessage: 'Enviar mensaje',
    removeImage: 'Eliminar imagen',
    maxCharsError: 'Longitud máxima de caracteres',
    maxImagesError: 'Solo puedes adjuntar hasta {maxImages} imágenes',
    showTripDetails: 'Detalles',
    houseRules: {
      title: 'Reglas de la casa',
      checkInStartTime: 'El check in es a partir de las {time}',
      guests: '{count} huéspedes',
      petsAllowed: 'Se permiten mascotas',
      petsNotAllowed: 'No se permiten mascotas',
      smokingAllowed: 'Se permite fumar',
      smokingNotAllowed: 'No se permite fumar',
      partiesAllowed: 'Se permiten fiestas',
      partiesNotAllowed: 'No se permiten fiestas',
      seeMore: 'Ver más',
      seeLess: 'Ver menos',
    },
    security: {
      title: 'Seguridad y propiedad',
      carbonMonoxideDetector:
        'No consta que tenga un detector de monóxido de carbono',
      smokeDetector: 'No consta que tenga un detector de humo',
      seeMore: 'Ver más',
      seeLess: 'Ver menos',
    },
    host: {
      hostedBy: 'Hosteado por',
      aboutHost: 'Sobre {hostName}',
      verified: 'Identidad verificada',
      reviews: '{count} reseñas',
      joined: 'Creó su cuenta en {year}',
      livesIn: 'Vive en {location}',
      viewProfile: 'Ver perfil del host',
      call: 'Llamar',
    },
    reservation: {
      title: 'Datos de la reserva',
      howManyTitle: 'Cuántos son',
      howMany: '{guestCount} {guestLabel}{pets}',
      guestSingular: 'huésped',
      guestPlural: 'huéspedes',
      petSingular: ' y {petCount} mascota',
      petPlural: ' y {petCount} mascotas',
      checkIn: 'Check in',
      checkOut: 'Check out',
    },
    payment: {
      title: 'Información de pago',
      totalPaid: 'Total pagado',
      details: 'Detalles del pago',
      downloadReceipt: 'Descargar recibo',
    },
    support: {
      title: 'Soporte',
      emailHost: 'Enviar correo al host',
      cancel: 'Cancelar reservación',
      report: 'Reportar al host',
    },
    seenAt: 'Visto a las {hour}',
    errors: {
      failLoad: 'No se pudo cargar',
      retry: 'Reintentar',
      couldNotSend: 'No se pudo enviar',
      couldNotOpenConversation: 'No se pudo abrir la conversación.',
    },
    listing: {
      label: 'Tu alojamiento',
    },
    you: 'Tú',
    photo: '📸 Imagen',
    goToBottom: 'Ir al final',
    goToBottomWithCount_one: 'Ir al final • {count} mensaje nuevo',
    goToBottomWithCount_other: 'Ir al final • {count} mensajes nuevos',
    noConversations: 'No tienes conversaciones',
    guest: {
      reservedBy: 'Huésped',
      aboutGuest: 'Acerca de {guestName}',
      verified: 'Identidad verificada',
      reviews: '{count} reseñas',
      joined: 'Usuario desde {year}',
      livesIn: 'Vive en {location}',
      viewProfile: 'Ver perfil',
    },
    invalidImageFormat: 'Formato de imagen no permitido. Usa {allowed}.',
    imageTooSmall: 'La imagen es muy pequeña: mínimo {minW}×{minH}px.',
    imageTooLarge: 'La imagen es muy grande: máximo {maxW}×{maxH}px.',
    imageValidationError: 'No se pudo validar la imagen. Inténtalo con otra.',
    systemMessage: '[Mensaje del sistema]',
    viewImage: 'Ver imagen',
    photoAlt: 'Foto',
    photoBy: 'Foto de {name}',
    imagePreviewAlt: 'Vista previa de imagen',
  },
  unauthorized: {
    title: 'Acceso denegado',
    description: 'No tienes permiso para ver esta página.',
    goBack: 'Regresar',
  },
  interests: {
    'Adrenaline sports': 'Deportes de adrenalina',
    'American football': 'Fútbol americano',
    Animals: 'Animales',
    Anime: 'Anime',
    Archery: 'Tiro con arco',
    Architecture: 'Arquitectura',
    Art: 'Arte',
    'Artisanal crafts': 'Artesanías',
    Aviation: 'Aviación',
    Badminton: 'Bádminton',
    Baseball: 'Béisbol',
    Basketball: 'Baloncesto',
    'Basque pelota': 'Pelota vasca',
    Billiards: 'Billar',
    'Board games': 'Juegos de mesa',
    Bobsledding: 'Bobsleigh',
    'Bocce ball': 'Bochas',
    Bowling: 'Boliche',
    Boxing: 'Boxeo',
    Bridge: 'Bridge',
    'Building things': 'Construir cosas',
    Camping: 'Campamento',
    Canoeing: 'Canotaje',
    'Card games': 'Juegos de cartas',
    Cars: 'Autos',
    Charreria: 'Charrería',
    Cheerleading: 'Porristas',
    Chess: 'Ajedrez',
    Climbing: 'Escalada',
    Cocktails: 'Cócteles',
    Coffee: 'Café',
    Comedy: 'Comedia',
    'Content creation': 'Creación de contenido',
    Cooking: 'Cocina',
    Crafting: 'Manualidades',
    Cricket: 'Críquet',
    'Cultural heritage': 'Patrimonio cultural',
    Curling: 'Curling',
    Cycling: 'Ciclismo',
    Dance: 'Baile',
    Darts: 'Dardos',
    Diving: 'Buceo',
    Dodgeball: 'Quemados',
    'Equestrian sports': 'Deportes ecuestres',
    'Fantasy sports': 'Deportes de fantasía',
    Fashion: 'Moda',
    Fencing: 'Esgrima',
    'Figure skating': 'Patinaje artístico',
    Films: 'Cine',
    Fishing: 'Pesca',
    Fitness: 'Fitness',
    Food: 'Comida',
    Football: 'Fútbol',
    Gardening: 'Jardinería',
    Golf: 'Golf',
    Gymnastics: 'Gimnasia',
    Hair: 'Cabello',
    Handball: 'Balonmano',
    Hiking: 'Senderismo',
    History: 'Historia',
    'Home improvement': 'Mejoras del hogar',
    'Horse racing': 'Carreras de caballos',
    'Ice hockey': 'Hockey sobre hielo',
    Judo: 'Judo',
    Karaoke: 'Karaoke',
    Kayaking: 'Kayak',
    Kickboxing: 'Kickboxing',
    'Kung fu': 'Kung-fu',
    Lacrosse: 'Lacrosse',
    'Live music': 'Música en vivo',
    'Live sports': 'Deportes en vivo',
    'Local culture': 'Cultura local',
    Luge: 'Luge',
    'Make-up': 'Maquillaje',
    Meditation: 'Meditación',
    'Motor sports': 'Deportes de motor',
    Museums: 'Museos',
    Netball: 'Netball',
    Nightlife: 'Vida nocturna',
    Outdoors: 'Aire libre',
    Padel: 'Pádel',
    Pentathlon: 'Pentatlón',
    Photography: 'Fotografía',
    Pickleball: 'Pickleball',
    Plants: 'Plantas',
    'Playing music': 'Tocar música',
    Podcasts: 'Podcasts',
    Poker: 'Póker',
    Polo: 'Polo',
    Puzzles: 'Rompecabezas',
    Racquetball: 'Ráquetbol',
    Reading: 'Lectura',
    Rodeo: 'Rodeo',
    'Roller skating': 'Patinaje sobre ruedas',
    Rowing: 'Remo',
    Rugby: 'Rugby',
    Running: 'Correr',
    Sailing: 'Vela',
    'Self-care': 'Cuidado personal',
    'Shooting sports': 'Deportes de tiro',
    Shopping: 'Compras',
    Singing: 'Cantar',
    Skateboarding: 'Patineta',
    Skiing: 'Esquí',
    Snorkeling: 'Esnórquel',
    Snowboarding: 'Snowboard',
    'Social activism': 'Activismo social',
    Spa: 'Spa',
    Squash: 'Squash',
    'Sumo wrestling': 'Sumo',
    Surfing: 'Surf',
    Sustainability: 'Sostenibilidad',
    Swimming: 'Natación',
    'Table tennis': 'Tenis de mesa',
    Taekwondo: 'Taekwondo',
    'Tai chi': 'Tai chi',
    Technology: 'Tecnología',
    Tennis: 'Tenis',
    Theater: 'Teatro',
    'Track and field': 'Atletismo',
    Travel: 'Viajar',
    TV: 'Televisión',
    'Ultimate frisbee': 'Ultimate frisbee',
    'Video games': 'Videojuegos',
    Volleyball: 'Voleibol',
    Volunteering: 'Voluntariado',
    Walking: 'Caminar',
    'Water polo': 'Waterpolo',
    'Water sports': 'Deportes acuáticos',
    Weightlifting: 'Levantamiento de pesas',
    Wine: 'Vino',
    Wrestling: 'Lucha libre',
    Writing: 'Escritura',
    Yoga: 'Yoga',
  },
  supportPage: {
    pageTitle: 'Soporte - Hospédate Bolivia',
    title: {
      doubts: '¿Dudas?',
      weAnswer: 'Te las respondemos todas',
    },
    tabs: {
      host: 'Anfitrión',
      guest: 'Huésped',
    },
    faq: {
      guest: [
        {
          question: '¿Cómo puedo pagar mi reserva?',
          answer: `Con tarjeta de débito/crédito y QR Simple. Todo se 
procesa de forma segura a través de pasarelas autorizadas.`,
        },
        {
          question: '¿Qué beneficios tengo al reservar en Hospédate Bolivia?',
          answer: `- Pagos en moneda nacional. <br>
- Más propiedades locales disponibles. <br>
- Atención directa por WhatsApp.`,
        },
        {
          question: '¿Qué pasa si debo cancelar una reserva?',
          answer: `El reembolso depende de la política de cancelación del anfitrión: <br>
- Flexible: hasta 24 h antes. <br>
- Moderada: hasta 5 días antes. <br>
- Firme: hasta 30 días antes. <br>
- Estricta: hasta 14 días antes. <br>
Siempre descontando costos de terceros (pasarelas, bancos, etc.).`,
        },
        {
          question:
            '¿Cómo puedo contactar al soporte técnico para resolver mis dudas?',
          answer: `Para contactar al soporte técnico y resolver tus dudas, 
        puedes enviarnos un mensaje o llamarnos directamente 
        a través de WhatsApp para una atención más rápida. 
        Simplemente envía tu consulta al número 
        <a href="https://wa.me/59175321619" target="_blank" 
           class="text-success font-semibold underline">
           +591 75321619
        </a> y te responderemos lo antes posible.`,
        },
      ],
      host: [
        {
          question: '¿Qué es Hospédate Bolivia?',
          answer: `Es una plataforma de alquiler temporal por noches, que 
conecta anfitriones con huéspedes, actuando como intermediario digital. 
No posee, administra ni alquila inmuebles.`,
        },
        {
          question: '¿Qué comisión cobra Hospédate Bolivia?',
          answer: `3% al anfitrión (descontado automáticamente de cada reserva 
confirmada).<br>
Beneficio de lanzamiento: los primeros 100 anfitriones registrados tendrán 
0% de comisión durante 3 meses`,
        },
        {
          question: '¿Cómo y cuándo recibo mis pagos?',
          answer: `El pago neto se transfiere a tu cuenta bancaria registrada 24 horas 
después del check-in, en días hábiles. Si el huésped realiza el check-in un viernes, el pago se procesará el lunes.`,
        },
        {
          question: '¿Qué obligaciones tengo como anfitrión?',
          answer: `- Garantizar acceso, limpieza y servicios básicos. <br>
- Atender incidentes directamente con el huésped. <br>
- Cumplir normas de seguridad y habitabilidad.`,
        },
        {
          question: '¿Qué es el Fondo de Protección?',
          answer: `Es un respaldo gratuito financiado por Hospédate Bolivia que cubre daños 
accidentales leves o moderados (muebles, electrodomésticos, ropa de 
cama). <br>
Requiere: mínimo 3 estadías completadas, check-in/out con fotos y reclamo 
dentro de 48 h.`,
        },
        {
          question: '¿Qué pasa si debo cancelar una reserva?',
          answer: `Puedes hacerlo, pero el huésped tiene derecho a reembolso según la 
política de cancelación que elegiste (Flexible, Moderada, Firme o Estricta). 
Además, tu anuncio puede recibir sanciones o suspensión.`,
        },
        {
          question: '¿Debo pagar impuestos por mis ingresos?',
          answer: `Los ingresos por alquiler son de tu exclusiva responsabilidad fiscal. 
Hospédate solo factura su comisión.`,
        },
        {
          question:
            '¿Cómo puedo contactar al soporte técnico para resolver mis dudas?',
          answer: `Para contactar al soporte técnico y resolver tus dudas,
        puedes enviarnos un mensaje o llamarnos directamente
        a través de WhatsApp para una atención más rápida.
        Simplemente envía tu consulta al número
        <a href="https://wa.me/59175321619" target="_blank"
           class="text-success font-semibold underline">
           +591 75321619
        </a> y te responderemos lo antes posible.`,
        },
      ],
    },
  },

  languages: {
    English: 'Inglés',
    Afrikaans: 'Afrikáans',
    Albanian: 'Albanés',
    'American Sign Language': 'Lengua de señas americana',
    Arabic: 'Árabe',
    Armenian: 'Armenio',
    Azerbaijani: 'Azerbaiyano',
    Basque: 'Vasco',
    Belarusian: 'Bielorruso',
    Bengali: 'Bengalí',
    Bosnian: 'Bosnio',
    'Brazilian Sign Language': 'Lengua de señas brasileña',
    'British Sign Language': 'Lengua de señas británica',
    Bulgarian: 'Búlgaro',
    Burmese: 'Birmano',
    Catalan: 'Catalán',
    Chinese: 'Chino',
    Croatian: 'Croata',
    Czech: 'Checo',
    Danish: 'Danés',
    Dutch: 'Neerlandés',
    Estonian: 'Estonio',
    Filipino: 'Filipino',
    Finnish: 'Finés',
    French: 'Francés',
    'French Sign Language': 'Lengua de señas francesa',
    Galician: 'Gallego',
    Georgian: 'Georgiano',
    German: 'Alemán',
    Greek: 'Griego',
    Gujarati: 'Guyaratí',
    Haitian: 'Haitiano',
    Hebrew: 'Hebreo',
    Hindi: 'Hindi',
    Hungarian: 'Húngaro',
    Icelandic: 'Islandés',
    Indonesian: 'Indonesio',
    Irish: 'Irlandés',
    Italian: 'Italiano',
    Japanese: 'Japonés',
    Kannada: 'Canarés',
    Khmer: 'Jemer',
    Korean: 'Coreano',
    Kyrgiz: 'Kirguís',
    Lao: 'Lao',
    Latvian: 'Letón',
    Lithuanian: 'Lituano',
    Macedonian: 'Macedonio',
    Malay: 'Malayo',
    Maltese: 'Maltés',
    Marathi: 'Maratí',
    Norwegian: 'Noruego',
    Persian: 'Persa',
    Polish: 'Polaco',
    Portuguese: 'Portugués',
    Punjabi: 'Punyabí',
    Romanian: 'Rumano',
    Russian: 'Ruso',
    Serbian: 'Serbio',
    'Sign Language': 'Lengua de señas',
    Slovak: 'Eslovaco',
    Slovenian: 'Esloveno',
    Spanish: 'Español',
    'Spanish Sign Language': 'Lengua de señas española',
    Swahili: 'Suajili',
    Swedish: 'Sueco',
    Tagalog: 'Tagalo',
    Tamil: 'Tamil',
    Telugu: 'Telugu',
    Thai: 'Tailandés',
    Turkish: 'Turco',
    Ukrainian: 'Ucraniano',
    Urdu: 'Urdu',
    Vietnamese: 'Vietnamita',
    Xhosa: 'Xhosa',
    Zulu: 'Zulú',
  },
};

// eSIM Page Translations
// Supported languages and their UI strings

const languages = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
        dir: 'ltr'
    },
    {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        dir: 'ltr'
    },
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        dir: 'ltr'
    },
    {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        dir: 'ltr'
    },
    {
        code: 'it',
        name: 'Italian',
        nativeName: 'Italiano',
        flag: '🇮🇹',
        dir: 'ltr'
    },
    {
        code: 'nl',
        name: 'Dutch',
        nativeName: 'Nederlands',
        flag: '🇳🇱',
        dir: 'ltr'
    },
    {
        code: 'ja',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵',
        dir: 'ltr'
    },
    {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        flag: '🇰🇷',
        dir: 'ltr'
    },
    {
        code: 'zh-CN',
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        flag: '🇨🇳',
        dir: 'ltr'
    },
    {
        code: 'zh-TW',
        name: 'Chinese (Traditional)',
        nativeName: '繁體中文',
        flag: '🇹🇼',
        dir: 'ltr'
    },
    {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇸🇦',
        dir: 'rtl'
    },
    {
        code: 'sv',
        name: 'Swedish',
        nativeName: 'Svenska',
        flag: '🇸🇪',
        dir: 'ltr'
    },
    {
        code: 'da',
        name: 'Danish',
        nativeName: 'Dansk',
        flag: '🇩🇰',
        dir: 'ltr'
    },
    {
        code: 'nb',
        name: 'Norwegian',
        nativeName: 'Norsk',
        flag: '🇳🇴',
        dir: 'ltr'
    },
    {
        code: 'fi',
        name: 'Finnish',
        nativeName: 'Suomi',
        flag: '🇫🇮',
        dir: 'ltr'
    },
    {
        code: 'th',
        name: 'Thai',
        nativeName: 'ไทย',
        flag: '🇹🇭',
        dir: 'ltr'
    },
    {
        code: 'tr',
        name: 'Turkish',
        nativeName: 'Türkçe',
        flag: '🇹🇷',
        dir: 'ltr'
    },
    {
        code: 'pt-BR',
        name: 'Portuguese (BR)',
        nativeName: 'Português (BR)',
        flag: '🇧🇷',
        dir: 'ltr'
    }
];

const translations = {
    en: {
        hero: {
            badge: 'Instant Digital SIM',
            title: 'Travel eSIM',
            description: 'Stay connected in 200+ destinations with instant eSIM activation. No physical SIM card needed.'
        },
        search: {
            placeholder: 'Search for a country or region...',
            button: 'Search'
        },
        tabs: {
            popular: 'Popular',
            local: 'Local',
            regional: 'Regional',
            worldwide: 'Worldwide'
        },
        section: {
            popularDestinations: 'Popular Destinations',
            allCountries: 'All Countries',
            regionalPlans: 'Regional Plans',
            worldwideCoverage: 'Worldwide Coverage'
        },
        card: {
            from: 'From',
            data: 'Data',
            sms: 'SMS',
            calls: 'Calls',
            viewPlans: 'View Plans',
            countries: 'countries'
        },
        cashback: {
            title: 'Earn Up to 10% Cashback on Every eSIM',
            description: 'The more you travel, the more you save. Build your tier status and unlock bigger rewards with every purchase.',
            explorer: 'Explorer',
            adventurer: 'Adventurer',
            pioneer: 'Pioneer',
            ambassador: 'Ambassador',
            startEarning: 'Start earning immediately',
            afterPurchases: 'After $X in purchases',
            yourBalance: 'Your Cashback Balance',
            viewRewards: 'View Your Rewards'
        },
        benefits: {
            title: 'Why Choose TripPortier eSIM?',
            instant: {
                title: 'Instant Activation',
                desc: 'Get your eSIM delivered instantly via QR code. Activate in minutes, no waiting required.'
            },
            noRoaming: {
                title: 'No Roaming Fees',
                desc: 'Save up to 90% compared to traditional roaming charges. Get local rates wherever you travel.'
            },
            countries: {
                title: '200+ Countries',
                desc: 'Coverage across the globe with reliable network partners in every destination.'
            },
            keepNumber: {
                title: 'Keep Your Number',
                desc: 'Your eSIM works alongside your regular SIM card. Keep your number while staying connected abroad.'
            }
        },
        app: {
            title: 'Manage Your eSIMs in the App',
            description: 'Download TripPortier to purchase eSIMs, manage your data plans, and track your usage on the go.',
            download: 'Download on App Store'
        },
        modal: {
            loading: 'Loading packages...',
            selectPackage: 'Select a package',
            buyNow: 'Buy Now',
            all: 'All',
            unlimited: 'Unlimited',
            standard: 'Standard',
            sortPrice: 'Price: Low to High',
            sortPriceDesc: 'Price: High to Low',
            sortData: 'Data: Most First',
            sortDays: 'Duration: Longest',
            daysValidity: 'days validity',
            included: 'Included',
            notIncluded: 'Not included',
            provider: 'Provider',
            validity: 'Validity',
            proceedCheckout: 'Proceed to Checkout'
        },
        tripcoins: {
            youHave: 'You have',
            tripcoins: 'TripCoins',
            useCoins: 'Use coins',
            youSave: 'You save'
        },
        checkout: {
            title: 'Complete Your Purchase',
            email: 'Email Address',
            emailHint: 'Your eSIM QR code will be sent to this email',
            continuePayment: 'Continue to Payment',
            securePayment: 'Secure payment powered by Stripe',
            tripcoinsApplied: 'TripCoins Applied',
            youllEarn: "You'll earn on this purchase",
            cashbackAs: 'cashback as a',
            member: 'member',
            earnCashback: 'Earn 3% cashback',
            createAccount: 'Create an account to earn on this purchase!',
            getApp: 'Get the App'
        }
    },
    de: {
        hero: {
            badge: 'Sofortige Digitale SIM',
            title: 'Reise-eSIM',
            description: 'Bleiben Sie an über 200 Reisezielen verbunden mit sofortiger eSIM-Aktivierung. Keine physische SIM-Karte erforderlich.'
        },
        search: {
            placeholder: 'Land oder Region suchen...',
            button: 'Suchen'
        },
        tabs: {
            popular: 'Beliebt',
            local: 'Lokal',
            regional: 'Regional',
            worldwide: 'Weltweit'
        },
        section: {
            popularDestinations: 'Beliebte Reiseziele',
            allCountries: 'Alle Länder',
            regionalPlans: 'Regionale Tarife',
            worldwideCoverage: 'Weltweite Abdeckung'
        },
        card: {
            from: 'Ab',
            data: 'Daten',
            sms: 'SMS',
            calls: 'Anrufe',
            viewPlans: 'Tarife Anzeigen',
            countries: 'Länder'
        },
        cashback: {
            title: 'Verdienen Sie bis zu 10% Cashback auf jede eSIM',
            description: 'Je mehr Sie reisen, desto mehr sparen Sie. Bauen Sie Ihren Tier-Status auf und erhalten Sie größere Belohnungen mit jedem Kauf.',
            explorer: 'Entdecker',
            adventurer: 'Abenteurer',
            pioneer: 'Pionier',
            ambassador: 'Botschafter',
            startEarning: 'Sofort verdienen',
            afterPurchases: 'Nach $X Einkäufen',
            yourBalance: 'Ihr Cashback-Guthaben',
            viewRewards: 'Ihre Prämien Anzeigen'
        },
        benefits: {
            title: 'Warum TripPortier eSIM wählen?',
            instant: {
                title: 'Sofortige Aktivierung',
                desc: 'Erhalten Sie Ihre eSIM sofort per QR-Code. Aktivierung in Minuten, kein Warten erforderlich.'
            },
            noRoaming: {
                title: 'Keine Roaming-Gebühren',
                desc: 'Sparen Sie bis zu 90% im Vergleich zu herkömmlichen Roaming-Gebühren. Erhalten Sie lokale Tarife, wohin Sie auch reisen.'
            },
            countries: {
                title: '200+ Länder',
                desc: 'Weltweite Abdeckung mit zuverlässigen Netzwerkpartnern an jedem Reiseziel.'
            },
            keepNumber: {
                title: 'Behalten Sie Ihre Nummer',
                desc: 'Ihre eSIM funktioniert zusammen mit Ihrer regulären SIM-Karte. Behalten Sie Ihre Nummer, während Sie im Ausland verbunden bleiben.'
            }
        },
        app: {
            title: 'Verwalten Sie Ihre eSIMs in der App',
            description: 'Laden Sie TripPortier herunter, um eSIMs zu kaufen, Ihre Datentarife zu verwalten und Ihre Nutzung unterwegs zu verfolgen.',
            download: 'Im App Store Laden'
        },
        modal: {
            loading: 'Pakete werden geladen...',
            selectPackage: 'Paket auswählen',
            buyNow: 'Jetzt Kaufen',
            all: 'Alle',
            unlimited: 'Unbegrenzt',
            standard: 'Standard',
            sortPrice: 'Preis: Niedrig bis Hoch',
            sortPriceDesc: 'Preis: Hoch bis Niedrig',
            sortData: 'Daten: Meiste Zuerst',
            sortDays: 'Dauer: Längste',
            daysValidity: 'Tage Gültigkeit',
            included: 'Inklusive',
            notIncluded: 'Nicht inklusive',
            provider: 'Anbieter',
            validity: 'Gültigkeit',
            proceedCheckout: 'Zur Kasse Gehen'
        },
        tripcoins: {
            youHave: 'Sie haben',
            tripcoins: 'TripCoins',
            useCoins: 'Coins verwenden',
            youSave: 'Sie sparen'
        },
        checkout: {
            title: 'Schließen Sie Ihren Kauf ab',
            email: 'E-Mail-Adresse',
            emailHint: 'Ihr eSIM-QR-Code wird an diese E-Mail gesendet',
            continuePayment: 'Weiter zur Zahlung',
            securePayment: 'Sichere Zahlung durch Stripe',
            tripcoinsApplied: 'TripCoins Angewendet',
            youllEarn: 'Sie verdienen bei diesem Kauf',
            cashbackAs: 'Cashback als',
            member: 'Mitglied',
            earnCashback: 'Verdienen Sie 3% Cashback',
            createAccount: 'Erstellen Sie ein Konto, um bei diesem Kauf zu verdienen!',
            getApp: 'App Herunterladen'
        }
    },
    fr: {
        hero: {
            badge: 'SIM Numérique Instantanée',
            title: 'eSIM Voyage',
            description: 'Restez connecté dans plus de 200 destinations avec activation eSIM instantanée. Aucune carte SIM physique nécessaire.'
        },
        search: {
            placeholder: 'Rechercher un pays ou une région...',
            button: 'Rechercher'
        },
        tabs: {
            popular: 'Populaire',
            local: 'Local',
            regional: 'Régional',
            worldwide: 'Mondial'
        },
        section: {
            popularDestinations: 'Destinations Populaires',
            allCountries: 'Tous les Pays',
            regionalPlans: 'Forfaits Régionaux',
            worldwideCoverage: 'Couverture Mondiale'
        },
        card: {
            from: 'À partir de',
            data: 'Données',
            sms: 'SMS',
            calls: 'Appels',
            viewPlans: 'Voir les Forfaits',
            countries: 'pays'
        },
        cashback: {
            title: 'Gagnez jusqu\'à 10% de Cashback sur Chaque eSIM',
            description: 'Plus vous voyagez, plus vous économisez. Construisez votre statut de niveau et débloquez des récompenses plus importantes à chaque achat.',
            explorer: 'Explorateur',
            adventurer: 'Aventurier',
            pioneer: 'Pionnier',
            ambassador: 'Ambassadeur',
            startEarning: 'Commencez à gagner immédiatement',
            afterPurchases: 'Après $X d\'achats',
            yourBalance: 'Votre Solde Cashback',
            viewRewards: 'Voir Vos Récompenses'
        },
        benefits: {
            title: 'Pourquoi Choisir TripPortier eSIM?',
            instant: {
                title: 'Activation Instantanée',
                desc: 'Recevez votre eSIM instantanément par QR code. Activation en quelques minutes, aucune attente requise.'
            },
            noRoaming: {
                title: 'Pas de Frais d\'Itinérance',
                desc: 'Économisez jusqu\'à 90% par rapport aux frais d\'itinérance traditionnels. Obtenez des tarifs locaux où que vous voyagiez.'
            },
            countries: {
                title: '200+ Pays',
                desc: 'Couverture mondiale avec des partenaires réseau fiables dans chaque destination.'
            },
            keepNumber: {
                title: 'Gardez Votre Numéro',
                desc: 'Votre eSIM fonctionne avec votre carte SIM habituelle. Gardez votre numéro tout en restant connecté à l\'étranger.'
            }
        },
        app: {
            title: 'Gérez Vos eSIM dans l\'Application',
            description: 'Téléchargez TripPortier pour acheter des eSIM, gérer vos forfaits de données et suivre votre utilisation en déplacement.',
            download: 'Télécharger sur l\'App Store'
        },
        modal: {
            loading: 'Chargement des forfaits...',
            selectPackage: 'Sélectionnez un forfait',
            buyNow: 'Acheter Maintenant',
            all: 'Tous',
            unlimited: 'Illimité',
            standard: 'Standard',
            sortPrice: 'Prix: Bas à Élevé',
            sortPriceDesc: 'Prix: Élevé à Bas',
            sortData: 'Données: Le Plus en Premier',
            sortDays: 'Durée: Le Plus Long',
            daysValidity: 'jours de validité',
            included: 'Inclus',
            notIncluded: 'Non inclus',
            provider: 'Fournisseur',
            validity: 'Validité',
            proceedCheckout: 'Procéder au Paiement'
        },
        tripcoins: {
            youHave: 'Vous avez',
            tripcoins: 'TripCoins',
            useCoins: 'Utiliser les pièces',
            youSave: 'Vous économisez'
        },
        checkout: {
            title: 'Finalisez Votre Achat',
            email: 'Adresse E-mail',
            emailHint: 'Votre QR code eSIM sera envoyé à cette adresse e-mail',
            continuePayment: 'Continuer vers le Paiement',
            securePayment: 'Paiement sécurisé par Stripe',
            tripcoinsApplied: 'TripCoins Appliqués',
            youllEarn: 'Vous gagnerez sur cet achat',
            cashbackAs: 'cashback en tant que',
            member: 'membre',
            earnCashback: 'Gagnez 3% de cashback',
            createAccount: 'Créez un compte pour gagner sur cet achat!',
            getApp: 'Obtenir l\'Application'
        }
    },
    es: {
        hero: {
            badge: 'SIM Digital Instantánea',
            title: 'eSIM de Viaje',
            description: 'Mantente conectado en más de 200 destinos con activación instantánea de eSIM. No se necesita tarjeta SIM física.'
        },
        search: {
            placeholder: 'Buscar un país o región...',
            button: 'Buscar'
        },
        tabs: {
            popular: 'Popular',
            local: 'Local',
            regional: 'Regional',
            worldwide: 'Mundial'
        },
        section: {
            popularDestinations: 'Destinos Populares',
            allCountries: 'Todos los Países',
            regionalPlans: 'Planes Regionales',
            worldwideCoverage: 'Cobertura Mundial'
        },
        card: {
            from: 'Desde',
            data: 'Datos',
            sms: 'SMS',
            calls: 'Llamadas',
            viewPlans: 'Ver Planes',
            countries: 'países'
        },
        cashback: {
            title: 'Gana Hasta 10% de Cashback en Cada eSIM',
            description: 'Cuanto más viajas, más ahorras. Construye tu nivel de estado y desbloquea mayores recompensas con cada compra.',
            explorer: 'Explorador',
            adventurer: 'Aventurero',
            pioneer: 'Pionero',
            ambassador: 'Embajador',
            startEarning: 'Comienza a ganar inmediatamente',
            afterPurchases: 'Después de $X en compras',
            yourBalance: 'Tu Saldo de Cashback',
            viewRewards: 'Ver Tus Recompensas'
        },
        benefits: {
            title: '¿Por Qué Elegir TripPortier eSIM?',
            instant: {
                title: 'Activación Instantánea',
                desc: 'Recibe tu eSIM al instante mediante código QR. Activación en minutos, sin esperas.'
            },
            noRoaming: {
                title: 'Sin Tarifas de Roaming',
                desc: 'Ahorra hasta 90% en comparación con las tarifas de roaming tradicionales. Obtén tarifas locales dondequiera que viajes.'
            },
            countries: {
                title: '200+ Países',
                desc: 'Cobertura mundial con socios de red confiables en cada destino.'
            },
            keepNumber: {
                title: 'Mantén Tu Número',
                desc: 'Tu eSIM funciona junto con tu tarjeta SIM regular. Mantén tu número mientras te mantienes conectado en el extranjero.'
            }
        },
        app: {
            title: 'Gestiona Tus eSIMs en la Aplicación',
            description: 'Descarga TripPortier para comprar eSIMs, gestionar tus planes de datos y rastrear tu uso sobre la marcha.',
            download: 'Descargar en App Store'
        },
        modal: {
            loading: 'Cargando paquetes...',
            selectPackage: 'Selecciona un paquete',
            buyNow: 'Comprar Ahora',
            all: 'Todos',
            unlimited: 'Ilimitado',
            standard: 'Estándar',
            sortPrice: 'Precio: Bajo a Alto',
            sortPriceDesc: 'Precio: Alto a Bajo',
            sortData: 'Datos: Más Primero',
            sortDays: 'Duración: Más Largo',
            daysValidity: 'días de validez',
            included: 'Incluido',
            notIncluded: 'No incluido',
            provider: 'Proveedor',
            validity: 'Validez',
            proceedCheckout: 'Proceder al Pago'
        },
        tripcoins: {
            youHave: 'Tienes',
            tripcoins: 'TripCoins',
            useCoins: 'Usar monedas',
            youSave: 'Ahorras'
        },
        checkout: {
            title: 'Completa Tu Compra',
            email: 'Dirección de Correo Electrónico',
            emailHint: 'Tu código QR de eSIM se enviará a este correo electrónico',
            continuePayment: 'Continuar al Pago',
            securePayment: 'Pago seguro con Stripe',
            tripcoinsApplied: 'TripCoins Aplicados',
            youllEarn: 'Ganarás en esta compra',
            cashbackAs: 'cashback como',
            member: 'miembro',
            earnCashback: 'Gana 3% de cashback',
            createAccount: '¡Crea una cuenta para ganar en esta compra!',
            getApp: 'Obtener la Aplicación'
        }
    },
    it: {
        hero: {
            badge: 'SIM Digitale Istantanea',
            title: 'eSIM Viaggio',
            description: 'Rimani connesso in oltre 200 destinazioni con attivazione eSIM istantanea. Nessuna scheda SIM fisica necessaria.'
        },
        search: {
            placeholder: 'Cerca un paese o una regione...',
            button: 'Cerca'
        },
        tabs: {
            popular: 'Popolare',
            local: 'Locale',
            regional: 'Regionale',
            worldwide: 'Mondiale'
        },
        section: {
            popularDestinations: 'Destinazioni Popolari',
            allCountries: 'Tutti i Paesi',
            regionalPlans: 'Piani Regionali',
            worldwideCoverage: 'Copertura Mondiale'
        },
        card: {
            from: 'Da',
            data: 'Dati',
            sms: 'SMS',
            calls: 'Chiamate',
            viewPlans: 'Vedi Piani',
            countries: 'paesi'
        },
        cashback: {
            title: 'Guadagna Fino al 10% di Cashback su Ogni eSIM',
            description: 'Più viaggi, più risparmi. Costruisci il tuo livello di stato e sblocca ricompense più grandi con ogni acquisto.',
            explorer: 'Esploratore',
            adventurer: 'Avventuriero',
            pioneer: 'Pioniere',
            ambassador: 'Ambasciatore',
            startEarning: 'Inizia a guadagnare immediatamente',
            afterPurchases: 'Dopo $X in acquisti',
            yourBalance: 'Il Tuo Saldo Cashback',
            viewRewards: 'Vedi le Tue Ricompense'
        },
        benefits: {
            title: 'Perché Scegliere TripPortier eSIM?',
            instant: {
                title: 'Attivazione Istantanea',
                desc: 'Ricevi la tua eSIM istantaneamente tramite codice QR. Attivazione in pochi minuti, nessuna attesa richiesta.'
            },
            noRoaming: {
                title: 'Nessun Costo di Roaming',
                desc: 'Risparmia fino al 90% rispetto alle tariffe di roaming tradizionali. Ottieni tariffe locali ovunque tu viaggi.'
            },
            countries: {
                title: '200+ Paesi',
                desc: 'Copertura in tutto il mondo con partner di rete affidabili in ogni destinazione.'
            },
            keepNumber: {
                title: 'Mantieni il Tuo Numero',
                desc: 'La tua eSIM funziona insieme alla tua scheda SIM normale. Mantieni il tuo numero mentre rimani connesso all\'estero.'
            }
        },
        app: {
            title: 'Gestisci le Tue eSIM nell\'App',
            description: 'Scarica TripPortier per acquistare eSIM, gestire i tuoi piani dati e monitorare il tuo utilizzo in movimento.',
            download: 'Scarica su App Store'
        },
        modal: {
            loading: 'Caricamento pacchetti...',
            selectPackage: 'Seleziona un pacchetto',
            buyNow: 'Acquista Ora',
            all: 'Tutti',
            unlimited: 'Illimitato',
            standard: 'Standard',
            sortPrice: 'Prezzo: Basso ad Alto',
            sortPriceDesc: 'Prezzo: Alto a Basso',
            sortData: 'Dati: Più Prima',
            sortDays: 'Durata: Più Lungo',
            daysValidity: 'giorni di validità',
            included: 'Incluso',
            notIncluded: 'Non incluso',
            provider: 'Fornitore',
            validity: 'Validità',
            proceedCheckout: 'Procedi al Pagamento'
        },
        tripcoins: {
            youHave: 'Hai',
            tripcoins: 'TripCoins',
            useCoins: 'Usa monete',
            youSave: 'Risparmi'
        },
        checkout: {
            title: 'Completa il Tuo Acquisto',
            email: 'Indirizzo Email',
            emailHint: 'Il tuo codice QR eSIM verrà inviato a questa email',
            continuePayment: 'Continua al Pagamento',
            securePayment: 'Pagamento sicuro tramite Stripe',
            tripcoinsApplied: 'TripCoins Applicati',
            youllEarn: 'Guadagnerai su questo acquisto',
            cashbackAs: 'cashback come',
            member: 'membro',
            earnCashback: 'Guadagna il 3% di cashback',
            createAccount: 'Crea un account per guadagnare su questo acquisto!',
            getApp: 'Ottieni l\'App'
        }
    },
    nl: {
        hero: {
            badge: 'Directe Digitale SIM',
            title: 'Reis eSIM',
            description: 'Blijf verbonden in meer dan 200 bestemmingen met directe eSIM-activering. Geen fysieke SIM-kaart nodig.'
        },
        search: {
            placeholder: 'Zoek naar een land of regio...',
            button: 'Zoeken'
        },
        tabs: {
            popular: 'Populair',
            local: 'Lokaal',
            regional: 'Regionaal',
            worldwide: 'Wereldwijd'
        },
        section: {
            popularDestinations: 'Populaire Bestemmingen',
            allCountries: 'Alle Landen',
            regionalPlans: 'Regionale Plannen',
            worldwideCoverage: 'Wereldwijde Dekking'
        },
        card: {
            from: 'Vanaf',
            data: 'Data',
            sms: 'SMS',
            calls: 'Oproepen',
            viewPlans: 'Bekijk Plannen',
            countries: 'landen'
        },
        cashback: {
            title: 'Verdien Tot 10% Cashback op Elke eSIM',
            description: 'Hoe meer je reist, hoe meer je bespaart. Bouw je tier-status op en ontgrendel grotere beloningen met elke aankoop.',
            explorer: 'Verkenner',
            adventurer: 'Avonturier',
            pioneer: 'Pionier',
            ambassador: 'Ambassadeur',
            startEarning: 'Begin direct met verdienen',
            afterPurchases: 'Na $X aan aankopen',
            yourBalance: 'Jouw Cashback Saldo',
            viewRewards: 'Bekijk Je Beloningen'
        },
        benefits: {
            title: 'Waarom Kiezen voor TripPortier eSIM?',
            instant: {
                title: 'Directe Activering',
                desc: 'Ontvang je eSIM direct via QR-code. Activering in enkele minuten, geen wachten vereist.'
            },
            noRoaming: {
                title: 'Geen Roamingkosten',
                desc: 'Bespaar tot 90% vergeleken met traditionele roamingkosten. Krijg lokale tarieven waar je ook reist.'
            },
            countries: {
                title: '200+ Landen',
                desc: 'Wereldwijde dekking met betrouwbare netwerkpartners in elke bestemming.'
            },
            keepNumber: {
                title: 'Behoud Je Nummer',
                desc: 'Je eSIM werkt naast je reguliere SIM-kaart. Behoud je nummer terwijl je in het buitenland verbonden blijft.'
            }
        },
        app: {
            title: 'Beheer Je eSIMs in de App',
            description: 'Download TripPortier om eSIMs te kopen, je dataplannen te beheren en je gebruik onderweg bij te houden.',
            download: 'Download op App Store'
        },
        modal: {
            loading: 'Pakketten laden...',
            selectPackage: 'Selecteer een pakket',
            buyNow: 'Nu Kopen',
            all: 'Alle',
            unlimited: 'Onbeperkt',
            standard: 'Standaard',
            sortPrice: 'Prijs: Laag naar Hoog',
            sortPriceDesc: 'Prijs: Hoog naar Laag',
            sortData: 'Data: Meeste Eerst',
            sortDays: 'Duur: Langste',
            daysValidity: 'dagen geldigheid',
            included: 'Inbegrepen',
            notIncluded: 'Niet inbegrepen',
            provider: 'Aanbieder',
            validity: 'Geldigheid',
            proceedCheckout: 'Naar Afrekenen'
        },
        tripcoins: {
            youHave: 'Je hebt',
            tripcoins: 'TripCoins',
            useCoins: 'Gebruik munten',
            youSave: 'Je bespaart'
        },
        checkout: {
            title: 'Voltooi Je Aankoop',
            email: 'E-mailadres',
            emailHint: 'Je eSIM QR-code wordt naar dit e-mailadres verzonden',
            continuePayment: 'Doorgaan naar Betaling',
            securePayment: 'Veilige betaling via Stripe',
            tripcoinsApplied: 'TripCoins Toegepast',
            youllEarn: 'Je verdient bij deze aankoop',
            cashbackAs: 'cashback als',
            member: 'lid',
            earnCashback: 'Verdien 3% cashback',
            createAccount: 'Maak een account aan om te verdienen bij deze aankoop!',
            getApp: 'Download de App'
        }
    },
    ja: {
        hero: {
            badge: 'インスタントデジタルSIM',
            title: 'トラベルeSIM',
            description: '200以上の目的地で即座にeSIMアクティベーション。物理的なSIMカードは不要です。'
        },
        search: {
            placeholder: '国または地域を検索...',
            button: '検索'
        },
        tabs: {
            popular: '人気',
            local: 'ローカル',
            regional: '地域',
            worldwide: '世界'
        },
        section: {
            popularDestinations: '人気の目的地',
            allCountries: 'すべての国',
            regionalPlans: '地域プラン',
            worldwideCoverage: '世界中のカバレッジ'
        },
        card: {
            from: 'から',
            data: 'データ',
            sms: 'SMS',
            calls: '通話',
            viewPlans: 'プランを見る',
            countries: '国'
        },
        cashback: {
            title: 'すべてのeSIMで最大10%のキャッシュバックを獲得',
            description: 'より多く旅行するほど、より多く節約できます。ティアステータスを構築し、購入ごとにより大きな報酬をアンロックします。',
            explorer: 'エクスプローラー',
            adventurer: 'アドベンチャラー',
            pioneer: 'パイオニア',
            ambassador: 'アンバサダー',
            startEarning: 'すぐに獲得開始',
            afterPurchases: '$Xの購入後',
            yourBalance: 'あなたのキャッシュバック残高',
            viewRewards: 'リワードを見る'
        },
        benefits: {
            title: 'なぜTripPortier eSIMを選ぶのか?',
            instant: {
                title: 'インスタントアクティベーション',
                desc: 'QRコードで即座にeSIMを受け取ります。数分でアクティベート、待ち時間はありません。'
            },
            noRoaming: {
                title: 'ローミング料金なし',
                desc: '従来のローミング料金と比較して最大90%節約。どこに旅行してもローカル料金を取得。'
            },
            countries: {
                title: '200以上の国',
                desc: 'すべての目的地で信頼できるネットワークパートナーとの世界中のカバレッジ。'
            },
            keepNumber: {
                title: '番号を保持',
                desc: 'あなたのeSIMは通常のSIMカードと一緒に機能します。海外で接続を維持しながら番号を保持します。'
            }
        },
        app: {
            title: 'アプリでeSIMを管理',
            description: 'TripPortierをダウンロードして、eSIMを購入し、データプランを管理し、外出先で使用状況を追跡します。',
            download: 'App Storeでダウンロード'
        },
        modal: {
            loading: 'パッケージを読み込んでいます...',
            selectPackage: 'パッケージを選択',
            buyNow: '今すぐ購入',
            all: 'すべて',
            unlimited: '無制限',
            standard: 'スタンダード',
            sortPrice: '価格: 低から高',
            sortPriceDesc: '価格: 高から低',
            sortData: 'データ: 最も多い順',
            sortDays: '期間: 最も長い',
            daysValidity: '日間有効',
            included: '含まれています',
            notIncluded: '含まれていません',
            provider: 'プロバイダー',
            validity: '有効期間',
            proceedCheckout: 'チェックアウトに進む'
        },
        tripcoins: {
            youHave: 'あなたは持っています',
            tripcoins: 'TripCoins',
            useCoins: 'コインを使用',
            youSave: '節約できます'
        },
        checkout: {
            title: '購入を完了する',
            email: 'メールアドレス',
            emailHint: 'eSIM QRコードはこのメールに送信されます',
            continuePayment: '支払いに進む',
            securePayment: 'Stripeによる安全な支払い',
            tripcoinsApplied: 'TripCoins適用済み',
            youllEarn: 'この購入で獲得できます',
            cashbackAs: 'キャッシュバックとして',
            member: 'メンバー',
            earnCashback: '3%のキャッシュバックを獲得',
            createAccount: 'この購入で獲得するためにアカウントを作成してください!',
            getApp: 'アプリを入手'
        }
    },
    ko: {
        hero: {
            badge: '즉시 디지털 SIM',
            title: '여행 eSIM',
            description: '즉시 eSIM 활성화로 200개 이상의 목적지에서 연결을 유지하세요. 물리적 SIM 카드가 필요하지 않습니다.'
        },
        search: {
            placeholder: '국가 또는 지역 검색...',
            button: '검색'
        },
        tabs: {
            popular: '인기',
            local: '로컬',
            regional: '지역',
            worldwide: '전 세계'
        },
        section: {
            popularDestinations: '인기 목적지',
            allCountries: '모든 국가',
            regionalPlans: '지역 요금제',
            worldwideCoverage: '전 세계 커버리지'
        },
        card: {
            from: '부터',
            data: '데이터',
            sms: 'SMS',
            calls: '통화',
            viewPlans: '요금제 보기',
            countries: '국가'
        },
        cashback: {
            title: '모든 eSIM에서 최대 10% 캐시백 적립',
            description: '더 많이 여행할수록 더 많이 절약합니다. 티어 상태를 구축하고 구매할 때마다 더 큰 보상을 잠금 해제하세요.',
            explorer: '탐험가',
            adventurer: '모험가',
            pioneer: '개척자',
            ambassador: '대사',
            startEarning: '즉시 적립 시작',
            afterPurchases: '$X 구매 후',
            yourBalance: '캐시백 잔액',
            viewRewards: '보상 보기'
        },
        benefits: {
            title: 'TripPortier eSIM을 선택하는 이유는?',
            instant: {
                title: '즉시 활성화',
                desc: 'QR 코드를 통해 즉시 eSIM을 받으세요. 몇 분 안에 활성화, 대기 시간 없음.'
            },
            noRoaming: {
                title: '로밍 요금 없음',
                desc: '기존 로밍 요금과 비교하여 최대 90% 절약. 어디를 여행하든 현지 요금을 받으세요.'
            },
            countries: {
                title: '200개 이상의 국가',
                desc: '모든 목적지에서 신뢰할 수 있는 네트워크 파트너와의 전 세계 커버리지.'
            },
            keepNumber: {
                title: '번호 유지',
                desc: 'eSIM은 일반 SIM 카드와 함께 작동합니다. 해외에서 연결을 유지하면서 번호를 유지하세요.'
            }
        },
        app: {
            title: '앱에서 eSIM 관리',
            description: 'TripPortier를 다운로드하여 eSIM을 구매하고 데이터 요금제를 관리하며 이동 중에 사용량을 추적하세요.',
            download: 'App Store에서 다운로드'
        },
        modal: {
            loading: '패키지 로드 중...',
            selectPackage: '패키지 선택',
            buyNow: '지금 구매',
            all: '모두',
            unlimited: '무제한',
            standard: '표준',
            sortPrice: '가격: 낮은 순',
            sortPriceDesc: '가격: 높은 순',
            sortData: '데이터: 가장 많은 순',
            sortDays: '기간: 가장 긴 순',
            daysValidity: '일 유효',
            included: '포함됨',
            notIncluded: '포함되지 않음',
            provider: '제공자',
            validity: '유효성',
            proceedCheckout: '결제 진행'
        },
        tripcoins: {
            youHave: '보유하고 있습니다',
            tripcoins: 'TripCoins',
            useCoins: '코인 사용',
            youSave: '절약합니다'
        },
        checkout: {
            title: '구매 완료',
            email: '이메일 주소',
            emailHint: 'eSIM QR 코드가 이 이메일로 전송됩니다',
            continuePayment: '결제 계속',
            securePayment: 'Stripe로 보안 결제',
            tripcoinsApplied: 'TripCoins 적용됨',
            youllEarn: '이 구매에서 적립합니다',
            cashbackAs: '캐시백으로',
            member: '회원',
            earnCashback: '3% 캐시백 적립',
            createAccount: '이 구매에서 적립하려면 계정을 만드세요!',
            getApp: '앱 받기'
        }
    },
    'zh-CN': {
        hero: {
            badge: '即时数字SIM卡',
            title: '旅行eSIM',
            description: '即时eSIM激活,在200多个目的地保持连接。无需物理SIM卡。'
        },
        search: {
            placeholder: '搜索国家或地区...',
            button: '搜索'
        },
        tabs: {
            popular: '热门',
            local: '本地',
            regional: '区域',
            worldwide: '全球'
        },
        section: {
            popularDestinations: '热门目的地',
            allCountries: '所有国家',
            regionalPlans: '区域套餐',
            worldwideCoverage: '全球覆盖'
        },
        card: {
            from: '起',
            data: '数据',
            sms: '短信',
            calls: '通话',
            viewPlans: '查看套餐',
            countries: '国家'
        },
        cashback: {
            title: '每次eSIM购买可赚取高达10%的返现',
            description: '旅行越多,节省越多。建立您的等级状态,每次购买解锁更大的奖励。',
            explorer: '探索者',
            adventurer: '冒险家',
            pioneer: '先锋',
            ambassador: '大使',
            startEarning: '立即开始赚取',
            afterPurchases: '消费$X后',
            yourBalance: '您的返现余额',
            viewRewards: '查看您的奖励'
        },
        benefits: {
            title: '为什么选择TripPortier eSIM?',
            instant: {
                title: '即时激活',
                desc: '通过二维码即时接收您的eSIM。几分钟内激活,无需等待。'
            },
            noRoaming: {
                title: '无漫游费',
                desc: '与传统漫游费相比节省高达90%。无论您去哪里旅行都能获得本地费率。'
            },
            countries: {
                title: '200多个国家',
                desc: '在每个目的地都有可靠的网络合作伙伴提供全球覆盖。'
            },
            keepNumber: {
                title: '保留您的号码',
                desc: '您的eSIM与常规SIM卡一起工作。在国外保持连接的同时保留您的号码。'
            }
        },
        app: {
            title: '在应用中管理您的eSIM',
            description: '下载TripPortier以购买eSIM、管理您的数据套餐并随时跟踪您的使用情况。',
            download: '在App Store下载'
        },
        modal: {
            loading: '加载套餐中...',
            selectPackage: '选择套餐',
            buyNow: '立即购买',
            all: '全部',
            unlimited: '无限',
            standard: '标准',
            sortPrice: '价格:从低到高',
            sortPriceDesc: '价格:从高到低',
            sortData: '数据:最多优先',
            sortDays: '时长:最长',
            daysValidity: '天有效期',
            included: '包含',
            notIncluded: '不包含',
            provider: '提供商',
            validity: '有效期',
            proceedCheckout: '前往结账'
        },
        tripcoins: {
            youHave: '您有',
            tripcoins: 'TripCoins',
            useCoins: '使用代币',
            youSave: '您节省'
        },
        checkout: {
            title: '完成您的购买',
            email: '电子邮件地址',
            emailHint: '您的eSIM二维码将发送到此电子邮件',
            continuePayment: '继续付款',
            securePayment: 'Stripe提供的安全支付',
            tripcoinsApplied: '已应用TripCoins',
            youllEarn: '您将在此次购买中赚取',
            cashbackAs: '返现作为',
            member: '会员',
            earnCashback: '赚取3%返现',
            createAccount: '创建账户以在此次购买中赚取!',
            getApp: '获取应用'
        }
    },
    'zh-TW': {
        hero: {
            badge: '即時數位SIM卡',
            title: '旅行eSIM',
            description: '即時eSIM啟動,在200多個目的地保持連接。無需實體SIM卡。'
        },
        search: {
            placeholder: '搜尋國家或地區...',
            button: '搜尋'
        },
        tabs: {
            popular: '熱門',
            local: '本地',
            regional: '區域',
            worldwide: '全球'
        },
        section: {
            popularDestinations: '熱門目的地',
            allCountries: '所有國家',
            regionalPlans: '區域套餐',
            worldwideCoverage: '全球覆蓋'
        },
        card: {
            from: '起',
            data: '數據',
            sms: '簡訊',
            calls: '通話',
            viewPlans: '查看套餐',
            countries: '國家'
        },
        cashback: {
            title: '每次eSIM購買可賺取高達10%的返現',
            description: '旅行越多,節省越多。建立您的等級狀態,每次購買解鎖更大的獎勵。',
            explorer: '探索者',
            adventurer: '冒險家',
            pioneer: '先鋒',
            ambassador: '大使',
            startEarning: '立即開始賺取',
            afterPurchases: '消費$X後',
            yourBalance: '您的返現餘額',
            viewRewards: '查看您的獎勵'
        },
        benefits: {
            title: '為什麼選擇TripPortier eSIM?',
            instant: {
                title: '即時啟動',
                desc: '透過二維碼即時接收您的eSIM。幾分鐘內啟動,無需等待。'
            },
            noRoaming: {
                title: '無漫遊費',
                desc: '與傳統漫遊費相比節省高達90%。無論您去哪裡旅行都能獲得本地費率。'
            },
            countries: {
                title: '200多個國家',
                desc: '在每個目的地都有可靠的網路合作夥伴提供全球覆蓋。'
            },
            keepNumber: {
                title: '保留您的號碼',
                desc: '您的eSIM與常規SIM卡一起工作。在國外保持連接的同時保留您的號碼。'
            }
        },
        app: {
            title: '在應用中管理您的eSIM',
            description: '下載TripPortier以購買eSIM、管理您的數據套餐並隨時追蹤您的使用情況。',
            download: '在App Store下載'
        },
        modal: {
            loading: '載入套餐中...',
            selectPackage: '選擇套餐',
            buyNow: '立即購買',
            all: '全部',
            unlimited: '無限',
            standard: '標準',
            sortPrice: '價格:從低到高',
            sortPriceDesc: '價格:從高到低',
            sortData: '數據:最多優先',
            sortDays: '時長:最長',
            daysValidity: '天有效期',
            included: '包含',
            notIncluded: '不包含',
            provider: '提供商',
            validity: '有效期',
            proceedCheckout: '前往結帳'
        },
        tripcoins: {
            youHave: '您有',
            tripcoins: 'TripCoins',
            useCoins: '使用代幣',
            youSave: '您節省'
        },
        checkout: {
            title: '完成您的購買',
            email: '電子郵件地址',
            emailHint: '您的eSIM二維碼將發送到此電子郵件',
            continuePayment: '繼續付款',
            securePayment: 'Stripe提供的安全支付',
            tripcoinsApplied: '已應用TripCoins',
            youllEarn: '您將在此次購買中賺取',
            cashbackAs: '返現作為',
            member: '會員',
            earnCashback: '賺取3%返現',
            createAccount: '創建帳戶以在此次購買中賺取!',
            getApp: '獲取應用'
        }
    },
    ar: {
        hero: {
            badge: 'بطاقة SIM رقمية فورية',
            title: 'eSIM السفر',
            description: 'ابق متصلاً في أكثر من 200 وجهة مع تفعيل eSIM الفوري. لا حاجة لبطاقة SIM فعلية.'
        },
        search: {
            placeholder: 'ابحث عن دولة أو منطقة...',
            button: 'بحث'
        },
        tabs: {
            popular: 'الشائعة',
            local: 'محلي',
            regional: 'إقليمي',
            worldwide: 'عالمي'
        },
        section: {
            popularDestinations: 'الوجهات الشائعة',
            allCountries: 'جميع الدول',
            regionalPlans: 'الخطط الإقليمية',
            worldwideCoverage: 'التغطية العالمية'
        },
        card: {
            from: 'من',
            data: 'البيانات',
            sms: 'رسائل نصية',
            calls: 'المكالمات',
            viewPlans: 'عرض الخطط',
            countries: 'دولة'
        },
        cashback: {
            title: 'احصل على ما يصل إلى 10٪ استرداد نقدي على كل eSIM',
            description: 'كلما سافرت أكثر، كلما وفرت أكثر. قم ببناء حالة المستوى الخاص بك وافتح مكافآت أكبر مع كل عملية شراء.',
            explorer: 'مستكشف',
            adventurer: 'مغامر',
            pioneer: 'رائد',
            ambassador: 'سفير',
            startEarning: 'ابدأ الكسب فوراً',
            afterPurchases: 'بعد $X من المشتريات',
            yourBalance: 'رصيد الاسترداد النقدي الخاص بك',
            viewRewards: 'عرض مكافآتك'
        },
        benefits: {
            title: 'لماذا تختار TripPortier eSIM؟',
            instant: {
                title: 'تفعيل فوري',
                desc: 'احصل على eSIM الخاص بك فوراً عبر رمز QR. التفعيل في دقائق، لا حاجة للانتظار.'
            },
            noRoaming: {
                title: 'بدون رسوم تجوال',
                desc: 'وفر حتى 90٪ مقارنة برسوم التجوال التقليدية. احصل على أسعار محلية أينما سافرت.'
            },
            countries: {
                title: 'أكثر من 200 دولة',
                desc: 'تغطية عبر العالم مع شركاء شبكة موثوقين في كل وجهة.'
            },
            keepNumber: {
                title: 'احتفظ برقمك',
                desc: 'يعمل eSIM الخاص بك جنباً إلى جنب مع بطاقة SIM العادية. احتفظ برقمك مع البقاء متصلاً في الخارج.'
            }
        },
        app: {
            title: 'إدارة eSIMs الخاصة بك في التطبيق',
            description: 'قم بتنزيل TripPortier لشراء eSIMs وإدارة خطط البيانات الخاصة بك وتتبع استخدامك أثناء التنقل.',
            download: 'التنزيل من App Store'
        },
        modal: {
            loading: 'جاري تحميل الحزم...',
            selectPackage: 'اختر حزمة',
            buyNow: 'اشتر الآن',
            all: 'الكل',
            unlimited: 'غير محدود',
            standard: 'قياسي',
            sortPrice: 'السعر: من الأقل إلى الأعلى',
            sortPriceDesc: 'السعر: من الأعلى إلى الأقل',
            sortData: 'البيانات: الأكثر أولاً',
            sortDays: 'المدة: الأطول',
            daysValidity: 'أيام الصلاحية',
            included: 'مشمول',
            notIncluded: 'غير مشمول',
            provider: 'المزود',
            validity: 'الصلاحية',
            proceedCheckout: 'المتابعة إلى الدفع'
        },
        tripcoins: {
            youHave: 'لديك',
            tripcoins: 'TripCoins',
            useCoins: 'استخدام العملات',
            youSave: 'توفر'
        },
        checkout: {
            title: 'أكمل عملية الشراء',
            email: 'عنوان البريد الإلكتروني',
            emailHint: 'سيتم إرسال رمز QR الخاص بـ eSIM إلى هذا البريد الإلكتروني',
            continuePayment: 'المتابعة إلى الدفع',
            securePayment: 'الدفع الآمن بواسطة Stripe',
            tripcoinsApplied: 'تم تطبيق TripCoins',
            youllEarn: 'ستربح من هذا الشراء',
            cashbackAs: 'استرداد نقدي كـ',
            member: 'عضو',
            earnCashback: 'احصل على 3٪ استرداد نقدي',
            createAccount: 'قم بإنشاء حساب للربح من هذا الشراء!',
            getApp: 'احصل على التطبيق'
        }
    },
    sv: {
        hero: {
            badge: 'Omedelbart Digitalt SIM',
            title: 'Rese-eSIM',
            description: 'Håll dig uppkopplad i över 200 destinationer med omedelbar eSIM-aktivering. Inget fysiskt SIM-kort behövs.'
        },
        search: {
            placeholder: 'Sök efter ett land eller region...',
            button: 'Sök'
        },
        tabs: {
            popular: 'Populärt',
            local: 'Lokalt',
            regional: 'Regionalt',
            worldwide: 'Världsomfattande'
        },
        section: {
            popularDestinations: 'Populära Destinationer',
            allCountries: 'Alla Länder',
            regionalPlans: 'Regionala Planer',
            worldwideCoverage: 'Världsomfattande Täckning'
        },
        card: {
            from: 'Från',
            data: 'Data',
            sms: 'SMS',
            calls: 'Samtal',
            viewPlans: 'Visa Planer',
            countries: 'länder'
        },
        cashback: {
            title: 'Tjäna Upp Till 10% Cashback på Varje eSIM',
            description: 'Ju mer du reser, desto mer sparar du. Bygg din nivåstatus och lås upp större belöningar med varje köp.',
            explorer: 'Upptäckare',
            adventurer: 'Äventyrare',
            pioneer: 'Pionjär',
            ambassador: 'Ambassadör',
            startEarning: 'Börja tjäna omedelbart',
            afterPurchases: 'Efter $X i köp',
            yourBalance: 'Ditt Cashback-saldo',
            viewRewards: 'Visa Dina Belöningar'
        },
        benefits: {
            title: 'Varför Välja TripPortier eSIM?',
            instant: {
                title: 'Omedelbar Aktivering',
                desc: 'Få ditt eSIM omedelbart via QR-kod. Aktivering på några minuter, ingen väntan krävs.'
            },
            noRoaming: {
                title: 'Inga Roamingavgifter',
                desc: 'Spara upp till 90% jämfört med traditionella roamingavgifter. Få lokala priser vart du än reser.'
            },
            countries: {
                title: '200+ Länder',
                desc: 'Täckning över hela världen med pålitliga nätverkspartners i varje destination.'
            },
            keepNumber: {
                title: 'Behåll Ditt Nummer',
                desc: 'Ditt eSIM fungerar tillsammans med ditt vanliga SIM-kort. Behåll ditt nummer medan du håller dig uppkopplad utomlands.'
            }
        },
        app: {
            title: 'Hantera Dina eSIM i Appen',
            description: 'Ladda ner TripPortier för att köpa eSIM, hantera dina dataplaner och spåra din användning på språng.',
            download: 'Ladda Ner på App Store'
        },
        modal: {
            loading: 'Laddar paket...',
            selectPackage: 'Välj ett paket',
            buyNow: 'Köp Nu',
            all: 'Alla',
            unlimited: 'Obegränsad',
            standard: 'Standard',
            sortPrice: 'Pris: Låg till Hög',
            sortPriceDesc: 'Pris: Hög till Låg',
            sortData: 'Data: Mest Först',
            sortDays: 'Varaktighet: Längst',
            daysValidity: 'dagars giltighet',
            included: 'Inkluderad',
            notIncluded: 'Ej inkluderad',
            provider: 'Leverantör',
            validity: 'Giltighet',
            proceedCheckout: 'Gå Till Kassan'
        },
        tripcoins: {
            youHave: 'Du har',
            tripcoins: 'TripCoins',
            useCoins: 'Använd mynt',
            youSave: 'Du sparar'
        },
        checkout: {
            title: 'Slutför Ditt Köp',
            email: 'E-postadress',
            emailHint: 'Din eSIM QR-kod skickas till denna e-postadress',
            continuePayment: 'Fortsätt Till Betalning',
            securePayment: 'Säker betalning via Stripe',
            tripcoinsApplied: 'TripCoins Tillämpade',
            youllEarn: 'Du kommer att tjäna på detta köp',
            cashbackAs: 'cashback som',
            member: 'medlem',
            earnCashback: 'Tjäna 3% cashback',
            createAccount: 'Skapa ett konto för att tjäna på detta köp!',
            getApp: 'Hämta Appen'
        }
    },
    da: {
        hero: {
            badge: 'Øjeblikkelig Digitalt SIM',
            title: 'Rejse-eSIM',
            description: 'Hold forbindelsen i over 200 destinationer med øjeblikkelig eSIM-aktivering. Intet fysisk SIM-kort nødvendigt.'
        },
        search: {
            placeholder: 'Søg efter et land eller region...',
            button: 'Søg'
        },
        tabs: {
            popular: 'Populære',
            local: 'Lokalt',
            regional: 'Regionalt',
            worldwide: 'Verdensomspændende'
        },
        section: {
            popularDestinations: 'Populære Destinationer',
            allCountries: 'Alle Lande',
            regionalPlans: 'Regionale Planer',
            worldwideCoverage: 'Verdensomspændende Dækning'
        },
        card: {
            from: 'Fra',
            data: 'Data',
            sms: 'SMS',
            calls: 'Opkald',
            viewPlans: 'Se Planer',
            countries: 'lande'
        },
        cashback: {
            title: 'Tjen Op Til 10% Cashback på Hvert eSIM',
            description: 'Jo mere du rejser, jo mere sparer du. Byg din tier-status og lås op for større belønninger med hvert køb.',
            explorer: 'Opdagelsesrejsende',
            adventurer: 'Eventyrer',
            pioneer: 'Pioner',
            ambassador: 'Ambassadør',
            startEarning: 'Begynd at tjene med det samme',
            afterPurchases: 'Efter $X i køb',
            yourBalance: 'Din Cashback Saldo',
            viewRewards: 'Se Dine Belønninger'
        },
        benefits: {
            title: 'Hvorfor Vælge TripPortier eSIM?',
            instant: {
                title: 'Øjeblikkelig Aktivering',
                desc: 'Få dit eSIM øjeblikkeligt via QR-kode. Aktivering på få minutter, ingen ventetid påkrævet.'
            },
            noRoaming: {
                title: 'Ingen Roaming-gebyrer',
                desc: 'Spar op til 90% sammenlignet med traditionelle roaming-gebyrer. Få lokale priser, uanset hvor du rejser hen.'
            },
            countries: {
                title: '200+ Lande',
                desc: 'Dækning over hele verden med pålidelige netværkspartnere i hver destination.'
            },
            keepNumber: {
                title: 'Behold Dit Nummer',
                desc: 'Dit eSIM fungerer sammen med dit almindelige SIM-kort. Behold dit nummer, mens du forbliver forbundet i udlandet.'
            }
        },
        app: {
            title: 'Administrer Dine eSIM i Appen',
            description: 'Download TripPortier for at købe eSIM, administrere dine dataplaner og spore dit forbrug på farten.',
            download: 'Download på App Store'
        },
        modal: {
            loading: 'Indlæser pakker...',
            selectPackage: 'Vælg en pakke',
            buyNow: 'Køb Nu',
            all: 'Alle',
            unlimited: 'Ubegrænset',
            standard: 'Standard',
            sortPrice: 'Pris: Lav til Høj',
            sortPriceDesc: 'Pris: Høj til Lav',
            sortData: 'Data: Mest Først',
            sortDays: 'Varighed: Længst',
            daysValidity: 'dages gyldighed',
            included: 'Inkluderet',
            notIncluded: 'Ikke inkluderet',
            provider: 'Udbyder',
            validity: 'Gyldighed',
            proceedCheckout: 'Fortsæt Til Betaling'
        },
        tripcoins: {
            youHave: 'Du har',
            tripcoins: 'TripCoins',
            useCoins: 'Brug mønter',
            youSave: 'Du sparer'
        },
        checkout: {
            title: 'Fuldfør Dit Køb',
            email: 'E-mailadresse',
            emailHint: 'Din eSIM QR-kode sendes til denne e-mail',
            continuePayment: 'Fortsæt Til Betaling',
            securePayment: 'Sikker betaling via Stripe',
            tripcoinsApplied: 'TripCoins Anvendt',
            youllEarn: 'Du vil tjene på dette køb',
            cashbackAs: 'cashback som',
            member: 'medlem',
            earnCashback: 'Tjen 3% cashback',
            createAccount: 'Opret en konto for at tjene på dette køb!',
            getApp: 'Hent Appen'
        }
    },
    nb: {
        hero: {
            badge: 'Øyeblikkelig Digitalt SIM',
            title: 'Reise-eSIM',
            description: 'Hold deg tilkoblet i over 200 destinasjoner med øyeblikkelig eSIM-aktivering. Intet fysisk SIM-kort nødvendig.'
        },
        search: {
            placeholder: 'Søk etter et land eller region...',
            button: 'Søk'
        },
        tabs: {
            popular: 'Populære',
            local: 'Lokalt',
            regional: 'Regionalt',
            worldwide: 'Verdensomspennende'
        },
        section: {
            popularDestinations: 'Populære Destinasjoner',
            allCountries: 'Alle Land',
            regionalPlans: 'Regionale Planer',
            worldwideCoverage: 'Verdensomspennende Dekning'
        },
        card: {
            from: 'Fra',
            data: 'Data',
            sms: 'SMS',
            calls: 'Anrop',
            viewPlans: 'Se Planer',
            countries: 'land'
        },
        cashback: {
            title: 'Tjen Opptil 10% Cashback på Hvert eSIM',
            description: 'Jo mer du reiser, jo mer sparer du. Bygg din tier-status og lås opp større belønninger med hvert kjøp.',
            explorer: 'Oppdagelsesreisende',
            adventurer: 'Eventyrer',
            pioneer: 'Pioner',
            ambassador: 'Ambassadør',
            startEarning: 'Begynn å tjene umiddelbart',
            afterPurchases: 'Etter $X i kjøp',
            yourBalance: 'Din Cashback Saldo',
            viewRewards: 'Se Dine Belønninger'
        },
        benefits: {
            title: 'Hvorfor Velge TripPortier eSIM?',
            instant: {
                title: 'Øyeblikkelig Aktivering',
                desc: 'Få ditt eSIM øyeblikkelig via QR-kode. Aktivering på minutter, ingen ventetid nødvendig.'
            },
            noRoaming: {
                title: 'Ingen Roaming-avgifter',
                desc: 'Spar opptil 90% sammenlignet med tradisjonelle roaming-avgifter. Få lokale priser uansett hvor du reiser.'
            },
            countries: {
                title: '200+ Land',
                desc: 'Dekning over hele verden med pålitelige nettverkspartnere i hver destinasjon.'
            },
            keepNumber: {
                title: 'Behold Ditt Nummer',
                desc: 'Ditt eSIM fungerer sammen med ditt vanlige SIM-kort. Behold ditt nummer mens du holder deg tilkoblet i utlandet.'
            }
        },
        app: {
            title: 'Administrer Dine eSIM i Appen',
            description: 'Last ned TripPortier for å kjøpe eSIM, administrere dine dataplaner og spore forbruket ditt på farten.',
            download: 'Last Ned på App Store'
        },
        modal: {
            loading: 'Laster pakker...',
            selectPackage: 'Velg en pakke',
            buyNow: 'Kjøp Nå',
            all: 'Alle',
            unlimited: 'Ubegrenset',
            standard: 'Standard',
            sortPrice: 'Pris: Lav til Høy',
            sortPriceDesc: 'Pris: Høy til Lav',
            sortData: 'Data: Mest Først',
            sortDays: 'Varighet: Lengst',
            daysValidity: 'dagers gyldighet',
            included: 'Inkludert',
            notIncluded: 'Ikke inkludert',
            provider: 'Leverandør',
            validity: 'Gyldighet',
            proceedCheckout: 'Fortsett Til Betaling'
        },
        tripcoins: {
            youHave: 'Du har',
            tripcoins: 'TripCoins',
            useCoins: 'Bruk mynter',
            youSave: 'Du sparer'
        },
        checkout: {
            title: 'Fullfør Ditt Kjøp',
            email: 'E-postadresse',
            emailHint: 'Din eSIM QR-kode vil bli sendt til denne e-posten',
            continuePayment: 'Fortsett Til Betaling',
            securePayment: 'Sikker betaling via Stripe',
            tripcoinsApplied: 'TripCoins Anvendt',
            youllEarn: 'Du vil tjene på dette kjøpet',
            cashbackAs: 'cashback som',
            member: 'medlem',
            earnCashback: 'Tjen 3% cashback',
            createAccount: 'Opprett en konto for å tjene på dette kjøpet!',
            getApp: 'Få Appen'
        }
    },
    fi: {
        hero: {
            badge: 'Välitön Digitaalinen SIM',
            title: 'Matka-eSIM',
            description: 'Pysy yhteydessä yli 200 kohteessa välittömällä eSIM-aktivoinnilla. Fyysistä SIM-korttia ei tarvita.'
        },
        search: {
            placeholder: 'Etsi maata tai aluetta...',
            button: 'Hae'
        },
        tabs: {
            popular: 'Suosittu',
            local: 'Paikallinen',
            regional: 'Alueellinen',
            worldwide: 'Maailmanlaajuinen'
        },
        section: {
            popularDestinations: 'Suositut Kohteet',
            allCountries: 'Kaikki Maat',
            regionalPlans: 'Alueelliset Paketit',
            worldwideCoverage: 'Maailmanlaajuinen Peitto'
        },
        card: {
            from: 'Alkaen',
            data: 'Data',
            sms: 'SMS',
            calls: 'Puhelut',
            viewPlans: 'Näytä Paketit',
            countries: 'maata'
        },
        cashback: {
            title: 'Ansaitse Jopa 10% Cashbackia Jokaisesta eSIM:stä',
            description: 'Mitä enemmän matkustat, sitä enemmän säästät. Rakenna tier-statuksesi ja avaa suuremmat palkinnot jokaisella ostoksella.',
            explorer: 'Tutkimusmatkailija',
            adventurer: 'Seikkailija',
            pioneer: 'Pioneeri',
            ambassador: 'Lähettiläs',
            startEarning: 'Aloita ansaitseminen välittömästi',
            afterPurchases: '$X:n ostojen jälkeen',
            yourBalance: 'Cashback-saldosi',
            viewRewards: 'Näytä Palkkiosi'
        },
        benefits: {
            title: 'Miksi Valita TripPortier eSIM?',
            instant: {
                title: 'Välitön Aktivointi',
                desc: 'Saat eSIM:si välittömästi QR-koodin kautta. Aktivointi muutamassa minuutissa, odotusta ei tarvita.'
            },
            noRoaming: {
                title: 'Ei Roaming-maksuja',
                desc: 'Säästä jopa 90% verrattuna perinteisiin roaming-maksuihin. Saat paikalliset hinnat minne tahansa matkustatkin.'
            },
            countries: {
                title: 'Yli 200 Maata',
                desc: 'Maailmanlaajuinen peitto luotettavien verkostokumppanien kanssa jokaisessa kohteessa.'
            },
            keepNumber: {
                title: 'Pidä Numerosi',
                desc: 'eSIM-korttisi toimii tavallisen SIM-korttisi rinnalla. Pidä numerosi pysyessäsi yhteydessä ulkomailla.'
            }
        },
        app: {
            title: 'Hallitse eSIM-korttejasi Sovelluksessa',
            description: 'Lataa TripPortier ostaaksesi eSIM-kortteja, hallitaksesi datapakettejasi ja seurataksesi käyttöäsi liikkeellä.',
            download: 'Lataa App Storesta'
        },
        modal: {
            loading: 'Ladataan paketteja...',
            selectPackage: 'Valitse paketti',
            buyNow: 'Osta Nyt',
            all: 'Kaikki',
            unlimited: 'Rajoittamaton',
            standard: 'Vakio',
            sortPrice: 'Hinta: Matalasta Korkeaan',
            sortPriceDesc: 'Hinta: Korkeasta Matalaan',
            sortData: 'Data: Eniten Ensin',
            sortDays: 'Kesto: Pisin',
            daysValidity: 'päivän voimassaolo',
            included: 'Sisältyy',
            notIncluded: 'Ei sisälly',
            provider: 'Palveluntarjoaja',
            validity: 'Voimassaolo',
            proceedCheckout: 'Siirry Kassalle'
        },
        tripcoins: {
            youHave: 'Sinulla on',
            tripcoins: 'TripCoins',
            useCoins: 'Käytä kolikoita',
            youSave: 'Säästät'
        },
        checkout: {
            title: 'Suorita Ostoksesi Loppuun',
            email: 'Sähköpostiosoite',
            emailHint: 'eSIM QR-koodisi lähetetään tähän sähköpostiin',
            continuePayment: 'Jatka Maksuun',
            securePayment: 'Turvallinen maksu Stripen avulla',
            tripcoinsApplied: 'TripCoins Käytetty',
            youllEarn: 'Ansaitset tästä ostoksesta',
            cashbackAs: 'cashbackia',
            member: 'jäsenenä',
            earnCashback: 'Ansaitse 3% cashbackia',
            createAccount: 'Luo tili ansaitaksesi tästä ostoksesta!',
            getApp: 'Hanki Sovellus'
        }
    },
    th: {
        hero: {
            badge: 'ซิมดิจิทัลทันที',
            title: 'eSIM ท่องเที่ยว',
            description: 'เชื่อมต่อในกว่า 200 จุดหมายปลายทางด้วยการเปิดใช้งาน eSIM ทันที ไม่จำเป็นต้องใช้ซิมการ์ดจริง'
        },
        search: {
            placeholder: 'ค้นหาประเทศหรือภูมิภาค...',
            button: 'ค้นหา'
        },
        tabs: {
            popular: 'ยอดนิยม',
            local: 'ท้องถิ่น',
            regional: 'ภูมิภาค',
            worldwide: 'ทั่วโลก'
        },
        section: {
            popularDestinations: 'จุดหมายปลายทางยอดนิยม',
            allCountries: 'ทุกประเทศ',
            regionalPlans: 'แพ็คเกจภูมิภาค',
            worldwideCoverage: 'ครอบคลุมทั่วโลก'
        },
        card: {
            from: 'เริ่มต้น',
            data: 'ข้อมูล',
            sms: 'SMS',
            calls: 'โทรศัพท์',
            viewPlans: 'ดูแพ็คเกจ',
            countries: 'ประเทศ'
        },
        cashback: {
            title: 'รับเงินคืนสูงสุด 10% ทุก eSIM',
            description: 'ยิ่งเดินทางมากเท่าไหร่ ยิ่งประหยัดมากเท่านั้น สร้างสถานะระดับของคุณและปลดล็อกรางวัลที่ใหญ่ขึ้นกับทุกการซื้อ',
            explorer: 'นักสำรวจ',
            adventurer: 'นักผจญภัย',
            pioneer: 'ผู้บุกเบิก',
            ambassador: 'ทูต',
            startEarning: 'เริ่มรับทันที',
            afterPurchases: 'หลังจากซื้อ $X',
            yourBalance: 'ยอดเงินคืนของคุณ',
            viewRewards: 'ดูรางวัลของคุณ'
        },
        benefits: {
            title: 'ทำไมต้องเลือก TripPortier eSIM?',
            instant: {
                title: 'เปิดใช้งานทันที',
                desc: 'รับ eSIM ของคุณทันทีผ่าน QR code เปิดใช้งานภายในไม่กี่นาที ไม่ต้องรอ'
            },
            noRoaming: {
                title: 'ไม่มีค่าโรมมิ่ง',
                desc: 'ประหยัดได้ถึง 90% เมื่อเทียบกับค่าโรมมิ่งแบบดั้งเดิม รับอัตราท้องถิ่นไม่ว่าคุณจะเดินทางไปที่ไหน'
            },
            countries: {
                title: 'กว่า 200 ประเทศ',
                desc: 'ครอบคลุมทั่วโลกด้วยพันธมิตรเครือข่ายที่เชื่อถือได้ในทุกจุดหมายปลายทาง'
            },
            keepNumber: {
                title: 'รักษาหมายเลขของคุณ',
                desc: 'eSIM ของคุณทำงานควบคู่กับซิมการ์ดปกติของคุณ รักษาหมายเลขของคุณในขณะที่เชื่อมต่อในต่างประเทศ'
            }
        },
        app: {
            title: 'จัดการ eSIM ของคุณในแอป',
            description: 'ดาวน์โหลด TripPortier เพื่อซื้อ eSIM จัดการแพ็คเกจข้อมูลของคุณ และติดตามการใช้งานของคุณขณะเดินทาง',
            download: 'ดาวน์โหลดบน App Store'
        },
        modal: {
            loading: 'กำลังโหลดแพ็คเกจ...',
            selectPackage: 'เลือกแพ็คเกจ',
            buyNow: 'ซื้อเลย',
            all: 'ทั้งหมด',
            unlimited: 'ไม่จำกัด',
            standard: 'มาตรฐาน',
            sortPrice: 'ราคา: ต่ำไปสูง',
            sortPriceDesc: 'ราคา: สูงไปต่ำ',
            sortData: 'ข้อมูล: มากที่สุดก่อน',
            sortDays: 'ระยะเวลา: นานที่สุด',
            daysValidity: 'วันใช้งาน',
            included: 'รวมอยู่',
            notIncluded: 'ไม่รวมอยู่',
            provider: 'ผู้ให้บริการ',
            validity: 'ระยะเวลา',
            proceedCheckout: 'ดำเนินการชำระเงิน'
        },
        tripcoins: {
            youHave: 'คุณมี',
            tripcoins: 'TripCoins',
            useCoins: 'ใช้เหรียญ',
            youSave: 'คุณประหยัด'
        },
        checkout: {
            title: 'ทำการซื้อให้เสร็จสมบูรณ์',
            email: 'ที่อยู่อีเมล',
            emailHint: 'QR code eSIM ของคุณจะถูกส่งไปยังอีเมลนี้',
            continuePayment: 'ดำเนินการชำระเงิน',
            securePayment: 'การชำระเงินที่ปลอดภัยโดย Stripe',
            tripcoinsApplied: 'ใช้ TripCoins แล้ว',
            youllEarn: 'คุณจะได้รับจากการซื้อนี้',
            cashbackAs: 'เงินคืนในฐานะ',
            member: 'สมาชิก',
            earnCashback: 'รับเงินคืน 3%',
            createAccount: 'สร้างบัญชีเพื่อรับจากการซื้อนี้!',
            getApp: 'รับแอป'
        }
    },
    tr: {
        hero: {
            badge: 'Anında Dijital SIM',
            title: 'Seyahat eSIM',
            description: 'Anında eSIM aktivasyonu ile 200\'den fazla destinasyonda bağlantıda kalın. Fiziksel SIM kart gerekli değil.'
        },
        search: {
            placeholder: 'Ülke veya bölge ara...',
            button: 'Ara'
        },
        tabs: {
            popular: 'Popüler',
            local: 'Yerel',
            regional: 'Bölgesel',
            worldwide: 'Dünya Çapında'
        },
        section: {
            popularDestinations: 'Popüler Destinasyonlar',
            allCountries: 'Tüm Ülkeler',
            regionalPlans: 'Bölgesel Planlar',
            worldwideCoverage: 'Dünya Çapında Kapsama'
        },
        card: {
            from: 'Başlangıç',
            data: 'Veri',
            sms: 'SMS',
            calls: 'Aramalar',
            viewPlans: 'Planları Görüntüle',
            countries: 'ülke'
        },
        cashback: {
            title: 'Her eSIM\'de %10\'a Varan Cashback Kazanın',
            description: 'Ne kadar çok seyahat ederseniz, o kadar çok tasarruf edersiniz. Kademe durumunuzu oluşturun ve her satın alımda daha büyük ödüllerin kilidini açın.',
            explorer: 'Kaşif',
            adventurer: 'Maceracı',
            pioneer: 'Öncü',
            ambassador: 'Büyükelçi',
            startEarning: 'Hemen kazanmaya başlayın',
            afterPurchases: '$X satın alma sonrası',
            yourBalance: 'Cashback Bakiyeniz',
            viewRewards: 'Ödüllerinizi Görüntüleyin'
        },
        benefits: {
            title: 'Neden TripPortier eSIM Seçmelisiniz?',
            instant: {
                title: 'Anında Aktivasyon',
                desc: 'QR kod ile anında eSIM\'inizi alın. Dakikalar içinde aktivasyon, bekleme gerekmez.'
            },
            noRoaming: {
                title: 'Roaming Ücreti Yok',
                desc: 'Geleneksel roaming ücretlerine kıyasla %90\'a varan tasarruf. Nereye seyahat ederseniz edin yerel ücretler alın.'
            },
            countries: {
                title: '200+ Ülke',
                desc: 'Her destinasyonda güvenilir ağ ortakları ile dünya çapında kapsama.'
            },
            keepNumber: {
                title: 'Numaranızı Koruyun',
                desc: 'eSIM\'iniz normal SIM kartınızla birlikte çalışır. Yurtdışında bağlantıda kalırken numaranızı koruyun.'
            }
        },
        app: {
            title: 'eSIM\'lerinizi Uygulamada Yönetin',
            description: 'eSIM satın almak, veri planlarınızı yönetmek ve kullanımınızı hareket halindeyken takip etmek için TripPortier\'i indirin.',
            download: 'App Store\'dan İndir'
        },
        modal: {
            loading: 'Paketler yükleniyor...',
            selectPackage: 'Bir paket seçin',
            buyNow: 'Şimdi Satın Al',
            all: 'Tümü',
            unlimited: 'Sınırsız',
            standard: 'Standart',
            sortPrice: 'Fiyat: Düşükten Yükseğe',
            sortPriceDesc: 'Fiyat: Yüksekten Düşüğe',
            sortData: 'Veri: En Fazla Önce',
            sortDays: 'Süre: En Uzun',
            daysValidity: 'gün geçerlilik',
            included: 'Dahil',
            notIncluded: 'Dahil değil',
            provider: 'Sağlayıcı',
            validity: 'Geçerlilik',
            proceedCheckout: 'Ödemeye Devam Et'
        },
        tripcoins: {
            youHave: 'Sahipsiniz',
            tripcoins: 'TripCoins',
            useCoins: 'Coin kullan',
            youSave: 'Tasarruf ediyorsunuz'
        },
        checkout: {
            title: 'Satın Alımınızı Tamamlayın',
            email: 'E-posta Adresi',
            emailHint: 'eSIM QR kodunuz bu e-postaya gönderilecek',
            continuePayment: 'Ödemeye Devam Et',
            securePayment: 'Stripe tarafından güvenli ödeme',
            tripcoinsApplied: 'TripCoins Uygulandı',
            youllEarn: 'Bu satın alımda kazanacaksınız',
            cashbackAs: 'cashback olarak',
            member: 'üye',
            earnCashback: '%3 cashback kazanın',
            createAccount: 'Bu satın alımda kazanmak için bir hesap oluşturun!',
            getApp: 'Uygulamayı Edinin'
        }
    },
    'pt-BR': {
        hero: {
            badge: 'SIM Digital Instantâneo',
            title: 'eSIM de Viagem',
            description: 'Mantenha-se conectado em mais de 200 destinos com ativação instantânea de eSIM. Nenhum cartão SIM físico necessário.'
        },
        search: {
            placeholder: 'Pesquisar por país ou região...',
            button: 'Pesquisar'
        },
        tabs: {
            popular: 'Popular',
            local: 'Local',
            regional: 'Regional',
            worldwide: 'Mundial'
        },
        section: {
            popularDestinations: 'Destinos Populares',
            allCountries: 'Todos os Países',
            regionalPlans: 'Planos Regionais',
            worldwideCoverage: 'Cobertura Mundial'
        },
        card: {
            from: 'A partir de',
            data: 'Dados',
            sms: 'SMS',
            calls: 'Chamadas',
            viewPlans: 'Ver Planos',
            countries: 'países'
        },
        cashback: {
            title: 'Ganhe Até 10% de Cashback em Cada eSIM',
            description: 'Quanto mais você viaja, mais você economiza. Construa seu status de nível e desbloqueie recompensas maiores a cada compra.',
            explorer: 'Explorador',
            adventurer: 'Aventureiro',
            pioneer: 'Pioneiro',
            ambassador: 'Embaixador',
            startEarning: 'Comece a ganhar imediatamente',
            afterPurchases: 'Após $X em compras',
            yourBalance: 'Seu Saldo de Cashback',
            viewRewards: 'Ver Suas Recompensas'
        },
        benefits: {
            title: 'Por Que Escolher TripPortier eSIM?',
            instant: {
                title: 'Ativação Instantânea',
                desc: 'Receba seu eSIM instantaneamente via código QR. Ativação em minutos, sem espera necessária.'
            },
            noRoaming: {
                title: 'Sem Taxas de Roaming',
                desc: 'Economize até 90% em comparação com taxas de roaming tradicionais. Obtenha tarifas locais onde quer que você viaje.'
            },
            countries: {
                title: '200+ Países',
                desc: 'Cobertura em todo o mundo com parceiros de rede confiáveis em cada destino.'
            },
            keepNumber: {
                title: 'Mantenha Seu Número',
                desc: 'Seu eSIM funciona junto com seu cartão SIM regular. Mantenha seu número enquanto permanece conectado no exterior.'
            }
        },
        app: {
            title: 'Gerencie Seus eSIMs no App',
            description: 'Baixe o TripPortier para comprar eSIMs, gerenciar seus planos de dados e rastrear seu uso em movimento.',
            download: 'Baixar na App Store'
        },
        modal: {
            loading: 'Carregando pacotes...',
            selectPackage: 'Selecione um pacote',
            buyNow: 'Comprar Agora',
            all: 'Todos',
            unlimited: 'Ilimitado',
            standard: 'Padrão',
            sortPrice: 'Preço: Menor para Maior',
            sortPriceDesc: 'Preço: Maior para Menor',
            sortData: 'Dados: Mais Primeiro',
            sortDays: 'Duração: Mais Longo',
            daysValidity: 'dias de validade',
            included: 'Incluído',
            notIncluded: 'Não incluído',
            provider: 'Provedor',
            validity: 'Validade',
            proceedCheckout: 'Prosseguir para Pagamento'
        },
        tripcoins: {
            youHave: 'Você tem',
            tripcoins: 'TripCoins',
            useCoins: 'Usar moedas',
            youSave: 'Você economiza'
        },
        checkout: {
            title: 'Complete Sua Compra',
            email: 'Endereço de E-mail',
            emailHint: 'Seu código QR do eSIM será enviado para este e-mail',
            continuePayment: 'Continuar para Pagamento',
            securePayment: 'Pagamento seguro pela Stripe',
            tripcoinsApplied: 'TripCoins Aplicados',
            youllEarn: 'Você vai ganhar nesta compra',
            cashbackAs: 'cashback como',
            member: 'membro',
            earnCashback: 'Ganhe 3% de cashback',
            createAccount: 'Crie uma conta para ganhar nesta compra!',
            getApp: 'Obter o App'
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { languages, translations };
}

export type Lang = "bs" | "en";

export const cities = [
  "Sarajevo", "Zenica", "Tuzla", "Mostar", "Banja Luka",
  "Živinice", "Kakanj", "Lukavac", "Prijedor", "Goražde", "Drugo",
];

const cityLocativeMap: Record<string, string> = {
  "Sarajevo": "Sarajevu",
  "Zenica": "Zenici",
  "Tuzla": "Tuzli",
  "Mostar": "Mostaru",
  "Banja Luka": "Banjoj Luci",
  "Živinice": "Živinicama",
  "Kakanj": "Kaknju",
  "Lukavac": "Lukavcu",
  "Prijedor": "Prijedoru",
  "Goražde": "Goraždu",
  "Drugo": "drugom gradu",
};

export const cityLocative = (city: string): string => cityLocativeMap[city] ?? city;

export type Children = "young" | "older" | "none";
export type Heating = "coal" | "gas" | "district" | "unsure";

export type Profile = {
  city: string;
  children: Children;
  heating: Heating;
};

export const t = (lang: Lang) => (lang === "bs" ? bs : en);

const bs = {
  brand: "Bura",
  langToggle: "BHS | EN",
  // Onboarding
  ob_title: "Recite nam nešto o sebi.",
  ob_sub: "Bura će vam svaki dan reći šta vaša djeca udišu, i šta možete učiniti.",
  ob_q1: "Gdje živite?",
  ob_q2: "Imate li djecu?",
  ob_q3: "Čime grijete dom?",
  ob_select_city: "Odaberite grad",
  ob_children: { young: "Da, malu djecu (do 10 godina)", older: "Da, stariju djecu", none: "Nemam djece" },
  ob_heating: { coal: "Ugalj ili drvo", gas: "Plin", district: "Daljinsko grijanje", unsure: "Nisam siguran/na" },
  ob_cta: "Pokažite mi zrak",
  ob_note: "Možete promijeniti ove podatke u bilo kom trenutku.",
  next: "Dalje",
  back: "Nazad",

  alert_banner: (city: string, pm: string, x: string) => `${city} danas: PM2.5 ${pm}, ${x}× iznad WHO granice`,

  greet_morning: "Dobro jutro.",
  greet_kids_coal: (city: string, x: string) =>
    `Danas u ${cityLocative(city)} djeca dišu zrak ${x}× iznad WHO preporuke.`,
  greet_default: (city: string, pm: string, x: string) =>
    `Danas u ${cityLocative(city)}: PM2.5 ${pm}, ${x}× iznad WHO granice.`,
  status_label: "DANAS",
  status_good: "DOBAR ZRAK",
  status_moderate: "UMJEREN ZRAK",
  status_bad: "LOŠ ZRAK",
  status_hazard: "OPASAN ZRAK",
  status_unknown: "PROVJERA ZRAKA",
  primary_tag: "PRIMARNA PREPORUKA",
  secondary_tag: "DODATNI SAVJETI",
  buri_tag: "Buri prati vaš zrak. Svaki dan.",

  actions_title: "Vaši koraci za danas",
  actions_sub: (city: string, fam: string, heat: string) =>
    `Prilagođeno za ${city} · ${fam} · ${heat}`,

  fam_young: "porodica s malom djecom",
  fam_older: "porodica sa starijom djecom",
  fam_none: "bez djece",
  heat_coal: "ugalj/drvo", heat_gas: "plin", heat_district: "daljinsko", heat_unsure: "nepoznato grijanje",

  live_pm: "PM2.5 (µg/m³)", live_aqi: "AQI", live_temp: "Temperatura",
  live_source: (m: string) => `aqicn.org · Federalni Hidrometeorološki Zavod · ažurirano prije ${m} min`,
  live_stale: "Podaci se osvježavaju... Prikazujemo posljednje poznate vrijednosti.",

  why_title: (pm: number | null): string =>
    pm == null ? "Zašto je danas ovako?"
    : pm < 15 ? "Zašto je zrak danas dobar?"
    : pm < 35 ? "Zašto je zrak danas umjeren?"
    : "Zašto je zrak danas loš?",
  why_text: (t: string, pm: number | null) => {
    const tn = parseFloat(t);
    const warm = !Number.isNaN(tn) && tn >= 18;
    if (pm != null && pm < 15) {
      return warm
        ? `Temperatura je ${t}°C. Ljeti je manje grijanja, a vjetar raznosi čestice iz kotline — zrak je čist. Iskoristite dan vani.`
        : `Temperatura je ${t}°C i vjetar raznosi čestice iz kotline. Manje grijanja uglja i drva znači čistiji zrak. Iskoristite dan vani.`;
    }
    if (pm != null && pm < 35) {
      return warm
        ? `Temperatura je ${t}°C. Pri ovakvim temperaturama glavni izvori su saobraćaj, građevinska prašina i prenos čestica iz regiona (ponekad i dim šumskih požara). Stanje je umjereno — oprez za osjetljive grupe.`
        : `Temperatura je ${t}°C. Domaćinstva u BiH još uvijek sagorijevaju ugalj i drva, a dio dima ostaje u kotlini. Stanje je umjereno — oprez za osjetljive grupe.`;
    }
    return warm
      ? `Temperatura je ${t}°C. Ljeti zagađenje najčešće dolazi od saobraćaja, industrije i prenosa dima šumskih požara iz regiona — bez vjetra čestice se zadržavaju nad gradom.`
      : `Temperatura je pala na ${t}°C. Kad je hladno, domaćinstva u BiH sagorijevaju više uglja i drva. Dim ostaje zarobljen u kotlini zbog temperaturne inverzije.`;
  },
  why_source: "Izvor: SMHI heating emissions data, BiH",

  ebm_title: "Svaki dah je važan.",
  ebm_sub: "Posebno za najmanja pluća.",
  ebm_p: (city: string, x: string, pm: number | null): string =>
    pm != null && pm < 15
      ? `Upravo sada u ${cityLocative(city)}, zrak je čist (${x}× WHO granice). Iskoristite ovaj dan — djeca neka budu vani što duže. Djeca udišu 50% više zraka po kilogramu tijela nego odrasli, pa su čisti dani posebno dragocjeni. Prema UNICEF-u, svako peto dijete u BiH pati od respiratornih problema, zato računamo svaki dan dobrog zraka.`
      : `Upravo sada u ${cityLocative(city)}, zrak sadrži ${x}× više štetnih čestica nego što WHO smatra sigurnim. Djeca udišu 50% više zraka po kilogramu tijela nego odrasli, što zagađen zrak čini dvostruko opasnijim za njih. Prema UNICEF-u, svako peto dijete u BiH već pati od respiratornih problema. Preko 100.000 djece živi u najzagađenijim gradovima BiH.`,
  ebm_source: "Izvor: UNICEF BiH, WHO",

  work_title: "Šta već funkcioniše",
  work_sub: "BiH napreduje. Evo gdje se dešavaju promjene.",
  work_eu: "EU STANDARD",
  work_eu_city: "Živinice",
  work_eu_text: "Prvi EU-usklađen centar za otpad u Tuzlanskom kantonu. Služi 95.000 ljudi.",
  work_rec: "RECIKLAŽA AKTIVNA",
  work_rec_city: "Sarajevo",
  work_rec_text: "Ekopak mreža kontejnera aktivna u cijelom gradu. Preko 1.440 domaćinstava razvrstava otpad.",
  work_air: "RECIKLAŽA AKTIVNA",
  work_air_city: "Bihać",
  work_air_text: "Bihać je jedan od aktivnijih gradova u BiH kada je riječ o reciklaži – JKP Komrad prikuplja papir, plastiku i staklo na 22 eko-otoka širom grada.",
  ranking: "Rang gradova ovaj mjesec",
  ranking_note: "Niži broj znači čistiji zrak",
  ranking_source: "Podaci: aqicn.org · Federalni Hidrometeorološki Zavod BiH",
  ranking_disclaimer: "Rang je ilustrativan i baziran na dostupnim podacima o kvalitetu zraka. Ne predstavlja zvanično rangiranje gradova.",
  actions_info: "Savjeti su generisani pomoću AI na osnovu trenutnih podataka o kvalitetu zraka. Ne zamjenjuju medicinski savjet.",
  foot_beta: "Bura je u beta fazi. Podaci i preporuke služe u demonstrativne svrhe i možda ne odražavaju stvarno stanje u realnom vremenu.",

  rep_title: "Vaše oči pomažu zaštititi djecu u blizini.",
  rep_sub: "Dim iz dimnjaka koji ne bi trebao gorjeti. Hrpa bačena pored škole. Miris kojeg juče nije bilo. Podijelite šta vidite.",
  rep_b1: "Unakrsno provjereno sa satelitskim podacima",
  rep_b2: "Dijeli se s partnerima: NGO, novinari, općine",
  rep_b3: "Korisno za porodice u blizini",
  rep_loc: "LOKACIJA", rep_desc: "OPIS", rep_photo: "Dodaj fotografiju",
  rep_cta: "Zaštitite moj kvart",
  rep_why: "Zašto prijaviti?",
  rep_why_text: "Ne tražimo krivce. Tražimo obrasce. Vaša prijava pomaže porodicama u blizini da znaju šta dišu.",

  sub_title: "Buri vam šalje poruku svako jutro u 7h.",
  sub_sub: "Šta vaša djeca dišu danas. Šta možete učiniti. Ništa više.",
  sub_email: "Vaš email",
  sub_cta: "Primajte jutarnje poruke",
  sub_note: "Besplatno. Vaši podaci su sigurni. Možete se odjaviti u bilo kom trenutku.",
  sub_done: "Hvala! Ovo je još beta verzija — javljamo vam se lično u narednim danima.",

  hiw_title: "Otvoreni podaci. Otvoreni kod. Besplatno zauvijek.",
  hiw_a: "Sateliti gledaju odozgo",
  hiw_a_t: "Sateliti EU Copernicus svakodnevno prelijevaju BiH i otkrivaju oblake dima, prašinu i obrasce zagađenja.",
  hiw_b: "Senzori mjere na zemlji",
  hiw_b_t: "Senzori u gradovima mjere čestice koje vaša porodica zaista udiše, ulica po ulica, sat po sat.",
  hiw_c: "Građani prijavljuju šta vide",
  hiw_c_t: "Vi prijavljujete dim, deponije i mirise. Lokalne oči vide ono što sateliti propuste.",
  hiw_d: "Spajamo tri izvora",
  hiw_d_t: "Naš sistem uspoređuje sve izvore, traži obrasce i objašnjava ih jednostavnim jezikom. Kad se izvori slažu, signal je pouzdan.",

  road_title: "Od podataka do utjecaja",
  road_p1: "Sateliti, senzori i prijave građana",
  road_p2: "Senzori u školama i edukacija",
  road_p3: "Buri, gejmifikacija i nagrade",
  road_p4: "Srbija, Kosovo, Sjeverna Makedonija",
  road_phase: "FAZA",
  road_active: "AKTIVNO",

  foot_tag: "Znaj šta dišeš.",
  foot_data: "Podaci: EU Copernicus · OpenAQ · aqicn.org · Federalni Hidrometeorološki Zavod BiH",
  foot_mission: "Bura ne optužuje. Bura čini nevidljivo vidljivim.",
  foot_founder: "",
  foot_bottom: "Svaki dah je važan.",
  foot_disclaimer: "Ovo je prototip. Podaci i preporuke služe isključivo u demonstrativne svrhe i možda ne odražavaju stvarno stanje kvaliteta zraka u realnom vremenu.",
  edit_profile: "Uredi profil",

  // Schools teaser (main page)
  schools_teaser_label: "ŠKOLE U AKCIJI",
  schools_teaser_title: "Škole koje predvode promjenu.",
  schools_teaser_sub: "Neke škole u BiH već poduzimaju akciju za čišći zrak. Instaliraju senzore. Podučavaju djecu. Dijele rezultate sa zajednicom. Bura ih čini vidljivim i poziva ostale da im se pridruže.",
  schools_teaser_amber: "Budite prva škola u vašem gradu.",
  schools_teaser_cta: "Vidi sve škole →",

  // /skole page
  schools_hero_title: "Škole koje predvode promjenu.",
  schools_hero_sub: "Čist zrak počinje u učionici.",
  schools_hero_body:
    "Neke škole u BiH već poduzimaju akciju za čišći zrak. Instaliraju senzore. Podučavaju djecu. Dijele rezultate sa zajednicom. Bura ih čini vidljivim i poziva ostale da im se pridruže.",

  schools_map_title: "Škole na mapi",
  schools_legend_active: "Aktivne, senzori i nastava",
  schools_legend_dev: "U razvoju, počinju",
  schools_legend_interested: "Zainteresirane, žele se pridružiti",
  schools_status_interested: "Zainteresirana",
  schools_more_info: "Više info →",
  schools_pin_sa: "OŠ pilot, Sarajevo",
  schools_pin_ze: "OŠ pilot, Zenica",
  schools_pin_tu: "OŠ pilot, Tuzla",
  schools_map_disclaimer:
    "Ovo je pilot mapa. Prve škole se pridružuju 2026. Vaša škola može biti prva u vašem gradu.",

  schools_what_title: "Šta škole rade?",
  schools_what_a_t: "Mjere zrak",
  schools_what_a_p:
    "Instaliraju senzore koji mjere PM2.5 u učionicama i školskom dvorištu. Učenici vide podatke uživo.",
  schools_what_b_t: "Podučavaju",
  schools_what_b_p:
    "Nastavnici koriste Bura podatke u nastavi: nauka, geografija, zdravstveni odgoj.",
  schools_what_c_t: "Dijele s porodicama",
  schools_what_c_p:
    "Rezultati mjerenja dostupni su roditeljima kroz Bura aplikaciju. Škola postaje dio lokalne zajednice.",

  schools_stories_title: "Priče iz škola",
  schools_stories_body:
    "Prve priče dolaze uskoro. Prijavite svoju školu i budite dio prve generacije Bura škola u BiH.",
  schools_stories_cta: "Prijavite svoju školu →",

  schools_join_title: "Je li vaša škola sljedeća?",
  schools_join_sub: "Tražimo prve škole u BiH koje žele biti dio Bura mreže.",
  schools_join_a_t: "Besplatni senzor",
  schools_join_a_p: "Prve pilot škole dobivaju Bura senzor bez naknade.",
  schools_join_b_t: "Materijali za nastavu",
  schools_join_b_p:
    "Pripremamo nastavne materijale za integraciju podataka o kvalitetu zraka u nastavu.",
  schools_join_c_t: "Vidljivost na mapi",
  schools_join_c_p: "Vaša škola postaje vidljiva svim porodicama u vašem gradu.",
  schools_form_school: "NAZIV ŠKOLE",
  schools_form_city: "GRAD",
  schools_form_contact: "IME KONTAKT OSOBE",
  schools_form_email: "EMAIL",
  schools_form_cta: "Prijavite svoju školu",
  schools_form_done: "Hvala! Kontaktirat ćemo vas u roku 48 sati.",
};

const en: typeof bs = {
  brand: "Bura",
  langToggle: "BHS | EN",
  ob_title: "Tell us a little about yourself.",
  ob_sub: "Every morning, Bura tells you what your children breathe, and what you can do.",
  ob_q1: "Where do you live?",
  ob_q2: "Do you have children?",
  ob_q3: "How do you heat your home?",
  ob_select_city: "Select a city",
  ob_children: { young: "Yes, young children (up to 10)", older: "Yes, older children", none: "No children" },
  ob_heating: { coal: "Coal or wood", gas: "Gas", district: "District heating", unsure: "Not sure" },
  ob_cta: "Show me the air",
  ob_note: "You can change these answers anytime.",
  next: "Next", back: "Back",

  alert_banner: (city, pm, x) => `${city} today: PM2.5 ${pm}, ${x}× above the WHO limit`,
  greet_morning: "Good morning.",
  greet_kids_coal: (city, x) =>
    `Today in ${city}, children are breathing air ${x}× above the WHO recommendation.`,
  greet_default: (city, pm, x) => `Today in ${city}: PM2.5 ${pm}, ${x}× above the WHO limit.`,
  status_label: "TODAY",
  status_good: "GOOD AIR",
  status_moderate: "MODERATE AIR",
  status_bad: "UNHEALTHY AIR",
  status_hazard: "HAZARDOUS AIR",
  status_unknown: "CHECKING AIR",
  primary_tag: "PRIMARY RECOMMENDATION",
  secondary_tag: "ADDITIONAL TIPS",
  buri_tag: "Buri watches your air. Every day.",

  actions_title: "Your steps for today",
  actions_sub: (city, fam, heat) => `Tailored for ${city} · ${fam} · ${heat}`,
  fam_young: "family with young children", fam_older: "family with older children", fam_none: "no children",
  heat_coal: "coal/wood", heat_gas: "gas", heat_district: "district", heat_unsure: "unknown heating",

  live_pm: "PM2.5 (µg/m³)", live_aqi: "AQI", live_temp: "Temperature",
  live_source: (m) => `aqicn.org · Federalni Hidrometeorološki Zavod · updated ${m} min ago`,
  live_stale: "Refreshing data... Showing last known values.",

  why_title: (pm: number | null) =>
    pm == null ? "What's going on today?"
    : pm < 15 ? "Why is the air good today?"
    : pm < 35 ? "Why is the air moderate today?"
    : "Why is the air bad today?",
  why_text: (tp: string, pm: number | null) =>
    pm != null && pm < 15
      ? `It's ${tp}°C and wind is clearing the basin. Less coal and wood burning means cleaner air. Enjoy the day outside.`
      : pm != null && pm < 35
      ? `It's ${tp}°C. Households in BiH still burn coal and wood, and some smoke lingers in the valley. Moderate — caution for sensitive groups.`
      : `The temperature dropped to ${tp}°C overnight. When it's cold, BiH households burn more coal and wood. Smoke stays trapped in the valley due to a temperature inversion.`,
  why_source: "Source: SMHI heating emissions data, BiH",

  ebm_title: "Every breath matters.",
  ebm_sub: "Especially for the smallest lungs.",
  ebm_p: (city: string, x: string, pm: number | null): string =>
    pm != null && pm < 15
      ? `Right now in ${city}, the air is clean (${x}× WHO limit). Make the most of today — let kids spend extra time outside. Children breathe 50% more air per kg of body weight than adults, so clean days are especially valuable. According to UNICEF, one in five children in BiH suffers from respiratory issues, which is why every clean day counts.`
      : `Right now in ${city}, the air contains ${x}× more harmful particles than the WHO considers safe. Children breathe 50% more air per kg of body weight than adults, making polluted air twice as dangerous for them. According to UNICEF, one in five children in BiH already suffers from respiratory issues. Over 100,000 children live in the most polluted cities in BiH.`,
  ebm_source: "Source: UNICEF BiH, WHO",

  work_title: "What's already working",
  work_sub: "BiH is making progress. Here's where change is happening.",
  work_eu: "EU STANDARD", work_eu_city: "Živinice",
  work_eu_text: "First EU-compliant waste center in Tuzla canton. Serves 95,000 people.",
  work_rec: "RECYCLING ACTIVE", work_rec_city: "Sarajevo",
  work_rec_text: "Ekopak container network active across the city. Over 1,440 households sort waste.",
  work_air: "RECYCLING ACTIVE", work_air_city: "Bihać",
  work_air_text: "Bihać is one of the most active cities in BiH for recycling — JKP Komrad collects paper, plastic and glass at 22 eco-islands across the city.",
  ranking: "City ranking this month",
  ranking_note: "Lower number means cleaner air",
  ranking_source: "Data: aqicn.org · Federalni Hidrometeorološki Zavod BiH",
  ranking_disclaimer: "Ranking is illustrative and based on available air-quality data. It is not an official city ranking.",
  actions_info: "Advice is generated by AI based on current air-quality data. It does not replace medical advice.",
  foot_beta: "Bura is in beta. Data and recommendations are for demonstration purposes and may not reflect real-time conditions.",

  rep_title: "Your eyes help protect children nearby.",
  rep_sub: "Smoke from a chimney that shouldn't be burning. A pile dumped near a school. A smell that wasn't there yesterday. Share what you see.",
  rep_b1: "Cross-checked with satellite and sensor data before becoming public",
  rep_b2: "Shared with NGOs, journalists and municipalities working on clean air",
  rep_b3: "Confirmed reports help parents know when to keep children indoors",
  rep_loc: "LOCATION", rep_desc: "DESCRIPTION", rep_photo: "Add photo",
  rep_cta: "Protect my neighbourhood",
  rep_why: "Why report?",
  rep_why_text: "We don't look for blame. We look for patterns. Your report helps families nearby know what they breathe.",

  sub_title: "Buri sends you a message every morning at 7am.",
  sub_sub: "What your children breathe today. What you can do. Nothing more.",
  sub_email: "Your email",
  sub_cta: "Get morning messages",
  sub_note: "Free. Your data is safe. Unsubscribe anytime.",
  sub_done: "Thanks! This is still a beta — we'll personally reach out in the coming days.",

  hiw_title: "Open data. Open code. Free forever.",
  hiw_a: "Satellites watch from above",
  hiw_a_t: "EU Copernicus satellites pass over BiH daily and reveal smoke clouds, dust and pollution patterns.",
  hiw_b: "Sensors measure on the ground",
  hiw_b_t: "Sensors in cities measure the particles your family actually breathes, street by street, hour by hour.",
  hiw_c: "Citizens report what they see",
  hiw_c_t: "You report smoke, dumpsites and smells. Local eyes see what satellites miss.",
  hiw_d: "We connect three sources",
  hiw_d_t: "Our system compares all sources, finds patterns, and explains them in plain language. When sources agree, the signal is reliable.",

  road_title: "From data to impact",
  road_p1: "Satellites, sensors and citizen reports",
  road_p2: "Sensors in schools and education",
  road_p3: "Buri, gamification and rewards",
  road_p4: "Serbia, Kosovo, North Macedonia",
  road_phase: "PHASE",
  road_active: "ACTIVE",

  foot_tag: "Know what you breathe.",
  foot_data: "Data: EU Copernicus · OpenAQ · aqicn.org · Federalni Hidrometeorološki Zavod BiH",
  foot_mission: "Bura doesn't accuse. Bura makes the invisible visible.",
  foot_founder: "",
  foot_bottom: "Every breath matters.",
  foot_disclaimer: "This is a prototype. Data and recommendations are for demonstration purposes only and may not reflect real-time air quality conditions.",
  edit_profile: "Edit profile",

  schools_teaser_label: "SCHOOLS IN ACTION",
  schools_teaser_title: "Schools leading the change.",
  schools_teaser_sub: "Some schools in BiH are already taking action for cleaner air. They install sensors. They teach children. They share results with the community. Bura makes them visible and invites others to join.",
  schools_teaser_amber: "Be the first school in your city.",
  schools_teaser_cta: "See all schools →",

  schools_hero_title: "Schools leading the change.",
  schools_hero_sub: "Clean air starts in the classroom.",
  schools_hero_body:
    "Some schools in BiH are already taking action for cleaner air. They install sensors. They teach children. They share results with the community. Bura makes them visible and invites others to join.",

  schools_map_title: "Schools on the map",
  schools_legend_active: "Active, sensors and teaching",
  schools_legend_dev: "In development, starting",
  schools_legend_interested: "Interested, want to join",
  schools_status_interested: "Interested",
  schools_more_info: "More info →",
  schools_pin_sa: "Pilot primary school, Sarajevo",
  schools_pin_ze: "Pilot primary school, Zenica",
  schools_pin_tu: "Pilot primary school, Tuzla",
  schools_map_disclaimer:
    "This is a pilot map. The first schools join in 2026. Your school can be the first in your city.",

  schools_what_title: "What do schools do?",
  schools_what_a_t: "Measure the air",
  schools_what_a_p:
    "They install sensors that measure PM2.5 in classrooms and the schoolyard. Students see the data live.",
  schools_what_b_t: "Teach",
  schools_what_b_p:
    "Teachers use Bura data in lessons: science, geography, health education.",
  schools_what_c_t: "Share with families",
  schools_what_c_p:
    "Measurement results are available to parents through the Bura app. The school becomes part of the local community.",

  schools_stories_title: "Stories from schools",
  schools_stories_body:
    "The first stories are coming soon. Sign up your school and be part of the first generation of Bura schools in BiH.",
  schools_stories_cta: "Sign up your school →",

  schools_join_title: "Is your school next?",
  schools_join_sub: "We are looking for the first schools in BiH that want to be part of the Bura network.",
  schools_join_a_t: "Free sensor",
  schools_join_a_p: "First pilot schools receive a Bura sensor at no cost.",
  schools_join_b_t: "Teaching materials",
  schools_join_b_p:
    "We are preparing teaching materials to integrate air-quality data into classes.",
  schools_join_c_t: "Visibility on the map",
  schools_join_c_p: "Your school becomes visible to all families in your city.",
  schools_form_school: "SCHOOL NAME",
  schools_form_city: "CITY",
  schools_form_contact: "CONTACT NAME",
  schools_form_email: "EMAIL",
  schools_form_cta: "Sign up your school",
  schools_form_done: "Thank you! We will contact you within 48 hours.",
};

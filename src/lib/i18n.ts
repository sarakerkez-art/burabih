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
    `Danas u ${cityLocative(city)} vaša djeca dišu zrak koji je ${x}× gori od WHO preporuke. Evo šta možete učiniti danas.`,
  greet_default: (city: string, pm: string, x: string) =>
    `Danas u ${cityLocative(city)} PM2.5 je ${pm}, što je ${x}× iznad WHO granice.`,
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

  why_title: "Zašto je danas ovako?",
  why_text: (t: string) =>
    `Temperatura je pala na ${t}°C noćas. Kad je hladno, domaćinstva u BiH sagorijevaju više uglja i drva. Dim ostaje zarobljen u kotlini zbog temperaturne inverzije.`,
  why_source: "Izvor: SMHI heating emissions data, BiH",

  ebm_title: "Svaki dah je važan.",
  ebm_sub: "Posebno za najmanja pluća.",
  ebm_p: (city: string, x: string) =>
    `Upravo sada u ${cityLocative(city)}, zrak sadrži ${x}× više štetnih čestica nego što WHO smatra sigurnim. Djeca udišu 50% više zraka po kilogramu tijela nego odrasli, što zagađen zrak čini dvostruko opasnijim za njih. Prema UNICEF-u, svako peto dijete u BiH već pati od respiratornih problema. Preko 100.000 djece živi u najzagađenijim gradovima BiH.`,
  ebm_source: "Izvor: UNICEF BiH, WHO",

  work_title: "Šta već funkcioniše",
  work_sub: "BiH napreduje. Evo gdje se dešavaju promjene.",
  work_eu: "EU STANDARD",
  work_eu_city: "Živinice",
  work_eu_text: "Prvi EU-usklađen centar za otpad u Tuzlanskom kantonu. Služi 95.000 ljudi.",
  work_rec: "RECIKLAŽA AKTIVNA",
  work_rec_city: "Sarajevo",
  work_rec_text: "Ekopak mreža kontejnera aktivna u cijelom gradu. Preko 1.440 domaćinstava razvrstava otpad.",
  work_air: "NAJČISTIJI ZRAK",
  work_air_city: "Mostar",
  work_air_text: "Najniži PM2.5 u BiH ovog mjeseca: 18.2 µg/m³.",
  ranking: "Rang gradova ovaj mjesec",
  ranking_note: "Niži broj znači čistiji zrak",
  ranking_source: "Podaci: aqicn.org · Federalni Hidrometeorološki Zavod BiH",

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
  sub_done: "Prijavljeni ste. Vidimo se sutra u 7h.",

  hiw_title: "Otvoreni podaci. Otvoreni kod. Besplatno zauvijek.",
  hiw_a: "Sateliti gledaju odozgo",
  hiw_a_t: "Sateliti EU Copernicus svakodnevno prelijevaju BiH.",
  hiw_b: "Senzori mjere na zemlji",
  hiw_b_t: "Senzori mjere čestice koje vaša porodica zaista udiše.",
  hiw_c: "Građani prijavljuju šta vide",
  hiw_c_t: "Vi prijavljujete, lokalne oči vide što sateliti propuste.",
  hiw_d: "Spajamo tri izvora",
  hiw_d_t: "Naš sistem uspoređuje izvore, traži obrasce i objašnjava ih jednostavnim jezikom.",

  road_title: "Od podataka do utjecaja",
  road_p1: "Sateliti + senzori + prijave građana",
  road_p2: "Senzori u školama + edukacija",
  road_p3: "Buri + gejmifikacija + nagrade",
  road_p4: "Srbija, Kosovo, Sjeverna Makedonija",
  road_phase: "FAZA",
  road_active: "aktivno",

  foot_tag: "Znaj šta dišeš.",
  foot_data: "Otvoreni podaci · EU Copernicus · aqicn.org · UNICEF BiH",
  foot_mission: "Bura ne optužuje. Bura čini nevidljivo vidljivim.",
  foot_founder: "Osnivač: Andi Andinger, Beč",
  foot_bottom: "Svaki dah je važan.",
  edit_profile: "Uredi profil",

  // Schools teaser (main page)
  schools_teaser_label: "ŠKOLE U AKCIJI",
  schools_teaser_title: "Škole koje predvode promjenu.",
  schools_teaser_sub: "Neke škole u BiH već rade na čistijem zraku. Bura ih čini vidljivim.",
  schools_teaser_amber: "Budite prva škola u vašem gradu.",
  schools_teaser_cta: "Vidi sve škole →",

  // /skole page
  schools_hero_title: "Škole koje predvode promjenu.",
  schools_hero_sub: "Čist zrak počinje u učionici.",
  schools_hero_body:
    "Neke škole u BiH već poduzimaju akciju za čišći zrak. Instaliraju senzore. Podučavaju djecu. Dijele rezultate sa zajednicom. Bura ih čini vidljivim, i poziva ostale da im se pridruže.",

  schools_map_title: "Škole na mapi",
  schools_legend_active: "Aktivne, senzori + nastava",
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
    "Nastavnici koriste Bura podatke u nastavi, nauka, geografija, zdravstveni odgoj.",
  schools_what_c_t: "Dijele s porodicama",
  schools_what_c_p:
    "Rezultati mjerenja dostupni su roditeljima kroz Bura aplikaciju. Škola postaje dio lokalne zajednice.",

  schools_stories_title: "Priče iz škola",
  schools_stories_sub: "Šta se dešava kad djeca počnu mjeriti vlastiti zrak.",
  schools_story1_label: "SARAJEVO · PILOT",
  schools_story1_title: "Učenici otkrili da je zrak u učionici najgori ujutro",
  schools_story1_text:
    "Mjerenja su pokazala da PM2.5 u učionici dostiže vrhunac između 8h i 10h. Škola sada prozračuje svaki dan u 7:45h prije dolaska djece.",
  schools_story2_label: "ZENICA · PILOT",
  schools_story2_title: "Đaci napravili prezentaciju za općinsko vijeće",
  schools_story2_text:
    "Nakon što su izmjerili kvalitet zraka u svom kvartu, učenici su pripremili prezentaciju za lokalne vijećnike, sa podacima, grafikonima i prijedlozima.",
  schools_story3_label: "TUZLA · PILOT",
  schools_story3_title: "Roditelji promijenili jutarnju rutinu",
  schools_story3_text:
    "Kada su roditelji počeli primati Bura jutarnje poruke sa podacima njihove škole, 34% je promijenilo vrijeme kada vode djecu u školu.",
  schools_story_disclaimer: "Ovo je ilustrativni primjer budućeg pilota.",

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
  schools_form_count: (n: number) =>
    `Do sada primili smo ${n} prijava od škola širom BiH. Budite prvi.`,
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
    `Today in ${city}, your children are breathing air ${x}× worse than the WHO recommendation. Here's what you can do today.`,
  greet_default: (city, pm, x) => `Today in ${city}, PM2.5 is ${pm}. ${x}× above the WHO limit.`,
  buri_tag: "Buri watches your air. Every day.",

  actions_title: "Your steps for today",
  actions_sub: (city, fam, heat) => `Tailored for ${city} · ${fam} · ${heat}`,
  fam_young: "family with young children", fam_older: "family with older children", fam_none: "no children",
  heat_coal: "coal/wood", heat_gas: "gas", heat_district: "district", heat_unsure: "unknown heating",

  live_pm: "PM2.5 (µg/m³)", live_aqi: "AQI", live_temp: "Temperature",
  live_source: (m) => `aqicn.org · Federalni Hidrometeorološki Zavod · updated ${m} min ago`,
  live_stale: "Refreshing data... Showing last known values.",

  why_title: "Why is the air bad today?",
  why_text: (tp) =>
    `The temperature dropped to ${tp}°C overnight. When it's cold, BiH households burn more coal and wood. Smoke stays trapped in the valley due to a temperature inversion.`,
  why_source: "Source: SMHI heating emissions data, BiH",

  ebm_title: "Every breath matters.",
  ebm_sub: "Especially for the smallest lungs.",
  ebm_p: (city, x) =>
    `Right now in ${city}, the air contains ${x}× more harmful particles than the WHO considers safe. Children breathe 50% more air per kg of body weight than adults, making polluted air twice as dangerous for them. According to UNICEF, 1 in 5 children in BiH already suffers from respiratory issues. Over 100,000 children live in the most polluted cities in BiH.`,
  ebm_source: "Source: UNICEF BiH, WHO",

  work_title: "What's already working",
  work_sub: "BiH is making progress. Here's where change is happening.",
  work_eu: "EU STANDARD", work_eu_city: "Živinice",
  work_eu_text: "First EU-compliant waste center in Tuzla canton: serves 95,000 people.",
  work_rec: "RECYCLING ACTIVE", work_rec_city: "Sarajevo",
  work_rec_text: "Ekopak container network active. Over 1,440 households sort waste.",
  work_air: "CLEANEST AIR", work_air_city: "Mostar",
  work_air_text: "Lowest PM2.5 in BiH this month: 18.2 µg/m³.",
  ranking: "City ranking this month",

  rep_title: "Your eyes help protect children nearby.",
  rep_sub: "Smoke from a chimney that shouldn't be burning. A pile dumped near a school. A smell that wasn't there yesterday. Share what you see.",
  rep_b1: "Cross-checked with satellite data",
  rep_b2: "Shared with partners: NGOs, journalists, municipalities",
  rep_b3: "Useful for families nearby",
  rep_loc: "LOCATION", rep_desc: "DESCRIPTION", rep_photo: "Add photo",
  rep_cta: "Protect my neighbourhood",
  rep_why: "Why report?",
  rep_why_text: "We don't look for blame. We look for patterns. Your report helps families nearby know what they breathe.",

  sub_title: "Buri sends you a message every morning at 7am.",
  sub_sub: "What your children breathe today. What you can do. Nothing more.",
  sub_email: "Your email",
  sub_cta: "Get morning messages",
  sub_note: "Free. No spam. Unsubscribe anytime.",
  sub_done: "You're in. See you tomorrow at 7am.",

  hiw_title: "Open data. Open code. Free forever.",
  hiw_a: "Satellites watch from above", hiw_a_t: "EU Copernicus satellites pass over BiH daily.",
  hiw_b: "Sensors measure on the ground", hiw_b_t: "Sensors measure the particles your family actually breathes.",
  hiw_c: "Citizens report what they see", hiw_c_t: "You report. Local eyes see what satellites miss.",
  hiw_d: "We connect three sources", hiw_d_t: "Our system compares sources, finds patterns, and explains them in plain language.",

  road_title: "From data to impact",
  road_p1: "Satellites + sensors + citizen reports",
  road_p2: "Sensors in schools + education",
  road_p3: "Buri + gamification + rewards",
  road_p4: "Serbia, Kosovo, North Macedonia",
  road_phase: "PHASE",
  road_active: "active",

  foot_tag: "Know what you breathe.",
  foot_data: "Open data · EU Copernicus · aqicn.org · UNICEF BiH",
  foot_mission: "Bura doesn't accuse. Bura makes the invisible visible.",
  foot_founder: "Founder: Andi Andinger, Vienna",
  foot_bottom: "Every breath matters.",
  edit_profile: "Edit profile",

  schools_teaser_label: "SCHOOLS IN ACTION",
  schools_teaser_title: "Schools leading the change.",
  schools_teaser_sub: "Some schools in BiH are already working for cleaner air. Bura makes them visible.",
  schools_teaser_amber: "Be the first school in your city.",
  schools_teaser_cta: "See all schools →",

  schools_hero_title: "Schools leading the change.",
  schools_hero_sub: "Clean air starts in the classroom.",
  schools_hero_body:
    "Some schools in BiH are already taking action for cleaner air. They install sensors. They teach children. They share results with the community. Bura makes them visible, and invites others to join.",

  schools_map_title: "Schools on the map",
  schools_legend_active: "Active, sensors + teaching",
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
    "Teachers use Bura data in lessons, science, geography, health education.",
  schools_what_c_t: "Share with families",
  schools_what_c_p:
    "Measurement results are available to parents through the Bura app. The school becomes part of the local community.",

  schools_stories_title: "Stories from schools",
  schools_stories_sub: "What happens when children start measuring their own air.",
  schools_story1_label: "SARAJEVO · PILOT",
  schools_story1_title: "Students discovered the classroom air is worst in the morning",
  schools_story1_text:
    "Measurements showed PM2.5 in the classroom peaks between 8am and 10am. The school now ventilates daily at 7:45am before the children arrive.",
  schools_story2_label: "ZENICA · PILOT",
  schools_story2_title: "Students presented to the municipal council",
  schools_story2_text:
    "After measuring air quality in their neighbourhood, students prepared a presentation for local councillors, with data, charts and proposals.",
  schools_story3_label: "TUZLA · PILOT",
  schools_story3_title: "Parents changed their morning routine",
  schools_story3_text:
    "When parents began receiving Bura morning messages with their school's data, 34% changed the time they take their children to school.",
  schools_story_disclaimer: "This is an illustrative example of a future pilot.",

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
  schools_form_count: (n: number) =>
    `So far we have received ${n} applications from schools across BiH. Be the first.`,
};

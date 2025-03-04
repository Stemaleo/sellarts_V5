DATABASE_NAME = "sellarts"
DATABASE_USER = "postgres"
DATABASE_PASSWORD = "FoD,Q]m6Get>;H7a"
DATABASE_HOST = "64.227.21.130"
DATABASE_PORT = "5432"
DEBUG_MODE = True
ALLOWED_HOSTS = ["localhost", "dev.sellarts.net", "dj-dev.sellarts.net"]
GRAPHIQL_MODE = True
SELLARTS_KEY = "SELLARTS_KEY"
ANKA_TOKEN = "FqvbsxHBxTKmbZyNcPvvNbFm"
REQUIRED_AUTHENTICATION = False


# DATABASE_NAME = "sellarts"
# DATABASE_USER = "postgres"
# DATABASE_PASSWORD = "@satoshi"
# DATABASE_HOST = "localhost"
# DATABASE_PORT = "5432"
# DEBUG_MODE = True
# ALLOWED_HOSTS = ["localhost"]
# GRAPHIQL_MODE = True    
# SELLARTS_KEY = "SELLARTS_KEY"
# ANKA_TOKEN = "FqvbsxHBxTKmbZyNcPvvNbFm"
# REQUIRED_AUTHENTICATION = False



import psycopg2


# Données à insérer
data = {
    "Benin (BJ)": "BJ",
    "Burkina Faso (BF)": "BF",
    "Cameroon (CM)": "CM",
    "Ivory Coast (CI)": "CI",
    "Cape Verde (CV)": "CV",
    "Central African Rep(CF)": "CF",
    "Gabon (GA)": "GA",
    "Gambia (GM)": "GM",
    "Ghana (GH)": "GH",
    "Guinea Rep. (GN)": "GN",
    "Guinea-Bissau (GW)": "GW",
    "Guinea-Equatorial (GQ)": "GQ",
    "Liberia (LR)": "LR",
    "Mali (ML)": "ML",
    "Mauritania (MR)": "MR",
    "Niger (NE)": "NE",
    "Nigeria (NG)": "NG",
    "Senegal (SN)": "SN",
    "Sierra Leone (SL)": "SL",
    "Togo (TG)": "TG",
    "France (FR)": "FR",
    "Monaco (MC)": "MC",
    "Algeria (DZ)": "DZ",
    "Angola (AO)": "AO",
    "Botswana (BW)": "BW",
    "Burundi (BI)": "BI",
    "Chad (TD)": "TD",
    "Comoros (KM)": "KM",
    "Congo (CG)": "CG",
    "Congo": "Congo",
    "DPR (CD)": "CD",
    "Djibouti (DJ)": "DJ",
    "Egypt (EG)": "EG",
    "Eritrea (ER)": "ER",
    "Eswatini (SZ)": "SZ",
    "Ethiopia (ET)": "ET",
    "Kenya (KE)": "KE",
    "Lesotho (LS)": "LS",
    "Libya (LY)": "LY",
    "Madagascar (MG)": "MG",
    "Malawi (MW)": "MW",
    "Mauritius (MU)": "MU",
    "Morocco (MA)": "MA",
    "Mozambique (MZ)": "MZ",
    "Namibia (NA)": "NA",
    "Rwanda (RW)": "RW",
    "Saint Helena (SH)": "SH",
    "Somalia (SO)": "SO",
    "Somaliland": "Somaliland",
    "Rep Of (XS)": "XS",
    "South Africa (ZA)": "ZA",
    "South Sudan (SS)": "SS",
    "Sudan (SD)": "SD",
    "Tanzania (TZ)": "TZ",
    "Tunisia (TN)": "TN",
    "Uganda (UG)": "UG",
    "Zambia (ZM)": "ZM",
    "Zimbabwe (ZW)": "ZW",
    "Albania (AL)": "AL",
    "Andorra (AD)": "AD",
    "Armenia (AM)": "AM",
    "Austria (AT)": "AT",
    "Azerbaijan (AZ)": "AZ",
    "Belarus (BY)": "BY",
    "Belgium (BE)": "BE",
    "Bosnia &Herzegovina(BA)": "BA",
    "Bulgaria (BG)": "BG",
    "Canary Islands": "Canary Islands",
    "The (IC)": "IC",
    "Croatia (HR)": "HR",
    "Cyprus (CY)": "CY",
    "Czech Rep.": "Czech Rep.",
    "The (CZ)": "CZ",
    "Denmark (DK)": "DK",
    "Estonia (EE)": "EE",
    "Finland (FI)": "FI",
    "Georgia (GE)": "GE",
    "Germany (DE)": "DE",
    "Gibraltar (GI)": "GI",
    "Greece (GR)": "GR",
    "Guernsey (GG)": "GG",
    "Hungary (HU)": "HU",
    "Iceland(IS)": "IS",
    "Ireland": "Ireland",
    "Rep. Of (IE)": "IE",
    "Israel (IL)": "IL",
    "Italy (IT)": "IT",
    "Jersey (JE)": "JE",
    "Kazakhstan (KZ)": "KZ",
    "Kyrgyzstan (KG)": "KG",
    "Latvia (LV)": "LV",
    "Liechtenstein (LI)": "LI",
    "Lithuania (LT)": "LT",
    "Luxembourg (LU)": "LU",
    "Malta (MT)": "MT",
    "Moldova": "Moldova",
    "Rep. Of (MD)": "MD",
    "Montenegro": "Montenegro",
    "Rep Of (ME)": "ME",
    "Netherlands": "Netherlands",
    "The (NL)": "NL",
    "North Macedonia (MK)": "MK",
    "Norway (NO)": "NO",
    "Poland (PL)": "PL",
    "Portugal (PT)": "PT",
    "Romania (RO)": "RO",
    "San Marino (SM)": "SM",
    "Serbia": "Serbia",
    "Rep. Of (RS)": "RS",
    "Slovakia (SK)": "SK",
    "Slovenia (SI)": "SI",
    "Spain (ES)": "ES",
    "Sweden (SE)": "SE",
    "Switzerland (CH)": "CH",
    "Tajikistan (TJ)": "TJ",
    "Turkey (TR)": "TR",
    "Turkmenistan (TM)": "TM",
    "Ukraine (UA)": "UA",
    "United Kingdom (GB)": "GB",
    "Uzbekistan (UZ)": "UZ",
    "Vatican City (VA)": "VA",
    "Canada (CA)": "CA",
    "Mexico (MX)": "MX",
    "USA (US)": "US",
    "China (CN)": "CN",
    "Hong Kong SAR China (HK)": "HK",
    "Japan (JP)": "JP",
    "Afghanistan (AF)": "AF",
    "Bahrain (BH)": "BH",
    "Bangladesh (BD)": "BD",
    "Bhutan (BT)": "BT",
    "Brunei (BN)": "BN",
    "Cambodia (KH)": "KH",
    "India (IN)": "IN",
    "Indonesia (ID)": "ID",
    "Iran (IR)": "IR",
    "Iraq (IQ)": "IQ",
    "Jordan (JO)": "JO",
    "Korea": "Korea",
    "Rep. Of (KR)": "KR",
    "D.P.R Of (KP)": "KP",
    "Kuwait (KW)": "KW",
    "Laos (LA)": "LA",
    "Lebanon (LB)": "LB",
    "Macau7 SAR China (MO)": "MO",
    "Malaysia (MY)": "MY",
    "Maldives (MV)": "MV",
    "Mongolia (MN)": "MN",
    "Myanmar (MM)": "MM",
    "Nepal (NP)": "NP",
    "Oman (OM)": "OM",
    "Pakistan(PK)": "PK",
    "Philippines": "Philippines",
    "The (PH)": "PH",
    "Qatar (QA)": "QA",
    "Saudi Arabia (SA)": "SA",
    "Singapore (SG)": "SG",
    "Sri Lanka (LK)": "LK",
    "Syria (SY)": "SY",
    "Taiwan (TW)": "TW",
    "Thailand (TH)": "TH",
    "United Arab Emirates (AE)": "AE",
    "Vietnam (VN)": "VN",
    "Yemen": "Yemen",
    "Rep. Of (YE)": "YE",
    "American Samoa (AS)": "AS",
    "Anguilla (AI)": "AI",
    "Antigua (AG)": "AG",
    "Argentina (AR)": "AR",
    "Aruba (AW)": "AW",
    "Australia (AU)": "AU",
    "Bahamas (BS)": "BS",
    "Barbados(BB)": "BB",
    "Belize (BZ)": "BZ",
    "Bermuda (BM)": "BM",
    "Bolivia (BO)": "BO",
    "Bonaire (XB)": "XB",
    "Brazil (BR)": "BR",
    "Cayman Islands (KY)": "KY",
    "Chile (CL)": "CL",
    "Colombia (CO)": "CO",
    "Cook Islands (CK)": "CK",
    "Costa Rica (CR)": "CR",
    "Cuba (CU)": "CU",
    "Curacao (XC)": "XC",
    "Dominica (DM)": "DM",
    "Dominican Rep. (DO)": "DO",
    "Ecuador (EC)": "EC",
    "ElSalvador (SV)": "SV",
    "Falkland Islands (FK)": "FK",
    "Faroe Islands (FO)": "FO",
    "Fiji (FJ)": "FJ",
    "French Guyana (GF)": "GF",
    "Greenland (GL)": "GL",
    "Grenada (GD)": "GD",
    "Guadeloupe (GP)": "GP",
    "Guam (GU)": "GU",
    "Guatemala (GT)": "GT",
    "Guyana (British) (GY)": "GY",
    "Haiti (HT)": "HT",
    "Honduras (HN)": "HN",
    "Jamaica (JM)": "JM",
    "Kiribati(KI)": "KI",
    "Kosovo (KV)": "KV",
    "Mariana Islands (MP)": "MP",
    "Marshall Islands (MH)": "MH",
    "Martinique (MQ)": "MQ",
    "Mayotte (YT)": "YT",
    "Micronesia (FM)": "FM",
    "8Montserrat (MS)": "MS",
    "Nauru": "Nauru",
    "Rep. Of (NR)": "NR",
    "Nevis (XN)": "XN",
    "New Caledonia (NC)": "NC",
    "New Zealand (NZ)": "NZ",
    "Nicaragua (NI)": "NI",
    "Niue (NU)": "NU",
    "Palau (PW)": "PW",
    "Panama (PA)": "PA",
    "Papua New Guinea (PG)": "PG",
    "Paraguay (PY)": "PY",
    "Peru (PE)": "PE",
    "Puerto Rico (PR)": "PR",
    "Reunion": "Reunion",
    "Island Of (RE)": "RE",
    "Russian Federation (RU)": "RU",
    "Samoa (WS)": "WS",
    "Sao Tome And Principe (ST)": "ST",
    "Seychelles (SC)": "SC",
    "Solomon Islands (SB)": "SB",
    "St. Barthelemy(XY)": "XY",
    "St. Eustatius (XE)": "XE",
    "St. Kitts (KN)": "KN",
    "St. Lucia (LC)": "LC",
    "St. Maarten (XM)": "XM",
    "St. Vincent (VC)": "VC",
    "Suriname (SR)": "SR",
    "Tahiti (PF)": "PF",
    "Timor-Leste (TL)": "TL",
    "Tonga (TO)": "TO",
    "Trinidad And Tobago (TT)": "TT",
    "Turks & Caicos (TC)": "TC",
    "Tuvalu (TV)": "TV",
    "Uruguay (UY)": "UY",
    "Vanuatu (VU)": "VU",
    "Venezuela (VE)": "VE",
    "Virgin Islands-British (VG)": "VG",
    "Virgin Islands-US (VI)": "VI",
}



try:
    # Connexion à la base de données
    conn = psycopg2.connect(
        dbname=DATABASE_NAME,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        host=DATABASE_HOST,
        port=DATABASE_PORT
    )
    cursor = conn.cursor()
    print("Connexion réussie à la base de données")
    # Requête SQL d'insertion
    insert_query = """
    INSERT INTO country (name, code, is_deleted, is_active, created_at) 
    VALUES (%s, %s, FALSE, TRUE, NOW())
    ON CONFLICT (code) DO NOTHING;
    """
    
    # Exécution des insertions
    for name, code in data.items():
        cursor.execute(insert_query, (name, code))
    
    # Validation des changements
    conn.commit()
    print("Insertion réussie !")

except Exception as e:
    print("Erreur :", e)

finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()


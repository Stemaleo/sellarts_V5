import pdfplumber


# Chemin du fichier PDF
pdf_path = "Cote d'Ivoire rates.pdf"


def extract_text_from_pdf(pdf_path):
    """Extrait le texte du PDF."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text


def extract_zone(pdf_path):
    """Extrait le texte du PDF."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            if page.page_number == 1:
                text += page.extract_text() + "\n"
    return text

def parse_zones(text):
    """Parse les zones et les tarifs depuis le texte extrait."""
    lines = text.split("\n")
    zones = {}
    
    # Extraction des zones
    current_zone = None
    for line in lines:
        line = line.strip()
        if line.isdigit():
            current_zone = int(line)
            zones[current_zone] = []
        elif current_zone and line:
            zones[current_zone].extend([country.strip() for country in line.split(",")])
    
    return zones
def check_parenthesis_at_end(line):
    return line.strip().endswith(')')

def parse_zones_and_tarifs(text, zones_text):
    """Parse les zones et les tarifs depuis le texte extrait."""
    lines = text.split("\n")
    zones_text = zones_text.split("\n")
    zones = {}
    tarifs = {}
    zones_line = ""
    # Extraction des zones
    current_zone = 1
    zones[current_zone] = []
    for index, line in enumerate(zones_text):
        if index not in [0, 1]:     
            if line.strip().endswith(')'):
                zones_line+=line
                zones[current_zone].extend([country.strip() for country in zones_line.split(",")])  
                current_zone += 1
                zones_line = ""
                zones[current_zone] = []
            else:
                zones_line+=line
                
    zones={key:value for key, value in zones.items() if value != []}   

    # Extraction des tarifs
    reading_tarifs = False
    for line in lines:
        if "KG/ZONE" in line:
            reading_tarifs = True
            continue
        if reading_tarifs:
            parts = line.split()
            if len(parts) == 9:  # Poids + 8 zones
                poids = float(parts[0].replace(",", ""))
                tarifs[poids] = {zone: float(price.replace(",", "")) for zone, price in enumerate(parts[1:], start=1)}

    return zones, tarifs

def generate_tarif_structure(zones, tarifs):
    """Génère un dictionnaire permettant d'obtenir un tarif en fonction du pays et du poids."""
    tarif_dict = {}
    my_countries = {}
    
    for zone, countries in zones.items():
        for country in countries:
            tarif_dict[country.split('(')[-1].removesuffix(")").strip()] = {int(poids): int(tarifs[poids][zone]) for poids in tarifs if zone in tarifs[poids]}
            # my_countries[country] = country.split('(')[-1].removesuffix(")").strip()
    # print(my_countries)
    return tarif_dict

def find_closest_higher_value(lst, target):
    lst = sorted(lst)  # Trier la liste
    if target in lst:
        return target
    higher_values = [x for x in lst if x > target]
    return min(higher_values)

def get_tarif(tarif_dict: dict, country: str, poids: int):
    """Retourne le tarif pour un pays et un poids donnés."""
    print(poids, "poids")
    poids_lists = tarif_dict.get('FR').keys()
    

    poids = find_closest_higher_value(poids_lists, poids)
    return tarif_dict.get(country, {}).get(poids, 0)



# Exécution
def get_value(country, poids):
    print(poids, "mypoids")
    text = extract_text_from_pdf(pdf_path)
    zones_texts = extract_zone(pdf_path)
    zones, tarifs = parse_zones_and_tarifs(text, zones_texts)
    tarif_dict = generate_tarif_structure(zones, tarifs)
    return get_tarif(tarif_dict, country, poids)



# print(get_value('FR', 501))




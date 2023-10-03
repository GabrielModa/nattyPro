import requests
from bs4 import BeautifulSoup

# URL da página que você deseja analisar
url = 'https://tbca.net.br/base-dados/int_composicao_alimentos.php?cod_produto=BRC0001C'

# Fazer uma solicitação GET para a página
response = requests.get(url)

# Verificar se a solicitação foi bem-sucedida
if response.status_code == 200:
    # Analisar o conteúdo HTML da página
    soup = BeautifulSoup(response.text, 'html.parser')

    # Encontrar o elemento <h5> com o código
    code_element = soup.find('h5', {'id': 'overview'}).find(
        'strong').find_next('br').previous_sibling.strip()

    # Encontrar a tabela de dados
    table = soup.find('table')

    # Verificar se a tabela foi encontrada
    if table:
        # Extrair os cabeçalhos da tabela
        headers = [header.text.strip() for header in table.find_all('th')]

        # Extrair os dados da tabela
        data = []
        for row in table.find_all('tr'):
            cols = [col.text.strip() for col in row.find_all('td')]
            data.append(cols)

        # Imprimir os cabeçalhos da tabela
        print(headers)

        # Enviar os dados como um POST para http://localhost:3000/insert/caloric-details
        for row_data in data:
            if len(row_data) == len(headers):
                post_data = {
                    "item_code": code_element,
                    "component": row_data[0],
                    "units": row_data[1],
                    "value_per_100g": row_data[2],
                    "full_soup_spoon_24g": row_data[3],
                    "shallow_soup_spoon_19g": row_data[4]
                }

                # Fazer uma solicitação POST
                post_url = 'http://localhost:3000/insert/caloric-details'
                post_response = requests.post(post_url, json=post_data)

                if post_response.status_code == 200:
                    print("Dados enviados com sucesso.")
                else:
                    print(
                        f"Falha ao enviar dados. Código de status: {post_response.status_code}")
            else:
                print("Ignorando linha com dados incompletos.")
    else:
        print("Tabela não encontrada na página.")
else:
    print(
        f"A solicitação falhou com o código de status {response.status_code}")

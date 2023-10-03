import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import json

# Função para enviar dados para o servidor


def send_data_to_server(data):
    # Substitua pela URL da sua rota no servidor
    server_url = 'http://localhost:3000/insert/caloric-details'
    response = requests.post(server_url, json=data)

    if response.status_code == 200:
        print('Dados enviados com sucesso para o servidor')
    else:
        print(
            f'Falha ao enviar dados para o servidor. Código de status: {response.status_code}')

# Função para carregar o último checkpoint processado


def load_checkpoint():
    try:
        with open('checkpoint.json', 'r') as checkpoint_file:
            checkpoint = json.load(checkpoint_file)
            return checkpoint.get('page_number', 1), checkpoint.get('last_item_code', None)
    except FileNotFoundError:
        return 1, None

# Função para salvar o checkpoint atual


def save_checkpoint(page_number, last_item_code):
    checkpoint = {
        'page_number': page_number,
        'last_item_code': last_item_code
    }
    with open('checkpoint.json', 'w') as checkpoint_file:
        json.dump(checkpoint, checkpoint_file)


# Defina manualmente os valores iniciais
page_number = 43  # Defina o número da página de onde deseja começar
last_item_code = 'BRC0225C'  # Defina o código do último item processado

# Restaurar o último checkpoint
# page_number, last_item_code = load_checkpoint()

# Configurar o Selenium para usar o Chrome WebDriver (certifique-se de ter o WebDriver instalado)
driver = webdriver.Chrome()

# URL da página inicial
base_url = 'https://tbca.net.br/base-dados/composicao_alimentos.php?pagina={}'

while True:
    # Construir a URL da página atual
    url = base_url.format(page_number)

    # Acessar a URL com o Selenium
    driver.get(url)

    # Esperar por um curto período para garantir que a página seja carregada
    time.sleep(2)

    # Pegar o conteúdo HTML da página atual
    page_source = driver.page_source

    # Analisar o conteúdo HTML da página
    soup = BeautifulSoup(page_source, 'html.parser')

    # Encontrar todas as tags <tr> na página
    rows = soup.find_all('tr')

    # Verificar se a página não contém dados e encerrar o loop
    if not any(row.find_all('td') for row in rows):
        print("Não há mais dados para coletar. Encerrando.")
        break

    # Iterar sobre as linhas (tags <tr>) e dividir o texto das tags <td> de acordo com as posições desejadas
    for row in rows:
        cols = row.find_all('td')
        if len(cols) >= 1:
            # Extrair o código de produto da primeira coluna
            code_element = cols[0].find('a')
            if code_element:
                codigo_produto = code_element.get_text()
                # Construir a URL da página de detalhes com base no código de produto
                detalhes_url = f'https://tbca.net.br/base-dados/int_composicao_alimentos.php?cod_produto={codigo_produto}'

                # Acessar a página de detalhes com o Selenium
                driver.get(detalhes_url)

                # Esperar por um curto período para garantir que a página seja carregada
                time.sleep(2)

                # Pegar o conteúdo HTML da página de detalhes
                detalhes_page_source = driver.page_source

                # Analisar o conteúdo HTML da página de detalhes
                detalhes_soup = BeautifulSoup(
                    detalhes_page_source, 'html.parser')

                # Encontrar a tabela de dados
                table = detalhes_soup.find('table')

                # Verificar se a tabela foi encontrada
                if table:
                    # Extrair os cabeçalhos da tabela
                    headers = [header.text.strip()
                               for header in table.find_all('th')]

                    # Extrair os dados da tabela
                    data = []
                    for row_data in table.find_all('tr'):
                        cols = [col.text.strip()
                                for col in row_data.find_all('td')]
                        data.append(cols)

                    # Imprimir os cabeçalhos da tabela
                    print(headers)

                    # Enviar os dados como um POST
                    for row_data in data:
                        # Verificar se a linha de dados tem o mesmo número de colunas que os cabeçalhos
                        if len(row_data) == len(headers):
                            # Inicializar o dicionário de dados
                            post_data = {
                                "item_code": codigo_produto,
                                # Assuming the component is in the first column
                                "component": row_data[0],
                                # Assuming units are in the second column
                                "units": row_data[1],
                                # Assuming value per 100g is in the third column
                                "value_per_100g": row_data[2],
                            }

                            # Enviar os dados para o servidor
                            send_data_to_server(post_data)

                            print(f"code: {codigo_produto}")
                            print(f"Dados: {post_data}")
                            # Linha de separação entre os registros
                            print("-" * 20)
                        else:
                            print("Ignorando linha com dados incompletos.")

                else:
                    print(
                        f"Tabela não encontrada na página de detalhes: {detalhes_url}")

                # Voltar à página inicial
                driver.back()
                last_item_code = codigo_produto
            else:
                print("Código de produto não encontrado na primeira coluna.")

    # Salvar o checkpoint atual
    save_checkpoint(page_number, last_item_code)

    # Incrementar o número da página
    page_number += 1

    # Adicionar um atraso mínimo de 2 segundos antes da próxima solicitação
    time.sleep(2)

# Fechar o navegador Selenium no final
driver.quit()

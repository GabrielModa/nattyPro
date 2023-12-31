import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import time

# Função para enviar dados para o servidor local

def send_data_to_server(data):
    # Substitua pela URL da sua rota no servidor
    server_url = 'http://localhost:3000/insert/caloric-details'
    response = requests.post(server_url, json=data)

    if response.status_code == 200:
        print('Dados enviados com sucesso para o servidor')
    else:
        print(
            f'Falha ao enviar dados para o servidor. Código de status: {response.status_code}')

# Configurar o Selenium para usar o Chrome WebDriver (certifique-se de ter o WebDriver instalado)
driver = webdriver.Chrome()

# URL da página inicial
base_url = 'https://tbca.net.br/base-dados/composicao_alimentos.php?pagina={}'

# Iniciar com a página 1
page_number = 1

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
                                "component": row_data[0],  # Assuming the component is in the first column
                                "units": row_data[1],      # Assuming units are in the second column
                                "value_per_100g": row_data[2],  # Assuming value per 100g is in the third column
                            }

                            # Send the data to the local server
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
            else:
                print("Código de produto não encontrado na primeira coluna.")
    # Incrementar o número da página
    page_number += 1

    # Adicionar um atraso mínimo de 1 segundo antes da próxima solicitação
    time.sleep(2)

# Fechar o navegador Selenium no final
driver.quit()

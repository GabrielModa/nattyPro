import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import time

# Função para enviar dados para o servidor local


def send_data_to_server(data):
    # Substitua pela URL da sua rota no servidor
    server_url = 'http://localhost:3000/insert'
    response = requests.post(server_url, json=data)

    if response.status_code == 200:
        print('Dados enviados com sucesso para o servidor')
    else:
        print(
            f'Falha ao enviar dados para o servidor. Código de status: {response.status_code}')


# URL da página inicial
base_url = 'https://tbca.net.br/base-dados/composicao_alimentos.php?pagina={}'

# Iniciar com a página 1
page_number = 1

# Configurar o Selenium para usar o Chrome WebDriver (certifique-se de ter o WebDriver instalado)
driver = webdriver.Chrome()

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
        if len(cols) >= 5:
            codigo = cols[0].get_text()
            nome = cols[1].get_text()
            nome_cientifico = cols[2].get_text()
            grupo = cols[3].get_text()
            marca = cols[4].get_text()

            # Criar um dicionário com os dados
            data = {
                'codigo': codigo,
                'nome': nome,
                'nome_cientifico': nome_cientifico,
                'grupo': grupo,
                'marca': marca
            }

            # Enviar os dados para o servidor local
            send_data_to_server(data)

            print(f"CODIGO: {codigo}")
            print(f"NOME: {nome}")
            print(f"NOME CIENTIFICO: {nome_cientifico}")
            print(f"GRUPO: {grupo}")
            print(f"MARCA: {marca}")
            print("-" * 20)  # Linha de separação entre os registros

    # Incrementar o número da página
    page_number += 1

    # Adicionar um atraso mínimo de 1 segundo antes da próxima solicitação
    time.sleep(1)

# Fechar o navegador Selenium no final
driver.quit()

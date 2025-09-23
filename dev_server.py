from livereload import Server, shell

# Cria uma instância do servidor
server = Server()

# Define a pasta que o servidor deve "observar" por mudanças
# Qualquer alteração em qualquer arquivo dentro de 'src/web/' irá recarregar o navegador
server.watch('src/web/')

# Inicia o servidor para servir os arquivos da pasta 'src/web'
# O 'root' define qual pasta é a raiz do site
server.serve(root='src/web', port=5500, host='localhost')
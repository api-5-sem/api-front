# Usando a imagem Node LTS (alpine) para maior estabilidade
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar o package.json e o package-lock.json para instalar as dependências
COPY api/package*.json ./

# Instalar as dependências
RUN npm install

# Instalar o Angular CLI globalmente (versão LTS)
RUN npm install -g @angular/cli@13

# Copiar todo o código da pasta 'api' para o container
COPY api /usr/src/app

# Expor a porta 4200
EXPOSE 4200

# Rodar o servidor Angular com o comando ng serve
CMD ["ng", "serve", "--host", "0.0.0.0"]

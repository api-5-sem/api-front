# Usando a imagem oficial do Jenkins como base
FROM jenkins/jenkins:lts

# Desabilitar a configuração interativa de jenkins
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false

# Instalar o JDK 17
USER root
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk

# Configurar a variável de ambiente JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Instalar Maven 3
RUN apt-get update && \
    apt-get install -y maven

# Instalar Node.js e NPM
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Verificar as versões instaladas
RUN java -version && \
    mvn -version && \
    node -v && \
    npm -v

# Instalar o Google Chrome
RUN apt-get update && \
    apt-get install -y wget gnupg2 && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable

# Definir a variável de ambiente para o Chrome
ENV CHROME_BIN="/usr/bin/google-chrome"

# Instalar ChromeDriver para suportar testes
RUN apt-get install -y chromium-driver

# Definir o display para executar testes headless
ENV DISPLAY=:99

# Configurar Jenkins para executar como usuário jenkins
USER jenkins

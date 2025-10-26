# 🚀 Como Executar o SoundMixer

## ⚡ Execução Rápida

### **Opção 1: Com Virtual Environment (Recomendado)**
```powershell
# 1. Navegue até a pasta do projeto
cd C:\Users\alcan\Downloads\0-Code\SoundMixer

# 2. Ative o ambiente virtual
.venv\Scripts\Activate.ps1

# 3. Execute a aplicação
python main.py
```

### **Opção 2: Executar direto do venv (sem ativar)**
```powershell
cd C:\Users\alcan\Downloads\0-Code\SoundMixer
.venv\Scripts\python.exe main.py
```

### **Opção 3: Python Global**
```bash
cd C:\Users\alcan\Downloads\0-Code\SoundMixer
python main.py
```

## 📋 Pré-requisitos

### **Python 3.11+**
- Download: https://python.org

### **Instalar Dependências**

**Com Virtual Environment (Recomendado):**
```powershell
# Ativar venv primeiro
.venv\Scripts\Activate.ps1

# Instalar dependências
pip install -r requirements.txt
```

**Ou instalar direto no venv:**
```powershell
.venv\Scripts\pip.exe install -r requirements.txt
```

**Se houver erro de permissão:**
```bash
pip install -r requirements.txt --no-cache-dir --user
```

**Instalar manualmente (sem requirements.txt):**
```bash
pip install pycaw psutil comtypes pywin32 pillow pywebview --no-cache-dir
```

## 🎛️ Interface

### **Telas Disponíveis:**
- **📱 Aplicativos** - Controle de volume por app
- **🔊 Dispositivos** - Gerenciamento de entrada/saída
- **📡 Canais** - Sistema de faixas de áudio (integrado!)

### **Controles:**
- **Volume individual** por aplicação
- **Mute/Unmute** por app
- **Volume Master** do sistema
- **Seleção de dispositivos** padrão

## 🔧 Desenvolvimento

### **Modo Browser (Teste Interface)**
```bash
cd src/web
python -m http.server 8000
# Acesse: http://localhost:8000
```

## ❓ Problemas Comuns

### **Não consigo executar dentro do venv**
**Problema:** PowerShell não reconhece o venv ativado

**Solução 1 - Executar direto:**
```powershell
.venv\Scripts\python.exe main.py
```

**Solução 2 - Habilitar execução de scripts:**
```powershell
# Como administrador
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Depois ativar o venv
.venv\Scripts\Activate.ps1
python main.py
```

**Solução 3 - Usar o atalho correto:**
```powershell
# Use ponto-barra-contrabarra
.\venv\Scripts\Activate.ps1
```

### **"ModuleNotFoundError: No module named 'webview'"**
```bash
# No venv ativado
pip install pywebview --no-cache-dir

# Ou direto no venv
.venv\Scripts\pip.exe install pywebview --no-cache-dir
```

### **"Permission denied" ao instalar dependências**
```bash
# Opção 1: Limpar cache e reinstalar
pip cache purge
pip install -r requirements.txt --no-cache-dir

# Opção 2: Instalar sem cache
pip install pycaw psutil comtypes pywin32 pillow pywebview --no-cache-dir --user
```

### **"Erro ao detectar apps"**
- Execute como administrador
- Verifique se há apps com áudio rodando
- Alguns apps do sistema podem não aparecer (filtrados)

### **Interface não carrega**
- Verifique conexão com internet (Font Awesome CDN)
- Execute `python main.py` na pasta raiz do projeto
- Verifique se o arquivo `src/web/index.html` existe

### **PyWebView não abre janela**
- Certifique-se de ter o .NET Framework instalado (Windows)
- Tente reinstalar: `pip install pywebview --force-reinstall --no-cache-dir`

## 📞 Suporte

- Verifique o arquivo `Plano_de_Ação.md` para roadmap
- Consulte `Readme.md` para detalhes técnicos
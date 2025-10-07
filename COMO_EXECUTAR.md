# 🚀 Como Executar o SoundMixer

## ⚡ Execução Rápida

### **Windows (Recomendado)**
```bash
# 1. Navegue até a pasta do projeto
cd C:\Users\alcan\Downloads\0-Code\SoundMixer

# 2. Execute a aplicação
python main.py
```

## 📋 Pré-requisitos

### **Python 3.11+**
- Download: https://python.org

### **Instalar Dependências**
```bash
pip install -r requirements.txt
```

## 🎛️ Interface

### **Telas Disponíveis:**
- **📱 Aplicativos** - Controle de volume por app
- **🔊 Dispositivos** - Gerenciamento de entrada/saída
- **📡 Canais** - Sistema de faixas de áudio (futuro)

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

### **"Module not found"**
```bash
pip install -r requirements.txt
```

### **"Erro ao detectar apps"**
- Execute como administrador
- Verifique se há apps com áudio rodando

### **Interface não carrega**
- Verifique conexão com internet (Font Awesome)
- Execute `python main.py` na pasta raiz

## 📞 Suporte

- Verifique o arquivo `Plano_de_Ação.md` para roadmap
- Consulte `Readme.md` para detalhes técnicos
# QR Leitos - Mobile

O QR Leitos é um aplicativo de gerenciamento de leitos hospitalares desenvolvido para simplificar e aprimorar o processo de alocação e acompanhamento de leitos em uma instituição de saúde. Ele oferece funcionalidades que tornam o gerenciamento de leitos mais eficiente e facilitam a comunicação entre os profissionais de saúde.

**Nota:** Além do aplicativo móvel, também existe um site para gerenciamento que oferece funcionalidades adicionais, como adicionar usuários, leitos e gerar códigos QR para impressão. O repositório do site está disponível em [https://github.com/FDelfim/qr-leitos-web-next](https://github.com/FDelfim/qr-leitos-web-next) e o site já se encontra hospedado em [https://qr-leitos.vercel.app](https://qr-leitos.vercel.app).

## Funcionalidades Principais

### Tela de Login:

- Os usuários fazem login no aplicativo para acessar as funcionalidades.
- As credenciais são autenticadas para garantir a segurança dos dados.

### Tela Inicial (Home):

- Lista os leitos de forma agrupada com informações sobre a taxa de ocupação.
- Mostra o número de leitos disponíveis.
- Ao clicar em um card da tela inicial, os usuários são redirecionados para a página de listagem de leitos com o status correspondente.

### Detalhes do Leito:

- Ao selecionar um leito na página de listagem, os usuários podem visualizar os detalhes do leito.
- Uma opção de seleção permite a mudança de status do leito.
- Um botão de "Salvar" permite confirmar as alterações no status do leito.

### Tela de QR Code:

- Os usuários podem usar a funcionalidade de leitura de QR code para acessar rapidamente os detalhes de um leito.
- A leitura do código QR redireciona para a página de detalhes do leito correspondente.

### Tela de Perfil:

- Exibe informações da conta do usuário.
- Permite aos usuários fazerem logout do aplicativo.

### Navegação:

- O aplicativo possui botões de navegação na parte inferior para acesso rápido à tela inicial, tela de QR code e tela de perfil.

### Controle de Acesso por Permissões:

- As funcionalidades do aplicativo são controladas com base nas permissões do usuário.
- Cada função tem permissões específicas para alterar os status dos leitos com base nas regras estabelecidas.

## Plataforma Suportada

Atualmente, o QR Leitos está disponível apenas para dispositivos Android. Isso ocorre porque, no momento, não temos suporte para a plataforma iOS devido à falta de um Mac para desenvolvimento. No entanto, estamos comprometidos em expandir a compatibilidade com outras plataformas no futuro.

## Origem do Projeto

O QR Leitos é um projeto desenvolvido como parte de um projeto acadêmico na Universidade Federal de Ouro Preto (UFOP). Ele foi criado como um esforço para melhorar a gestão de leitos hospitalares e facilitar a comunicação entre os profissionais de saúde. O projeto é resultado do trabalho de estudantes da UFOP, incluindo [Felipe Delfim](https://github.com/FDelfim).

## Instalação

1. Faça o download do aplicativo QR Leitos a partir [deste link](https://github.com/henriquemalvar/qr-leitos-mobile).
2. Siga as instruções de instalação no seu dispositivo móvel.
3. Faça login com suas credenciais para começar a usar o aplicativo.

## Contribuições

Este projeto tem sido desenvolvido por [Henrique Malvar](https://github.com/henriquemalvar) e [Felipe Delfim](https://github.com/FDelfim).
